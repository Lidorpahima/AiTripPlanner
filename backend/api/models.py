"""
Django Models for Trip Planner Application

This module contains the database models for the Trip Planner application.
It defines the structure for user profiles, visited countries, saved trips,
and activity notes.
"""

from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    """
    Extended user profile model that stores additional user information.
    
    Attributes:
        user (OneToOneField): Link to Django's built-in User model
        full_name (CharField): User's full name
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    full_name = models.CharField(max_length=100, default="")

    def __str__(self):
        return self.user.username

class VisitedCountry(models.Model):
    """
    Model to track countries visited by users.
    
    Attributes:
        user (ForeignKey): Link to the user who visited the country
        country_name (CharField): Name of the visited country
        visit_date (DateField): Date when the country was marked as visited
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='visited_countries')
    country_name = models.CharField(max_length=100)
    visit_date = models.DateField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'country_name']

class SavedTrip(models.Model):
    """
    Model to store user's saved trip plans.
    
    Attributes:
        user (ForeignKey): Link to the user who saved the trip
        destination (CharField): Trip destination
        start_date (DateField): Trip start date (optional)
        end_date (DateField): Trip end date (optional)
        plan_json (JSONField): Detailed trip plan in JSON format
        saved_at (DateTimeField): When the trip was saved
        title (CharField): Trip title
        destination_image_urls (JSONField): URLs of destination images
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='saved_trips')
    destination = models.CharField(max_length=255)
    start_date = models.DateField(null=True, blank=True) 
    end_date = models.DateField(null=True, blank=True)
    plan_json = models.JSONField() 
    saved_at = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=255, default="")
    destination_image_urls = models.JSONField(default=list, null=True, blank=True)
    
    def __str__(self):
        return f"Trip to {self.destination} for {self.user.username}"

    class Meta:
        ordering = ['-saved_at'] 

class ActivityNote(models.Model):
    """
    Model to store user notes for specific activities in a trip.
    
    Attributes:
        user (ForeignKey): Link to the user who created the note
        trip (ForeignKey): Link to the associated trip
        day_index (IntegerField): Day number in the trip
        activity_index (IntegerField): Activity number in the day
        note (TextField): Content of the note
        created_at (DateTimeField): When the note was created
        updated_at (DateTimeField): When the note was last updated
        is_done (BooleanField): Whether the activity is completed
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activity_notes')
    trip = models.ForeignKey(SavedTrip, on_delete=models.CASCADE, related_name='activity_notes')
    day_index = models.IntegerField()
    activity_index = models.IntegerField()
    note = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_done = models.BooleanField(default=False)

    class Meta:
        unique_together = ['user', 'trip', 'day_index', 'activity_index']

    def __str__(self):
        return f"Note for trip {self.trip.id} day {self.day_index} activity {self.activity_index} by {self.user.username}"