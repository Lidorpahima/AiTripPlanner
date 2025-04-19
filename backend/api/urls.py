from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,)
from .views import RegisterView , get_place_details_view ,   ProfileView,plan_trip_view, get_visited_countries, add_visited_country, remove_visited_country
urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('plantrip/', plan_trip_view, name='plan_trip'),
    path('place-details/',get_place_details_view , name='place_details'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('api/visited-countries',get_visited_countries, name='visited_countries'),
    path('api/visited-countries/<str:country_name>', remove_visited_country, name='remove_visited_country'),
    path('api/visited-countries', add_visited_country, name='add_visited_country'),
]
