import logging
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger
from django_apscheduler.jobstores import DjangoJobStore
from django_apscheduler.models import DjangoJobExecution
from django.utils import timezone
from datetime import timedelta
from django.core.mail import send_mail
from .models import MatchFixture, ClubSubscriber

logger = logging.getLogger(__name__)

def send_fixture_reminders():
    now = timezone.now()
    upcoming = MatchFixture.objects.filter(
        date__range=(now + timedelta(minutes=30), now + timedelta(minutes=31))
    )
    for fixture in upcoming:
        subject = f"Upcoming Match: {fixture.team_a.name} vs {fixture.team_b.name}"
        message = f"""
Kickoff: {fixture.date.strftime('%Y-%m-%d %H:%M')}
Venue: {fixture.venue}
"""
        subscribers = ClubSubscriber.objects.filter(club__in=[fixture.team_a, fixture.team_b])
        for sub in subscribers:
            send_mail(subject, message, None, [sub.email])

def start():
    scheduler = BackgroundScheduler()
    scheduler.add_jobstore(DjangoJobStore(), "default")
    scheduler.add_job(
        send_fixture_reminders,
        trigger=IntervalTrigger(minutes=1),  # run every 1 minute
        id="fixture_reminder_job",
        replace_existing=True,
    )
    scheduler.start()
    logger.info("Scheduler started...")
