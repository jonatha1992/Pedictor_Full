from rest_framework import serializers
from .models import License, UserLicense

class LicenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = License
        fields = ['id_license', 'key', 'duration_days', 'created_at']

class UserLicenseSerializer(serializers.ModelSerializer):
    license_key = serializers.CharField(source='license.key', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = UserLicense
        fields = ['id', 'user_email', 'license_key', 'assigned_at', 'valid_until', 'last_used', 'status', 'is_active']
        read_only_fields = ['assigned_at', 'valid_until', 'last_used', 'is_active']

class LicenseActivationSerializer(serializers.Serializer):
    license_key = serializers.CharField()
