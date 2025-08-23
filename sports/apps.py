from django.apps import AppConfig
import sys 

class SportsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'sports'

    
    def ready(self):
        import sports.signals
        
        if "runserver" in sys.argv or "shell" in sys.argv:
            from . import scheduler
            scheduler.start()