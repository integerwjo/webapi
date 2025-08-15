#!/bin/sh

python manage.py makemigrations --noinput
python manage.py migrate --noinput
python manage.py collectstatic --noinput

exec daphne -b 0.0.0.0 -p 8000 webapi.asgi:application
