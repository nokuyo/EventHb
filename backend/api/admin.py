# Register your models here.
from django.contrib import admin
from .models import Event, UserProfile

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'host', 'event_time', 'event_place')
    search_fields = ('title', 'description', 'event_place')

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('profile_name', 'email')
    search_fields = ('profile_name', 'email')
