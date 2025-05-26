"""
Google Places API Service for Trip Planner Application

This module provides a service for interacting with the Google Places API.
It handles place searches, details retrieval, and photo management.

Key Features:
- Place search and details retrieval
- Photo URL generation
- Response caching
- Error handling
- Data processing and formatting
"""

from googlemaps import Client
from django.conf import settings
from django.core.cache import cache

class GooglePlacesService:
    """
    Service class for interacting with Google Places API.
    
    Features:
    - Place search and details retrieval
    - Photo URL generation
    - Response caching (72 hours)
    - Error handling
    - Data processing
    """
    
    def __init__(self):
        """
        Initialize the Google Places service.
        
        Sets up the Google Maps client and cache duration.
        """
        self.client = Client(key=settings.GOOGLE_API_KEY)
        self.cache_duration = 60 * 60 * 72  # 72 hours in seconds

    def search_place(self, query, location=None):
        """
        Search for a place and retrieve its details.
        
        Args:
            query (str): The search query for the place
            location (tuple, optional): (latitude, longitude) for location-based search
            
        Returns:
            dict: Processed place details or None if not found/error
        """
        cache_key = f"place_details_{query}"
        cached_result = cache.get(cache_key)
        
        if cached_result:
            print("📦 Returning cached result for:", query)
            return cached_result

        try:
            print(f"🔍 Searching for place: {query}")
            
            places_result = self.client.places(
                query,
                location=location,
            )

            if not places_result.get('results'):
                print("❌ No results found")
                return None

            # Get full details
            place_id = places_result['results'][0]['place_id']
            place_details = self.client.place(
                place_id,
                fields=[
                    'name',
                    'formatted_address',
                    'rating',
                    'user_ratings_total',
                    'photo',
                    'formatted_phone_number',
                    'opening_hours',
                    'website',
                    'price_level',
                    'reviews',
                    'geometry'
                ],
            )

            result = self._process_place_details(place_details['result'])
            cache.set(cache_key, result, self.cache_duration)
            
            print("✅ Successfully fetched place details")
            return result

        except Exception as e:
            print(f"❌ Error in search_place: {str(e)}")
            return None

    def _process_place_details(self, place):
        """
        Process raw place details into a standardized format.
        
        Args:
            place (dict): Raw place details from Google Places API
            
        Returns:
            dict: Processed place details or None if invalid
        """
        if not place:
            return None

        location = place.get('geometry', {}).get('location') 
        opening_hours_list = place.get('opening_hours', {}).get('weekday_text', []) 

        # Process photos
        photo_urls = []
        photos_references = place.get('photos', [])
        if isinstance(photos_references, list):
            for photo_ref_obj in photos_references[:5]:
                if isinstance(photo_ref_obj, dict) and 'photo_reference' in photo_ref_obj:
                    photo_ref_string = photo_ref_obj['photo_reference']
                    photo_urls.append(self._get_photo_url(photo_ref_string))

        # Process reviews
        reviews_list = []
        reviews_data = place.get('reviews', [])
        if isinstance(reviews_data, list):
            reviews_list = [
                {
                    'author_name': review.get('author_name'),
                    'rating': review.get('rating'),
                    'text': review.get('text'),
                    'time': review.get('relative_time_description')
                }
                for review in reviews_data
                if isinstance(review, dict)
            ]

        return {
            'name': place.get('name'),
            'address': place.get('formatted_address'),
            'rating': place.get('rating'),
            'total_ratings': place.get('user_ratings_total'),
            'phone': place.get('formatted_phone_number'),
            'website': place.get('website'),
            'price_level': place.get('price_level'),
            'location': location,
            'photos': photo_urls, 
            'opening_hours': opening_hours_list, 
            'reviews': reviews_list 
        }

    def _get_photo_url(self, photo_reference):
        """
        Generate a photo URL from a photo reference.
        
        Args:
            photo_reference (str): Google Places photo reference
            
        Returns:
            str: Complete photo URL with API key
        """
        return f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference={photo_reference}&key={settings.GOOGLE_API_KEY}"
