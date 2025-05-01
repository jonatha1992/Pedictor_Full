from django.test import TestCase, Client
from backend.models import User, License, UserLicense, Report, Game
from django.utils import timezone

class EndpointAndModelTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(email='test@example.com', name='Test User', password='testpass123')
        self.license = License.objects.create(key='ABC123', date_expiration=timezone.now().date())
        self.user_license = UserLicense.objects.create(
            user=self.user,
            license=self.license,
            valid_until=timezone.now(),
            is_active=True,
            status='active',
        )
        self.game = Game.objects.create(
            user=self.user,
            tipo='demo',
            nombre_ruleta='ruleta1',
            tardanza=1,
            cantidad_vecinos=2,
            umbral_probabilidad=0.5
        )
        self.report = Report.objects.create(
            user=self.user,
            game='demo',
            predicted=1,
            total_hits=1,
            predicted_hits=1,
            v1l=1,
            v2l=2,
            v3l=3,
            numbers_to_predict=5,
            previous_numbers=10,
            neighbor_count=2,
            game_limit=100,
            probability=0.5,
            effectiveness=0.6,
            roulette='ruleta1',
        )

    def test_reports_endpoint(self):
        response = self.client.get('/reports')
        self.assertIn(response.status_code, [200, 401, 403])

    def test_users_endpoint(self):
        response = self.client.get('/users')
        self.assertIn(response.status_code, [200, 401, 403])

    def test_licenses_endpoint(self):
        response = self.client.get('/licenses')
        self.assertIn(response.status_code, [200, 401, 403])

    def test_games_endpoint(self):
        response = self.client.get('/games')
        self.assertIn(response.status_code, [200, 401, 403])

    def test_predict_endpoint(self):
        response = self.client.get('/predict')
        self.assertIn(response.status_code, [200, 401, 403])

    def test_user_model(self):
        self.assertEqual(self.user.email, 'test@example.com')
        self.assertTrue(self.user.check_password('testpass123'))
        self.assertIsNotNone(self.user.license_info)
        self.assertTrue(self.user.has_active_license)
        self.assertGreaterEqual(self.user.licenses.count(), 1)

    def test_license_model(self):
        self.assertEqual(self.license.key, 'ABC123')

    def test_userlicense_model(self):
        self.assertEqual(self.user_license.user, self.user)
        self.assertEqual(self.user_license.license, self.license)
        self.assertTrue(self.user_license.is_active)

    def test_report_model(self):
        self.assertEqual(self.report.user, self.user)
        self.assertEqual(self.report.game, 'demo')

    def test_game_model(self):
        self.assertEqual(self.game.user, self.user)
        self.assertEqual(self.game.tipo, 'demo')
