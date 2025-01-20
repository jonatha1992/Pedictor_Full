from .models import Report, User, License
from rest_framework import viewsets
from .serializers import ReportSerializer, userSerializer, LicenseSerializer
from django.conf import settings
from firebase_admin import credentials, auth
import firebase_admin
from rest_framework.permissions import IsAuthenticated, AllowAny

firebase_creds = credentials.Certificate(settings.FIREBASE_CONFIG)
firebase_app = firebase_admin.initialize_app(firebase_creds)


class ReportViewSet(viewsets.ModelViewSet):
    serializer_class = ReportSerializer
    queryset = Report.objects.all()
    permission_classes = [AllowAny]


class UserViewSet(viewsets.ModelViewSet):
    serializer_class = userSerializer
    queryset = User.objects.all()
    permission_classes = [AllowAny]


class licenseViewSet(viewsets.ModelViewSet):
    serializer_class = LicenseSerializer
    queryset = License.objects.all()
    permission_classes = [AllowAny]
