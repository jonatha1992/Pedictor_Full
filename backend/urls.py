from django.urls import include, path
from rest_framework import routers
from . import views


router = routers.DefaultRouter()
router.register(r'reports', views.ReportViewSet, "reports")


urlpatterns = [
    path('reports/', include(router.urls)),
]
