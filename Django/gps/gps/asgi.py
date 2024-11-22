"""
ASGI config for gps project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from gps.consumers import LocationConsumer
from django.urls import path

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'gps.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),  # Default HTTP handling
    "websocket": AuthMiddlewareStack(  # WebSocket handling
        URLRouter([
            path("ws/locations/", LocationConsumer.as_asgi()),  # Your WebSocket route
        ])
    ),
})
