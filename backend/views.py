from .models import Report, User, License
from django.http import JsonResponse
# Create your views here.

from rest_framework import viewsets
from .serializers import ReportSerializer


class ReportViewSet(viewsets.ModelViewSet):
    serializer_class = ReportSerializer
    queryset = Report.objects.all()
