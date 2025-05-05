from django.db import models
from users.models import User
from django.utils import timezone

class License(models.Model):
    id_license = models.AutoField(primary_key=True)
    key = models.CharField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    duration_days = models.IntegerField(default=30)

    def __str__(self):
        return f"License {self.key}"

class UserLicense(models.Model):
    STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('EXPIRED', 'Expired'),
        ('SUSPENDED', 'Suspended')
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='user_license')
    license = models.ForeignKey(License, on_delete=models.CASCADE, related_name='user_licenses')
    assigned_at = models.DateTimeField(auto_now_add=True)
    valid_until = models.DateTimeField()
    last_used = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE')

    @property
    def is_active(self):
        return self.status == 'ACTIVE' and self.valid_until > timezone.now()

    def save(self, *args, **kwargs):
        if not self.valid_until:
            self.valid_until = timezone.now() + timezone.timedelta(days=self.license.duration_days)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.email} - {self.license.key}"

    class Meta:
        unique_together = ('user', 'license')
