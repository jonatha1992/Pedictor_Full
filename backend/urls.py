from django.urls import include, path
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet, "users")
router.register(r'reports', views.ReportViewSet, "reports")
router.register(r'licenses', views.LicenseViewSet, "licenses")

urlpatterns = [
    path('', include(router.urls)),
    path('predict/init/', views.PredictorInitView.as_view(), name='predictor-init'),
    path('predict/', views.PredictView.as_view(), name='predict'),
]
