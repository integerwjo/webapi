# create_superuser.py

import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'webapi.settings')  # Update if your settings module is named differently
django.setup()

from django.contrib.auth import get_user_model

def create_superuser():
    User = get_user_model()
    username = os.getenv("DJANGO_SUPERUSER_USERNAME", "integer")
    email = os.getenv("DJANGO_SUPERUSER_EMAIL", "wanderaotieno321@gmail.com")
    password = os.getenv("DJANGO_SUPERUSER_PASSWORD", "wjo@2023")

    if not User.objects.filter(username=username).exists():
        print(f"🛠 Creating superuser '{username}'...")
        User.objects.create_superuser(username=username, email=email, password=password)
        print("✅ Superuser created.")
    else:
        print(f"✅ Superuser '{username}' already exists.")

if __name__ == "__main__":
    create_superuser()
