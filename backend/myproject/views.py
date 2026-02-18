from rest_framework import viewsets, status, permissions, serializers
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.utils import timezone
from datetime import timedelta, datetime
from django.db import transaction
from django.db.models import Q
from .models import User, Resource, Booking, AuditLog, Notification, MeetingSchedule
from .serializers import (
    UserSerializer, ResourceSerializer, BookingSerializer, 
    AuditLogSerializer, NotificationSerializer, RegisterSerializer,
    MeetingScheduleSerializer
)

class IsAdminRole(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'ADMIN')

class IsAdminOrLabInCharge(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in ['ADMIN', 'LAB_INCHARGE'])

class IsStaffOrAbove(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in ['ADMIN', 'LAB_INCHARGE', 'STAFF'])

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action == 'signup':
            return [IsAdminRole()]
        if self.action == 'student_stats':
            return [permissions.IsAuthenticated()]
        if self.action == 'list':
            return [IsStaffOrAbove()]
        return [IsAdminRole()]

    def perform_destroy(self, instance):
        instance.status = 'INACTIVE'
        instance.save()
        AuditLog.objects.create(user=self.request.user, action="USER_DEACTIVATED", details=f"Deactivated user {instance.username}")

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def student_stats(self, request):
        from .models import Booking
        user = request.user
        upcoming = Booking.objects.filter(user=user, status='APPROVED', booking_date__gte=timezone.now().date()).count()
        pending = Booking.objects.filter(user=user, status='PENDING').count()
        completed = Booking.objects.filter(user=user, status='APPROVED', booking_date__lt=timezone.now().date()).count()
        
        return Response({
            "upcoming": upcoming,
            "pending": pending,
            "completed": completed
        })

    @action(detail=False, methods=['get'], permission_classes=[IsAdminRole])
    def dashboard_stats(self, request):
        from .models import Resource, Booking, AuditLog
        total_users = User.objects.count()
        active_bookings = Booking.objects.filter(status='APPROVED').count()
        pending_approvals = Booking.objects.filter(status='PENDING').count()
        total_resources = Resource.objects.count()
        
        return Response({
            "total_users": total_users,
            "active_bookings": active_bookings,
            "pending_approvals": pending_approvals,
            "total_resources": total_resources
        })

    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def signup(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            AuditLog.objects.create(user=user, action="USER_REGISTERED", details=f"New user {user.username} registered as {user.role}")
            return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
        
        errors = serializer.errors
        first_error_msg = "Signup failed"
        if errors:
            first_field = list(errors.keys())[0]
            first_error_msg = f"{first_field}: {errors[first_field][0]}"
            
        return Response({"message": first_error_msg, "errors": errors}, status=status.HTTP_400_BAD_REQUEST)

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        email = attrs.get('email') or attrs.get(User.USERNAME_FIELD)
        password = attrs.get('password')
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError({"message": "Invalid email or password"})

        if user.status == 'INACTIVE':
            raise serializers.ValidationError({"message": "Account is inactive"})

        if user.is_locked():
            raise serializers.ValidationError({"message": "Security Protocol: Account locked due to multiple failed attempts. Please try again in 3 minutes."})

        try:
            data = super().validate(attrs)
            from rest_framework_simplejwt.tokens import AccessToken
            
            token = AccessToken(data['access'])
            user.current_token_jti = token['jti']
            user.failed_login_attempts = 0
            user.last_failed_login_at = None
            user.account_locked_until = None
            user.save()
            
            AuditLog.objects.create(user=user, action="LOGIN_SUCCESS", details="User logged in session initiated.")
            
            return {
                'user': {
                    'id': user.id,
                    'name': user.first_name or user.username,
                    'email': user.email,
                    'role': user.role.upper()
                },
                'token': data['access'],
                'refresh': data['refresh']
            }
        except Exception as e:
            user.failed_login_attempts += 1
            user.last_failed_login_at = timezone.now()
            if user.failed_login_attempts >= 3:
                user.account_locked_until = timezone.now() + timedelta(minutes=3)
            user.save()
            raise e

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class ResourceViewSet(viewsets.ModelViewSet):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminOrLabInCharge()]
        return [permissions.IsAuthenticated()]

class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    queryset = Booking.objects.all()

    def get_queryset(self):
        user = self.request.user
        if user.role == 'ADMIN': # HOD Handles All
            return Booking.objects.all()
        elif user.role == 'LAB_INCHARGE':
            # Only Labs he manages + his own
            managed_labs = Resource.objects.filter(lab_in_charge=user)
            return Booking.objects.filter(Q(resource__in=managed_labs) | Q(user=user))
        elif user.role == 'STAFF':
            # Staff see their own + Meeting requests directed at them
            return Booking.objects.filter(Q(user=user) | Q(resource__assigned_staff=user, booking_type='MEETING'))
        else:
            return Booking.objects.filter(user=user)

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        user = request.user
        resource_id = request.data.get('resource')
        staff_id = request.data.get('staff_id') # New: Direct staff meeting request
        booking_date = request.data.get('booking_date')
        start_time = request.data.get('start_time')
        end_time = request.data.get('end_time')
        booking_type = request.data.get('booking_type', 'NORMAL')
        
        if user.status == 'INACTIVE':
            return Response({"error": "Inactive users cannot initiate requests"}, status=403)
            
        # Duration Validation
        if start_time and end_time:
            try:
                # Handle both HH:MM and HH:MM:SS
                start_dt = datetime.strptime(start_time[:5], '%H:%M')
                end_dt = datetime.strptime(end_time[:5], '%H:%M')
                duration = (end_dt - start_dt).total_seconds() / 3600
                
                # Special bookings bypass standard limits as they are for institutional events like symposiums
                if booking_type != 'SPECIAL':
                    if user.role == 'STUDENT' and duration > 1:
                        return Response({"error": "Students are restricted to 60-minute sessions per booking."}, status=400)
                    if user.role == 'STAFF' and duration > 4:
                        return Response({"error": "Staff sessions are limited to a maximum of 4 hours."}, status=400)
                
                if duration <= 0:
                    return Response({"error": "Invalid temporal range: End time must succeed start time."}, status=400)
            except ValueError:
                return Response({"error": "Invalid time format provided."}, status=400)

        # Handle Staff ID lookup for meetings
        if staff_id and not resource_id:
            try:
                staff_target = User.objects.get(employee_id=staff_id, role='STAFF')
                # Find a resource assigned to this staff or a general meeting room
                resource = Resource.objects.filter(assigned_staff=staff_target).first()
                if not resource:
                    resource = Resource.objects.filter(type='MEETING_ROOM').first()
                if not resource:
                    return Response({"error": "Target faculty has no assigned consultation space."}, status=400)
                resource_id = resource.id
                booking_type = 'MEETING'
            except User.DoesNotExist:
                return Response({"error": "Identified Staff ID not found in institutional records."}, status=404)

        try:
            resource = Resource.objects.get(id=resource_id)
        except:
            return Response({"error": "Resource not found"}, status=404)

        if resource.status != 'ACTIVE':
            return Response({"error": f"Resource status: {resource.status}"}, status=400)

        # Priority & Status Logic
        priority = 0
        if booking_type == 'SPECIAL': priority = 2
        elif user.role in ['STAFF', 'ADMIN']: priority = 1

        # Staff bookings are auto-approved for normal requests, but SPECIAL ones require oversight
        booking_status = 'PENDING'
        if user.role == 'STAFF' and booking_type not in ['MEETING', 'SPECIAL']:
            booking_status = 'APPROVED'
        elif user.role == 'ADMIN':
            booking_status = 'APPROVED'

        # Merge resource_id back into data if derived
        data = request.data.copy()
        data['resource'] = resource_id
        data['booking_type'] = booking_type

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        booking = serializer.save(user=user, priority_level=priority, status=booking_status)
        
        AuditLog.objects.create(user=user, action="REQUEST_CREATED", details=f"Request {booking.id} status: {booking_status}")
        
        # Notify Approver
        if booking_status == 'PENDING':
            notification_msg = f"New Request: {user.username} is requesting access to {resource.name} on {booking_date}."
            if resource.type == 'LAB' and resource.lab_in_charge:
                Notification.objects.create(user=resource.lab_in_charge, message=notification_msg)
            elif booking_type == 'MEETING' and resource.assigned_staff:
                Notification.objects.create(user=resource.assigned_staff, message=notification_msg)
            else:
                admins = User.objects.filter(role='ADMIN')
                for admin in admins:
                    Notification.objects.create(user=admin, message=notification_msg)
        else:
            Notification.objects.create(user=user, message=f"Booking for {resource.name} has been AUTO-APPROVED.")

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        booking = self.get_object()
        user = request.user
        
        if booking.status != 'PENDING':
            return Response({"error": "Already processed"}, status=400)
            
        # Hierarchy Rules
        can_approve = False
        if user.role == 'ADMIN': 
            can_approve = True
        elif user.role == 'LAB_INCHARGE' and booking.resource.type == 'LAB':
            if booking.resource.lab_in_charge == user: can_approve = True
        elif user.role == 'STAFF':
            # Staff can approve meetings directed at them OR their own bookings now
            if booking.booking_type == 'MEETING' and booking.resource.assigned_staff == user:
                can_approve = True
            elif booking.user == user: # Self-approval for staff authorized
                can_approve = True
        
        if not can_approve:
            return Response({"error": "Authorization failed"}, status=403)

        booking.status = 'APPROVED'
        booking.remarks = request.data.get('remarks', '')
        booking.save()
        
        Notification.objects.create(user=booking.user, message=f"Access to {booking.resource.name} has been GRANTED.")
        AuditLog.objects.create(user=user, action="REQUEST_APPROVED", details=f"Approved ID: {booking.id}")
        return Response({"status": "approved"})

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        booking = self.get_object()
        user = request.user
        reason = request.data.get('remarks')
        
        if not reason: return Response({"error": "Justification required"}, status=400)

        can_reject = False
        if user.role == 'ADMIN': can_reject = True
        elif user.role == 'LAB_INCHARGE' and booking.resource.type == 'LAB':
            if booking.resource.lab_in_charge == user: can_reject = True
        elif user.role == 'STAFF' and booking.booking_type == 'MEETING':
            if booking.resource.assigned_staff == user: can_reject = True

        if not can_reject: return Response({"error": "Auth failed"}, status=403)

        booking.status = 'REJECTED'
        booking.remarks = reason
        booking.save()
        
        Notification.objects.create(user=booking.user, message=f"Access to {booking.resource.name} DENIED: {reason}")
        return Response({"status": "rejected"})

    @action(detail=False, methods=['get'])
    def availability(self, request):
        resource_id = request.query_params.get('resource')
        date = request.query_params.get('date')
        if not resource_id or not date:
            return Response({"error": "Resource and date are required"}, status=400)
        
        # Consider both APPROVED and PENDING as occupied to prevent overlaps
        bookings = Booking.objects.filter(
            resource_id=resource_id,
            booking_date=date,
            status__in=['APPROVED', 'PENDING']
        ).values('start_time', 'end_time')
        
        return Response(list(bookings))

class MeetingScheduleViewSet(viewsets.ModelViewSet):
    serializer_class = MeetingScheduleSerializer
    queryset = MeetingSchedule.objects.all()

    def get_queryset(self):
        user = self.request.user
        # Users see meetings where they are participants or organizer
        return MeetingSchedule.objects.filter(Q(organizer=user) | Q(participants=user)).distinct()

    def perform_create(self, serializer):
        meeting = serializer.save(organizer=self.request.user)
        # Notify participants
        for participant in meeting.participants.all():
            Notification.objects.create(
                user=participant,
                message=f"New Meeting Scheduled: {meeting.title} on {meeting.date} at {meeting.start_time}"
            )

class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer
    permission_classes = [IsAdminRole]

class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        Notification.objects.filter(user=request.user).update(is_read=True)
        return Response({"status": "success"})
