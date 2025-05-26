from django.shortcuts import redirect
from django.utils import timezone
from django.contrib import messages
from functools import wraps
from rest_framework.response import Response
from rest_framework import status

def subscription_required(view_func):
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        if request.user.is_authenticated:
            # Check if user has active subscription
            active_subscription = request.user.subscriptions.filter(end_date__gt=timezone.now()).exists()
            
            if active_subscription:
                return view_func(request, *args, **kwargs)
            else:
                # For API requests return JSON response
                if request.headers.get('accept') == 'application/json':
                    return Response(
                        {"error": "Se requiere una suscripción activa para acceder a esta función."},
                        status=status.HTTP_403_FORBIDDEN
                    )
                # For browser requests show message and redirect
                messages.warning(request, "Necesitas una suscripción activa para acceder a esta función.")
                return redirect('subscribe')
        
        # For API requests return JSON response for unauthenticated users
        if request.headers.get('accept') == 'application/json':
            return Response(
                {"error": "Autenticación requerida."},
                status=status.HTTP_401_UNAUTHORIZED
            )
        return redirect('login')
    return _wrapped_view
