from django.db import models

class Game(models.Model):
    id_game = models.AutoField(primary_key=True)
    user = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='games')
    tipo = models.CharField(max_length=100)
    nombre_ruleta = models.CharField(max_length=100)
    tardanza = models.IntegerField()
    cantidad_vecinos = models.IntegerField()
    umbral_probabilidad = models.FloatField()

    def __str__(self):
        return f"{self.id_game}- {self.tipo} - {self.nombre_ruleta}"

    class Meta:
        db_table = 'games'

