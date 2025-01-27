from django.contrib.auth.models import User  # type: ignore
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
        except UserLicense.DoesNotExist:
            return None

    @property
    def has_active_license(self):
        return hasattr(self, 'user_license') and self.user_license.is_active

    @property
    def licenses(self):
        return UserLicense.objects.filter(user=self)

    class Meta:
        db_table = 'users'


class License(models.Model):
    id_license = models.AutoField(primary_key=True)
    key = models.CharField(max_length=100, unique=True)
    date_expiration = models.DateField()

    class Meta:
        db_table = 'licenses'


class UserLicense(models.Model):
    id_user_license = models.AutoField(primary_key=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='user_license')
    license = models.ForeignKey(License, on_delete=models.CASCADE, related_name='user_licenses')
    assigned_date = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    valid_until = models.DateTimeField()
    status = models.CharField(max_length=50)  # active, suspended, expired
    last_used = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'user_licenses'


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


class Game(models.Model):
    id_juego = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='games')
    tipo = models.CharField(max_length=100)
    ruleta = models.CharField(max_length=100)
    cantidad_vecinos = models.IntegerField()
    numero_tardanza = models.IntegerField()
    umbral_probabilidad = models.FloatField()

    def __str__(self):
        return f"{self.id_juego}- {self.ruleta} - {self.tipo}"

    class Meta:
        db_table = 'games'
