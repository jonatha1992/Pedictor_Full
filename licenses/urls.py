from django.urls import path
from .views import LicenseActivationView, UserLicenseDetail, update_last_used

urlpatterns = [
    path('activate/', LicenseActivationView.as_view(), name='license-activate'),
    path('my-license/', UserLicenseDetail.as_view(), name='user-license-detail'),
    path('update-usage/', update_last_used, name='update-last-used'),
]
