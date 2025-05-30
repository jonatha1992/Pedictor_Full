from django.urls import path
from .views import CreatePaymentView, PaymentSuccessView, UserPaymentsView, MercadoPagoWebhookView, CheckPaymentStatusView, AutoCheckPaymentView, TestAPIView

urlpatterns = [
    path('create-payment/', CreatePaymentView.as_view(), name='create_payment'),
    path('success/', PaymentSuccessView.as_view(), name='payment_success'),
    path('failure/', PaymentSuccessView.as_view(), name='payment_failure'),
    path('pending/', PaymentSuccessView.as_view(), name='payment_pending'),
    path('webhook/', MercadoPagoWebhookView.as_view(), name='mercadopago_webhook'),
    path('check-payment/', CheckPaymentStatusView.as_view(), name='check_payment'),
    path('auto-check/', AutoCheckPaymentView.as_view(), name='auto_check_payments'),  # NUEVO
    path('test/', TestAPIView.as_view(), name='test_api'),  # NUEVO - para debugging
    path('my-payments/', UserPaymentsView.as_view(), name='user_payments'),
]
