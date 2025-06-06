import firebase_admin
from firebase_admin import auth as firebase_auth, credentials
from django.conf import settings

# Inicializar Firebase solo una vez
def initialize_firebase():
    if not firebase_admin._apps:
        cred = credentials.Certificate(settings.FIREBASE_CONFIG)
        firebase_admin.initialize_app(cred)

# Inicializar Firebase al importar este módulo
initialize_firebase()

def get_firebase_user_data(id_token):
    """
    Verifica el token de Firebase y devuelve los datos del usuario.
    Args:
        id_token (str): Token de ID de Firebase
    Returns:
        tuple: (uid, email, display_name) del usuario
    Raises:
        Exception: Si el token es inválido o hay algún error
    """
    try:
        decoded_token = firebase_auth.verify_id_token(id_token)
        uid = decoded_token.get('uid')
        email = decoded_token.get('email')
        name = decoded_token.get('name')
        return uid, email, name
    except Exception as e:
        raise Exception(f'Token de Firebase inválido: {str(e)}')

def create_custom_token(uid):
    """
    Crea un token personalizado para un usuario.
    Args:
        uid (str): ID de usuario de Firebase
    Returns:
        str: Token personalizado
    """
    return firebase_auth.create_custom_token(uid)
