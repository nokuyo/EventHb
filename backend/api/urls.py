from django.urls import path, include
from api import views
urlpatterns = [
    path('api/event_list_view/', views.event_list_view, name='event'),
]
