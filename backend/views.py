from django.shortcuts import render
from .models import Report, User
from django.http import HttpResponse, JsonResponse
# Create your views here.


def Listar_user(request):
    users = User.objects.all()
    return JsonResponse({'users': list(users.values())})


def Listar_reportes(request):
    reportes = Report.objects.all()
    return JsonResponse({'reportes': list(reportes.values())})
