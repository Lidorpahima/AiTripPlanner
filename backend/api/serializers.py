from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.tokens import RefreshToken
from django.db import transaction

class RegisterSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(required=True,write_only=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2', 'full_name')
        extra_kwargs = {
            'username':{'read_only': True},
        }
    def validate(self, attrs):
        if User.objects.filter(username=attrs['email']).exists():
            raise serializers.ValidationError({"email": "This email address is already registered."})
        
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Passwords don't match."})

        return attrs
    
    @transaction.atomic
    def create(self, validated_data):
        full_name = validated_data.pop('full_name')
        password = validated_data.pop('password')
        validated_data.pop('password2')
        email_address = validated_data.pop('email')

        user = User.objects.create_user(
            username=email_address,  
            email=email_address,     
            **validated_data         
        )

        user.set_password(password)
        user.save()

        UserProfile.objects.create(user=user, full_name=full_name)
        return user