from django.contrib import admin
from .models import User

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'name', 'created_at', 'has_active_subscription')
    list_filter = ('created_at',)
    search_fields = ('name', 'email')
    ordering = ('email',)
    readonly_fields = ('created_at',)
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('name',)}),
        ('Dates', {'fields': ('created_at',)}),
    )
    
    def has_active_subscription(self, obj):
        return obj.has_active_subscription
    has_active_subscription.boolean = True
    has_active_subscription.short_description = 'Suscripción Activa'
