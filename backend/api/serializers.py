from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, VisitedCountry ,SavedTrip 
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.tokens import RefreshToken
from django.db import transaction
from rest_framework import serializers
from django.db import transaction 
from .models import ActivityNote

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
    visited_countries = serializers.ListField(child=serializers.CharField(max_length=100),required=False,write_only=False)
    
    class Meta:
        model = UserProfile
        fields = ['id', 'username_email', 'full_name','visited_countries']
        read_only_fields = ['id', 'username_email']
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        countries_queryset = VisitedCountry.objects.filter(user=instance.user).values_list('country_name', flat=True) 
        representation['visited_countries'] = list(countries_queryset)
        return representation
    
    @transaction.atomic 
    def update(self, instance, validated_data):

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
                print(f"[DEBUG] Deleted countries for user {user.id}: {countries_to_delete}") 

            countries_to_add = new_countries - current_countries
            if countries_to_add:
                visited_country_objects = [
                    VisitedCountry(user=user, country_name=country) for country in countries_to_add
                ]
                VisitedCountry.objects.bulk_create(visited_country_objects)
                print(f"[DEBUG] Added countries for user {user.id}: {countries_to_add}") 

            final_countries = set(VisitedCountry.objects.filter(user=user).values_list('country_name', flat=True))
            print(f"[DEBUG] Final countries for user {user.id}: {final_countries}") 

        return instance 
    
class PlanTripSerializer(serializers.Serializer):
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
    class Meta:
        model = ActivityNote
        fields = ['id', 'user', 'trip', 'day_index', 'activity_index', 'note', 'is_done', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']