from django.urls import path, include
from api import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'events', views.EventViewSet, basename='event')
router.register(r'users', views.UserProfileViewSet, basename='users')  

urlpatterns = [
    path('api/event_list_view/', views.EventListView.as_view(), name='event_fetch'),
    path('api/user-profile/', views.UserProfileView.as_view(), name='user-profile'),  
    path('api/', include(router.urls)),
]

