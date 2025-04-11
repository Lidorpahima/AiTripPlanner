from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.contrib.auth.models import User
from .serializers import RegisterSerializer , LoginSerializer
from rest_framework_simplejwt.tokens import RefreshToken

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
