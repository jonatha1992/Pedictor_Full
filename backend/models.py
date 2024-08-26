from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models

# Create your models here.


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
    password = models.CharField(max_length=100)  # Django maneja la contraseña automáticamente

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    class Meta:
        db_table = 'users'


class License(models.Model):
    id_license = models.AutoField(primary_key=True)
    key = models.CharField(max_length=100)
    date_expiration = models.DateField()
    user = models.ForeignKey(User, related_name='licenses', on_delete=models.CASCADE)

    class Meta:
        db_table = 'licenses'


class Report(models.Model):
    id_report = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, related_name='reports', on_delete=models.CASCADE)
    game = models.CharField(max_length=50)
    game_datetime = models.DateTimeField(auto_now_add=True)
    predicted = models.IntegerField()
    total_hits = models.IntegerField()
    predicted_hits = models.IntegerField()
    v1l = models.IntegerField()
    v2l = models.IntegerField()
    v3l = models.IntegerField()
    v4l = models.IntegerField()
    numbers_to_predict = models.IntegerField()
    previous_numbers = models.IntegerField()
    neighbor_count = models.IntegerField()
    game_limit = models.IntegerField()
    probability = models.FloatField()
    effectiveness = models.FloatField()
    roulette = models.CharField(max_length=100)
    description = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = 'reports'
