# backend_authentication.py
from rest_framework import authentication, exceptions
import firebase_admin
from firebase_admin import auth as firebase_auth, credentials
from django.conf import settings
from users.models import User

# Inicializar Firebase solo una vez
if not firebase_admin._apps:
    cred = credentials.Certificate(settings.FIREBASE_CONFIG)
    firebase_admin.initialize_app(cred)

class FirebaseAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return None
        if not auth_header.startswith('Bearer '):
            return None
        id_token = auth_header.split(' ')[1]
        try:
            decoded_token = firebase_auth.verify_id_token(id_token)
        except Exception:
            raise exceptions.AuthenticationFailed('Token de Firebase inválido')
        uid = decoded_token.get('uid')
        email = decoded_token.get('email')
        if not email:
            raise exceptions.AuthenticationFailed('El token de Firebase no contiene email')
        # Buscar o crear usuario local
        user, created = User.objects.get_or_create(email=email, defaults={'name': email.split('@')[0]})
        return (user, None)
