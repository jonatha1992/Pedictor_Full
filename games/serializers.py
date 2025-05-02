from rest_framework import serializers

class ParametrosSerializer(serializers.Serializer):
    numeros_anteriores = serializers.IntegerField(min_value=1, max_value=20, required=False, default=8)
    tipo_ruleta = serializers.ChoiceField(choices=['Electromecanica', 'Crupier'], required=False, default="Electromecanica")

class GamePredictParamsSerializer(serializers.Serializer):
    numeros = serializers.ListField(
        child=serializers.IntegerField(min_value=0, max_value=36),
        min_length=8
    )
    parametros = ParametrosSerializer(required=False)

    class Meta:
        swagger_schema_fields = {
            "example": {
                "numeros": [1, 5, 12, 23, 8, 17, 29, 36],
                "parametros": {
                    "numeros_anteriores": 8,
                    "tipo_ruleta": "Electromecanica"
                }
            }
        }
