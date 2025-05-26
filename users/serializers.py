from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import User

class UserSerializer(serializers.ModelSerializer):
    has_active_subscription = serializers.BooleanField(read_only=True)
    subscription_info = serializers.JSONField(read_only=True)
    
    class Meta:
        model = User
        fields = ('id_user', 'email', 'name', 'has_active_subscription', 'subscription_info')
        read_only_fields = ('id_user', 'has_active_subscription', 'subscription_info')

class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id_user', 'email', 'name', 'password')
        read_only_fields = ('id_user',)

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            name=validated_data['name'],
            password=validated_data['password']
        )
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
