from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Event, UserProfile

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['id', 'image', 'title', 'description', 'event_time', 'event_place', 'estimated_attendees']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'profile_name', 'email']
