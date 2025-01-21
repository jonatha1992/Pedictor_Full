from django.db import migrations
from datetime import timedelta
from django.utils import timezone


def create_initial_data(apps, schema_editor):
    User = apps.get_model('backend', 'User')
    License = apps.get_model('backend', 'License')
    UserLicense = apps.get_model('backend', 'UserLicense')

    # Create Licenses with timezone-aware dates
    now = timezone.now()

    license1 = License.objects.create(
        key="LICENSE-2024-001",
        date_expiration=now.date() + timedelta(days=365)
    )

    license2 = License.objects.create(
        key="LICENSE-2024-002",
        date_expiration=now.date() + timedelta(days=180)
    )

    license3 = License.objects.create(
        key="LICENSE-2024-003",
        date_expiration=now.date() + timedelta(days=90)
    )

    # Create Users with UserLicenses
    users_data = [
        {"email": "user1@example.com", "name": "User One", "license": license1, "days": 365},
        {"email": "user2@example.com", "name": "User Two", "license": license2, "days": 180},
        {"email": "user3@example.com", "name": "User Three", "license": license3, "days": 90}
    ]

    for user_data in users_data:
        user = User.objects.create(
            email=user_data["email"],
            name=user_data["name"],
            password="password123"
        )

        UserLicense.objects.create(
            user=user,
            license=user_data["license"],
            is_active=True,
            valid_until=now + timedelta(days=user_data["days"]),
            status='active'
        )


class Migration(migrations.Migration):
    dependencies = [
        ('backend', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_initial_data),
    ]
