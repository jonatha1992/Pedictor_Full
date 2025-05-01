from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models

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
    def license_info(self):
        try:
            user_license = self.user_license
            return {
                'key': user_license.license.key,
                'expiration': user_license.valid_until,
                'is_active': user_license.is_active,
                'status': user_license.status
            }
        except Exception:
            return None

    @property
    def has_active_license(self):
        return hasattr(self, 'user_license') and self.user_license.is_active

    @property
    def licenses(self):
        from licenses.models import UserLicense
        return UserLicense.objects.filter(user=self)

    class Meta:
        db_table = 'users'
