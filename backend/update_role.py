import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings')
django.setup()

from myproject.models import User

try:
    user = User.objects.get(email="[EMAIL_ADDRESS]")
    user.role = 'ADMIN'
    user.save()
    print(f"Successfully updated {user.email} role to ADMIN.")
except User.DoesNotExist:
    print("User with email gokulsat73@gmail.com not found.")
except Exception as e:
    print(f"Error: {e}")
