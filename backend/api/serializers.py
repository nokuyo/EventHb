from rest_framework import serializers
from .models import Event, UserProfile

# 🎯 Event Serializer (now includes host)
class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = [
            'id',
            'image',
            'title',
            'description',
            'event_time',
            'event_place',
            'estimated_attendees',
            'host'  # ✅ Add this!
        ]


# 🎮 UserProfile Serializer for XP and profile data
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['profile_name', 'email', 'xp']
