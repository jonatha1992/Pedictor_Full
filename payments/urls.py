from django.urls import path
from .views import CreatePaymentView, PaymentSuccessView

urlpatterns = [
    path('create-payment/', CreatePaymentView.as_view(), name='create_payment'),
    path('success/', PaymentSuccessView.as_view(), name='payment_success'),
    path('failure/', PaymentSuccessView.as_view(), name='payment_failure'), # También maneja fallos
    path('pending/', PaymentSuccessView.as_view(), name='payment_pending'), # También maneja pendientes
]
