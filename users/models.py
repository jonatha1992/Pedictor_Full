from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models
from django.utils import timezone

class UserManager(BaseUserManager):
    def create_user(self, email, name, password=None):
        if not email:
            raise ValueError('Users must have an email address')
        user = self.model(
            email=self.normalize_email(email),
            name=name,
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

class User(AbstractBaseUser):
    id_user = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    email = models.EmailField(max_length=100, unique=True)
    password = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']
    
    @property
    def active_subscription(self):
        """Returns the user's active subscription or None if no active subscription exists"""
        try:
            return self.subscriptions.filter(end_date__gt=timezone.now()).order_by('-end_date').first()
        except Exception:
            return None
    
    @property
    def has_active_subscription(self):
        """Returns True if the user has an active subscription"""
        return self.active_subscription is not None
    
    @property
    def subscription_info(self):
        """Returns information about the user's active subscription"""
        subscription = self.active_subscription
        if subscription:
            return {
                'plan_name': subscription.plan.get_name_display(),
                'start_date': subscription.start_date,
                'end_date': subscription.end_date,
                'is_active': subscription.is_active()
            }
        return None

    class Meta:
        db_table = 'users'
