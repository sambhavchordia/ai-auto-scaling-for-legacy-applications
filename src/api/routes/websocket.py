"""
WebSocket Routes for Real-time Communication

Provides WebSocket endpoints for real-time scaling notifications and system updates.
"""

from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from typing import Optional
import logging

from ..websocket import websocket_endpoint, manager

logger = logging.getLogger(__name__)

router = APIRouter()

@router.websocket("/ws")
async def websocket_route(
    websocket: WebSocket,
    client_id: Optional[str] = Query(None, description="Optional client identifier")
):
    """
    WebSocket endpoint for real-time communication.
    
    Supports:
    - Real-time scaling notifications
    - System metrics updates
    - Alert broadcasts
    - Health status updates
    """
    await websocket_endpoint(websocket, client_id)

@router.get("/ws/connections")
async def get_connections():
    """Get information about active WebSocket connections."""
    return {
        "active_connections": manager.get_connection_count(),
        "connections": manager.get_connection_info()
    }
