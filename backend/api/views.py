from django.http import JsonResponse
from django.contrib.auth.models import User
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Event, UserProfile
from .serializers import EventSerializer, UserSerializer, UserProfileSerializer


# DRF ViewSet for Event (with 'attend' action)
class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    @action(detail=True, methods=['post'])
    def attend(self, request, pk=None):
        event = self.get_object()
        attended_events = request.session.get('attended_events', [])

        if event.id in attended_events:
            return Response({"detail": "Already attended."}, status=status.HTTP_400_BAD_REQUEST)

        event.estimated_attendees += 1
        event.save()

        attended_events.append(event.id)
        request.session['attended_events'] = attended_events

        serializer = self.get_serializer(event)
        return Response(serializer.data)


# Optional non-DRF API view (JSON-only)
def event_list_view(request):
    if request.method == 'GET':
        events = Event.objects.all()
        events_data = []
        for event in events:
            events_data.append({
                'id': event.id,
                'image': event.image.url if event.image else None,
                'title': event.title,
                'host': event.host,  # Display as string unless using FK
                'description': event.description,
                'event_time': event.event_time.isoformat(),
                'event_place': event.event_place,
                'estimated_attendees': event.estimated_attendees,
            })
        return JsonResponse(events_data, safe=False)
    else:
        return JsonResponse({'error': 'GET request required.'}, status=400)


#  DRF ViewSet for User
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


#  DRF ViewSet for UserProfile
class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
