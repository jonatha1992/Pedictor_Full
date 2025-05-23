from django.urls import path
from .views import SubscriptionPlanListView, UserSubscriptionView

urlpatterns = [
    path('plans/', SubscriptionPlanListView.as_view(), name='subscription_plans'),
    path('my-subscription/', UserSubscriptionView.as_view(), name='user_subscription'),
]
