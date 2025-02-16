from django.shortcuts import render
from django.http import JsonResponse
from .models import Event

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Event
from .serializers import EventSerializer
from rest_framework.decorators import action
from rest_framework.response import Response


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
                'host': event.host.user.username if hasattr(event.host, 'user') else str(event.host),
                'description': event.description,
                # Convert the datetime to an ISO formatted string
                'event_time': event.event_time.isoformat(),
                'event_place': event.event_place,
                'estimated_attendees': event.estimated_attendees,
            })
        return JsonResponse(events_data, safe=False)
    else:
        return JsonResponse({'error': 'GET request required.'}, status=400)
    
# views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Event
from .serializers import EventSerializer

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    @action(detail=True, methods=['post'])
    def attend(self, request, pk=None):
        event = self.get_object()
        # Get a list of attended event IDs from the session (or initialize it)
        attended_events = request.session.get('attended_events', [])
        if event.id in attended_events:
            return Response({"detail": "Already attended."}, status=status.HTTP_400_BAD_REQUEST)
        # Increase the attendance count
        event.estimated_attendees += 1
        event.save()
        # Mark this event as attended in the session
        attended_events.append(event.id)
        request.session['attended_events'] = attended_events
        serializer = self.get_serializer(event)
        return Response(serializer.data)