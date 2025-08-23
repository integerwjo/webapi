# app_name/signals.py

from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from sports.models import MatchResult, ClubSubscriber

@receiver(post_save, sender=MatchResult)
def send_match_result_email(sender, instance, created, **kwargs):
    if created:  # only when a new result is added
        subject = f"Match Result: {instance.team_a.name} {instance.score_a} - {instance.score_b} {instance.team_b.name}"
        message = f"""
Final Score:
{instance.team_a.name} {instance.score_a} - {instance.score_b} {instance.team_b.name}
Venue: {instance.venue}
Date: {instance.date.strftime('%Y-%m-%d %H:%M')}
"""
        subscribers = ClubSubscriber.objects.filter(club__in=[instance.team_a, instance.team_b])
        for sub in subscribers:
            send_mail(subject, message, None, [sub.email])
