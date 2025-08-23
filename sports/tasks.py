# app_name/tasks.py

from celery import shared_task
from django.utils import timezone
from django.core.mail import send_mail
from datetime import timedelta
from .models import MatchFixture, ClubSubscriber

@shared_task
def send_fixture_reminders():
    now = timezone.now()
    upcoming = MatchFixture.objects.filter(date__range=(now + timedelta(minutes=30), now + timedelta(minutes=31)))
    for fixture in upcoming:
        subject = f"Upcoming Match: {fixture.team_a.name} vs {fixture.team_b.name}"
        message = f"""
Kickoff: {fixture.date.strftime('%Y-%m-%d %H:%M')}
Venue: {fixture.venue}
"""
        subscribers = ClubSubscriber.objects.filter(club__in=[fixture.team_a, fixture.team_b])
        for sub in subscribers:
            send_mail(subject, message, None, [sub.email])
