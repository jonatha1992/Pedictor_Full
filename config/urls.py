from django.contrib import admin
from django.urls import include, path
from rest_framework.documentation import include_docs_urls
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from .health_check import health_check


schema_view = get_schema_view(
    openapi.Info(
        title="Predictor API",
        default_version='v1',
        description="API Documentation for Predictor",
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    # Health check
    path('api/health-check/', health_check, name='health_check'),
    
    # Django admin
    path('admin/', admin.site.urls),
      # API endpoints
    path('api/users/', include('users.urls')),
    path('api/games/', include('games.urls')),
    path('api/reports/', include('reports.urls')),
    path('api/subscriptions/', include('subscriptions.urls')),
    path('api/payments/', include('payments.urls')),
    
    # Swagger documentation
    path('api/swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('api/redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
