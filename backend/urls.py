from django.urls import path
from .views import (
    ReportAPIView,
    UserAPIView,
    LicenseAPIView,
    GameInitView
)

# urlpatterns = [
#     # List all reports and filter with parameters
#     path('reports/<int:pk>/', ReportAPIView.as_view(), name='report-detail'),

#     # List all users and filter with parameters
#     path('users/', UserAPIView.as_view(), name='users-list'),
#     path('users/<int:pk>/', UserAPIView.as_view(), name='user-detail'),

#     # List all licenses and filter with parameters
#     path('licenses/', LicenseAPIView.as_view(), name='licenses-list'),
#     path('licenses/<int:pk>/', LicenseAPIView.as_view(), name='license-detail'),

#     # List all games and filter with parameters
#     path('game/', GameInitView.as_view(), name='games-list'),
#     path('game/<int:pk>/', GameInitView.as_view(), name='game-detail'),
# ]


urlpatterns = [
    path('reports', ReportAPIView.as_view(), name='reports'),
    path('users', UserAPIView.as_view(), name='users'),
    path('licenses', LicenseAPIView.as_view(), name='licenses'),
    path('games', GameInitView.as_view(), name='games'),
]
