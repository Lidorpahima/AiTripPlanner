from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .serializers import RegisterSerializer ,  PlanTripSerializer ,UserProfileSerializer,SavedTripSerializer 
from .models import VisitedCountry,UserProfile,SavedTrip
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import date
import redis
import json
import requests
from bs4 import BeautifulSoup
from django.conf import settings
from .chat_request import ask_gemini, extract_json_from_response 
import re
from api.google_places_service import GooglePlacesService
from rest_framework.decorators import api_view, permission_classes 
from rest_framework.permissions import IsAuthenticated 
from django.http import JsonResponse
from django.views.decorators.http import require_GET
from rest_framework import viewsets
from django.views.decorators.csrf import ensure_csrf_cookie

# ──────────────────────────────── CSRF Token ──────────────────────────────── #
@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({"detail": "CSRF cookie set"})
# ──────────────────────────────── Register ──────────────────────────────── #

class RegisterView(generics.CreateAPIView):
    queryset = RegisterSerializer 
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

            }
        }
        headers = self.get_success_headers(serializer.data)
        return Response(response_data, status=status.HTTP_201_CREATED, headers=headers)
# ──────────────────────────────── Profile ──────────────────────────────── #
class ProfileRetrieveView(generics.RetrieveAPIView): 
    serializer_class = UserProfileSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        profile, created = UserProfile.objects.get_or_create(user=self.request.user)
        return profile

class ProfileUpdateView(generics.UpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        profile, created = UserProfile.objects.get_or_create(user=self.request.user)
        return profile

# ──────────────────────────────── Redis & Helper ──────────────────────────────── #

redis_client = redis.StrictRedis.from_url(settings.REDIS_URL, decode_responses=True)

def make_key(data):
    trip_style_str = ','.join(map(str, data.get('tripStyle', [])))
    interests_str = ','.join(map(str, data.get('interests', [])))

    return (
        f"trip:{data.get('destination', '')}:{data.get('startDate', '')}:{data.get('endDate', '')}:"
        f"{data.get('pace', '')}:{trip_style_str}:{interests_str}"
    ).lower().replace(" ", "_")

# ──────────────────────────────── Prompt Generation (for GEMINI) ──────────────────────────────── #

def generate_trip_prompt(form_data: dict) -> str:
    print("DEBUG: Inside generate_trip_prompt START")

    destination = form_data.get("destination", "a destination")
    start_date_obj = form_data.get("startDate")
    end_date_obj = form_data.get("endDate")

    interests_list = form_data.get("interests", [])
    interests = ', '.join(interests_list) or "general travel interests"
    trip_style = ', '.join(form_data.get("tripStyle", [])) or "standard"
    pace = form_data.get("pace", "moderate")

    # stringify safely
    start_date_str = start_date_obj.isoformat() if isinstance(start_date_obj, date) else str(start_date_obj or "")
    end_date_str = end_date_obj.isoformat() if isinstance(end_date_obj, date) else str(end_date_obj or "")

    print(f"DEBUG: Received start_date_str: '{start_date_str}', end_date_str: '{end_date_str}'")

    date_range_str = "an unspecified date range"
    if start_date_obj and end_date_obj:
        if isinstance(start_date_obj, date) and isinstance(end_date_obj, date):
            if start_date_obj != end_date_obj:
                num_days = (end_date_obj - start_date_obj).days + 1
                date_range_str = f"from {start_date_str} to {end_date_str} ({num_days} days)"
            else:
                date_range_str = f"on {start_date_str} (1 day)"
        else:
            print("⚠️ Warning: Dates are not valid date objects")

    elif start_date_obj:
        date_range_str = f"on {start_date_str} (1 day)"
        print(f"DEBUG: Calculated single day range: {date_range_str}")
    prompt = f"""
You are an expert travel planner and researcher AI assistant. Your task is to create a detailed travel itinerary in JSON format based *only* on the user's preferences provided below. You must perform the necessary research implicitly using your knowledge and capabilities to find relevant places and events.

**User Preferences:**
- Destination: {destination}
- Dates: {date_range_str}
- Traveler Interests: {interests}
- Trip Style: {trip_style}
- Pace: {pace}

**Your Combined Task & Output Requirements:**

1.  **Implicit Research:** Based *only* on the preferences above, identify key attractions, activities, relevant food/cafe types/locations, and any specific real-world events (concerts, festivals, markets, etc.) occurring in {destination} during the specified dates ({date_range_str}) that align with the traveler's interests ({interests}) and style ({trip_style}). Use your internal knowledge and search capabilities for this. **Do not show the research findings separately.**
2.  **Directly Create JSON Itinerary:** Use the information gathered (implicitly) to construct a day-by-day travel itinerary.
3.  **Strict JSON Output Format:** Format the *entire* output **strictly** as a single JSON object adhering precisely to the format specified below. **ABSOLUTELY NO TEXT BEFORE OR AFTER THE JSON OBJECT.** Your entire response must start with `{{` and end with `}}`.
4.  **Activity Object Details:** For each activity within the `activities` array in the JSON, include:
    *   `time` (string): Approximate start time in HH:MM format (e.g., "09:00", "13:30"). Be logical with timing.
    *   `description` (string): User-friendly description using specific names of places/events found during your internal research (e.g., "Visit Kinkaku-ji (Golden Pavilion)", "Lunch exploring Nishiki Market", "Evening stroll in Gion district looking for Geiko/Maiko", "Attend the Gion Matsuri parade (specific date if applicable)").
    *   `place_name_for_lookup` (string or null): The specific, **searchable name** of the physical location (e.g., "Kinkaku-ji", "Nishiki Market", "Gion Corner", "Fushimi Inari Shrine", "Arashiyama Bamboo Grove"). Use the most common English name suitable for map lookups. Set to `null` or an empty string (`""`) ONLY for general activities like "Breakfast at Hotel", "Free time", or generic neighborhood explorations without a single point of interest (e.g., "Explore the charming streets of Higashiyama District").
5.  **Event Integration:** If your research finds relevant specific events (festivals, concerts, markets) happening during the trip dates, integrate them logically into the schedule as activities. Ensure `description` mentions the event and `place_name_for_lookup` is the venue name (if known and searchable).
6.  **Pace Adherence:** Ensure the number and density of activities per day reflect the requested pace ('{pace}'). A 'relaxed' pace should have fewer scheduled items than 'moderate' or 'fast-paced'. Include buffer time or 'Free time' entries for relaxed paces.
7.  **Summary Field:** Include a short, engaging `summary` field within the JSON object (1-2 sentences).
8.  **Day Titles:** Provide a meaningful `title` for each day reflecting the main theme or area (e.g., "Day 1: Arrival and Golden Exploration", "Day 2: Temples, Shrines, and Bamboo").
9.  **CRITICAL OUTPUT CONSTRAINT:** Output **ONLY the raw JSON object**. Do not include markdown formatting like ```json ... ```. Do not include any introductory or concluding sentences like "Here is your itinerary:". Your response must be *only* the JSON.

**Required JSON Output Format Example:**
```json
{{
"summary": "An immersive cultural journey through Kyoto's temples, gardens, and traditional districts.",
"days": [
    {{
    "title": "Day 1: Golden Temples & Zen Gardens",
    "activities": [
        {{
        "time": "09:00",
        "description": "Breakfast near the hotel",
        "place_name_for_lookup": null
        }},
        {{
        "time": "10:00",
        "description": "Visit the stunning Kinkaku-ji (Golden Pavilion)",
        "place_name_for_lookup": "Kinkaku-ji"
        }},
        {{
        "time": "11:30",
        "description": "Explore the serene Ryoan-ji Temple Zen Garden",
        "place_name_for_lookup": "Ryoan-ji Temple"
        }},
        {{
        "time": "13:00",
        "description": "Lunch featuring Kyoto specialties",
        "place_name_for_lookup": "Nishiki Market"
        }},
        {{
        "time": "14:30",
        "description": "Free time for shopping or relaxing",
        "place_name_for_lookup": null
        }},
        {{
        "time": "19:00",
        "description": "Dinner in the Pontocho Alley area",
        "place_name_for_lookup": "Pontocho Alley"
        }}
    ]
    }},
    {{
    "title": "Day 2: Iconic Shrines & Geisha District",
    "activities": [
        {{
        "time": "10:00",
        "description": "Walk through thousands of red gates at Fushimi Inari Shrine",
        "place_name_for_lookup": "Fushimi Inari Shrine"
        }},
        {{
        "time": "18:00",
        "description": "Evening stroll in Gion, hoping to spot Geiko or Maiko",
        "place_name_for_lookup": "Gion Corner"
        }}
    ]
    }}
]
}}
Now, generate ONLY the JSON itinerary based on the user preferences and your research. Remember the strict output constraint.
"""
    return prompt.strip()
# ──────────────────────────────── Plan Trip View (Main Logic) ──────────────────────────────── #
model_name = 'gemini-2.5-pro-exp-03-25'
@api_view(['POST'])
def plan_trip_view(request):
    serializer = PlanTripSerializer(data=request.data)
    if serializer.is_valid():
        data = serializer.validated_data # <-- קבל את הנתונים כאן
        key = make_key(data)         # <-- צור את המפתח כאן
        print("DEBUG: Serializer is valid")
        # --- בדיקת Cache ---
        try:
            ("DEBUG: Checked cache, proceeding...")
            cached = redis_client.get(key)
            if cached:
                print("✔️ Found in Redis cache!")
                try:
                    cached_data = json.loads(cached)
                    if "days" in cached_data and "summary" in cached_data:
                         print("   Cached data seems valid.")
                         return Response(cached_data, status=200)
                    else:
                         print("⚠️ Cached data has incorrect structure. Re-generating...")
                         redis_client.delete(key)
                except json.JSONDecodeError:
                    print("⚠️ Invalid JSON found in cache. Re-generating...")
                    redis_client.delete(key)
        except Exception as e:
            print(f"⚠️ Redis Error: {e}. Proceeding without cache.")

        print("\n🧠 Generating combined prompt for Gemini...")
        print("DEBUG: Before calling ask_gemini")
        single_prompt = generate_trip_prompt(data) 
        print(f"DEBUG: Generated prompt length: {len(single_prompt)}")
        print("🚀 Sending combined prompt to Gemini...")
        raw_response = None
        try:
            raw_response = ask_gemini(single_prompt, model_name)


            if raw_response is None:
                return Response({"error": "Failed to get a valid response from the planning assistant (API error or blocked)."}, status=500)
            elif raw_response == "":
                 print("⚠️ Assistant returned an empty response.")
                 return Response({"error": "The planning assistant returned an empty response (possibly due to safety filters)."}, status=500)

            print(f"\n📦 Gemini Raw Response (length: {len(raw_response)} chars, first 500):\n", raw_response[:500], "...\n")

            print("🧹 Cleaning and parsing the JSON response...")
            cleaned_json_str = extract_json_from_response(raw_response)

            try: 
                if not cleaned_json_str:
                    print("❌ Cleaned JSON string is empty after extraction attempts.")
                    raise json.JSONDecodeError("Empty string cannot be parsed", "", 0)

                parsed_result = json.loads(cleaned_json_str)

                if not isinstance(parsed_result, dict) or "days" not in parsed_result or "summary" not in parsed_result:
                    print("❌ Parsed JSON has incorrect structure (missing 'days' or 'summary').")
                    print(f"   Parsed Data: {str(parsed_result)[:500]}...")
                    return Response({"error": "The planning assistant returned data in an unexpected structure."}, status=500)

                try:
                    # השתמש ב-key שהוגדר למעלה
                    redis_client.setex(key, 3600 * 24 * 3, json.dumps(parsed_result))
                    print("💾 Successfully cached itinerary in Redis!")
                except Exception as e:
                    print(f"⚠️ Redis Set Error: {e}. Could not cache result.")

                print("✅ Successfully generated and parsed itinerary!")
                return Response(parsed_result, status=200)

            except json.JSONDecodeError as e:
                error_msg = f"JSON Decode Error – Gemini response (after cleaning) was not valid JSON: {e}"
                print(f"❌ {error_msg}")
                problematic_string_excerpt = cleaned_json_str[:1000] if cleaned_json_str else "None"
                print(f"   Problematic cleaned string (first 1000 chars): {problematic_string_excerpt}")
                return Response({"error": "The planning assistant returned an invalid format.", "details": error_msg}, status=500)

        except Exception as e:
            error_msg = f"Unexpected Error during Gemini interaction or processing: {e}"
            print(f"❌ {error_msg}")
            import traceback
            traceback.print_exc()
            return Response({"error": f"An unexpected error occurred: {e}"}, status=500)

    # --- אם ה-Serializer לא היה תקין מלכתחילה ---
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

# ──────────────────────────────── SavedTrip ──────────────────────────────── #
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_trip_view(request):
    print(f"***** Request type in save_trip_view: {type(request)} *****") 
    serializer = SavedTripSerializer(data = request.data,context={'request': request})
    if serializer.is_valid():
        try:
            saved_trip = serializer.save(user=request.user)
            return Response(SavedTripSerializer(saved_trip).data, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            print (f"❌ Error saving trip: {e}")
            return Response({"error": "Could not save trip due to an internal error."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        print (f"❌ Error with serializer: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)