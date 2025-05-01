from django.db import models

class Report(models.Model):
    id_report = models.AutoField(primary_key=True)
    user = models.ForeignKey('users.User', related_name='reports', on_delete=models.CASCADE)
    game = models.CharField(max_length=50)
    game_datetime = models.DateTimeField(auto_now_add=True)
    predicted = models.IntegerField()
    total_hits = models.IntegerField()
    predicted_hits = models.IntegerField()
    v1l = models.IntegerField()
    v2l = models.IntegerField()
    v3l = models.IntegerField()
    numbers_to_predict = models.IntegerField()
    previous_numbers = models.IntegerField()
    neighbor_count = models.IntegerField()
    game_limit = models.IntegerField()
    probability = models.FloatField()
    effectiveness = models.FloatField()
    roulette = models.CharField(max_length=100)
    description = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = 'reports'
from django.db import models

# Create your models here.
