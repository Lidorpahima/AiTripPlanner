from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .serializers import RegisterSerializer , LoginSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view
import redis
from .serializers import PlanTripSerializer
from backend.chat_request import ask_gpt
import requests
from bs4 import BeautifulSoup
import json

class RegisterView(generics.CreateAPIView):
    queryset  = RegisterSerializer
    permission_classes = (permissions.AllowAny,)
    serializer_class  = RegisterSerializer 

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

redis_client = redis.StrictRedis(host='localhost', port=6379, db=0, decode_responses=True)

def make_key(data):
    return (
        f"trip:{data['destination']}:{data['startDate']}:{data['endDate']}:"
        f"{data['pace']}:{','.join(data['tripStyle'])}:{','.join(data['interests'])}"
    ).lower().replace(" ", "_")

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

        prompt = generate_trip_prompt(data)

        try:
            result = ask_gpt(prompt)

            parsed = {
                "summary": prompt,
                "plan": result  
            }

            redis_client.setex(key, 60 * 60 * 6, json.dumps(parsed))

            return Response(parsed, status=200)

        except Exception as e:
            return Response({"error": str(e)}, status=500)

    return Response(serializer.errors, status=400)
def generate_trip_prompt(form_data: dict) -> str:
    destination = form_data.get("destination", "a destination")
    start_date = form_data.get("startDate", "a start date")
    end_date = form_data.get("endDate", "an end date")
    audience = "a traveler"
    interests = ', '.join(form_data.get("interests", [])) or "general travel interests"
    trip_style = ', '.join(form_data.get("tripStyle", [])) or "standard"
    pace = form_data.get("pace", "moderate")

    prompt = f"""
You are an expert travel planner.

Your task is to generate a 3-day **detailed** travel itinerary based on the provided information.

**Important:**
- DO NOT ask the user for anything.
- Assume you have all the information you need.
- Return ONLY JSON (no explanation).
- Include **exact times** (e.g., 08:30, 14:00) for each activity.
- Use **real names of places**, landmarks, and restaurants.
- Include **options** or alternatives where relevant (e.g., rainy-day options).
- Suggest specific restaurants or cafes when possible.

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
