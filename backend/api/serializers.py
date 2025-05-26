"""
Django REST Framework Serializers for Trip Planner Application

This module contains all the serializers used in the Trip Planner application.
It includes serializers for:
- User registration and authentication
- User profile management
- Trip planning and saving
- Activity notes

Key Features:
- User registration with email and password validation
- Profile management with visited countries tracking
- Trip planning data validation
- Activity note management
"""

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, VisitedCountry, SavedTrip 
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.tokens import RefreshToken
from django.db import transaction
from rest_framework import serializers
from django.db import transaction 
from .models import ActivityNote

class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration.
    
    Features:
    - Email-based registration
    - Password validation
    - Full name collection
    - Automatic username generation from email
    - User profile creation
    """
    full_name = serializers.CharField(required=True, write_only=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2', 'full_name')
        extra_kwargs = {
            'username': {'read_only': True},
        }

    def validate(self, attrs):
        """
        Validate registration data.
        
        Args:
            attrs: Dictionary of registration attributes
            
        Returns:
            dict: Validated attributes
            
        Raises:
            ValidationError: If email is already registered or passwords don't match
        """
        if User.objects.filter(username=attrs['email']).exists():
            raise serializers.ValidationError({"email": "This email address is already registered."})
        
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Passwords don't match."})

        return attrs
    
    @transaction.atomic
    def create(self, validated_data):
        """
        Create a new user and associated profile.
        
        Args:
            validated_data: Dictionary of validated registration data
            
        Returns:
            User: Newly created user instance
        """
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
    """
    Serializer for user login.
    
    Features:
    - Email-based login
    - Password validation
    - User existence verification
    """
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('email', 'password')
        
    @transaction.atomic
    def validate(self, attrs):
        """
        Validate login credentials.
        
        Args:
            attrs: Dictionary of login attributes
            
        Returns:
            dict: Validated attributes
            
        Raises:
            ValidationError: If email is not registered or password is incorrect
        """
        email = attrs.get('email')
        password = attrs.get('password')

        if not User.objects.filter(email=email).exists():
            raise serializers.ValidationError({"email": "Email address is not registered."})

        user = User.objects.get(email=email)

        if not user.check_password(password):
            raise serializers.ValidationError({"password": "Incorrect password."})

        return attrs
    
class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for user profile management.
    
    Features:
    - Profile information retrieval
    - Visited countries management
    - Full name updates
    """
    username_email = serializers.EmailField(source='user.username', read_only=True) 
    visited_countries = serializers.ListField(child=serializers.CharField(max_length=100), required=False, write_only=False)
    
    class Meta:
        model = UserProfile
        fields = ['id', 'username_email', 'full_name', 'visited_countries']
        read_only_fields = ['id', 'username_email']

    def to_representation(self, instance):
        """
        Convert profile instance to dictionary representation.
        
        Args:
            instance: UserProfile instance
            
        Returns:
            dict: Profile data with visited countries
        """
        representation = super().to_representation(instance)
        countries_queryset = VisitedCountry.objects.filter(user=instance.user).values_list('country_name', flat=True) 
        representation['visited_countries'] = list(countries_queryset)
        return representation
    
    @transaction.atomic 
    def update(self, instance, validated_data):
        """
        Update profile information and visited countries.
        
        Args:
            instance: UserProfile instance to update
            validated_data: Dictionary of validated update data
            
        Returns:
            UserProfile: Updated profile instance
        """
        instance.full_name = validated_data.get('full_name', instance.full_name) 
        instance.save() 

        visited_countries_data = validated_data.get('visited_countries', None) 

        if visited_countries_data is not None:
            user = instance.user 

            current_countries = set(VisitedCountry.objects.filter(user=user).values_list('country_name', flat=True))
            new_countries = set(visited_countries_data)

            countries_to_delete = current_countries - new_countries
            if countries_to_delete:
                VisitedCountry.objects.filter(user=user, country_name__in=countries_to_delete).delete()

            countries_to_add = new_countries - current_countries
            if countries_to_add:
                visited_country_objects = [
                    VisitedCountry(user=user, country_name=country) for country in countries_to_add
                ]
                VisitedCountry.objects.bulk_create(visited_country_objects)

        return instance 
    
class PlanTripSerializer(serializers.Serializer):
    """
    Serializer for trip planning data.
    
    Features:
    - Destination validation
    - Date range handling
    - Trip preferences collection
    - Search mode specification
    """
    destination = serializers.CharField()
    startDate = serializers.DateField(required=False, allow_null=True)
    endDate = serializers.DateField(required=False, allow_null=True)
    tripStyle = serializers.ListField(child=serializers.CharField(), required=False, default=list)
    interests = serializers.ListField(child=serializers.CharField(), required=False, default=list)
    pace = serializers.CharField(required=False, default="moderate")
    budget = serializers.CharField(required=False, default="Mid-range")
    transportationMode = serializers.CharField(max_length=100, required=False, default="Walking & Public Transit")
    travelWith = serializers.ListField(child=serializers.CharField(), required=False, default=list)
    mustSeeAttractions = serializers.CharField(required=False, allow_blank=True, default="")
    searchMode = serializers.CharField(required=True)

class SavedTripSerializer(serializers.ModelSerializer):
    """
    Serializer for saved trips.
    
    Features:
    - Trip data storage
    - User association
    - Destination images
    - Plan JSON storage
    """
    user_email = serializers.EmailField(source='user.username', read_only=True)
    
    class Meta:
        model = SavedTrip
        fields = [
            'id', 
            'user', 
            'user_email', 
            'destination', 
            'start_date', 
            'end_date', 
            'plan_json', 
            'saved_at',
            'title',
            'destination_image_urls',
        ]
        read_only_fields = ['id', 'user', 'saved_at', 'user_email']

class ActivityNoteSerializer(serializers.ModelSerializer):
    """
    Serializer for activity notes.
    
    Features:
    - Note content management
    - Activity completion tracking
    - Timestamp tracking
    """
    class Meta:
        model = ActivityNote
        fields = ['id', 'user', 'trip', 'day_index', 'activity_index', 'note', 'is_done', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']