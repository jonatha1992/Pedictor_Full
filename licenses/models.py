from django.db import models

class License(models.Model):
    id_license = models.AutoField(primary_key=True)
    key = models.CharField(max_length=100, unique=True)
    date_expiration = models.DateField()

    class Meta:
        db_table = 'licenses'

class UserLicense(models.Model):
    id_user_license = models.AutoField(primary_key=True)
    user = models.OneToOneField('users.User', on_delete=models.CASCADE, related_name='user_license')
    license = models.ForeignKey('licenses.License', on_delete=models.CASCADE, related_name='user_licenses')
    assigned_date = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    valid_until = models.DateTimeField()
    status = models.CharField(max_length=50)  # active, suspended, expired
    last_used = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'user_licenses'
from django.db import models

# Create your models here.
