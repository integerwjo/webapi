from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from chat.models import ChatMessage  # adjust to your app name

class Command(BaseCommand):
    help = "Delete chat messages older than 48 hours"

    def handle(self, *args, **kwargs):
        cutoff_time = timezone.now() - timedelta(hours=48)
        deleted_count, _ = ChatMessage.objects.filter(timestamp__lt=cutoff_time).delete()
        self.stdout.write(self.style.SUCCESS(f"Deleted {deleted_count} old messages"))
