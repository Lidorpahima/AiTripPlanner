from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
    )
from .views import (
    RegisterView, 
    get_place_details_view, 
    ProfileUpdateView,
    ProfileRetrieveView,
    plan_trip_view, 
    SaveTripView, 
    MyTripsListView,
    MyTripDetailView,
    get_csrf_token,
    chat_replace_activity,
    proxy_place_photo,
    PasswordResetRequestView,
    PasswordResetConfirmView,
    GoogleLoginView,
    chat_add_activity,
    save_activity_note,
    get_activity_notes,
    GoogleOAuthCallbackView,
)
from django.contrib.auth import views as auth_views
urlpatterns = [
    path('csrf/', get_csrf_token, name='csrf'),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('plantrip/', plan_trip_view, name='plan_trip'),
    path('place-details/',get_place_details_view , name='place_details'),
    path('place-photo/', proxy_place_photo, name='place_photo'),
    path('profile/', ProfileRetrieveView.as_view(), name='profile-retrieve'),
    path('profile/update/', ProfileUpdateView.as_view(), name='profile-update'), 
    path('trips/save/', SaveTripView.as_view(), name='save_trip'),  
    path('my-trips/', MyTripsListView.as_view(), name='my_trips'),
    path('my-trips/<int:pk>/', MyTripDetailView.as_view(), name='my_trip_detail'),
    path('chat-replace-activity/', chat_replace_activity, name='chat_replace_activity'),
    path('chat-add-activity/', chat_add_activity, name='chat_add_activity'),
    path('password-reset/request/', PasswordResetRequestView.as_view(), name='password_reset_request_api'),
    path('password-reset/confirm/<uidb64>/<token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm_api'),
    path('auth/google/', GoogleLoginView.as_view(), name='google_login'),
    path('activity-note/', save_activity_note, name='save_activity_note'),
    path('activity-notes/<int:trip_id>/', get_activity_notes, name='get_activity_notes'),
    path('auth/google/callback/', GoogleOAuthCallbackView.as_view(), name='google_oauth_callback'),
]
