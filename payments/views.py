from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from django.urls import reverse

from subscriptions.models import SubscriptionPlan
from subscriptions.utils import create_or_renew_subscription
from .models import PaymentIntent
from .serializers import PaymentIntentSerializer
from .utils import get_mercadopago_sdk, verify_payment_with_mercadopago

class CreatePaymentView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        plan_id = request.data.get('plan_id')
        
        if not plan_id:
            return Response({"error": "Se requiere un plan_id válido"}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            plan = SubscriptionPlan.objects.get(id=plan_id)
        except SubscriptionPlan.DoesNotExist:
            return Response({"error": "Plan de suscripción no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        
        # Initialize MercadoPago SDK using utility function
        sdk = get_mercadopago_sdk()
        
        # Para desarrollo: usar URLs públicas de ejemplo para evitar error de Mercado Pago
        success_url = "https://www.google.com"
        failure_url = "https://www.google.com"
        pending_url = "https://www.google.com"

        preference_data = {
            "items": [
                {
                    "title": f"Suscripción {plan.get_name_display()} - Spin Predictor",
                    "quantity": 1,
                    "currency_id": "ARS",  # Ajustar a tu moneda
                    "unit_price": float(plan.price)
                }
            ],
            "back_urls": {
                "success": success_url,
                "failure": failure_url,
                "pending": pending_url
            },
            "auto_return": "approved",
            "binary_mode": True,  # Solo aprobado o rechazado, no pendiente
            "external_reference": f"user_{request.user.id_user}_plan_{plan.id}"
        }
        
        try:
            preference_response = sdk.preference().create(preference_data)
            preference = preference_response.get("response", {})
            # Debug: log the full MercadoPago response if missing keys
            if not all(k in preference for k in ("id", "init_point", "sandbox_init_point")):
                return Response({
                    "error": f"Respuesta inesperada de MercadoPago: {preference}",
                    "raw_response": preference_response
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # Save payment intent
            payment_intent = PaymentIntent.objects.create(
                user=request.user,
                plan=plan,
                preference_id=preference["id"],
                amount=plan.price
            )

            return Response({
                "preference_id": preference["id"],
                "init_point": preference["init_point"],
                "sandbox_init_point": preference["sandbox_init_point"]
            })

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PaymentSuccessView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        payment_id = request.GET.get('payment_id')
        status_param = request.GET.get('status')
        preference_id = request.GET.get('preference_id')
        
        if not all([payment_id, status_param, preference_id]):
            return Response({"error": "Parámetros incompletos"}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            payment_intent = PaymentIntent.objects.get(preference_id=preference_id, user=request.user)
        except PaymentIntent.DoesNotExist:
            return Response({"error": "Intento de pago no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        
        # If payment is already processed
        if payment_intent.status == 'approved':
            return Response({"message": "El pago ya fue procesado correctamente"})
            
        try:
            # Verify payment status with MercadoPago
            payment_info = verify_payment_with_mercadopago(payment_id)
            payment_status = payment_info["response"]["status"]
            
            payment_intent.status = payment_status
            payment_intent.save()
            
            if payment_status == "approved":
                # Activate subscription
                subscription = create_or_renew_subscription(request.user, payment_intent.plan)
                return Response({
                    "message": "Pago aprobado. Suscripción activada.",
                    "subscription": {
                        "plan": payment_intent.plan.name,
                        "end_date": subscription.end_date
                    }
                })
            else:
                return Response({
                    "message": f"El estado del pago es: {payment_status}",
                    "status": payment_status
                })
                
        except Exception as e:
            payment_intent.status = "error"
            payment_intent.error_message = str(e)
            payment_intent.save()
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserPaymentsView(APIView):
    """View to list all user payments"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        payments = PaymentIntent.objects.filter(user=request.user).order_by('-created_at')
        serializer = PaymentIntentSerializer(payments, many=True)
        return Response(serializer.data)
