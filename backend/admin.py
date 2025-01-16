from django.contrib import admin
from backend.models import License, Report, User

# Register your models here.
admin.site.register(User)
admin.site.register(Report)
admin.site.register(License)
