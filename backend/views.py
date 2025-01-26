from grpc import Status
from backend.entity.predictor import Predictor
from .models import Report, User, License
from rest_framework import viewsets, permissions, mixins
from rest_framework.viewsets import GenericViewSet
from .serializers import ReportSerializer, UserSerializer, LicenseSerializer
from django.conf import settings
from firebase_admin import credentials, auth
import firebase_admin
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from rest_framework.views import APIView


firebase_creds = credentials.Certificate(settings.FIREBASE_CONFIG)
firebase_app = firebase_admin.initialize_app(firebase_creds)


class ReportViewSet(mixins.CreateModelMixin,
                    mixins.RetrieveModelMixin,
                    mixins.ListModelMixin,
                    GenericViewSet):
    serializer_class = ReportSerializer
    queryset = Report.objects.all()
    permission_classes = [AllowAny]


class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet para ver y editar usuarios
    """
    serializer_class = UserSerializer
    queryset = User.objects.all()
    permission_classes = [AllowAny]

    @swagger_auto_schema(operation_description="Listar todos los usuarios")
    def list(self, request):
        return super().list(request)

    @swagger_auto_schema(operation_description="Crear un nuevo usuario")
    def create(self, request):
        return super().create(request)

    @swagger_auto_schema(operation_description="Obtener un usuario por ID")
    def retrieve(self, request, pk=None):
        return super().retrieve(request, pk)

    @swagger_auto_schema(operation_description="Actualizar un usuario completo")
    def update(self, request, pk=None):
        return super().update(request, pk)

    @swagger_auto_schema(operation_description="Actualizar parcialmente un usuario")
    def partial_update(self, request, pk=None):
        return super().partial_update(request, pk)

    @swagger_auto_schema(operation_description="Eliminar un usuario")
    def destroy(self, request, pk=None):
        return super().destroy(request, pk)


class LicenseViewSet(mixins.CreateModelMixin,
                     mixins.RetrieveModelMixin,
                     mixins.ListModelMixin,
                     GenericViewSet):
    serializer_class = LicenseSerializer
    queryset = License.objects.all()
    permission_classes = [AllowAny]
    http_method_names = ['get', 'post', 'head', 'options']


class PredictorInitView(APIView):
    def post(self, request):
        filename = request.data.get('filename')
        parametros = request.data.get('parametros')
        hiperparametros = request.data.get('hiperparametros')
        apps.get_app_config('backend').predictor_crupier = Predictor(filename, parametros, hiperparametros)
        apps.get_app_config('backend').predictor_electromecanica = Predictor(filename, parametros, hiperparametros)
        return Response({'message': 'Predictors initialized'}, status=status.HTTP_200_OK)


class PredictView(APIView):
    def post(self, request):
        serializer = PredictSerializer(data=request.data)
        if serializer.is_valid():
            numeros = serializer.validated_data['numeros']
            predictor_crupier = apps.get_app_config('backend').predictor_crupier
            predictor_electromecanica = apps.get_app_config('backend').predictor_electromecanica
            prediction_crupier = predictor_crupier.predecir(numeros)
            prediction_electromecanica = predictor_electromecanica.predecir(numeros)
            return Response({
                'prediction_crupier': prediction_crupier,
                'prediction_electromecanica': prediction_electromecanica
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
