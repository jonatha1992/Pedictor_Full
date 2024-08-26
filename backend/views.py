from .models import Report, User, License
from rest_framework import viewsets
from .serializers import ReportSerializer, userSerializer, LicenseSerializer


class ReportViewSet(viewsets.ModelViewSet):
    serializer_class = ReportSerializer
    queryset = Report.objects.all()


class UserViewSet(viewsets.ModelViewSet):
    serializer_class = userSerializer
    queryset = User.objects.all()


class licenseViewSet(viewsets.ModelViewSet):
    serializer_class = LicenseSerializer
    queryset = License.objects.all()
