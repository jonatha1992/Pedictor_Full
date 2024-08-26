
from rest_framework import serializers
from .models import License, Report, User


class LicenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = License
        fields = '__all__'


class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = '__all__'


class userSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
