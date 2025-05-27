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
        
    def create_superuser(self, email, name, password=None):
        """
        Creates and saves a superuser with the given email, name and password.
        """
        user = self.create_user(
            email,
            name=name,
            password=password,
        )
        user.is_admin = True
        user.save(using=self._db)
        return user
        
    def create_superuser(self, email, name, password=None):
        """
        Creates and saves a superuser with the given email, name and password.
        """
        user = self.create_user(
            email,
            name=name,
            password=password,
        )
        # Add any additional attributes that your admin might need
        # If you need to track superuser status, you might add a field like:
        # user.is_admin = True
        user.save(using=self._db)
        return user
        
    def create_superuser(self, email, name, password=None):
        """
        Creates and saves a superuser with the given email, name and password.
        """
        user = self.create_user(
            email,
            name=name,
            password=password,
        )
        # Add any superuser specific fields here if needed
        user.save(using=self._db)
        return user

class User(AbstractBaseUser):
    id_user = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    email = models.EmailField(max_length=100, unique=True)
    password = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']
    
    def has_perm(self, perm, obj=None):
        """Does the user have a specific permission?"""
        # Simplest possible answer: Yes, always
        return True

    def has_module_perms(self, app_label):
        """Does the user have permissions to view the app `app_label`?"""
        # Simplest possible answer: Yes, always
        return True
        
    @property
    def is_staff(self):
        """Is the user a member of staff?"""
        # All admins are staff
        return self.is_admin
    
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
