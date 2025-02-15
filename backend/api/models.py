from django.db import models

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

# Event Model
class Event(models.Model):
    # Image for the event. This will store the path of the image file.
    image = models.ImageField(upload_to='event_images/')
    
    # Title of the event
    title = models.CharField(max_length=200)
    
    # Who is hosting the event, tied to a user profile
    # host = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    host = models.CharField(max_length=20)

    # Description of the event
    description = models.TextField()
    
    # When the event is happening
    event_time = models.DateTimeField()
    
    # Where the event is taking place
    event_place = models.CharField(max_length=200)
    
    # How many people are estimated to be there
    estimated_attendees = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.title
