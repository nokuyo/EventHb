from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from rest_framework.views import APIView

from .models import Event, UserProfile
from .serializers import EventSerializer, UserProfileSerializer
from .authentication import FirebaseAuthentication


# 🎯 CRUD + user-specific events
class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    authentication_classes = [FirebaseAuthentication]
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user_profile = self.request.user.userprofile
        serializer.save(host=user_profile.profile_name)

    @action(detail=False, methods=['get'], url_path='my-events')
    def my_events(self, request):
        user_profile = request.user.userprofile
        user_events = Event.objects.filter(host=user_profile.profile_name)
        serializer = self.get_serializer(user_events, many=True)
        return Response(serializer.data)


# 🌱 Custom GET/POST for all events + XP gain
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
                'host': event.host,
                'title': event.title,
                'description': event.description,
                'event_time': event.event_time.isoformat(),
                'event_place': event.event_place,
                'estimated_attendees': event.estimated_attendees,
            })
        return Response(events_data)

    def post(self, request, format=None):
        user_profile = request.user.userprofile

        # 🪵 Log incoming POST request
        print("📥 Incoming POST data:", request.data)

        # Attendance logic
        if 'event_id' in request.data:
            try:
                event_id = int(request.data['event_id'])
                increment = int(request.data.get('increment', 1))
            except (KeyError, ValueError, TypeError) as e:
                return Response({'error': f'Invalid parameters: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

            try:
                event = Event.objects.get(id=event_id)
            except Event.DoesNotExist:
                return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)

            event.estimated_attendees += increment
            event.save()

            user_profile.xp += 25
            user_profile.save()

            serializer = EventSerializer(event)
            return Response(serializer.data, status=status.HTTP_200_OK)

        # Creation logic
        serializer = EventSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(host=user_profile.profile_name)
            user_profile.xp += 50
            user_profile.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 👤 View to fetch user XP, email, etc.
class UserProfileView(APIView):
    authentication_classes = [FirebaseAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_profile = request.user.userprofile
        serializer = UserProfileSerializer(user_profile)
        return Response(serializer.data)
