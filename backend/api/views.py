from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from rest_framework.views import APIView

from .models import Event, UserProfile
from .serializers import EventSerializer, UserProfileSerializer
from .authentication import FirebaseAuthentication


# 🎯 ModelViewSet for basic CRUD + user-specific events
class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    authentication_classes = [FirebaseAuthentication]
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user_profile = self.request.user.userprofile
        # 🔧 Fix: Save profile_name string to CharField
        serializer.save(host=user_profile.profile_name)

    @action(detail=False, methods=['get'], url_path='my-events')
    def my_events(self, request):
        user_profile = request.user.userprofile
        user_events = Event.objects.filter(host=user_profile.profile_name)  # 🔧 match against CharField
        serializer = self.get_serializer(user_events, many=True)
        return Response(serializer.data)


# 🌱 APIView for custom GET/POST logic and XP handling
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
                'host': event.host,  # 🔧 already a string (CharField)
                'title': event.title,
                'description': event.description,
                'event_time': event.event_time.isoformat(),
                'event_place': event.event_place,
                'estimated_attendees': event.estimated_attendees,
            })
        return Response(events_data)

    def post(self, request, format=None):
        user_profile = request.user.userprofile

        # 1️⃣ User is attending an event
        if 'event_id' in request.data:
            event_id = request.data['event_id']
            increment = int(request.data.get('increment', 1))

            try:
                event = Event.objects.get(id=event_id)
            except Event.DoesNotExist:
                return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)

            event.estimated_attendees += increment
            event.save()

            # 🎮 Grant XP for attending
            user_profile.xp += 25
            user_profile.save()

            serializer = EventSerializer(event)
            return Response(serializer.data, status=status.HTTP_200_OK)

        # 2️⃣ User is creating an event
        serializer = EventSerializer(data=request.data)
        if serializer.is_valid():
            # 🔧 Fix: Save profile_name string to host field
            serializer.save(host=user_profile.profile_name)

            # 🎮 Grant XP for creating an event
            user_profile.xp += 50
            user_profile.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 🧑‍💻 APIView for profile data (for frontend XP/profile fetch)
class UserProfileView(APIView):
    authentication_classes = [FirebaseAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_profile = request.user.userprofile
        serializer = UserProfileSerializer(user_profile)
        return Response(serializer.data)
