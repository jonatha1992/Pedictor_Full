from django.db import models
from django.utils import timezone

class ContactMessage(models.Model):
    """
    Modelo para almacenar mensajes de contacto enviados por los usuarios.
    """
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True, null=True)
    message = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)
    processed = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Mensaje de contacto'
        verbose_name_plural = 'Mensajes de contacto'
    
    def __str__(self):
        return f"Mensaje de {self.name} ({self.email}) - {self.created_at.strftime('%Y-%m-%d')}"
