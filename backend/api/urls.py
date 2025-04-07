from django.urls import path, include
from api import views
from rest_framework.routers import DefaultRouter
from .views import EventListView

router = DefaultRouter()
router.register(r'events', views.EventViewSet, basename='event')
urlpatterns = [
    path('api/event_list_view/', EventListView.as_view(), name='event_fetch'),
    path('api/', include(router.urls)),
]
