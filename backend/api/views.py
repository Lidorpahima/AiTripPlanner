from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .serializers import RegisterSerializer , LoginSerializer, PlanTripSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view
from time import time
from .chat_request import ask_gpt_sonar, get_trip_itinerary
import redis
import json
import requests
from bs4 import BeautifulSoup
from django.conf import settings
from .chat_request import get_trip_itinerary, extract_json_from_response

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
                'full_name': user.profile.full_name
            }
        }
        headers = self.get_success_headers(serializer.data)
        return Response(response_data, status=status.HTTP_201_CREATED, headers=headers)

# ──────────────────────────────── Redis & Helper ──────────────────────────────── #

redis_client = redis.StrictRedis.from_url(settings.REDIS_URL, decode_responses=True)

def make_key(data):
    return (
        f"trip:{data['destination']}:{data['startDate']}:{data['endDate']}:"
        f"{data['pace']}:{','.join(data['tripStyle'])}:{','.join(data['interests'])}"
    ).lower().replace(" ", "_")

# ──────────────────────────────── Plan Trip View ──────────────────────────────── #


@api_view(['POST'])
def plan_trip_view(request):
    serializer = PlanTripSerializer(data=request.data)
    if serializer.is_valid():
        data = serializer.validated_data

        key = make_key(data)
        cached = redis_client.get(key)
        if cached:
            print("✔️ Found in Redis cache!")
            return Response(json.loads(cached), status=200)

        # יצירת פרומפט לבניית טיול
        prompt = generate_trip_prompt(data)

        try:
            print("🚀 Sending prompt to GPT...")
            start = time()
            json_result = get_trip_itinerary(prompt)  # שימוש ב־SONAR ואז OpenRouter
            end = time()
            print(f"⏱ GPT response time: {end - start:.2f} seconds")

            cleaned_json = extract_json_from_response(json_result)
            parsed_result = json.loads(cleaned_json)

            redis_client.setex(key, 60 * 60 * 720, json.dumps(parsed_result))

            return Response(parsed_result, status=200)

        except json.JSONDecodeError:
            print("❌ JSON Decode Error – GPT did not return valid JSON.")
            return Response({"error": "Invalid JSON returned from GPT"}, status=500)
        except Exception as e:
            print("❌ Unexpected Error:", str(e))
            return Response({"error": str(e)}, status=500)

    return Response(serializer.errors, status=400)



# ──────────────────────────────── Prompt (Original) ──────────────────────────────── #

def generate_trip_prompt(form_data: dict) -> str:
    destination = form_data.get("destination", "a destination")
    start_date = form_data.get("startDate", "a start date")
    end_date = form_data.get("endDate", "an end date")
    audience = "a traveler"
    interests = ', '.join(form_data.get("interests", [])) or "general travel interests"
    trip_style = ', '.join(form_data.get("tripStyle", [])) or "standard"
    pace = form_data.get("pace", "moderate")

    # שליפת אירועים מהעולם האמיתי
    real_events_text = fetch_real_events(destination, start_date, end_date)

    prompt = f"""
You are an expert travel planner.

Your task is to generate a **detailed** travel itinerary based on the provided information.

**Important:**
- DO NOT ask the user for anything.
- Assume you have all the information you need.
- Return ONLY JSON (no explanation).
- Include **exact times** (e.g., 08:30, 14:00) for each activity.
- Use **real names of places**, landmarks, and restaurants.
- Include **options** or alternatives where relevant (e.g., rainy-day options).
- Suggest specific restaurants or cafes when possible.
- Consider the following **real-world events** and try to integrate relevant ones when possible.
- Ensure the entire itinerary fits within the response. Keep it concise and valid JSON and keep it short answer.

**Real-world Events ({start_date} to {end_date}) in {destination}:**
{real_events_text}

**Response Format (JSON only):**
{{
  "summary": "Short summary of the trip.",
  "days": [
    {{
      "title": "Day 1: ...",
      "activities": [
        "08:30 - Breakfast at [place]",
        "10:00 - Visit [place] for [activity]",
        ...
      ]
    }},
    ...
  ]
}}

**Trip Info:**
- Destination: {destination}
- Dates: {start_date} to {end_date}
- Style: {trip_style}
- Interests: {interests}
- Audience: {audience}
- Pace: {pace}
"""
    return prompt.strip()




def fetch_real_events(destination: str, start_date: str, end_date: str) -> str:
    prompt = f"What are the top events in {destination} between {start_date} and {end_date}?"
    try:
        response = ask_gpt_sonar(prompt)  # שימוש ב־SONAR ישירות
        if response:
            return f"\n\n**Real-world Events in {destination} ({start_date} - {end_date}):**\n{response}"
        return ""
    except Exception as e:
        print(f"Perplexity error: {e}")
        return ""

# ──────────────────────────────── Image Search ──────────────────────────────── #

@api_view(['GET'])
def image_search_view(request):
    query = request.GET.get('q')
    if not query:
        return Response({'error': 'Missing query'}, status=400)

    headers = {
        "User-Agent": "Mozilla/5.0"
    }
    search_url = f"https://www.google.com/search?tbm=isch&q={query}"
    try:
        response = requests.get(search_url, headers=headers, timeout=5)
        soup = BeautifulSoup(response.text, "html.parser")

        image_links = []
        for img in soup.find_all("img"):
            src = img.get("src")
            if src and src.startswith("http"):
                image_links.append(src)
            if len(image_links) >= 5:
                break

        if not image_links:
            return Response({"images": [], "message": "No images found"}, status=404)

        return Response({"images": image_links})

    except Exception as e:
        return Response({"error": str(e)}, status=500)
