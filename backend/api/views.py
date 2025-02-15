from django.shortcuts import render
from django.http import JsonResponse
from .models import Event

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Event
from .serializers import EventSerializer
# Create your views here.


# views.py
from django.http import JsonResponse
from .models import Event

def event_list_view(request):
    if request.method == 'GET':
        events = Event.objects.all()
        events_data = []
        for event in events:
            events_data.append({
                'id': event.id,
                # If an image exists, return its URL; otherwise, return None
                'image': event.image.url if event.image else None,
                'title': event.title,
                # For the host, you might return the host's ID, username, or other detail;
                # adjust as needed (assuming UserProfile has a 'user' field with a username)
                'host': event.host.user.username if hasattr(event.host, 'user') else event.host.id,
                'description': event.description,
                # Convert the datetime to an ISO formatted string
                'event_time': event.event_time.isoformat(),
                'event_place': event.event_place,
                'estimated_attendees': event.estimated_attendees,
            })
        return JsonResponse(events_data, safe=False)
    else:
        return JsonResponse({'error': 'GET request required.'}, status=400)
    
class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    def perform_create(self, serializer):
        # Automatically set the host using the logged-in user's profile.
        # This assumes that every User has an associated UserProfile.
        user_profile = self.request.user.userprofile  
        serializer.save(host=user_profile)
