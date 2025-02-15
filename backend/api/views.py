from django.shortcuts import render
from django.http import JsonResponse
# Create your views here.


def test_function(request):
    value = {"message":"This data is from the backend! "}
    return JsonResponse(value)