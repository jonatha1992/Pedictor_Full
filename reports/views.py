from rest_framework import generics
from .models import Report
from rest_framework.serializers import ModelSerializer

class ReportSerializer(ModelSerializer):
    class Meta:
        model = Report
        fields = '__all__'

class ReportListView(generics.ListAPIView):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
from django.shortcuts import render

# Create your views here.
