from django.core.management.base import BaseCommand
from payments.models import PaymentIntent
from payments.utils import get_mercadopago_sdk


class Command(BaseCommand):
    help = 'Debug pagos pendientes'

    def handle(self, *args, **options):
        pending_payments = PaymentIntent.objects.filter(
            status__in=['pending', 'in_process']
        ).order_by('-created_at')

        self.stdout.write(f"🔍 Pagos pendientes encontrados: {pending_payments.count()}")

        for payment in pending_payments:
            self.stdout.write(f"\n📋 Payment Intent ID: {payment.id}")
            self.stdout.write(f"   Usuario: {payment.user.name} ({payment.user.email})")
            self.stdout.write(f"   Preference ID: {payment.preference_id}")
            self.stdout.write(f"   External Reference: {payment.external_reference}")
            self.stdout.write(f"   Estado actual: {payment.status}")
            self.stdout.write(f"   Fecha: {payment.created_at}")

            # Buscar en MercadoPago
            try:
                sdk = get_mercadopago_sdk()
                
                search_filters = {
                    "external_reference": payment.external_reference
                }
                
                payments_response = sdk.payment().search(filters=search_filters)
                payments_data = payments_response.get("response", {}).get("results", [])
                
                self.stdout.write(f"   🔍 Pagos en MP: {len(payments_data)}")
                
                if payments_data:
                    latest_payment = payments_data[0]
                    self.stdout.write(f"   💳 MP Payment ID: {latest_payment.get('id')}")
                    self.stdout.write(f"   💳 MP Status: {latest_payment.get('status')}")
                    self.stdout.write(f"   💳 MP Amount: {latest_payment.get('transaction_amount')}")
                else:
                    self.stdout.write(f"   ❌ No se encontraron pagos en MP")
                    
            except Exception as e:
                self.stdout.write(f"   ❌ Error: {e}")

        self.stdout.write(f"\n✅ Debug completado")
