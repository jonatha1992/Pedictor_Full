from django.contrib import admin
from .models import PaymentIntent

@admin.register(PaymentIntent)
class PaymentIntentAdmin(admin.ModelAdmin):
    list_display = ('user', 'plan', 'amount', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('user__username', 'user__email', 'preference_id')
    readonly_fields = ('preference_id', 'created_at')
