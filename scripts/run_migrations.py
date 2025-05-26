#!/usr/bin/env python
"""
Script to run database migrations for the project.
This will also create test data for local development.
"""
import os
import sys
import django
from django.core.management import call_command
from django.utils import timezone
from datetime import timedelta

# Set up Django environment
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

# Now we can import Django models
from django.contrib.auth import get_user_model
from subscriptions.models import SubscriptionPlan, Subscription

User = get_user_model()

def main():
    """Run migrations and create test data."""
    print("Running migrations...")
    call_command('makemigrations')
    call_command('migrate')
    
    print("Creating test data...")
    create_test_data()
    
    print("Done! The database is now ready.")

def create_test_data():
    """Create test data for development."""
    # Create subscription plans if they don't exist
    plans = [
        {
            'name': 'weekly',
            'price': 1500.00,
            'duration_days': 7
        },
        {
            'name': 'monthly',
            'price': 4500.00,
            'duration_days': 30
        },
        {
            'name': 'annual',
            'price': 40000.00,
            'duration_days': 365
        }
    ]
    
    for plan_data in plans:
        plan, created = SubscriptionPlan.objects.get_or_create(
            name=plan_data['name'],
            defaults={
                'price': plan_data['price'],
                'duration_days': plan_data['duration_days']
            }
        )
        if created:
            print(f"Created subscription plan: {plan.name}")
    
    # Create a test user if it doesn't exist
    test_user, created = User.objects.get_or_create(
        email='test@example.com',
        defaults={
            'name': 'Test User',
            'password': 'pbkdf2_sha256$720000$HHy7WLnDVLGGzswNVlDGnR$sOtzbiY5dUEMGxjGnbE31FD/yrIrwE9ATDXJCt02Ri4='  # 'password123'
        }
    )
    
    if created:
        print(f"Created test user: {test_user.email}")
    
    # Create a test subscription if it doesn't exist
    monthly_plan = SubscriptionPlan.objects.get(name='monthly')
    subscription, created = Subscription.objects.get_or_create(
        user=test_user,
        plan=monthly_plan,
        defaults={
            'start_date': timezone.now(),
            'end_date': timezone.now() + timedelta(days=30)
        }
    )
    
    if created:
        print(f"Created test subscription for: {test_user.email}")

if __name__ == '__main__':
    main()
