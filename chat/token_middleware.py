from urllib.parse import parse_qs
from channels.middleware import BaseMiddleware
from django.contrib.auth.models import AnonymousUser
from django.db import close_old_connections
from rest_framework_simplejwt.authentication import JWTAuthentication
from asgiref.sync import sync_to_async

class TokenAuthMiddleware(BaseMiddleware):
    """
    Custom token auth middleware for Channels.
    Expects `?token=<access_token>` in websocket URL.
    """
    async def __call__(self, scope, receive, send):
        # Close old DB connections to prevent usage of timed out connections
        close_old_connections()

        query_string = scope.get('query_string', b'').decode()
        qs = parse_qs(query_string)
        token = qs.get('token')
        if token:
            raw_token = token[0]
            jwt_auth = JWTAuthentication()
            try:
                validated_token = jwt_auth.get_validated_token(raw_token)
                user = await sync_to_async(jwt_auth.get_user)(validated_token)
                scope['user'] = user
            except Exception:
                scope['user'] = AnonymousUser()
        else:
            scope['user'] = AnonymousUser()

        return await super().__call__(scope, receive, send)
