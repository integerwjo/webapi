import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'webapi.settings')

import django
django.setup()  # ensure apps are loaded before importing middleware

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
import chat.routing
from chat.token_middleware import TokenAuthMiddleware


application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": TokenAuthMiddleware(
        URLRouter(
            chat.routing.websocket_urlpatterns
        )
    ),
})
