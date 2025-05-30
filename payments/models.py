from django.db import models
from django.contrib.auth import get_user_model
from subscriptions.models import SubscriptionPlan

User = get_user_model()

class PaymentIntent(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pendiente'),
        ('approved', 'Aprobado'),
        ('rejected', 'Rechazado'),
        ('in_process', 'En Proceso'),
        ('cancelled', 'Cancelado'),
        ('refunded', 'Reembolsado'),
        ('error', 'Error'),    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payment_intents')
    plan = models.ForeignKey(SubscriptionPlan, on_delete=models.CASCADE)
    preference_id = models.CharField(max_length=255)
    external_reference = models.CharField(max_length=255, blank=True, null=True)  # NUEVO
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='pending')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    error_message = models.TextField(blank=True, null=True)
    
    def __str__(self):
        user_display = getattr(self.user, 'username', None) or getattr(self.user, 'email', None) or getattr(self.user, 'name', 'Usuario')
        return f"{user_display} - {self.plan.name} - {self.status}"
