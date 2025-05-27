from django.contrib import admin
from .models import Report

@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ('id_report', 'user', 'game', 'roulette', 'game_datetime', 'predicted', 'total_hits', 'predicted_hits', 'effectiveness')
    list_filter = ('game', 'roulette', 'game_datetime')
    search_fields = ('user__email', 'roulette', 'game')
    readonly_fields = ('game_datetime',)
