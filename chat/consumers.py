import json
from channels.generic.websocket import AsyncWebsocketConsumer

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_group_name = 'global_chat'  # define early to avoid attribute errors

        user = self.scope.get('user')
        if not user or user.is_anonymous:
            # Reject unauthenticated connections
            await self.close()
            return

        # Add this channel to the group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        # Remove this channel from the group (check if attribute exists)
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get('message')
        user = self.scope.get('user')

        # Broadcast message to the group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',  # maps to chat_message method below
                'message': message,
                'user': user.username if user else 'Anonymous'
            }
        )

    async def chat_message(self, event):
        # Send message data to WebSocket client
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'user': event['user'],
        }))
