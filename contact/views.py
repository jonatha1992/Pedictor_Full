from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import ContactMessage
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([AllowAny])
def send_contact_email(request):
    """
    Endpoint para guardar mensajes de contacto en la base de datos.
    """
    try:
        # Registro básico de la solicitud
        logger.info(f"📩 NUEVA SOLICITUD DE CONTACTO RECIBIDA")
        
        # Extraer datos del formulario
        data = request.data
        name = data.get('name', '')
        email = data.get('email', '')
        phone = data.get('phone', '')
        message = data.get('message', '')
        
        # Registro de los datos recibidos
        logger.info(f"📋 DATOS: Nombre: {name}, Email: {email}, Teléfono: {phone}, Mensaje: {message[:30]}...")
          
        # Validación básica
        missing_fields = []
        if not name:
            missing_fields.append("nombre")
        if not email:
            missing_fields.append("email")
        if not message:
            missing_fields.append("mensaje")
            
        if missing_fields:
            error_msg = f"Por favor, completa los campos requeridos: {', '.join(missing_fields)}"
            logger.warning(f"⚠️ Validación fallida: {error_msg}")
            return Response(
                {"error": error_msg},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Guardar el mensaje en la base de datos
        try:
            contact_message = ContactMessage.objects.create(
                name=name,
                email=email,
                phone=phone,
                message=message
            )
            logger.info(f"💾 Mensaje guardado exitosamente en la base de datos con ID: {contact_message.id}")
            
            # Respuesta exitosa al usuario
            return Response(
                {"message": "Tu mensaje ha sido recibido correctamente. Nos pondremos en contacto contigo pronto."},
                status=status.HTTP_200_OK
            )
            
        except Exception as db_error:
            logger.error(f"❌ ERROR AL GUARDAR EN LA BASE DE DATOS: {str(db_error)}")
            logger.exception("Detalles completos del error:")
            
            return Response(
                {"error": "No se pudo guardar tu mensaje. Por favor, inténtalo de nuevo."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    except Exception as e:
        # Manejo de errores general
        logger.error(f"❌ ERROR INESPERADO: {str(e)}")
        logger.exception("Detalles completos del error:")
        
        return Response(
            {"error": "Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo más tarde."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
