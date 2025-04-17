from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .serializers import RegisterSerializer , LoginSerializer, PlanTripSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view
from time import time
import redis
import json
import requests
from bs4 import BeautifulSoup
from django.conf import settings
from .chat_request import ask_gpt_sonar, ask_gpt_openrouter, extract_json_from_response # ייבוא פונקציות מעודכנות
import re
from api.google_places_service import GooglePlacesService
from rest_framework.decorators import api_view, permission_classes # הוספת ייבוא
from rest_framework.permissions import IsAuthenticated # הוספת ייבוא (מומלץ לאבטחה)
from django.http import JsonResponse
from django.views.decorators.http import require_GET
# ──────────────────────────────── Register ──────────────────────────────── #

class RegisterView(generics.CreateAPIView):
    queryset = RegisterSerializer # שינוי קטן: queryset צריך להיות המודל, לא הסריאלייזר, אבל לצורך CreateAPIView זה עובד טכנית. עדיף User.objects.all() אם יש לך מודל User
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()
        refresh = RefreshToken.for_user(user)

        response_data = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                # הנחה שיש לך related_name='profile' במודל User לפרופיל
                # 'full_name': user.profile.full_name if hasattr(user, 'profile') else user.get_full_name()
            }
        }
        headers = self.get_success_headers(serializer.data)
        return Response(response_data, status=status.HTTP_201_CREATED, headers=headers)

# ──────────────────────────────── Redis & Helper ──────────────────────────────── #

redis_client = redis.StrictRedis.from_url(settings.REDIS_URL, decode_responses=True)

def make_key(data):
    # ודא שכל הערכים הם מחרוזות לפני join
    trip_style_str = ','.join(map(str, data.get('tripStyle', [])))
    interests_str = ','.join(map(str, data.get('interests', [])))

    return (
        f"trip:{data.get('destination', '')}:{data.get('startDate', '')}:{data.get('endDate', '')}:"
        f"{data.get('pace', '')}:{trip_style_str}:{interests_str}"
    ).lower().replace(" ", "_")

# ──────────────────────────────── Prompt Generation (for SONAR) ──────────────────────────────── #

def generate_trip_prompt(form_data: dict) -> str:
    """Creates the initial research prompt for SONAR."""
    destination = form_data.get("destination", "a destination")
    start_date = form_data.get("startDate", "a start date")
    end_date = form_data.get("endDate", "an end date")
    interests = ', '.join(form_data.get("interests", [])) or "general travel interests"
    trip_style = ', '.join(form_data.get("tripStyle", [])) or "standard"
    pace = form_data.get("pace", "moderate")

    prompt = f"""
You are a travel research assistant. Your goal is to gather relevant information for planning a trip.

**Trip Details:**
- Destination: {destination}
- Dates: {start_date} to {end_date}
- Traveler Interests: {interests}
- Trip Style: {trip_style}
- Pace: {pace}

**Your Task:**
Provide a **text-based summary** of potential activities, attractions, and real-world events for this trip. Do **NOT** format this as JSON. Do **NOT** create a day-by-day itinerary yet.

**Please provide the following information:**

1.  **Key Attractions & Activities:** List the main sights, landmarks, museums, neighborhoods, or activities in {destination} that align with the traveler's interests ({interests}) and trip style ({trip_style}). Briefly describe why each is relevant.
2.  **Restaurant/Cafe Suggestions:** Suggest a few types of restaurants or specific places known for local cuisine or ambiance suitable for the trip style.
3.  **Real-World Events:** List specific events (e.g., concerts, festivals, markets, exhibitions, performances) happening in {destination} between {start_date} and {end_date}. For each event, mention the date(s) and a brief description. Be specific with names and dates if possible.

**Output Format:**
Use clear headings or bullet points for each section (Attractions, Restaurants, Events). Write concisely.

Example structure:

**Key Attractions & Activities:**
*   [Attraction 1 Name]: [Brief description relevant to interests/style]
*   [Activity 1 Name]: [Brief description relevant to interests/style]
...

**Restaurant/Cafe Suggestions:**
*   Try [Type of food/restaurant] known for...
*   Consider visiting [Specific Cafe/Restaurant Name] because...
...

**Real-World Events ({start_date} - {end_date}):**
*   [Event Name] on [Date(s)]: [Brief description]
*   [Another Event Name] at [Venue] on [Date(s)]: [Brief description]
...

Remember: Provide only the research findings as text, not a full itinerary or JSON.
"""
    return prompt.strip()


# ──────────────────────────────── Plan Trip View (Main Logic) ──────────────────────────────── #

@api_view(['POST'])
def plan_trip_view(request):
    serializer = PlanTripSerializer(data=request.data)
    if serializer.is_valid():
        data = serializer.validated_data

        key = make_key(data)
        try:
            cached = redis_client.get(key)
            if cached:
                print("✔️ Found in Redis cache!")
                try:
                    # ודא שהנתונים ב-cache הם JSON תקין לפני החזרה
                    cached_data = json.loads(cached)
                    return Response(cached_data, status=200)
                except json.JSONDecodeError:
                    print("⚠️ Invalid JSON found in cache. Re-generating...")
                    # אם ה-cache לא תקין, נמחק אותו ונמשיך ליצור מחדש
                    redis_client.delete(key)
        except Exception as e:
            print(f"⚠️ Redis Error: {e}. Proceeding without cache.")


        # --- שלב 1: קבלת מידע גולמי מ-SONAR ---
        research_prompt = generate_trip_prompt(data)
        print("🔭 Sending research prompt to SONAR...")
        start_sonar = time()
        try:
            research_findings = ask_gpt_sonar(research_prompt)
            if not research_findings:
                print("❌ SONAR did not return findings.")
                return Response({"error": "Failed to get travel information from assistant."}, status=500)
            end_sonar = time()
            print(f"⏱ SONAR response time: {end_sonar - start_sonar:.2f} seconds")
            print("\n📝 SONAR Research Findings (excerpt):\n", research_findings, "...\n")

        except Exception as e:
            print(f"❌ Error during SONAR call: {e}")
            return Response({"error": f"Failed to communicate with SONAR: {e}"}, status=500)


        print("🧠 Crafting final itinerary prompt for OpenRouter...")

        structure_prompt = f"""
You are an expert travel planner tasked with creating a detailed JSON itinerary.

**Input:**
1.  **User Preferences:**
    *   Destination: {data['destination']}
    *   Dates: {data['startDate']} to {data['endDate']}
    *   Interests: {', '.join(data.get('interests', []))}
    *   Style: {', '.join(data.get('tripStyle', []))}
    *   Pace: {data['pace']}
2.  **Research Findings (from another AI):**
    ```text
    {research_findings}
    ```

**Your Task:**
1.  Create a day-by-day travel itinerary based *only* on the **Research Findings** and **User Preferences** provided above.
2.  Structure the output strictly as a JSON object following the format below.
3.  For each activity, create a JSON object containing the following fields:
    *   `time`: The exact start time in HH:MM format (e.g., "09:00", "13:30", "19:00").
    *   `description`: The full, user-friendly description of the activity (e.g., "Visit the Israel Museum", "Lunch at Machane Yehuda Market", "Attend a performance by the Jerusalem Symphony Orchestra (check local listings for schedule)"). Use real names of places mentioned in the research findings within this description.
    *   `place_name_for_lookup`: The specific, **searchable name of the physical location** relevant to the activity (e.g., "Israel Museum", "Machane Yehuda Market", "Jerusalem Symphony Orchestra", "Western Wall Plaza"). This name will be used to fetch details from mapping services. **If the activity is general** (like "Breakfast at Hotel"), has no single venue (like "Explore the Old City"), or refers to a neighborhood stroll (like "Sunset stroll in Yemin Moshe Neighborhood"), **set this field to `null` or an empty string (`""`)**.
4.  **Intelligently integrate relevant events:** Look at the 'Real-World Events' section in the research findings. If an event fits logically, add it as an activity object, ensuring `description` mentions the event and `place_name_for_lookup` contains the event's venue name (if known and searchable). If not relevant, omit it.
5.  Generate a short "summary" for the trip (around 1-2 sentences).
6.  Ensure the pace of the itinerary matches the requested pace ({data['pace']}). Adapt the number of activities per day accordingly.
7.  **Output ONLY the JSON object.** No explanations, no introductory text like "Here is the JSON:", no apologies, just the raw JSON object starting with `{{` and ending with `}}`.

**Required JSON Output Format:**
{{
  "summary": "A short, engaging summary of the planned trip.",
  "days": [
    {{
      "title": "Day 1: [Meaningful Title, e.g., Arrival and Old Town Exploration]",
      "activities": [
        {{
          "time": "09:00",
          "description": "Breakfast at Hotel/Suggested Cafe",
          "place_name_for_lookup": null
        }},
        {{
          "time": "10:00",
          "description": "Visit Old City of Jerusalem",
          "place_name_for_lookup": "Old City of Jerusalem" // Or perhaps null if too general
        }},
        {{
          "time": "12:30",
          "description": "Lunch at Machane Yehuda Market",
          "place_name_for_lookup": "Mahane Yehuda Market"
        }},
        {{
           "time": "21:00",
           "description": "Attend a performance by the Jerusalem Symphony Orchestra (check local listings for schedule)",
           "place_name_for_lookup": "Jerusalem Symphony Orchestra" // Or the actual venue like "Jerusalem Theatre"
        }}
        // ... more activity objects for the day
      ]
    }},
    {{
      "title": "Day 2: [Meaningful Title]",
      "activities": [
         // ... activity objects
      ]
    }}
    // ... more days as needed
  ]
}}

Now, generate ONLY the JSON itinerary based *only* on the provided information, following the specified object structure for activities.
"""
        print("🚀 Sending structuring prompt to OpenRouter...")
        start_or = time()
        json_response_raw = None # הגדרה מראש למקרה של שגיאה
        try:
            # השתמש בפונקציית הקריאה ל-OpenRouter
            json_response_raw = ask_gpt_openrouter(structure_prompt)
            if not json_response_raw:
                 print("❌ OpenRouter did not return a response.")
                 return Response({"error": "Failed to get structured itinerary from assistant."}, status=500)
            end_or = time()
            print(f"⏱ OpenRouter response time: {end_or - start_or:.2f} seconds")
            print("\n📦 OpenRouter Raw Response (excerpt):\n", json_response_raw[:500], "...\n")

            # --- שלב 3: ניקוי וניתוח ה-JSON ---
            print("🧹 Cleaning and parsing the JSON response...")
            cleaned_json_str = extract_json_from_response(json_response_raw)

            # ניסיון נוסף לנקות אם עדיין יש בעיות - הסרת טקסט לפני ה-'{' הראשון או אחרי ה-'}' האחרון
            first_brace = cleaned_json_str.find('{')
            last_brace = cleaned_json_str.rfind('}')
            if first_brace != -1 and last_brace != -1 and last_brace >= first_brace:
                 # אם מצאנו גם פותח וגם סוגר, נבודד את מה שביניהם
                 potential_json = cleaned_json_str[first_brace:last_brace+1]
                 print(f"ℹ️ Attempting to isolate JSON between braces (indices {first_brace}-{last_brace}).")
                 cleaned_json_str = potential_json
            elif first_brace > 0:
                 # אם יש רק טקסט לפני, נסיר אותו
                 print(f"⚠️ Found leading text before JSON, attempting to strip {first_brace} characters.")
                 cleaned_json_str = cleaned_json_str[first_brace:]
            # (ניתן להוסיף גם לוגיקה להסרת טקסט *אחרי* הסוגר האחרון אם צריך)


            if not cleaned_json_str:
                 print("❌ Cleaned JSON string is empty after extraction attempts.")
                 raise json.JSONDecodeError("Empty string cannot be parsed", "", 0)

            parsed_result = json.loads(cleaned_json_str) # כאן עלולה להתרחש השגיאה

            # שמירה ב-Redis
            try:
                redis_client.setex(key, 3600 * 24 * 3, json.dumps(parsed_result)) # 3 ימים שמירה
                print("💾 Successfully cached itinerary in Redis!")
            except Exception as e:
                 print(f"⚠️ Redis Set Error: {e}. Could not cache result.")


            print("✅ Successfully generated and parsed itinerary!")
            return Response(parsed_result, status=200)

        except json.JSONDecodeError as e:
            error_msg = f"JSON Decode Error – OpenRouter response was not valid JSON: {e}"
            print(f"❌ {error_msg}")
            # הדפס את המחרוזת שניסינו לפענח (אם היא לא ארוכה מדי)
            problematic_string_excerpt = cleaned_json_str[:1000] if cleaned_json_str else "None"
            print(f" problematic JSON string (first 1000 chars): {problematic_string_excerpt}")
            # שקול להדפיס גם את התשובה הגולמית אם הניקוי אגרסיבי מדי
            # print(f" Raw response was (first 1000 chars): {json_response_raw[:1000] if json_response_raw else 'None'}")
            return Response({"error": "The planning assistant returned an invalid format. Please try again later.", "details": error_msg}, status=500)
        except Exception as e:
            # שגיאות רשת מ-ask_gpt_openrouter, או שגיאות לא צפויות אחרות
            error_msg = f"Unexpected Error during OpenRouter call or JSON processing: {e}"
            print(f"❌ {error_msg}")
            return Response({"error": f"An unexpected error occurred: {e}"}, status=500)

    # אם ה-serializer לא תקין
    return Response(serializer.errors, status=400)


# ──────────────────────────────── Image Search ──────────────────────────────── #

@require_GET
def get_place_details_view(request):
    query = request.GET.get('query', '').strip()

    if not query:
        print(f"⚠️ Received place details request with empty query.")
        return JsonResponse({"error": "Missing place name query parameter."}, status=400)

    print(f"ℹ️ Processing place details request for query: '{query}'")

    try:
        places_service = GooglePlacesService()
        place_details = places_service.search_place(query)

        if place_details:
            print(f"✅ Successfully retrieved/found details for query: '{query}' (from Service/Cache)")
            return JsonResponse(place_details, status=200)
        else:
            print(f"❌ Could not find place details for query: '{query}' (Service returned None)")
            return JsonResponse({"error": "Place details not found."}, status=404)

    except Exception as e:
        print(f"❌ Unexpected error processing place details for query '{query}': {e}")
        return JsonResponse({"error": "An internal server error occurred."}, status=500)
