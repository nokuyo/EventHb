# models.py
from django.db import models
from django.contrib.auth.models import User  

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    profile_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    
    xp = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.profile_name

    # Helper method
    def level(self):
        return self.xp // 500  


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
