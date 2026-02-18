import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings')
django.setup()

from myproject.models import User, Resource, Booking
from django.utils import timezone
from datetime import time, date

def seed():
    print("Seeding database for CampusCore...")

    # Create Superuser/Admin (HOD) if not exists
    admin, created = User.objects.get_or_create(
        email="hod@campus.edu",
        defaults={
            "username": "Dr. Arun (HOD)",
            "role": "ADMIN",
            "is_staff": True,
            "is_superuser": True,
        }
    )
    if created:
        admin.set_password("Admin@123")
        admin.save()
        print("Created Admin: hod@campus.edu / Admin@123")
    else:
        print("Admin already exists.")

    # Create a Staff member
    staff, created = User.objects.get_or_create(
        email="prof.radha@campus.edu",
        defaults={
            "username": "Prof. Radha",
            "role": "STAFF",
        }
    )
    if created:
        staff.set_password("Staff@123")
        staff.save()
        print("Created Staff: prof.radha@campus.edu / Staff@123")

    # Create a Lab In-Charge
    incharge, created = User.objects.get_or_create(
        email="incharge.kumar@campus.edu",
        defaults={
            "username": "Mr. Kumar",
            "role": "LAB_INCHARGE",
        }
    )
    if created:
        incharge.set_password("Kumar@123")
        incharge.save()
        print("Created Lab In-Charge: incharge.kumar@campus.edu / Kumar@123")

    # Create a Student
    student_email = "gokul@edu.in" # Match existing user if possible
    student, created = User.objects.update_or_create(
        email=student_email,
        defaults={
            "username": "Gokul Student", # Unique username
            "role": "STUDENT",
        }
    )
    if created:
        student.set_password("Gokul@123")
        student.save()
        print(f"Created Student: {student_email} / Gokul@123")
    else:
        print(f"Student {student_email} already exists.")

    # Create Resources
    resources_data = [
        {"name": "Advanced Physics Lab", "type": "LAB", "capacity": 30, "lab_in_charge": incharge},
        {"name": "Computing Center 01", "type": "LAB", "capacity": 60, "lab_in_charge": incharge},
        {"name": "Seminar Hall B", "type": "EVENT_HALL", "capacity": 150},
        {"name": "Main Conference Room", "type": "MEETING_ROOM", "capacity": 20, "assigned_staff": staff},
        {"name": "Smart Classroom 302", "type": "CLASSROOM", "capacity": 50},
    ]

    for data in resources_data:
        res, created = Resource.objects.get_or_create(
            name=data["name"],
            defaults={
                "type": data["type"],
                "capacity": data["capacity"],
                "status": "ACTIVE",
                "lab_in_charge": data.get("lab_in_charge"),
                "assigned_staff": data.get("assigned_staff"),
            }
        )
        if created:
            print(f"Created Resource: {res.name}")

    print("Seeding complete! App is ready for college use.")

if __name__ == "__main__":
    seed()
