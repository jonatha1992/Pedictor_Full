from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from unittest.mock import patch, MagicMock

from subscriptions.models import SubscriptionPlan
from payments.models import PaymentIntent

User = get_user_model()

class PaymentIntentTestCase(TestCase):
    def setUp(self):
        # Create a test user
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpassword',
            name='Test User'
        )
        
        # Create a subscription plan
        self.plan = SubscriptionPlan.objects.create(
            name='monthly',
            price=1000.00,
            duration_days=30
        )
        
        # Set up the test client
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        
    def test_create_payment_intent(self):
        # Mock MercadoPago SDK response
        mock_preference = {
            "response": {
                "id": "test_preference_id",
                "init_point": "https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=test_preference_id",
                "sandbox_init_point": "https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=test_preference_id"
            }
        }
        
        with patch('payments.utils.get_mercadopago_sdk') as mock_sdk:
            # Configure the mock SDK to return our mock preference
            mock_sdk_instance = MagicMock()
            mock_preference_instance = MagicMock()
            mock_preference_instance.create.return_value = mock_preference
            mock_sdk_instance.preference.return_value = mock_preference_instance
            mock_sdk.return_value = mock_sdk_instance
            
            # Make the request to create a payment intent
            url = reverse('create_payment')
            data = {'plan_id': self.plan.id}
            response = self.client.post(url, data, format='json')
            
            # Check the response
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertIn('preference_id', response.data)
            self.assertEqual(response.data['preference_id'], 'test_preference_id')
            
            # Check that a PaymentIntent was created in the database
            self.assertTrue(PaymentIntent.objects.filter(
                user=self.user,
                plan=self.plan,
                preference_id='test_preference_id'
            ).exists())
    
    def test_process_successful_payment(self):
        # Create a payment intent first
        payment_intent = PaymentIntent.objects.create(
            user=self.user,
            plan=self.plan,
            preference_id='test_preference_id',
            status='pending',
            amount=self.plan.price
        )
        
        # Mock MercadoPago payment verification
        mock_payment_info = {
            "response": {
                "status": "approved",
                "id": "test_payment_id"
            }
        }
        
        with patch('payments.utils.verify_payment_with_mercadopago') as mock_verify:
            mock_verify.return_value = mock_payment_info
            
            # Make the request to process the payment
            url = reverse('payment_success')
            params = {
                'payment_id': 'test_payment_id',
                'status': 'approved',
                'preference_id': 'test_preference_id'
            }
            response = self.client.get(url, params)
            
            # Check the response
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertIn('message', response.data)
            self.assertIn('approved', response.data['message'])
            
            # Check that the payment intent status was updated
            payment_intent.refresh_from_db()
            self.assertEqual(payment_intent.status, 'approved')
            
            # Check that a subscription was created
            self.assertTrue(self.user.subscriptions.filter(plan=self.plan).exists())

    def test_list_user_payments(self):
        # Create some payment intents
        PaymentIntent.objects.create(
            user=self.user,
            plan=self.plan,
            preference_id='test_preference_id_1',
            status='approved',
            amount=self.plan.price
        )
        
        PaymentIntent.objects.create(
            user=self.user,
            plan=self.plan,
            preference_id='test_preference_id_2',
            status='pending',
            amount=self.plan.price
        )
        
        # Make the request to list user payments
        url = reverse('user_payments')
        response = self.client.get(url)
        
        # Check the response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
