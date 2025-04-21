from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    full_name = models.CharField(max_length=100, default="")

    def __str__(self):
        return self.user.username

class VisitedCountry(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='visited_countries')
    country_name = models.CharField(max_length=100)
    visit_date = models.DateField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'country_name']  
class SavedTrip (models.Model):
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