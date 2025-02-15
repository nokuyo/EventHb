from django.urls import path, include
from api import views
urlpatterns = [
    path('api/events/', views.event_list_view, name='event'),
]
