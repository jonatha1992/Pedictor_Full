from django.contrib import admin
from .models import ContactMessage

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'created_at', 'processed')
    list_filter = ('processed', 'created_at')
    search_fields = ('name', 'email', 'message')
    readonly_fields = ('created_at',)
    date_hierarchy = 'created_at'
