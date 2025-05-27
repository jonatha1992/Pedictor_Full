from django.contrib import admin
from .models import Game

@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
    list_display = ('id_game', 'user', 'tipo', 'nombre_ruleta', 'tardanza', 'cantidad_vecinos', 'umbral_probabilidad')
    list_filter = ('tipo', 'nombre_ruleta')
    search_fields = ('user__email', 'nombre_ruleta', 'tipo')
