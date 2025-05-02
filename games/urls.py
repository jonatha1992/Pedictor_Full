from django.urls import path
from .views import GameListView, GamePredictAPIView

urlpatterns = [
    path('', GameListView.as_view(), name='game-list'),
    path('predict/', GamePredictAPIView.as_view(), name='game-predict'),
]
