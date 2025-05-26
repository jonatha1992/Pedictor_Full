import mercadopago
from django.conf import settings

def verify_payment_with_mercadopago(payment_id):
    """
    Verify payment status with MercadoPago
    """
    sdk = mercadopago.SDK(settings.MERCADOPAGO_ACCESS_TOKEN)
    return sdk.payment().get(payment_id)
    
def get_mercadopago_sdk():
    """
    Get initialized MercadoPago SDK
    """
    return mercadopago.SDK(settings.MERCADOPAGO_ACCESS_TOKEN)
