
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
from rest_framework.permissions import AllowAny
from .predictor_singleton import get_predictor

class GameSerializer(ModelSerializer):
    class Meta:
        model = Game
        fields = '__all__'

class GameListView(generics.ListAPIView):
    queryset = Game.objects.all()
    serializer_class = GameSerializer



class GamePredictAPIView(APIView):
    # Disable authentication classes to avoid CSRF/session auth, allow anonymous
    authentication_classes = []
    permission_classes = [AllowAny]
    
    @swagger_auto_schema(
        request_body=GamePredictParamsSerializer,
        operation_description="""                {
                    "numeros": [1, 5, 12, 23, 8, 17, 29, 36, ...], // Puedes enviar toda la lista histórica
                    "parametros": {
                        "numeros_anteriores": 10, // Usar hasta 36 números para la predicción (default: 8)
                        "tipo_ruleta": "Electromecanica"
                    }
                }"""
    )
    def post(self, request):
        print("[DEBUG] request.data:", request.data)
        serializer = GamePredictParamsSerializer(data=request.data)
        if not serializer.is_valid():
            print("[DEBUG] serializer.errors:", serializer.errors)
            return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        data = serializer.validated_data
        print("[DEBUG] validated_data:", data)
        numeros = data.get('numeros', [])
        parametros = data.get('parametros', {})
        print("[DEBUG] numeros:", numeros)
        print("[DEBUG] parametros:", parametros)
        numeros_anteriores = parametros.get('numeros_anteriores', 10)
        tipo_ruleta = parametros.get('tipo_ruleta', 'Electromecanica')
        print("[DEBUG] numeros_anteriores:", numeros_anteriores)
        print("[DEBUG] tipo_ruleta:", tipo_ruleta)
        modelo_nombre = f"Model_{tipo_ruleta}_N{numeros_anteriores}.keras"
        model_path = os.path.join(os.path.dirname(__file__), 'ml', modelo_nombre)
        
        # Si no existe el modelo solicitado, intentar encontrar algún modelo compatible
        if not os.path.exists(model_path):
            # Intentar con Electromecanica por defecto
            model_path = os.path.join(os.path.dirname(__file__), 'ml', f'Model_Electromecanica_N{numeros_anteriores}.keras')
            
            # Si aún no existe, buscar modelos con el mismo tipo de ruleta pero distinto N
            if not os.path.exists(model_path):
                # Buscar en directorio ml por modelos compatibles
                ml_dir = os.path.join(os.path.dirname(__file__), 'ml')
                if os.path.exists(ml_dir):
                    model_files = [f for f in os.listdir(ml_dir) if f.startswith(f"Model_{tipo_ruleta}_") and f.endswith(".keras")]
                    if model_files:
                        # Usar el primer modelo encontrado para ese tipo de ruleta
                        model_path = os.path.join(ml_dir, model_files[0])
                        # Extraer el N del nombre del modelo
                        import re
                        match = re.search(r'N(\d+)\.keras$', model_files[0])
                        if match:
                            numeros_anteriores = int(match.group(1))
                    else:
                        # Si no hay modelo para ese tipo, buscar cualquier modelo de Electromecanica
                        model_files = [f for f in os.listdir(ml_dir) if f.startswith("Model_Electromecanica_") and f.endswith(".keras")]
                        if model_files:
                            model_path = os.path.join(ml_dir, model_files[0])
                            match = re.search(r'N(\d+)\.keras$', model_files[0])
                            if match:
                                numeros_anteriores = int(match.group(1))
                
                if not os.path.exists(model_path):
                    return Response({"error": "Modelo de predicción no encontrado."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)        
                
        try:
            print("[DEBUG] model_path:", model_path)
            predictor = get_predictor(model_path, numeros_anteriores)
            print("[DEBUG] predictor creado")
            probabilidades = predictor.predecir(numeros)
            print("[DEBUG] probabilidades:", probabilidades)
            probabilidades_obj = [
                {"numero": i, "probabilidad": round(p, 2)}
                for i, p in enumerate(probabilidades)
            ]
            print("[DEBUG] probabilidades_obj:", probabilidades_obj)
            return Response({
                "probabilidades": probabilidades_obj,
                "modelo_usado": os.path.basename(model_path),
                "numeros_anteriores_usados": numeros_anteriores
            }, status=status.HTTP_200_OK)
        except Exception as e:
            import traceback
            print("[ERROR] Exception:", str(e))
            traceback.print_exc()
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

