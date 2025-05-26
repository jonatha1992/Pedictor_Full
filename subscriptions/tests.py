from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from rest_framework.test import APIClient
from rest_framework import status

from subscriptions.models import SubscriptionPlan, Subscription
from subscriptions.utils import create_or_renew_subscription

User = get_user_model()

class SubscriptionModelTestCase(TestCase):
    def setUp(self):
        # Create a test user
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpassword',
            name='Test User'
        )
        
        # Create some subscription plans
        self.weekly_plan = SubscriptionPlan.objects.create(
            name='weekly',
            price=300.00,
            duration_days=7
        )
        
        self.monthly_plan = SubscriptionPlan.objects.create(
            name='monthly',
            price=1000.00,
            duration_days=30
        )
        
        self.annual_plan = SubscriptionPlan.objects.create(
            name='annual',
            price=10000.00,
            duration_days=365
        )
    
    def test_create_subscription(self):
        # Create a new subscription
        subscription = create_or_renew_subscription(self.user, self.monthly_plan)
        
        # Check that the subscription was created with correct values
        self.assertEqual(subscription.user, self.user)
        self.assertEqual(subscription.plan, self.monthly_plan)
        self.assertLessEqual(timezone.now() - subscription.start_date, timedelta(seconds=5))
        expected_end_date = subscription.start_date + timedelta(days=self.monthly_plan.duration_days)
        self.assertEqual(subscription.end_date.date(), expected_end_date.date())
        self.assertTrue(subscription.is_active())
    
    def test_renew_active_subscription(self):
        # Create an active subscription first
        start_date = timezone.now() - timedelta(days=15)  # 15 days ago
        end_date = start_date + timedelta(days=30)  # 15 days remaining
        subscription = Subscription.objects.create(
            user=self.user,
            plan=self.monthly_plan,
            start_date=start_date,
            end_date=end_date
        )
        
        original_end_date = subscription.end_date
        
        # Renew the subscription
        renewed_subscription = create_or_renew_subscription(self.user, self.monthly_plan)
        
        # Check that the same subscription was updated
        self.assertEqual(renewed_subscription.id, subscription.id)
        
        # Check that the end date was extended by 30 days
        self.assertEqual(
            renewed_subscription.end_date.date(), 
            (original_end_date + timedelta(days=self.monthly_plan.duration_days)).date()
        )
        
        # Start date should remain unchanged
        self.assertEqual(renewed_subscription.start_date, start_date)
    
    def test_renew_expired_subscription(self):
        # Create an expired subscription first
        start_date = timezone.now() - timedelta(days=45)  # 45 days ago
        end_date = start_date + timedelta(days=30)  # 15 days expired
        subscription = Subscription.objects.create(
            user=self.user,
            plan=self.monthly_plan,
            start_date=start_date,
            end_date=end_date
        )
        
        # Renew the subscription
        renewed_subscription = create_or_renew_subscription(self.user, self.monthly_plan)
        
        # Check that the same subscription object was updated
        self.assertEqual(renewed_subscription.id, subscription.id)
        
        # Start date should be reset to now
        self.assertLessEqual(timezone.now() - renewed_subscription.start_date, timedelta(seconds=5))
        
        # End date should be start date + 30 days
        expected_end_date = renewed_subscription.start_date + timedelta(days=self.monthly_plan.duration_days)
        self.assertEqual(renewed_subscription.end_date.date(), expected_end_date.date())

class SubscriptionAPITestCase(TestCase):
    def setUp(self):
        # Create a test user
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpassword',
            name='Test User'
        )
        
        # Create some subscription plans
        self.weekly_plan = SubscriptionPlan.objects.create(
            name='weekly',
            price=300.00,
            duration_days=7
        )
        
        self.monthly_plan = SubscriptionPlan.objects.create(
            name='monthly',
            price=1000.00,
            duration_days=30
        )
        
        # Create an active subscription
        start_date = timezone.now()
        self.subscription = Subscription.objects.create(
            user=self.user,
            plan=self.monthly_plan,
            start_date=start_date,
            end_date=start_date + timedelta(days=30)
        )
        
        # Set up the test client
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
    
    def test_list_subscription_plans(self):
        url = reverse('subscription_plans')
        response = self.client.get(url)
        
        # Check response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)  # Two plans created in setUp
    
    def test_get_user_subscription(self):
        url = reverse('user_subscription')
        response = self.client.get(url)
        
        # Check response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.subscription.id)
        self.assertEqual(response.data['plan']['id'], self.monthly_plan.id)
        self.assertTrue(response.data['is_active'])
