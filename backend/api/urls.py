from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EventViewSet, UserViewSet, UserProfileViewSet

router = DefaultRouter()
router.register(r'events', EventViewSet)
router.register(r'users', UserViewSet)
router.register(r'userprofiles', UserProfileViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
