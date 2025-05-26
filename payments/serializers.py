from rest_framework import serializers
from .models import PaymentIntent
from subscriptions.serializers import SubscriptionPlanSerializer
from users.serializers import UserSerializer

class PaymentIntentSerializer(serializers.ModelSerializer):
    plan = SubscriptionPlanSerializer(read_only=True)
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = PaymentIntent
        fields = ['id', 'user', 'plan', 'preference_id', 'status', 'amount', 'created_at', 'error_message']
        read_only_fields = ['id', 'user', 'plan', 'preference_id', 'status', 'created_at']

class PaymentIntentCreateSerializer(serializers.ModelSerializer):
    plan_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = PaymentIntent
        fields = ['plan_id']
