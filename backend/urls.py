from django.urls import path
from .views import (
    ReportAPIView,
    UserAPIView,
    LicenseAPIView,
    GameInitView
)


urlpatterns = [
    path('reports', ReportAPIView.as_view(), name='reports'),
    path('users', UserAPIView.as_view(), name='users'),
    path('licenses', LicenseAPIView.as_view(), name='licenses'),
    path('games', GameInitView.as_view(), name='games'),
]
