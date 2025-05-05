import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from django.contrib.auth import get_user_model
from reports.models import Report

User = get_user_model()

@pytest.fixture
def user(db):
    return User.objects.create_user(email='user@example.com', name='User', password='testpass')

@pytest.fixture
def report_data(db, user):
    # create two report instances
    reports = [
        Report.objects.create(
            user=user,
            game='Game1',
            predicted=5,
            total_hits=10,
            predicted_hits=3,
            v1l=1,
            v2l=2,
            v3l=3,
            numbers_to_predict=8,
            previous_numbers=5,
            neighbor_count=2,
            game_limit=10,
            probability=0.5,
            effectiveness=0.3,
            roulette='Electromecanica',
            description='Test report'
        ),
        Report.objects.create(
            user=user,
            game='Game2',
            predicted=7,
            total_hits=15,
            predicted_hits=5,
            v1l=2,
            v2l=3,
            v3l=4,
            numbers_to_predict=10,
            previous_numbers=8,
            neighbor_count=3,
            game_limit=12,
            probability=0.6,
            effectiveness=0.4,
            roulette='Crupier'
        )
    ]
    return reports

def test_report_list_empty(db):
    client = APIClient()
    user = User.objects.create_user(email='user@example.com', name='User', password='testpass')
    client.force_authenticate(user=user)
    url = reverse('report-list')
    response = client.get(url)
    assert response.status_code == 200
    assert isinstance(response.data, list)
    assert response.data == []

def test_report_list_with_data(db, report_data):
    client = APIClient()
    user = report_data[0].user
    client.force_authenticate(user=user)
    url = reverse('report-list')
    response = client.get(url)
    assert response.status_code == 200
    assert isinstance(response.data, list)
    assert len(response.data) == len(report_data)
    # Check that the first report contains expected fields
    first = response.data[0]
    assert 'id_report' in first
    assert first['game'] == report_data[0].game
    assert 'probability' in first
    assert 'effectiveness' in first
