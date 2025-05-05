import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from licenses.models import License, UserLicense

User = get_user_model()

@pytest.fixture
def user(db):
    return User.objects.create_user(email='test@example.com', name='Test', password='pass1234')

@pytest.fixture
def license_obj(db):
    return License.objects.create(key='ABC123', duration_days=5)

def test_activate_license_success(db, user, license_obj):
    client = APIClient()
    client.force_authenticate(user=user)
    url = reverse('license-activate')
    data = {'license_key': license_obj.key}
    response = client.post(url, data, format='json')
    assert response.status_code == 200
    assert 'message' in response.data
    assert response.data['message'] == 'License activated successfully'
    assert 'license' in response.data
    license_data = response.data['license']
    assert license_data['user_email'] == user.email
    assert license_data['license_key'] == license_obj.key
    assert 'valid_until' in license_data
    assert license_data['status'] == 'ACTIVE'

def test_activate_license_invalid_key(db, user):
    client = APIClient()
    client.force_authenticate(user=user)
    url = reverse('license-activate')
    data = {'license_key': 'INVALID'}
    response = client.post(url, data, format='json')
    assert response.status_code == 404
    assert 'error' in response.data
    assert response.data['error'] == 'Invalid license key'

def test_activate_license_already_active(db, user, license_obj):
    UserLicense.objects.create(user=user, license=license_obj)
    client = APIClient()
    client.force_authenticate(user=user)
    url = reverse('license-activate')
    data = {'license_key': license_obj.key}
    response = client.post(url, data, format='json')
    assert response.status_code == 400
    assert 'error' in response.data
    assert response.data['error'] == 'User already has an active license'

def test_update_last_used_no_license(db, user):
    client = APIClient()
    client.force_authenticate(user=user)
    url = reverse('update-last-used')
    response = client.post(url, {}, format='json')
    assert response.status_code == 404
    assert 'error' in response.data

def test_update_last_used_success(db, user, license_obj):
    UserLicense.objects.create(user=user, license=license_obj)
    client = APIClient()
    client.force_authenticate(user=user)
    url = reverse('update-last-used')
    response = client.post(url, {}, format='json')
    assert response.status_code == 200
    assert 'message' in response.data
    assert response.data['message'] == 'Last used timestamp updated successfully'
