# serializers.py
from rest_framework import serializers
from .models import Event

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        # Notice we’re not including the 'host' field here because we set it automatically.
        fields = ['id', 'image', 'title', 'description', 'event_time', 'event_place', 'estimated_attendees']
