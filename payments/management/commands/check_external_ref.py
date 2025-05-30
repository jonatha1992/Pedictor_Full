from django.core.management.base import BaseCommand
from payments.models import PaymentIntent
from payments.utils import get_mercadopago_sdk


class Command(BaseCommand):
    help = 'Verificar external_references específicos'

    def add_arguments(self, parser):
        parser.add_argument('--payment-id', type=int, help='ID específico del payment intent')

    def handle(self, *args, **options):
        payment_id = options.get('payment_id')
        
        if payment_id:
            try:
                payment = PaymentIntent.objects.get(id=payment_id)
                self.check_payment(payment)
            except PaymentIntent.DoesNotExist:
                self.stdout.write(f"❌ Payment Intent {payment_id} no encontrado")
        else:
            # Verificar los últimos 3 pagos pendientes
            payments = PaymentIntent.objects.filter(
                status__in=['pending', 'in_process']
            ).order_by('-created_at')[:3]
            
            self.stdout.write(f"🔍 Verificando los últimos 3 pagos pendientes...")
            
            for payment in payments:
                self.check_payment(payment)

    def check_payment(self, payment):
        self.stdout.write(f"\n📋 Payment Intent ID: {payment.id}")
        self.stdout.write(f"   Usuario: {payment.user.name} ({payment.user.email})")
        self.stdout.write(f"   Preference ID: {payment.preference_id}")
        self.stdout.write(f"   External Reference: '{payment.external_reference}'")
        self.stdout.write(f"   Estado actual: {payment.status}")
        
        try:
            sdk = get_mercadopago_sdk()
            
            # Buscar por external_reference
            if payment.external_reference:
                search_filters = {
                    "external_reference": payment.external_reference
                }
                
                self.stdout.write(f"🔍 Buscando con external_reference: '{payment.external_reference}'")
                payments_response = sdk.payment().search(filters=search_filters)
                payments_data = payments_response.get("response", {}).get("results", [])
                
                self.stdout.write(f"📊 Pagos encontrados: {len(payments_data)}")
                
                if payments_data:
                    for mp_payment in payments_data:
                        self.stdout.write(f"   💳 MP Payment ID: {mp_payment.get('id')}")
                        self.stdout.write(f"   💳 MP Status: {mp_payment.get('status')}")
                        self.stdout.write(f"   💳 MP External Ref: '{mp_payment.get('external_reference')}'")
                        self.stdout.write(f"   💳 MP Amount: {mp_payment.get('transaction_amount')}")
                        self.stdout.write(f"   💳 MP Date: {mp_payment.get('date_created')}")
                else:
                    self.stdout.write(f"   ❌ No se encontraron pagos con external_reference: '{payment.external_reference}'")
                    
                    # Intentar buscar por preference_id
                    self.stdout.write(f"🔍 Intentando buscar por preference_id...")
                    try:
                        preference_response = sdk.preference().get(payment.preference_id)
                        preference_data = preference_response.get("response", {})
                        if preference_data:
                            self.stdout.write(f"   ✅ Preference encontrada:")
                            self.stdout.write(f"     - ID: {preference_data.get('id')}")
                            self.stdout.write(f"     - External Ref: '{preference_data.get('external_reference')}'")
                            self.stdout.write(f"     - Estado: {preference_data.get('status')}")
                    except Exception as e:
                        self.stdout.write(f"   ❌ Error buscando preference: {e}")
            else:
                self.stdout.write(f"   ⚠️ Payment no tiene external_reference!")
                
        except Exception as e:
            self.stdout.write(f"   ❌ Error general: {e}")
