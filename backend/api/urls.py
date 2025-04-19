from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,)
from .views import RegisterView , get_place_details_view ,   ProfileView
from .views import plan_trip_view
urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('plantrip/', plan_trip_view, name='plan_trip'),
    path('place-details/',get_place_details_view , name='place_details'),
    path('profile/', ProfileView.as_view(), name='profile')
]
