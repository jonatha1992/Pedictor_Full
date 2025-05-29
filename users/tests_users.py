import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

User = get_user_model()

@pytest.fixture
def user_data():
    return {
        'email': 'testuser@example.com',
        'name': 'Test User',
        'password': 'testpass123'
    }

def test_register_user(db, user_data):
    client = APIClient()
    url = reverse('register')
    response = client.post(url, user_data, format='json')
    assert response.status_code == 201
    assert 'email' in response.data
    assert response.data['email'] == user_data['email']
    assert response.data['name'] == user_data['name']

def test_login_user(db, user_data):
    user = User.objects.create_user(email=user_data['email'], name=user_data['name'], password=user_data['password'])
    client = APIClient()
    url = reverse('login')
    response = client.post(url, {'email': user_data['email'], 'password': user_data['password']}, format='json')
    assert response.status_code == 200
    assert 'user' in response.data
    assert response.data['user']['email'] == user_data['email']

def test_login_invalid_credentials(db, user_data):
    client = APIClient()
    url = reverse('login')
    response = client.post(url, {'email': user_data['email'], 'password': 'wrongpass'}, format='json')
    assert response.status_code == 401
    assert 'error' in response.data

def test_logout_user(db, user_data):
    user = User.objects.create_user(email=user_data['email'], name=user_data['name'], password=user_data['password'])
    client = APIClient()
    client.force_authenticate(user=user)
    url = reverse('logout')
    response = client.post(url)
    assert response.status_code == 200
    assert 'message' in response.data
    assert response.data['message'] == 'Successfully logged out'

def test_profile_view(db, user_data):
    user = User.objects.create_user(email=user_data['email'], name=user_data['name'], password=user_data['password'])
    client = APIClient()
    client.force_authenticate(user=user)
    url = reverse('profile')
    response = client.get(url)
    assert response.status_code == 200
    assert response.data['email'] == user_data['email']
