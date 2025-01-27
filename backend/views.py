from .models import Game
from .serializers import GameSerializer
from grpc import Status
from backend.entity.predictor import Predictor
from .models import Report, User, License
from rest_framework import status
from rest_framework.views import APIView
from .serializers import PredictSerializer, ReportSerializer, UserSerializer, LicenseSerializer
from django.conf import settings
from firebase_admin import credentials, auth
import firebase_admin
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema


firebase_creds = credentials.Certificate(settings.FIREBASE_CONFIG)
firebase_app = firebase_admin.initialize_app(firebase_creds)


class ReportAPIView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(operation_description="Listar todos los reportes")
    def get(self, request):
        reports = Report.objects.all()
        serializer = ReportSerializer(reports, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(operation_description="Crear un nuevo reporte")
    def post(self, request):
        serializer = ReportSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserAPIView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(operation_description="Listar todos los usuarios")
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(operation_description="Crear un nuevo usuario")
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LicenseAPIView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(operation_description="Listar todas las licencias")
    def get(self, request):
        licenses = License.objects.all()
        serializer = LicenseSerializer(licenses, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(operation_description="Crear una nueva licencia")
    def post(self, request):
        serializer = LicenseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GameInitView(APIView):
    def post(self, request):
        # Get parameters from request
        data = request.data

        # Add user to data if authenticated
        if request.user.is_authenticated:
            data['user'] = request.user.id_user

        # Create serializer with data
        serializer = GameSerializer(data=data)

        if serializer.is_valid():
            game = serializer.save()
            return Response({
                'message': 'Game parameters saved',
                'game_id': game.id_game
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
