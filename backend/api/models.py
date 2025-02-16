# models.py
from django.db import models
from django.contrib.auth.models import User  # Optional: if you want to tie UserProfile to Django's User

# User Profile Model
class UserProfile(models.Model):
    # Option 1: If you want to tie the profile to Django's User model
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    
    # Profile name and email (email can be redundant if using User.email)
    profile_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.profile_name

class Event(models.Model):
    image = models.ImageField(upload_to='event_images/')
    title = models.CharField(max_length=200)
    host = models.CharField(max_length=20)
    description = models.TextField()
    event_time = models.DateTimeField()
    event_place = models.CharField(max_length=200)
    estimated_attendees = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.title
