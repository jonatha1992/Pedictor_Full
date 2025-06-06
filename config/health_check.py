from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def health_check(request):
    """
    Simple health check endpoint to verify the API is running.
    """
    return HttpResponse("OK", content_type="text/plain")
