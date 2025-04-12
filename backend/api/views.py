from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.contrib.auth.models import User
from .serializers import RegisterSerializer , LoginSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view
from .serializers import PlanTripSerializer
from backend.chat_request import ask_gpt
import requests
from bs4 import BeautifulSoup
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

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

@api_view(['POST'])
def plan_trip_view(request):
    serializer = PlanTripSerializer(data=request.data)
    if serializer.is_valid():
        data = serializer.validated_data

        prompt = (
            f"Create a {data['tripStyle'][0].lower()} travel itinerary to {data['destination']} "
            f"from {data['startDate']} to {data['endDate']}. "
            f"The traveler is interested in {', '.join(data['interests'])} "
            f"and prefers a {data['pace'].lower()} pace. "
            "Provide a 3-day plan with a short summary."
        )

        try:
            prompt = generate_trip_prompt(request.data)
            result = ask_gpt(prompt)


            return Response({
                "summary": prompt,
                "plan": result
            })
            
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
def get_google_image(request):
    query = request.GET.get("q")
    if not query:
        return Response({"error": "Missing query param 'q'"}, status=400)

    try:
        headers = {
            "User-Agent": "Mozilla/5.0",
        }
        url = f"https://www.google.com/search?tbm=isch&q={query.replace(' ', '+')}"
        res = requests.get(url, headers=headers)
        soup = BeautifulSoup(res.text, "html.parser")
        images = soup.find_all("img")

        for img in images:
            src = img.get("src")
            if src and src.startswith("http"):
                return Response({"image_url": src})

        return Response({"image_url": None, "message": "No JPG found"}, status=404)

    except Exception as e:
        return Response({"error": str(e)}, status=500)
