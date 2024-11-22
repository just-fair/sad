from channels.generic.websocket import AsyncWebsocketConsumer
import json

class LocationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        self.group_name = "drivers_location"
        await self.channel_layer.group_add(self.group_name, self.channel_name)

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        latitude = data["latitude"]
        longitude = data["longitude"]
        driver_id = data["driver_id"]

        # Broadcast location to all admins
        await self.channel_layer.group_send(
            self.group_name,
            {
                "type": "broadcast_location",
                "latitude": latitude,
                "longitude": longitude,
                "driver_id": driver_id,
            }
        )

    async def broadcast_location(self, event):
        await self.send(text_data=json.dumps(event))
