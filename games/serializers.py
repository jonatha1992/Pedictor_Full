from rest_framework import serializers

class ParametrosSerializer(serializers.Serializer):
    numeros_anteriores = serializers.IntegerField(min_value=1, max_value=36, required=False, default=10)
    tipo_ruleta = serializers.ChoiceField(choices=['Electromecanica', 'Crupier'], required=False, default="Electromecanica")

class GamePredictParamsSerializer(serializers.Serializer):
    numeros = serializers.ListField(
        child=serializers.IntegerField(min_value=0, max_value=36),
        min_length=10,
        max_length=1000  # Permitir listas largas de históricos
    )
    parametros = ParametrosSerializer(required=False)
    
    class Meta:
        swagger_schema_fields = {
            "example": {
                "numeros": [1, 5, 12, 23, 8, 17, 29, 36, 14, 7],  # Mínimo 10 números
                "parametros": {
                    "numeros_anteriores": 10,
                    "tipo_ruleta": "Electromecanica"
                }
            }
        }
