from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from .models import License, UserLicense
from .serializers import LicenseSerializer, UserLicenseSerializer, LicenseActivationSerializer

class LicenseActivationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = LicenseActivationSerializer(data=request.data)
        if serializer.is_valid():
            try:
                license = License.objects.get(key=serializer.validated_data['license_key'])
                
                # Verificar si el usuario ya tiene una licencia activa
                if hasattr(request.user, 'user_license'):
                    return Response({
                        'error': 'User already has an active license'
                    }, status=status.HTTP_400_BAD_REQUEST)
                
                # Crear la licencia para el usuario
                user_license = UserLicense.objects.create(
                    user=request.user,
                    license=license
                )
                
                return Response({
                    'message': 'License activated successfully',
                    'license': UserLicenseSerializer(user_license).data
                })
                
            except License.DoesNotExist:
                return Response({
                    'error': 'Invalid license key'
                }, status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserLicenseDetail(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserLicenseSerializer

    def get_object(self):
        return UserLicense.objects.get(user=self.request.user)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_last_used(request):
    try:
        user_license = request.user.user_license
        user_license.last_used = timezone.now()
        user_license.save()
        return Response({'message': 'Last used timestamp updated successfully'})
    except UserLicense.DoesNotExist:
        return Response({'error': 'No active license found'}, status=status.HTTP_404_NOT_FOUND)
from django.shortcuts import render

# Create your views here.
