import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from .models import ContactMessage

@pytest.fixture
def contact_data():
    """
    Fixture que proporciona datos de prueba para un mensaje de contacto.
    """
    return {
        'name': 'Test User',
        'email': 'test@example.com',
        'phone': '+541112345678',
        'message': 'This is a test message.'
    }

@pytest.mark.django_db
def test_save_contact_message_success(contact_data):
    """
    Prueba que un mensaje de contacto se guarda correctamente en la base de datos.
    """
    client = APIClient()
    url = reverse('send_contact_email')
    
    # Verificar que no hay mensajes en la base de datos antes de la prueba
    assert ContactMessage.objects.count() == 0
    
    # Enviar solicitud al endpoint
    response = client.post(url, contact_data, format='json')
    
    # Verificar respuesta exitosa
    assert response.status_code == 200
    assert 'message' in response.data
    
    # Verificar que el mensaje se guardó en la base de datos
    assert ContactMessage.objects.count() == 1
    
    # Verificar los datos del mensaje guardado
    saved_message = ContactMessage.objects.first()
    assert saved_message.name == contact_data['name']
    assert saved_message.email == contact_data['email']
    assert saved_message.phone == contact_data['phone']
    assert saved_message.message == contact_data['message']
    assert saved_message.processed == False  # Por defecto no está procesado

@pytest.mark.django_db
def test_missing_required_fields():
    """
    Prueba que se manejan correctamente los errores cuando faltan campos obligatorios.
    """
    client = APIClient()
    url = reverse('send_contact_email')
    
    # Probar sin nombre
    response = client.post(
        url, 
        {'email': 'test@example.com', 'message': 'Test message'}, 
        format='json'
    )
    assert response.status_code == 400
    assert 'error' in response.data
    assert 'nombre' in response.data['error']
    
    # Probar sin email
    response = client.post(
        url, 
        {'name': 'Test User', 'message': 'Test message'}, 
        format='json'
    )
    assert response.status_code == 400
    assert 'error' in response.data
    assert 'email' in response.data['error']
    
    # Probar sin mensaje
    response = client.post(
        url, 
        {'name': 'Test User', 'email': 'test@example.com'}, 
        format='json'
    )
    assert response.status_code == 400
    assert 'error' in response.data
    assert 'mensaje' in response.data['error']
    
    # Verificar que no se guardó ningún mensaje en la base de datos
    assert ContactMessage.objects.count() == 0

@pytest.mark.django_db
def test_contact_api_public_access():
    """
    Prueba que la API de contacto es accesible sin autenticación.
    """
    client = APIClient()
    url = reverse('send_contact_email')
    
    # Verificar que se puede acceder al endpoint sin token
    response = client.options(url)
    assert response.status_code == 200
