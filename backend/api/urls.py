from django.urls import path, include
from api import views
urlpatterns = [
    path('api/test_function/', views.test_function, name='test'),
]
