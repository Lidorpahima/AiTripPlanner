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
from rest_framework.views import APIView
from django.http import JsonResponse
from django.views.decorators.http import require_GET
from rest_framework import viewsets
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import generics
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode ,urlsafe_base64_decode
from django.utils.encoding import force_bytes ,force_str
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
from django.core.exceptions import ObjectDoesNotExist


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
# ──────────────────────────────── GOOGLELOGIN ──────────────────────────────── #
class GoogleLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        print("Starting Google login process...")  # Log the start of the process

        token = request.data.get('token')
        print(f"Received token: {token}")  # Log the received token

        if not token:
            print("No token provided in the request.")  # Log missing token
            return Response({'error': 'No token provided'}, status=400)
        
        try:
            print("Verifying token with Google...")  # Log token verification start
            idinfo = id_token.verify_oauth2_token(
                token, 
                google_requests.Request(), 
                settings.GOOGLE_CLIENT_ID
            )
            print(f"Token verified successfully. ID Info: {idinfo}")  # Log the decoded ID token information

            if idinfo['aud'] not in [settings.GOOGLE_CLIENT_ID]:
                print("Invalid token audience. Expected audience does not match.")  # Log invalid audience
                return Response({'error': 'Invalid token'}, status=401)

            email = idinfo['email']
            print(f"Extracted email from token: {email}")  # Log the extracted email

            try:
                user = User.objects.get(email=email)
                print(f"User found in database: {user}")  # Log if user exists
            except User.DoesNotExist:
                print("User does not exist. Creating a new user...")  # Log user creation
                user = User.objects.create_user(
                    username=email,
                    email=email,
                )
                UserProfile.objects.create(
                    user=user, 
                    full_name=idinfo.get('name', '')
                )
                print(f"New user created: {user}")  # Log new user creation

            print("Generating refresh and access tokens...")  # Log token generation
            refresh = RefreshToken.for_user(user)
            print(f"Generated tokens: refresh={refresh}, access={refresh.access_token}")  # Log generated tokens

            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                }
            })

        except ValueError as ve:
            print(f"ValueError during token verification: {ve}")  # Log invalid token format
            return Response({'error': 'Invalid token'}, status=401)
        except Exception as e:
            print(f"Unexpected error during Google login: {str(e)}")  # Log unexpected errors
            return Response({'error': 'Authentication failed'}, status=400)

# ──────────────────────────────── RestPassword ──────────────────────────────── #
class PasswordResetRequestView(APIView): 
    def post(self, request): 
        email = request.data.get('email') 
        user = User.objects.filter(email=email).first() 

        if user:
            frontend_url = settings.FRONTEND_BASE_URL
            uid = urlsafe_base64_encode(force_bytes(user.pk)) 
            token = default_token_generator.make_token(user) 
            reset_link = f"{frontend_url}/reset-password/{uid}/{token}" 

            send_mail(
                'Password Reset', 
                f'Click here to reset your password: {reset_link}', 
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=False,
            )

        return Response({'message': 'If this email exists, a reset link was sent.'})
    
# ──────────────────────────────── SETNEW PASSWORD ──────────────────────────────── #
class PasswordResetConfirmView(APIView):
    def post(self, request, uidb64=None, token=None):

        new_password = request.data.get('new_password')
        new_password_confirm = request.data.get('new_password_confirm') 

        if not all([uidb64, token, new_password, new_password_confirm]):
             return Response({'error': 'Missing required fields.'}, status=status.HTTP_400_BAD_REQUEST)

        if new_password != new_password_confirm:
            return Response({'error': 'Passwords do not match.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            uid = force_str(urlsafe_base64_decode(uidb64)) 
            user = User.objects.get(pk=uid)
        except (User.DoesNotExist, ValueError, TypeError, OverflowError):
            user = None

        if user is not None and default_token_generator.check_token(user, token):
            try:
                validate_password(new_password, user)
            except ValidationError as e:
                return Response({'error': list(e.messages)}, status=status.HTTP_400_BAD_REQUEST)

            user.set_password(new_password) 
            user.save()
            return Response({'message': 'Password has been reset successfully.'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid reset link or token expired.'}, status=status.HTTP_400_BAD_REQUEST)
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
    budget = form_data.get("budget", "Mid-range")
    accommodation = form_data.get("accommodation", "")
    local_experiences = ', '.join(form_data.get("localExperiences", [])) or "various experiences"
    travel_with = ', '.join(form_data.get("travelWith", [])) or "solo traveler"

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
- Budget Level: {budget}
- Preferred Accommodation: {accommodation}
- Desired Local Experiences: {local_experiences}
- Travel Companions: {travel_with}

**Your Combined Task & Output Requirements:**

1.  **Implicit Research:** Based *only* on the preferences above, identify key attractions, activities, relevant food/cafe types/locations, and any specific real-world events (concerts, festivals, markets, etc.) occurring in {destination} during the specified dates ({date_range_str}) that align with the traveler's interests ({interests}) and style ({trip_style}). Use your internal knowledge and search capabilities for this. **Do not show the research findings separately.**
2.  **Directly Create JSON Itinerary:** Use the information gathered (implicitly) to construct a day-by-day travel itinerary.
3.  **Strict JSON Output Format:** Format the *entire* output **strictly** as a single JSON object adhering precisely to the format specified below. **ABSOLUTELY NO TEXT BEFORE OR AFTER THE JSON OBJECT.** Your entire response must start with `{{` and end with `}}`.
4.  **Currency Standardization:** For all cost estimates, use USD (US Dollars) as the standard currency, regardless of the destination country. This makes it easier for travelers to compare costs.
5.  **Activity Object Details:** For each activity within the `activities` array in the JSON, include:
    *   `time` (string): Approximate start time in HH:MM format (e.g., "09:00", "13:30"). Be logical with timing.
    *   `description` (string): User-friendly description using specific names of places/events found during your internal research (e.g., "Visit Kinkaku-ji (Golden Pavilion)", "Lunch exploring Nishiki Market", "Evening stroll in Gion district looking for Geiko/Maiko", "Attend the Gion Matsuri parade (specific date if applicable)").
    *   `place_name_for_lookup` (string or null): The specific, **searchable name** of the physical location (e.g., "Kinkaku-ji", "Nishiki Market", "Gion Corner", "Fushimi Inari Shrine", "Arashiyama Bamboo Grove"). Use the most common English name suitable for map lookups. Set to `null` or an empty string (`""`) ONLY for general activities like "Breakfast at Hotel", "Free time", or generic neighborhood explorations without a single point of interest (e.g., "Explore the charming streets of Higashiyama District").
    *   `place_details` (object or null, optional): If available, include additional details about the place:
      * `name` (string): Official name of the location
      * `category` (string): Category like "restaurant", "attraction", "museum", "cafe", etc. 
      * `price_level` (number, optional): Price level on a scale of 1-4 (1 being least expensive)
    *   `cost_estimate` (object, optional): Include cost estimate for the activity:
      * `min` (number): Minimum estimated cost in USD
      * `max` (number): Maximum estimated cost in USD
      * `currency` (string): Always set to "USD"
    *   `ticket_url` (string or null, optional): If the activity requires booking or tickets (e.g., museum, concert, specific tour), provide a direct URL for booking or purchasing tickets. If booking is not required, not typically done online, or no direct link is available, set this to `null`.
6.  **Event Integration:** If your research finds relevant specific events (festivals, concerts, markets) happening during the trip dates, integrate them logically into the schedule as activities. Ensure `description` mentions the event and `place_name_for_lookup` is the venue name (if known and searchable).
7.  **Pace Adherence:** Ensure the number and density of activities per day reflect the requested pace ('{pace}'). A 'relaxed' pace should have fewer scheduled items than 'moderate' or 'fast-paced'. Include buffer time or 'Free time' entries for relaxed paces.
8.  **Cost Estimates at Day Level:** For each day, include a `day_cost_estimate` object with `min`, `max`, and `currency` properties (always in USD).
9.  **Overall Cost Breakdown:** Include a `total_cost_estimate` object in the root of the JSON with the following structure:
    * `min` (number): Minimum estimated total cost for the entire trip in USD
    * `max` (number): Maximum estimated total cost for the entire trip in USD
    * `currency` (string): Always "USD"
    * `accommodations` (object): Sub-object with `min` and `max` properties in USD
    * `food` (object): Sub-object with `min` and `max` properties in USD
    * `attractions` (object): Sub-object with `min` and `max` properties in USD
    * `transportation` (object): Sub-object with `min` and `max` properties in USD
    * `other` (object): Sub-object with `min` and `max` properties in USD
10.  **Destination Information:** Include a `destination_info` object in the root of the JSON with:
    * `country` (string): Country of the destination
    * `city` (string/locality name)
    * `language` (string): Primary language(s) spoken
    * `currency` (string): Local currency code
    * `exchange_rate` (number): Exchange rate from local currency to USD (e.g. how many local currency units equal 1 USD)
    * `budget_tips` (array of strings): List of money-saving tips for the destination
    * `transportation_options` (array of objects): List of transportation options, each with:
      * `name` (string): Name of transportation option (e.g., "Metro", "Bus", "Taxi")
      * `description` (string): Brief description
      * `cost_range` (string): Text describing typical costs in USD (e.g., "$1-3 per ride")
      * `app_name` (string, optional): Relevant app for this transportation method
      * `app_link` (string, optional): URL to download/access the app
    * `discount_options` (array of objects): List of money-saving passes/discounts:
      * `name` (string): Name of the discount pass/option
      * `description` (string): What it includes and why it's valuable
      * `price` (string): Approximate cost in USD
      * `link` (string, optional): Where to purchase/learn more
    * `emergency_info` (object, optional): Emergency contact numbers:
      * `police` (string): Local police number
      * `ambulance` (string): Local emergency medical number
      * `tourist_police` (string, optional): Tourist police if applicable
11. **Summary Field:** Include a short, engaging `summary` field within the JSON object (1-2 sentences).
12. **Day Titles:** Provide a meaningful `title` for each day reflecting the main theme or area (e.g., "Day 1: Arrival and Golden Exploration", "Day 2: Temples, Shrines, and Bamboo").
13. **CRITICAL OUTPUT CONSTRAINT:** Output **ONLY the raw JSON object**. Do not include markdown formatting like ```json ... ```. Do not include any introductory or concluding sentences like "Here is your itinerary:". Your response must be *only* the JSON.

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
        "place_name_for_lookup": null,
        "cost_estimate": {{
          "min": 10,
          "max": 20,
          "currency": "USD"
        }}
        }},
        {{
        "time": "10:00",
        "description": "Visit the stunning Kinkaku-ji (Golden Pavilion)",
        "place_name_for_lookup": "Kinkaku-ji",
        "place_details": {{
          "name": "Kinkaku-ji Temple",
          "category": "attraction",
          "price_level": 2
        }},
        "cost_estimate": {{
          "min": 5,
          "max": 10,
          "currency": "USD"
        }},
        "ticket_url": "https://example.com/kinkaku-ji-tickets"
        }}
    ],
    "day_cost_estimate": {{
      "min": 50,
      "max": 100,
      "currency": "USD"
    }}
    }}
],
"destination_info": {{
  "country": "Japan",
  "city": "Kyoto",
  "language": "Japanese",
  "currency": "JPY",
  "exchange_rate": 110.5,
  "budget_tips": [
    "Purchase a 1-day bus pass for unlimited travel",
    "Many temples have free areas you can visit without paying entrance fees"
  ],
  "transportation_options": [
    {{
      "name": "City Bus",
      "description": "Extensive network covering most tourist sites",
      "cost_range": "$2-3 per ride, $5 for day pass",
      "app_name": "Kyoto Bus Navi",
      "app_link": "https://www2.city.kyoto.lg.jp/kotsu/webguide/en/"
    }}
  ],
  "discount_options": [
    {{
      "name": "Kyoto Sightseeing Pass",
      "description": "Unlimited bus and subway travel within Kyoto",
      "price": "$8 for 1-day pass"
    }}
  ]
}},
"total_cost_estimate": {{
  "min": 800,
  "max": 1200,
  "currency": "USD",
  "accommodations": {{
    "min": 400,
    "max": 600
  }},
  "food": {{
    "min": 150,
    "max": 250
  }},
  "attractions": {{
    "min": 100,
    "max": 150
  }},
  "transportation": {{
    "min": 50,
    "max": 100
  }},
  "other": {{
    "min": 100,
    "max": 100
  }}
}}
}}
```
Now, generate ONLY the JSON itinerary based on the user preferences and your research. Remember the strict output constraint and ensure all cost estimates are in USD.
"""
    return prompt.strip()
# ──────────────────────────────── Plan Trip View (Main Logic) ──────────────────────────────── #
@api_view(['POST'])
def plan_trip_view(request):
    serializer = PlanTripSerializer(data=request.data)
    if serializer.is_valid():
        data = serializer.validated_data 
        
        key = make_key(data)       
        print("DEBUG: Serializer is valid")
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
            if data.get("searchMode") == "normal":
                raw_response = ask_gemini(single_prompt, 'gemini-2.5-flash-preview-04-17')
            elif data.get("searchMode") == "quick":
                raw_response = ask_gemini(single_prompt, 'gemini-2.0-flash')
            else:
                raw_response = ask_gemini(single_prompt, 'gemini-2.5-pro-preview-03-25')


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
                    # Use the key defined above
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

@require_GET
def proxy_place_photo(request):
    """
    Proxy endpoint for Google Places photos to avoid CORS issues.
    """
    photo_reference = request.GET.get('photo_reference')
    max_width = request.GET.get('maxwidth', 800)
    
    if not photo_reference:
        return JsonResponse({"error": "Missing photo_reference parameter"}, status=400)
        
    try:
        # Build the photo URL
        google_url = f"https://maps.googleapis.com/maps/api/place/photo?maxwidth={max_width}&photoreference={photo_reference}&key={settings.GOOGLE_API_KEY}"
        
        # Fetch the image from Google
        import requests
        response = requests.get(google_url, stream=True)
        
        if not response.ok:
            return JsonResponse({"error": "Failed to fetch image from Google"}, status=response.status_code)
            
        # Return the image with appropriate content type
        from django.http import HttpResponse
        return HttpResponse(
            response.content,
            content_type=response.headers.get('Content-Type', 'image/jpeg')
        )
    except Exception as e:
        print(f"❌ Error proxying photo: {str(e)}")
        return JsonResponse({"error": "Internal server error"}, status=500)

# ──────────────────────────────── SavedTrip ──────────────────────────────── #
class SaveTripView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        serializer = SavedTripSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            try:
                destination_name = serializer.validated_data.get('destination')
                image_urls = [] 
                if destination_name:
                    image_urls = get_pixabay_image_urls(destination_name, count=5) 
                
                saved_trip = serializer.save(user=request.user, destination_image_urls=image_urls) 
                
                return Response(SavedTripSerializer(saved_trip).data, status=status.HTTP_201_CREATED)
            except Exception as e:
                 print (f"❌ Error saving trip: {e}")
                 return Response({"error": "Could not save trip due to an internal error."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            print (f"❌ Error with serializer: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# ──────────────────────────────── SavedTrip List ──────────────────────────────── #
class MyTripsListView(generics.ListAPIView):
    serializer_class = SavedTripSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        return SavedTrip.objects.filter(user=self.request.user).order_by('-saved_at')  

# ──────────────────────────────── SavedTrip Images ──────────────────────────────── #
def get_pixabay_image_urls(query: str, count: int = 5) -> list[str]: 

    api_key = settings.PIXABAY_API_KEY
    if not api_key: return []

    params = {
        'key': api_key,
        'q': query,
        'image_type': 'photo',
        'orientation': 'horizontal',
        'category': 'places,travel,buildings',
        'safesearch': 'true',
        'per_page': count 
    }
    api_url = "https://pixabay.com/api/"
    image_urls = [] 

    try:
        response = requests.get(api_url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()

        if data['hits']:
            for hit in data['hits'][:count]: 
                url = hit.get('webformatURL') or hit.get('largeImageURL')
                if url:
                    image_urls.append(url)
            print(f"✅ Found {len(image_urls)} Pixabay images for '{query}'")
        else:
            print(f"ℹ️ No Pixabay image results found for query: '{query}'")
        
        return image_urls 

    except requests.exceptions.RequestException as e:
        print(f"❌ Error fetching from Pixabay API: {e}")
        return [] 
    except Exception as e:
        print(f"❌ Unexpected error in get_pixabay_image_urls: {e}")
        return [] 

#--────────────────────────────── Chat Replace Activity ──────────────────────────────── #
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

@api_view(['POST'])
def chat_replace_activity(request):

    try:
        message = request.data.get('message')
        day_index = request.data.get('dayIndex')
        activity_index = request.data.get('activityIndex')
        plan = request.data.get('plan')

        if not message or day_index is None or activity_index is None or not plan:
            return Response({"error": "Missing required fields."}, status=400)

        # Get current location, budget, etc. for context
        destination_info = plan.get('destination_info', {})
        destination = destination_info.get('city', 'the destination')
        country = destination_info.get('country', '')
        currency = destination_info.get('currency', 'USD')
        current_activity = plan['days'][day_index]['activities'][activity_index] if day_index < len(plan['days']) and activity_index < len(plan['days'][day_index]['activities']) else {}
        budget_level = "Mid-range"  # Default if not specified
        
        # Extract the time from the current activity to maintain schedule
        current_time = current_activity.get('time', '')

        prompt = (
            f"You are an expert travel assistant. The user wants to replace an activity in their trip plan for {destination}, {country}.\n"
            f"User message: {message}\n"
            f"Current day index: {day_index}, activity index: {activity_index}\n"
            f"The current activity details are: {json.dumps(current_activity)}\n"
            f"Here is relevant context from the trip plan:\n"
            f"- Location: {destination}, {country}\n"
            f"- Local currency: {currency}\n"
            f"- Budget level: {budget_level}\n\n"
            f"Suggest a single new activity (in JSON) that fits the user's request and maintains the time from the original schedule."
            f"Include cost estimates based on the destination and budget level.\n\n"
            f"Return ONLY a JSON object with these keys:\n"
            f"- time: (same time as original activity to maintain schedule)\n"
            f"- description: (detailed description of the new activity)\n"
            f"- place_name_for_lookup: (specific location name for map lookup, or null if not applicable)\n"
            f"- place_details: (object with name, category, and optional price_level properties)\n"
            f"- cost_estimate: (object with min, max, and currency properties)\n"
            f"- ticket_url: (string or null, direct URL for booking/tickets if applicable, otherwise null)"
        )

        from .chat_request import ask_gemini, extract_json_from_response
        model_name = 'gemini-1.5-flash'
        raw_response = ask_gemini(prompt, model_name)
        if not raw_response:
            return Response({"error": "No response from AI."}, status=500)

        cleaned_json = extract_json_from_response(raw_response)
        try:
            activity = json.loads(cleaned_json)
            required_fields = ["time", "description", "place_name_for_lookup"]
            if "ticket_url" not in activity:
                activity["ticket_url"] = None 

            if not all(k in activity for k in required_fields):
                # If some fields are missing, add defaults
                if "time" not in activity:
                    activity["time"] = current_time
                if "description" not in activity:
                    return Response({"error": "AI response missing required 'description' field."}, status=500)
                if "place_name_for_lookup" not in activity:
                    activity["place_name_for_lookup"] = None
            
            # Ensure cost_estimate is present
            if "cost_estimate" not in activity:
                activity["cost_estimate"] = {
                    "min": 10,
                    "max": 50,
                    "currency": currency
                }
            
            # Ensure place_details is present
            if "place_details" not in activity and activity.get("place_name_for_lookup"):
                activity["place_details"] = {
                    "name": activity["place_name_for_lookup"],
                    "category": "attraction"  # Default category
                }
            # Ensure ticket_url is present, defaulting to null if not already set
            if "ticket_url" not in activity:
                activity["ticket_url"] = None
            
            return Response({"activity": activity}, status=200)
        except Exception as e:
            return Response({"error": "Failed to parse AI response.", "details": str(e)}, status=500)

    except Exception as e:
        return Response({"error": "Internal server error.", "details": str(e)}, status=500)

