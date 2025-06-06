from rest_framework import authentication, exceptions
from django.conf import settings
from users.models import User
from users.firebase_utils import get_firebase_user_data

class FirebaseAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return None
        if not auth_header.startswith('Bearer '):
            return None
        id_token = auth_header.split(' ')[1]
        try:
            # Utilizamos la función auxiliar para obtener datos de usuario
            uid, email, name = get_firebase_user_data(id_token)
            if not email:
                raise exceptions.AuthenticationFailed('El token de Firebase no contiene email')
            # Buscar o crear usuario local
            user, created = User.objects.get_or_create(
                email=email,
                defaults={'name': name or email.split('@')[0]}
            )
            return (user, None)
        except Exception as e:
            raise exceptions.AuthenticationFailed(f'Error de autenticación: {str(e)}')
