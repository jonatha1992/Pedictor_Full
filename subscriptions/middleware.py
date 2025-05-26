from django.utils import timezone
from django.shortcuts import redirect
from django.urls import resolve

class SubscriptionMiddleware:
    """
    Middleware to check if a user has an active subscription for protected routes
    """
    def __init__(self, get_response):
        self.get_response = get_response
        # List of URL patterns that require a subscription
        self.subscription_required_urls = [
            '/api/games/predict',
            '/api/reports',
        ]

    def __call__(self, request):
        # Skip middleware for non-authenticated users
        if not request.user.is_authenticated:
            return self.get_response(request)

        # Get current path
        current_path = request.path_info

        # Check if path requires subscription
        requires_subscription = any(current_path.startswith(url) for url in self.subscription_required_urls)

        if requires_subscription:
            # Check if user has active subscription
            if not request.user.has_active_subscription:
                # Handle API request differently from browser request
                if request.headers.get('accept') == 'application/json':
                    from rest_framework.response import Response
                    from rest_framework import status
                    from django.http import JsonResponse
                    return JsonResponse(
                        {"error": "Se requiere una suscripción activa para acceder a esta función."},
                        status=status.HTTP_403_FORBIDDEN
                    )
                # For browser requests
                from django.contrib import messages
                messages.warning(request, "Necesitas una suscripción activa para acceder a esta función.")
                return redirect('subscribe')

        return self.get_response(request)
