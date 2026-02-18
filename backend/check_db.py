import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings')
django.setup()

from django.contrib.auth import get_user_model
from myproject.models import Resource, Booking, MeetingSchedule, Notification, AuditLog

User = get_user_model()

print(f"Users: {User.objects.count()}")
print(f"Resources: {Resource.objects.count()}")
print(f"Bookings: {Booking.objects.count()}")
print(f"Meetings: {MeetingSchedule.objects.count()}")
print(f"Notifications: {Notification.objects.count()}")
print(f"AuditLogs: {AuditLog.objects.count()}")
