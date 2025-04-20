from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.tokens import RefreshToken
from django.db import transaction
from rest_framework import serializers

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

class LoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('email', 'password')
        
    @transaction.atomic
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if not User.objects.filter(email=email).exists():
            raise serializers.ValidationError({"email": "Email address is not registered."})

        user = User.objects.get(email=email)

        if not user.check_password(password):
            raise serializers.ValidationError({"password": "Incorrect password."})

        return attrs
    
class UserProfileSerializer(serializers.ModelSerializer):
    username_email = serializers.EmailField(source='user.username', read_only=True) 

    class Meta:
        model = UserProfile
        fields = ['id', 'username_email', 'full_name']
        read_only_fields = ['id', 'username_email']
    
class PlanTripSerializer(serializers.Serializer):
    destination = serializers.CharField()
    startDate = serializers.DateField()
    endDate = serializers.DateField()
    tripStyle = serializers.ListField(child=serializers.CharField())
    interests = serializers.ListField(child=serializers.CharField())
    pace = serializers.CharField()
