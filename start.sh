#!/bin/sh

# Apply database migrations
echo "🔄 Running migrations..."
python manage.py makemigrations --noinput
python manage.py migrate --noinput

# Collect static files
echo "🧹 Collecting static files..."
python manage.py collectstatic --noinput

# Create admin user
echo "👤 Creating superuser..."
python webapi/create_superuser.py

# Start Daphne server
echo "🚀 Starting Daphne server..."
exec daphne -b 0.0.0.0 -p 8000 webapi.asgi:application

