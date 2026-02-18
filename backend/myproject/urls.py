from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    CustomTokenObtainPairView, 
    ResourceViewSet, 
    BookingViewSet, 
    AuditLogViewSet, 
    NotificationViewSet,
    UserViewSet,
    MeetingScheduleViewSet
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'resources', ResourceViewSet)
router.register(r'bookings', BookingViewSet)
router.register(r'meetings', MeetingScheduleViewSet)
router.register(r'audit', AuditLogViewSet)
router.register(r'notifications', NotificationViewSet, basename='notification')

from django.http import JsonResponse

def logout_view(request):
    return JsonResponse({"message": "Successfully logged out"})

urlpatterns = [
    path('', include(router.urls)),
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/logout/', logout_view, name='logout'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
