import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import ChatMessage

class ChatConsumer(AsyncWebsocketConsumer):

    @database_sync_to_async
    def save_message(self, user, message):
        return ChatMessage.objects.create(user=user, message=message)

    @database_sync_to_async
    def get_last_messages(self, limit=30):
        return list(
            ChatMessage.objects.order_by('-timestamp')[:limit]
            .values('user__username', 'message', 'timestamp')
        )

    async def connect(self):
        self.room_group_name = 'global_chat'
        user = self.scope.get('user')

        if not user or user.is_anonymous:
            await self.close()
            return

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

        # Send last messages when connecting
        last_messages = await self.get_last_messages()
        for msg in reversed(last_messages):  
            await self.send(text_data=json.dumps({
                'message': msg['message'],
                'user': msg['user__username'],
                'timestamp': str(msg['timestamp']),
            }))

    async def disconnect(self, close_code):
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get('message')
        user = self.scope.get('user')

        # Save the message
        await self.save_message(user, message)

        # Broadcast to the group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'user': user.username if user else 'Anonymous'
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'user': event['user'],
        }))
