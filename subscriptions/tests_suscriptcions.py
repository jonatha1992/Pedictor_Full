import pytest
from django.urls import reverse
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from rest_framework.test import APIClient
from rest_framework import status

from subscriptions.models import SubscriptionPlan, Subscription
from subscriptions.utils import create_or_renew_subscription

User = get_user_model()

@pytest.fixture
def user(db):
    # Create a test user
    return User.objects.create_user(
        email='test@example.com',
        password='testpassword',
        name='Test User'
    )

@pytest.fixture
def weekly_plan(db):
    return SubscriptionPlan.objects.create(
        name='weekly',
        price=300.00,
        duration_days=7
    )

@pytest.fixture
def monthly_plan(db):
    return SubscriptionPlan.objects.create(
        name='monthly',
        price=1000.00,
        duration_days=30
    )

@pytest.fixture
def annual_plan(db):
    return SubscriptionPlan.objects.create(
        name='annual',
        price=10000.00,
        duration_days=365
    )

@pytest.fixture
def api_client(user):
    client = APIClient()
    client.force_authenticate(user=user)
    return client

@pytest.mark.django_db
def test_create_subscription(user, monthly_plan):
    # Create a new subscription
    subscription = create_or_renew_subscription(user, monthly_plan)
      # Check that the subscription was created with correct values
    assert subscription.user == user
    assert subscription.plan == monthly_plan
    assert (timezone.now() - subscription.start_date).total_seconds() < 5
    expected_end_date = subscription.start_date + timedelta(days=monthly_plan.duration_days)
    assert subscription.end_date.date() == expected_end_date.date()
    assert subscription.is_active()

@pytest.mark.django_db
def test_renew_active_subscription(user, monthly_plan):
    # Create an active subscription first
    start_date = timezone.now() - timedelta(days=15)  # 15 days ago
    end_date = start_date + timedelta(days=30)  # 15 days remaining
    subscription = Subscription.objects.create(
        user=user,
        plan=monthly_plan,
        start_date=start_date,
        end_date=end_date
    )
    
    original_end_date = subscription.end_date
    
    # Renew the subscription
    renewed_subscription = create_or_renew_subscription(user, monthly_plan)
    
    # Check that the same subscription was updated
    assert renewed_subscription.id == subscription.id
    
    # Check that the end date was extended by 30 days
    assert renewed_subscription.end_date.date() == (original_end_date + timedelta(days=monthly_plan.duration_days)).date()
      # Start date should remain unchanged
    assert renewed_subscription.start_date == start_date

@pytest.mark.django_db
def test_renew_expired_subscription(user, monthly_plan):
    # Create an expired subscription first
    start_date = timezone.now() - timedelta(days=45)  # 45 days ago
    end_date = start_date + timedelta(days=30)  # 15 days expired
    subscription = Subscription.objects.create(
        user=user,
        plan=monthly_plan,
        start_date=start_date,
        end_date=end_date
    )
    
    # Renew the subscription
    renewed_subscription = create_or_renew_subscription(user, monthly_plan)
    
    # Check that the same subscription object was updated
    assert renewed_subscription.id == subscription.id
    
    # Start date should be reset to now
    assert (timezone.now() - renewed_subscription.start_date).total_seconds() < 5
    
    # End date should be start date + 30 days
    expected_end_date = renewed_subscription.start_date + timedelta(days=monthly_plan.duration_days)
    assert renewed_subscription.end_date.date() == expected_end_date.date()

@pytest.fixture
def active_subscription(db, user, monthly_plan):
    # Create an active subscription
    start_date = timezone.now()
    return Subscription.objects.create(
        user=user,
        plan=monthly_plan,
        start_date=start_date,
        end_date=start_date + timedelta(days=30)    )

@pytest.mark.django_db
def test_list_subscription_plans(api_client, weekly_plan, monthly_plan):
    url = reverse('subscription_plans')
    response = api_client.get(url)
    
    # Check response
    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 2  # Two plans created in fixtures
    
    # Verify plan names are in the response
    plan_names = [plan['name'] for plan in response.data]
    assert weekly_plan.name in plan_names
    assert monthly_plan.name in plan_names

@pytest.mark.django_db
def test_get_user_subscription(api_client, active_subscription, monthly_plan):
    url = reverse('user_subscription')
    response = api_client.get(url)
    
    # Check response
    assert response.status_code == status.HTTP_200_OK
    assert response.data['id'] == active_subscription.id
    assert response.data['plan']['id'] == monthly_plan.id
    assert response.data['is_active'] == True

@pytest.mark.django_db
def test_user_without_subscription(db):
    # Create a new user with no subscription
    new_user = User.objects.create_user(
        email='no_subscription@example.com',
        password='testpass123',
        name='No Sub User'
    )
    
    client = APIClient()
    client.force_authenticate(user=new_user)
    
    url = reverse('user_subscription')
    response = client.get(url)
    
    # Should return 404 with a message
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert 'message' in response.data
    assert 'No tienes suscripciones activas' in response.data['message']
