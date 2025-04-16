from rest_framework import serializers
from .models import Event, UserProfile

# Event Serializer (includes host as read-only)
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
            'host'
        ]
        # Prevent frontend from supplying this directly
        read_only_fields = ['host']  


# UserProfile Serializer for XP and profile data
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['profile_name', 'email', 'xp']
