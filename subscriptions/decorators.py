from django.shortcuts import redirect
from django.utils import timezone
from django.contrib import messages
from functools import wraps

def subscription_required(view_func):
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        if request.user.is_authenticated:
            # Check if user has active subscription
            active_subscription = request.user.subscriptions.filter(end_date__gt=timezone.now()).exists()
            
            if active_subscription:
                return view_func(request, *args, **kwargs)
            else:
                messages.warning(request, "Necesitas una suscripción activa para acceder a esta función.")
                return redirect('subscribe')
        return redirect('login')
    return _wrapped_view
