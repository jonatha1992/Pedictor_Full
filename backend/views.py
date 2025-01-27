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


# class ReportAPIView(APIView):
#     #     permission_classes = [AllowAny]

#     #     @swagger_auto_schema(operation_description="Get all reports")
#     #     def get_all(self, request):
#     #         reports = Report.objects.all()
#     #         serializer = ReportSerializer(reports, many=True)
#     #         return Response(serializer.data)

#     #     @swagger_auto_schema(operation_description="Get report by id")
#     #     def get(self, request, report_id):
#     #         try:
#     #             report = Report.objects.get(id=report_id)
#     #             serializer = ReportSerializer(report)
#     #             return Response(serializer.data)
#     #         except Report.DoesNotExist:
#     #             return Response({'message': 'Report not found'}, status=status.HTTP_404_NOT_FOUND)

#     #     @swagger_auto_schema(operation_description="Created a new report")
#     #     def post(self, request):
#     #         serializer = ReportSerializer(data=request.data)
#     #         if serializer.is_valid():
#     #             serializer.save()
#     #             return Response(serializer.data, status=status.HTTP_201_CREATED)
#     #         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     def get(self, request):
#         id = request.query_params.get('id', None)
#         if id:
#             # Get by id
#             report = get_object_or_404(Report, pk=id)
#             serializer = ReportSerializer(report)
#         else:
#             # Get all
#             reports = Report.objects.all()
#             serializer = ReportSerializer(reports, many=True)
#         return Response(serializer.data)


class UserAPIView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(operation_description="Get all users")
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(operation_description="Creted a new user")
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LicenseAPIView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(operation_description="Get all licenses")
    def get(self, request):
        licenses = License.objects.all()
        serializer = LicenseSerializer(licenses, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(operation_description="Create a new license")
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
