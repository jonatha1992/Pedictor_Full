from django.db import models
from django.utils import timezone
from django.contrib.auth import get_user_model

User = get_user_model()

class SubscriptionPlan(models.Model):
    PLAN_CHOICES = (
        ('weekly', 'Semanal'),
        ('monthly', 'Mensual'),
        ('annual', 'Anual'),
    )
    
    name = models.CharField(max_length=50, choices=PLAN_CHOICES)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration_days = models.PositiveIntegerField()
    
    def __str__(self):
        return f"{self.get_name_display()} - ${self.price}"

class Subscription(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subscriptions')
    plan = models.ForeignKey(SubscriptionPlan, on_delete=models.CASCADE)
    start_date = models.DateTimeField(default=timezone.now)
    end_date = models.DateTimeField()
    
    def __str__(self):
        # Usa email o name si username no existe
        user_display = getattr(self.user, 'username', None) or getattr(self.user, 'email', None) or getattr(self.user, 'name', 'Usuario')
        return f"{user_display} - {self.plan.name} ({self.is_active()})"
    
    def is_active(self):
        return timezone.now() <= self.end_date
