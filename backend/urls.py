from django.urls import include, path

from . import views

urlpatterns = [
    path('users/', views.Listar_user),
    path('reports/', views.Listar_reportes),
    path('licenses/', views.Listar_reportes),
]
