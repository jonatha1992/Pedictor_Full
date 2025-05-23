from django.utils import timezone
from datetime import timedelta
from .models import Subscription

def create_or_renew_subscription(user, plan):
    """
    Creates a new subscription or renews an existing one for a user.
    """
    # Check if user has an existing subscription to this plan
    try:
        subscription = Subscription.objects.get(user=user, plan=plan)
        
        # If subscription exists but expired, set new start date to now
        if subscription.end_date < timezone.now():
            subscription.start_date = timezone.now()
            subscription.end_date = timezone.now() + timedelta(days=plan.duration_days)
        else:
            # Add more days to existing subscription
            subscription.end_date += timedelta(days=plan.duration_days)
            
        subscription.save()
        return subscription
        
    except Subscription.DoesNotExist:
        # Create new subscription
        end_date = timezone.now() + timedelta(days=plan.duration_days)
        subscription = Subscription.objects.create(
            user=user,
            plan=plan,
            start_date=timezone.now(),
            end_date=end_date
        )
        return subscription
