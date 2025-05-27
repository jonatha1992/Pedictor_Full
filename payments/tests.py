import pytest
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from unittest.mock import patch, MagicMock
from django.utils import timezone
from datetime import timedelta

from subscriptions.models import SubscriptionPlan, Subscription
from payments.models import PaymentIntent
from subscriptions.utils import create_or_renew_subscription

User = get_user_model()

# Fixtures básicos
@pytest.fixture
def user(db):
    # Create a test user
    return User.objects.create_user(
        email='test@example.com',
        name='Test User',
        password='testpassword'
    )

@pytest.fixture
def subscription_plan(db):
    # Create a subscription plan
    return SubscriptionPlan.objects.create(
        name='monthly',
        price=1000.00,
        duration_days=30
    )

@pytest.fixture
def api_client(user):
    # Set up the test client
    client = APIClient()
    client.force_authenticate(user=user)
    return client

@pytest.fixture
def payment_intent(db, user, subscription_plan):
    # Create a payment intent
    return PaymentIntent.objects.create(
        user=user,
        plan=subscription_plan,        preference_id='test_preference_id',
        status='pending',
        amount=subscription_plan.price
    )

# Tests para el modelo PaymentIntent
@pytest.mark.django_db
def test_payment_intent_model():
    """Test the PaymentIntent model functionality"""
    # Crear usuario
    user = User.objects.create_user(
        email='model_test@example.com',
        name='Model Test User',
        password='testpass123'
    )
    
    # Crear plan
    plan = SubscriptionPlan.objects.create(
        name='weekly',
        price=300.00,
        duration_days=7
    )
    
    # Crear intent de pago
    payment_intent = PaymentIntent.objects.create(
        user=user,
        plan=plan,
        preference_id='test_preference_id',
        status='pending',
        amount=plan.price
    )
    
    # Verificar campos
    assert payment_intent.user == user
    assert payment_intent.plan == plan
    assert payment_intent.preference_id == 'test_preference_id'
    assert payment_intent.status == 'pending'
    assert payment_intent.amount == plan.price

# Tests para validar los estados de PaymentIntent
@pytest.mark.django_db
def test_payment_intent_status_transitions():
    """Test the status transitions of the PaymentIntent model"""
    # Crear usuario
    user = User.objects.create_user(
        email='status_test@example.com',
        name='Status Test User',
        password='testpass123'
    )
    
    # Crear plan
    plan = SubscriptionPlan.objects.create(
        name='annual',
        price=10000.00,
        duration_days=365
    )
    
    # Crear intent de pago en estado pendiente
    payment_intent = PaymentIntent.objects.create(
        user=user,
        plan=plan,
        preference_id='test_status_id',
        status='pending',
        amount=plan.price
    )
    
    # Verificar estado inicial
    assert payment_intent.status == 'pending'
    
    # Simular un proceso de pago aprobado
    payment_intent.status = 'approved'
    payment_intent.save()
    
    # Verificar actualización
    updated_payment = PaymentIntent.objects.get(id=payment_intent.id)
    assert updated_payment.status == 'approved'
    
    # Simular un proceso de pago rechazado en otro intent
    rejected_intent = PaymentIntent.objects.create(
        user=user,
        plan=plan,
        preference_id='test_rejected_id',
        status='pending',
        amount=plan.price
    )
    
    rejected_intent.status = 'rejected'
    rejected_intent.error_message = 'Fondos insuficientes'
    rejected_intent.save()
    
    # Verificar el estado rechazado y mensaje de error
    updated_rejected = PaymentIntent.objects.get(id=rejected_intent.id)
    assert updated_rejected.status == 'rejected'
    assert updated_rejected.error_message == 'Fondos insuficientes'

# Tests para la integración entre PaymentIntent y Subscription
@pytest.mark.django_db
def test_payment_and_subscription_integration():
    """Test the integration between payment and subscription"""
    # Crear usuario
    user = User.objects.create_user(
        email='integration@example.com',
        name='Integration User',
        password='testpass123'
    )
    
    # Crear plan
    plan = SubscriptionPlan.objects.create(
        name='monthly',
        price=1000.00,
        duration_days=30
    )
    
    # Simular pago exitoso
    payment_intent = PaymentIntent.objects.create(
        user=user,
        plan=plan,
        preference_id='test_preference_id',
        status='pending',
        amount=plan.price
    )
    
    # Actualizar estado a aprobado
    payment_intent.status = 'approved'
    payment_intent.save()
    
    # Crear suscripción basada en el pago
    subscription = create_or_renew_subscription(user, plan)
    
    # Verificar suscripción
    assert subscription.user == user
    assert subscription.plan == plan
    assert subscription.is_active()
    
    # Verificar fecha final
    expected_end_date = subscription.start_date + timedelta(days=plan.duration_days)
    assert subscription.end_date.date() == expected_end_date.date()
