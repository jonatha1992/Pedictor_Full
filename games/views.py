
from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Game
from .predictor import Predictor
import os
from rest_framework.serializers import ModelSerializer
from .serializers import GamePredictParamsSerializer

from django.shortcuts import render
from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView

class GameSerializer(ModelSerializer):
    class Meta:
        model = Game
        fields = '__all__'

class GameListView(generics.ListAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer



class GamePredictAPIView(APIView):
    @swagger_auto_schema(
        request_body=GamePredictParamsSerializer,
        operation_description="""
                {
                    "numeros": [1, 5, 12, 23, 8, 17, 29, 36],
                    "parametros": {
                        "numeros_anteriores": 8,
                        "tipo_ruleta": "Electromecanica"
                    }
                }"""
    )
    def post(self, request):
        serializer = GamePredictParamsSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        data = serializer.validated_data
        numeros = data.get('numeros', [])
        parametros = data.get('parametros', {})
        numeros_anteriores = parametros.get('numeros_anteriores', 8)
        tipo_ruleta = parametros.get('tipo_ruleta', 'Electromecanica')

        # Lógica para elegir el modelo según el tipo de ruleta
        modelo_nombre = f"Model_{tipo_ruleta}_N{numeros_anteriores}.keras"
        model_path = os.path.join(os.path.dirname(__file__), 'ml', modelo_nombre)
        # Si no existe el modelo solicitado, usar Electromecanica por defecto
        if not os.path.exists(model_path):
            model_path = os.path.join(os.path.dirname(__file__), 'ml', f'Model_Electromecanica_N{numeros_anteriores}.keras')
            if not os.path.exists(model_path):
                return Response({"error": "Modelo de predicción no encontrado."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        try:
            predictor = Predictor(model_path, numeros_anteriores=numeros_anteriores)
            probabilidades = predictor.predecir(numeros)
            # Devuelve las probabilidades para cada número (0-36)
            return Response({
                "probabilidades": probabilidades,
                "modelo_usado": os.path.basename(model_path)
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Create your views here.
