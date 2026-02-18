from rest_framework import serializers
from .models import User, Resource, Booking, AuditLog, Notification, MeetingSchedule

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'phone', 'role', 'status', 'created_at']
        read_only_fields = ['id', 'created_at']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    name = serializers.CharField(write_only=True, required=False) # Frontend sends 'name'
    confirmPassword = serializers.CharField(write_only=True, required=False) # Ignore confirmPassword
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'phone', 'role', 'name', 'confirmPassword']
        extra_kwargs = {'username': {'required': False}} # We'll set it from name
    
    def create(self, validated_data):
        # Remove confirmPassword if present to avoid passing it to create_user
        validated_data.pop('confirmPassword', None)
        
        # Default status for new users is ACTIVE based on requirements
        role = validated_data.get('role', 'STUDENT')
        is_staff = (role == 'ADMIN')
        
        # Use 'email' as 'username' to ensure uniqueness (AbstractUser needs a unique username field)
        username = validated_data.get('email')
        
        user = User.objects.create_user(
            username=username,
            email=validated_data['email'],
            password=validated_data['password'],
            phone=validated_data.get('phone', ''),
            first_name=validated_data.get('name', ''), # Save display name to first_name
            role=role,
            is_staff=is_staff
        )
        return user

class ResourceSerializer(serializers.ModelSerializer):
    lab_in_charge_name = serializers.ReadOnlyField(source='lab_in_charge.username')
    assigned_staff_name = serializers.ReadOnlyField(source='assigned_staff.username')
    
    class Meta:
        model = Resource
        fields = ['id', 'name', 'type', 'capacity', 'status', 'lab_in_charge', 'lab_in_charge_name', 'assigned_staff', 'assigned_staff_name']

class BookingSerializer(serializers.ModelSerializer):
    user_name = serializers.ReadOnlyField(source='user.username')
    resource_name = serializers.ReadOnlyField(source='resource.name')
    
    class Meta:
        model = Booking
        fields = [
            'id', 'user', 'user_name', 'resource', 'resource_name', 
            'booking_date', 'start_time', 'end_time', 
            'booking_type', 'justification', 'remarks', 
            'priority_level', 'status', 'created_at'
        ]
        read_only_fields = ['id', 'user', 'priority_level', 'status', 'created_at']

class MeetingScheduleSerializer(serializers.ModelSerializer):
    organizer_name = serializers.ReadOnlyField(source='organizer.username')
    location_name = serializers.ReadOnlyField(source='location.name')
    participant_names = serializers.StringRelatedField(source='participants', many=True, read_only=True)

    class Meta:
        model = MeetingSchedule
        fields = [
            'id', 'title', 'description', 'organizer', 'organizer_name',
            'participants', 'participant_names', 'date', 'start_time', 
            'end_time', 'location', 'location_name', 'created_at'
        ]
        read_only_fields = ['id', 'organizer', 'created_at']

class AuditLogSerializer(serializers.ModelSerializer):
    user_name = serializers.ReadOnlyField(source='user.username')
    
    class Meta:
        model = AuditLog
        fields = ['id', 'user_name', 'action', 'details', 'timestamp', 'ip_address']

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'message', 'is_read', 'created_at']
