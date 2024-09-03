from django.contrib.auth import get_user_model
from django.utils.functional import SimpleLazyObject
from firebase_admin import auth
from rest_framework.exceptions import AuthenticationFailed

User = get_user_model()


def get_user(firebase_token):
    try:
        decoded_token = auth.verify_id_token(firebase_token)
        uid = decoded_token['uid']
        email = decoded_token.get('email')
        user, _ = User.objects.get_or_create(email=email, defaults={'name': email})
        return user
    except BaseException:
        return None


class FirebaseAuthenticationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        if auth_header and auth_header.startswith('Bearer '):
            firebase_token = auth_header.split('Bearer ')[1]
            request.user = SimpleLazyObject(lambda: get_user(firebase_token))

        response = self.get_response(request)
        return response
