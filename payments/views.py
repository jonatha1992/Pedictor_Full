from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.utils import timezone

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
            return Response({"error": "Plan de suscripción no encontrado"}, status=status.HTTP_404_NOT_FOUND)        # Initialize MercadoPago SDK using utility function
        sdk = get_mercadopago_sdk()        # URLs que MercadoPago acepta para auto_return
        # Usamos httpbin.org que redirige automáticamente a localhost
        success_url = "https://httpbin.org/redirect-to?url=http://localhost:5173/?payment=success"
        failure_url = "https://httpbin.org/redirect-to?url=http://localhost:5173/?payment=failure" 
        pending_url = "https://httpbin.org/redirect-to?url=http://localhost:5173/?payment=pending"

        # Crear external_reference único
        external_ref = f"user_{request.user.id_user}_plan_{plan.id}_ts_{int(timezone.now().timestamp())}"

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
            "auto_return": "approved",  # Necesario para mostrar el botón "Volver al sitio"
            "binary_mode": False,  # Permitimos estados intermedios  
            "external_reference": external_ref
        }
        
        try:
            preference_response = sdk.preference().create(preference_data)
            preference = preference_response.get("response", {})
            # Debug: log the full MercadoPago response if missing keys
            if not all(k in preference for k in ("id", "init_point", "sandbox_init_point")):
                return Response({
                    "error": f"Respuesta inesperada de MercadoPago: {preference}",
                    "raw_response": preference_response                }, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR)
              # Save payment intent usando el mismo external_reference que se envió a MercadoPago
            payment_intent = PaymentIntent.objects.create(
                user=request.user,
                plan=plan,
                preference_id=preference["id"],
                external_reference=external_ref,
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


class CheckPaymentStatusView(APIView):
    """Endpoint para verificar manualmente el estado de un pago"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        preference_id = request.data.get('preference_id')
        
        if not preference_id:
            return Response({"error": "preference_id requerido"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Buscar el payment intent
            payment_intent = PaymentIntent.objects.get(
                preference_id=preference_id, 
                user=request.user
            )
            
            # Verificar si ya está procesado
            if payment_intent.status == 'approved':
                return Response({
                    "message": "El pago ya está aprobado",
                    "status": payment_intent.status
                })
            
            # Obtener información del pago desde MercadoPago
            sdk = get_mercadopago_sdk()
            
            # Método 1: Buscar por external_reference
            search_filters = {
                "external_reference": payment_intent.external_reference or f"user_{request.user.id_user}_plan_{payment_intent.plan.id}"
            }
            
            payments_response = sdk.payment().search(filters=search_filters)
            payments_data = payments_response.get("response", {}).get("results", [])
            
            # Método 2: Si no encuentra nada, buscar por preference_id
            if not payments_data:
                try:
                    preference_response = sdk.preference().get(preference_id)
                    preference_data = preference_response.get("response", {})
                    
                    # Buscar pagos por preference_id directamente
                    search_filters = {"preference_id": preference_id}
                    payments_response = sdk.payment().search(filters=search_filters)
                    payments_data = payments_response.get("response", {}).get("results", [])
                except Exception as e:
                    print(f"Error buscando preference: {e}")
            
            print(f"🔍 Encontrados {len(payments_data)} pagos para preference {preference_id}")
            
            if payments_data:
                # Tomar el pago más reciente
                latest_payment = payments_data[0]
                payment_status = latest_payment.get("status")
                
                # Actualizar el estado en la base de datos
                payment_intent.status = payment_status
                payment_intent.save()
                
                print(f"📝 Estado actualizado: {payment_status}")
                
                # Si está aprobado, activar suscripción
                if payment_status == "approved":
                    subscription = create_or_renew_subscription(request.user, payment_intent.plan)
                    return Response({
                        "message": "¡Pago aprobado! Suscripción activada.",
                        "status": payment_status,
                        "subscription": {
                            "plan": payment_intent.plan.name,
                            "end_date": subscription.end_date
                        }
                    })
                else:
                    return Response({
                        "message": f"Estado del pago: {payment_status}",
                        "status": payment_status
                    })
            else:
                return Response({
                    "message": "No se encontró información del pago en MercadoPago",
                    "status": "not_found"
                })
                
        except PaymentIntent.DoesNotExist:
            return Response({"error": "Payment intent no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AutoCheckPaymentView(APIView):
    """Verificación automática del pago cuando el usuario regresa del checkout"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Verificar todos los pagos pendientes del usuario"""
        try:
            print(f"🔍 AutoCheckPaymentView: Usuario {request.user.id_user}")
            
            pending_payments = PaymentIntent.objects.filter(
                user=request.user,
                status__in=['pending', 'in_process']
            ).order_by('-created_at')
            
            print(f"📋 Pagos pendientes encontrados: {pending_payments.count()}")
            
            results = []
            
            for payment_intent in pending_payments:
                print(f"🔎 Verificando pago: {payment_intent.preference_id}")
                print(f"   External ref: {payment_intent.external_reference}")
                print(f"   Estado actual: {payment_intent.status}")
                
                try:
                    sdk = get_mercadopago_sdk()
                    
                    # Buscar pagos por external_reference
                    search_filters = {
                        "external_reference": payment_intent.external_reference
                    }
                    
                    print(f"🔍 Buscando con filtros: {search_filters}")
                    payments_response = sdk.payment().search(filters=search_filters)
                    payments_data = payments_response.get("response", {}).get("results", [])
                    
                    print(f"📊 Pagos encontrados en MP: {len(payments_data)}")
                    
                    if payments_data:
                        latest_payment = payments_data[0]
                        payment_status = latest_payment.get("status")
                        payment_id = latest_payment.get("id")
                        
                        print(f"💳 Pago MP ID: {payment_id}, Estado: {payment_status}")
                        
                        if payment_intent.status != payment_status:
                            print(f"🔄 Actualizando estado de {payment_intent.status} a {payment_status}")
                            # Actualizar estado
                            payment_intent.status = payment_status
                            payment_intent.save()
                            
                            # Si está aprobado, activar suscripción
                            if payment_status == "approved":
                                print(f"✅ Activando suscripción para usuario {request.user.id_user}")
                                subscription = create_or_renew_subscription(request.user, payment_intent.plan)
                                results.append({
                                    "preference_id": payment_intent.preference_id,
                                    "status": payment_status,
                                    "message": "¡Pago aprobado! Suscripción activada.",
                                    "subscription": {
                                        "plan": payment_intent.plan.name,
                                        "end_date": subscription.end_date
                                    }
                                })
                            else:
                                results.append({
                                    "preference_id": payment_intent.preference_id,
                                    "status": payment_status,
                                    "message": f"Estado actualizado a: {payment_status}"
                                })
                        else:
                            print(f"ℹ️ Estado sin cambios: {payment_status}")
                    else:
                        print(f"❌ No se encontraron pagos para external_reference: {payment_intent.external_reference}")
                
                except Exception as e:
                    print(f"❌ Error verificando pago {payment_intent.preference_id}: {e}")
            
            print(f"✅ Verificación completa. Resultados: {len(results)}")
            return Response({
                "message": f"Verificados {len(results)} pagos actualizados de {pending_payments.count()} pendientes",
                "payments": results,
                "total_pending": pending_payments.count()
            })
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@method_decorator(csrf_exempt, name='dispatch')
@method_decorator(csrf_exempt, name='dispatch')
class MercadoPagoWebhookView(APIView):
    """
    Webhook para recibir notificaciones de MercadoPago.
    Este endpoint es llamado automáticamente por MercadoPago cuando cambia el estado del pago.
    """
    permission_classes = []  # No requiere autenticación
    
    def post(self, request):
        """Procesar notificación de MercadoPago"""
        try:
            # Obtener el tipo de notificación y el ID
            notification_type = request.data.get('type')
            data = request.data.get('data', {})
            payment_id = data.get('id')
            
            # Solo procesar notificaciones de pago
            if notification_type == 'payment' and payment_id:
                # Verificar el estado del pago con MercadoPago
                payment_info = verify_payment_with_mercadopago(payment_id)
                payment_data = payment_info.get("response", {})
                
                # Obtener información del pago
                payment_status = payment_data.get("status")
                external_reference = payment_data.get("external_reference")
                
                if external_reference:
                    # Buscar el PaymentIntent por external_reference
                    try:
                        # Parsear external_reference (formato: "user_{id}_plan_{id}")
                        parts = external_reference.split('_')
                        if len(parts) >= 4:
                            user_id = parts[1]
                            plan_id = parts[3]
                            
                            # Buscar payment intent
                            payment_intent = PaymentIntent.objects.filter(
                                user__id_user=user_id,
                                plan__id=plan_id,
                                status__in=['pending', 'in_process']
                            ).first()
                            
                            if payment_intent:
                                # Actualizar estado del pago
                                payment_intent.status = payment_status
                                payment_intent.save()
                                
                                # Si el pago fue aprobado, activar suscripción
                                if payment_status == "approved":
                                    subscription = create_or_renew_subscription(
                                        payment_intent.user, 
                                        payment_intent.plan
                                    )
                                    print(f"✅ Suscripción activada para usuario {payment_intent.user.id_user}")
                                
                                print(f"✅ Pago actualizado: {payment_id} -> {payment_status}")
                            else:
                                print(f"⚠️ No se encontró PaymentIntent para: {external_reference}")
                    
                    except Exception as e:
                        print(f"❌ Error procesando external_reference {external_reference}: {str(e)}")
                
                # Responder OK a MercadoPago (importante para que no reenvíe)
                return Response({"status": "ok"}, status=status.HTTP_200_OK)
            
            # Para otros tipos de notificación, solo responder OK
            return Response({"status": "ok"}, status=status.HTTP_200_OK)
            
        except Exception as e:
            print(f"❌ Error en webhook: {str(e)}")
            # Importante: siempre responder 200 para evitar reintentos de MercadoPago
            return Response({"status": "error", "message": str(e)}, status=status.HTTP_200_OK)

class TestAPIView(APIView):
    """Endpoint simple para probar conectividad"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        return Response({
            "message": "API funcionando correctamente",
            "user": str(request.user),
            "user_id": request.user.id_user if hasattr(request.user, 'id_user') else request.user.id,
            "timestamp": timezone.now()
        })
