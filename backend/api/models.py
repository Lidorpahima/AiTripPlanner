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
