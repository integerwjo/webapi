#!/bin/sh

echo "Running migrations..."
python manage.py makemigrations --noinput
python manage.py migrate --noinput

echo "Waiting for database to be ready..."
for i in $(seq 1 10); do
    python manage.py showmigrations && break
    echo "Retrying in 3s..."
    sleep 3
done

echo "Creating superuser..."
python webapi/create_superuser.py || echo "Failed to create superuser"

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Starting Daphne server..."
exec daphne -b 0.0.0.0 -p 8000 webapi.asgi:application


