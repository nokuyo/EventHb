# views.py (using DRF viewset)
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Event
from .serializers import EventSerializer

from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Event, UserProfile
from .serializers import EventSerializer


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]  # or just [IsAuthenticated] if you wish

    def perform_create(self, serializer):
        user_profile = self.request.user.userprofile  
        serializer.save(host=user_profile)

    @action(detail=False, methods=['get'], url_path='my-events')
    def my_events(self, request):
        # Return only events where host == current user's UserProfile
        user_profile = request.user.userprofile
        user_events = Event.objects.filter(host=user_profile)
        serializer = self.get_serializer(user_events, many=True)
        return Response(serializer.data)


    
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser

from .models import Event
from .serializers import EventSerializer
from .authentication import FirebaseAuthentication

class EventListView(APIView):
    authentication_classes = [FirebaseAuthentication]
    permission_classes = [IsAuthenticated]
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def get(self, request, format=None):
        events = Event.objects.all()
        events_data = []
        for event in events:
            events_data.append({
                'id': event.id,
                'image': request.build_absolute_uri(event.image.url) if event.image else None,
                'host': event.host.user.username if hasattr(event.host, 'user') else str(event.host),
                'title': event.title,
                'description': event.description,
                'event_time': event.event_time.isoformat(),
                'event_place': event.event_place,
                'estimated_attendees': event.estimated_attendees,
            })
        return Response(events_data)

    def post(self, request, format=None):
        # 1) Check if this request is for incrementing attendance
        if 'event_id' in request.data:
            event_id = request.data['event_id']
            increment = int(request.data.get('increment', 1)) 
            try:
                event = Event.objects.get(id=event_id)
            except Event.DoesNotExist:
                return Response(
                    {'error': 'Event not found'},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Increment the attendees count
            event.estimated_attendees += increment
            event.save()

            # Return updated event data
            serializer = EventSerializer(event)
            return Response(serializer.data, status=status.HTTP_200_OK)

        # 2) If 'event_id' not in request, then proceed as normal 
        serializer = EventSerializer(data=request.data)
        if serializer.is_valid():
            user_profile = request.user.userprofile
            serializer.save(host=user_profile)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
