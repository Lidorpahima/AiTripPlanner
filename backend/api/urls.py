from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,)
from .views import RegisterView , get_place_details_view , ProfileUpdateView  ,ProfileRetrieveView,plan_trip_view,save_trip_view,get_csrf_token
urlpatterns = [
    path('csrf/', get_csrf_token, name='csrf'),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenObtainPairView.as_view(), name='token_refresh'),
    path('plantrip/', plan_trip_view, name='plan_trip'),
    path('place-details/',get_place_details_view , name='place_details'),
    path('profile/', ProfileRetrieveView.as_view(), name='profile-retrieve'),
    path('profile/update/', ProfileUpdateView.as_view(), name='profile-update'), 
    path('trips/save/', save_trip_view, name='save_trip'),  

]
