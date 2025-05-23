from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import SubscriptionPlan, Subscription
from .serializers import SubscriptionPlanSerializer, SubscriptionSerializer

class SubscriptionPlanListView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        plans = SubscriptionPlan.objects.all()
        serializer = SubscriptionPlanSerializer(plans, many=True)
        return Response(serializer.data)

class UserSubscriptionView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            # Get the latest subscription for the user
            subscription = Subscription.objects.filter(user=request.user).order_by('-end_date').first()
            
            if subscription:
                serializer = SubscriptionSerializer(subscription)
                return Response(serializer.data)
            else:
                return Response({"message": "No tienes suscripciones activas"}, status=status.HTTP_404_NOT_FOUND)
                
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
