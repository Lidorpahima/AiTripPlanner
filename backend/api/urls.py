from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import RegisterView ,image_search_view
from .views import plan_trip_view
urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('plantrip/', plan_trip_view, name='plan_trip'),
    path("image-search/", image_search_view, name="image_search"),
]
