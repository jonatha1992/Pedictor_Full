from drf_yasg import openapi
from django.shortcuts import get_object_or_404
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


class UserAPIView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_description="Get all users or single user by id",
        manual_parameters=[
            openapi.Parameter(
                'id',
                openapi.IN_QUERY,
                description="User ID (optional)",
                type=openapi.TYPE_INTEGER,
                required=False
            )
        ],
        responses={
            200: UserSerializer(many=True),
            404: 'User not found'
        }
    )
    def get(self, request):
        id = request.query_params.get('id')
        if id:
            user = get_object_or_404(User, pk=id)
            serializer = UserSerializer(user)
        else:
            users = User.objects.all()
            serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        operation_description="Create a new user",
        request_body=UserSerializer,
        responses={
            201: UserSerializer,
            400: 'Bad Request'
        }
    )
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        operation_description="Update a user",
        request_body=UserSerializer,
        manual_parameters=[
            openapi.Parameter(
                'id',
                openapi.IN_QUERY,
                description="User ID",
                type=openapi.TYPE_INTEGER,
                required=True
            )
        ],
        responses={
            200: UserSerializer,
            400: 'Bad Request',
            404: 'User not found'
        }
    )
    def put(self, request):
        id = request.query_params.get('id')
        user = get_object_or_404(User, pk=id)
        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        operation_description="Delete a user",
        manual_parameters=[
            openapi.Parameter(
                'id',
                openapi.IN_QUERY,
                description="User ID",
                type=openapi.TYPE_INTEGER,
                required=True
            )
        ],
        responses={
            204: 'No Content',
            404: 'User not found'
        }
    )
    def delete(self, request):
        id = request.query_params.get('id')
        user = get_object_or_404(User, pk=id)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class LicenseAPIView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_description="Get all licenses or single license by id",
        manual_parameters=[
            openapi.Parameter(
                'id',
                openapi.IN_QUERY,
                description="License ID (optional)",
                type=openapi.TYPE_INTEGER,
                required=False
            )
        ],
        responses={
            200: LicenseSerializer(many=True),
            404: 'License not found'
        }
    )
    def get(self, request):
        id = request.query_params.get('id')
        if id:
            license = get_object_or_404(License, pk=id)
            serializer = LicenseSerializer(license)
        else:
            licenses = License.objects.all()
            serializer = LicenseSerializer(licenses, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        operation_description="Create a new license",
        request_body=LicenseSerializer,
        responses={
            201: LicenseSerializer,
            400: 'Bad Request'
        }
    )
    def post(self, request):
        serializer = LicenseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GameInitView(APIView):

    @swagger_auto_schema(operation_description="Create a new game")
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

    @swagger_auto_schema(operation_description="Get all games")
    def get(self, request):
        games = Game.objects.all()
        serializer = GameSerializer(games, many=True)
        return Response(serializer.data)


class ReportAPIView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_description="Get all reports or single report by id",
        manual_parameters=[
            openapi.Parameter(
                'id',
                openapi.IN_QUERY,
                description="Report ID (optional)",
                type=openapi.TYPE_INTEGER,
                required=False
            )
        ],
        responses={
            200: ReportSerializer(many=True),
            404: 'Report not found'
        }
    )
    def get(self, request):
        id = request.query_params.get('id')
        if id:
            report = get_object_or_404(Report, pk=id)
            serializer = ReportSerializer(report)
        else:
            reports = Report.objects.all()
            serializer = ReportSerializer(reports, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        operation_description="Create a new report",
        request_body=ReportSerializer,
        responses={
            201: ReportSerializer,
            400: 'Bad Request'
        }
    )
    def post(self, request):
        serializer = ReportSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        operation_description="Update a report",
        request_body=ReportSerializer,
        manual_parameters=[
            openapi.Parameter(
                'id',
                openapi.IN_QUERY,
                description="Report ID",
                type=openapi.TYPE_INTEGER,
                required=True
            )
        ],
        responses={
            200: ReportSerializer,
            400: 'Bad Request',
            404: 'Report not found'
        }
    )
    def put(self, request):
        id = request.query_params.get('id')
        report = get_object_or_404(Report, pk=id)
        serializer = ReportSerializer(report, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        operation_description="Delete a report",
        manual_parameters=[
            openapi.Parameter(
                'id',
                openapi.IN_QUERY,
                description="Report ID",
                type=openapi.TYPE_INTEGER,
                required=True
            )
        ],
        responses={
            204: 'No Content',
            404: 'Report not found'
        }
    )
    def delete(self, request):
        id = request.query_params.get('id')
        report = get_object_or_404(Report, pk=id)
        report.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
