"""
WebSocket Manager for Real-time Scaling Notifications

Handles WebSocket connections and broadcasts scaling events to connected clients.
"""

import asyncio
import json
import logging
from typing import Dict, List, Set
from fastapi import WebSocket, WebSocketDisconnect
from datetime import datetime

logger = logging.getLogger(__name__)

class ConnectionManager:
    """Manages WebSocket connections and broadcasts messages to clients."""
    
    def __init__(self):
        self.active_connections: Set[WebSocket] = set()
        self.connection_metadata: Dict[WebSocket, Dict] = {}
    
    async def connect(self, websocket: WebSocket, client_id: str = None):
        """Accept a new WebSocket connection."""
        await websocket.accept()
        self.active_connections.add(websocket)
        self.connection_metadata[websocket] = {
            'client_id': client_id or f"client_{len(self.active_connections)}",
            'connected_at': datetime.now().isoformat(),
            'last_activity': datetime.now().isoformat()
        }
        logger.info(f"WebSocket client connected: {self.connection_metadata[websocket]['client_id']}")
        
        # Send welcome message
        await self.send_personal_message({
            'type': 'connection_established',
            'client_id': self.connection_metadata[websocket]['client_id'],
            'timestamp': datetime.now().isoformat(),
            'message': 'Connected to AI Auto-Scaling System'
        }, websocket)
    
    def disconnect(self, websocket: WebSocket):
        """Remove a WebSocket connection."""
        if websocket in self.active_connections:
            client_id = self.connection_metadata.get(websocket, {}).get('client_id', 'unknown')
            self.active_connections.remove(websocket)
            if websocket in self.connection_metadata:
                del self.connection_metadata[websocket]
            logger.info(f"WebSocket client disconnected: {client_id}")
    
    async def send_personal_message(self, message: dict, websocket: WebSocket):
        """Send a message to a specific WebSocket client."""
        try:
            await websocket.send_text(json.dumps(message))
            if websocket in self.connection_metadata:
                self.connection_metadata[websocket]['last_activity'] = datetime.now().isoformat()
        except Exception as e:
            logger.error(f"Error sending personal message: {e}")
            self.disconnect(websocket)
    
    async def broadcast(self, message: dict):
        """Broadcast a message to all connected WebSocket clients."""
        if not self.active_connections:
            return
        
        disconnected = set()
        for websocket in self.active_connections:
            try:
                await websocket.send_text(json.dumps(message))
                if websocket in self.connection_metadata:
                    self.connection_metadata[websocket]['last_activity'] = datetime.now().isoformat()
            except Exception as e:
                logger.error(f"Error broadcasting message: {e}")
                disconnected.add(websocket)
        
        # Clean up disconnected clients
        for websocket in disconnected:
            self.disconnect(websocket)
    
    async def broadcast_scaling_event(self, event_type: str, data: dict):
        """Broadcast a scaling event to all connected clients."""
        message = {
            'type': 'scaling_event',
            'event_type': event_type,
            'data': data,
            'timestamp': datetime.now().isoformat()
        }
        await self.broadcast(message)
        logger.info(f"Broadcasted scaling event: {event_type}")
    
    async def broadcast_system_metrics(self, metrics: dict):
        """Broadcast system metrics to all connected clients."""
        message = {
            'type': 'system_metrics',
            'data': metrics,
            'timestamp': datetime.now().isoformat()
        }
        await self.broadcast(message)
    
    async def broadcast_alert(self, alert: dict):
        """Broadcast an alert to all connected clients."""
        message = {
            'type': 'alert',
            'data': alert,
            'timestamp': datetime.now().isoformat()
        }
        await self.broadcast(message)
        logger.info(f"Broadcasted alert: {alert.get('type', 'unknown')}")
    
    def get_connection_count(self) -> int:
        """Get the number of active connections."""
        return len(self.active_connections)
    
    def get_connection_info(self) -> List[Dict]:
        """Get information about all active connections."""
        return [
            {
                'client_id': metadata['client_id'],
                'connected_at': metadata['connected_at'],
                'last_activity': metadata['last_activity']
            }
            for metadata in self.connection_metadata.values()
        ]

# Global connection manager instance
manager = ConnectionManager()

async def websocket_endpoint(websocket: WebSocket, client_id: str = None):
    """WebSocket endpoint for client connections."""
    await manager.connect(websocket, client_id)
    try:
        while True:
            # Keep connection alive and handle incoming messages
            data = await websocket.receive_text()
            try:
                message = json.loads(data)
                logger.info(f"Received message from {manager.connection_metadata[websocket]['client_id']}: {message}")
                
                # Handle different message types
                if message.get('type') == 'ping':
                    await manager.send_personal_message({
                        'type': 'pong',
                        'timestamp': datetime.now().isoformat()
                    }, websocket)
                elif message.get('type') == 'subscribe':
                    # Handle subscription to specific events
                    await manager.send_personal_message({
                        'type': 'subscription_confirmed',
                        'events': message.get('events', []),
                        'timestamp': datetime.now().isoformat()
                    }, websocket)
                
            except json.JSONDecodeError:
                logger.warning(f"Received invalid JSON from client")
                await manager.send_personal_message({
                    'type': 'error',
                    'message': 'Invalid JSON format',
                    'timestamp': datetime.now().isoformat()
                }, websocket)
                
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        manager.disconnect(websocket)

# Event broadcasting functions
async def broadcast_scaling_decision(decision: dict):
    """Broadcast a scaling decision event."""
    await manager.broadcast_scaling_event('scaling_decision', decision)

async def broadcast_scaling_execution(execution: dict):
    """Broadcast a scaling execution event."""
    await manager.broadcast_scaling_event('scaling_execution', execution)

async def broadcast_anomaly_detection(anomaly: dict):
    """Broadcast an anomaly detection event."""
    await manager.broadcast_scaling_event('anomaly_detection', anomaly)

async def broadcast_forecast_update(forecast: dict):
    """Broadcast a forecast update event."""
    await manager.broadcast_scaling_event('forecast_update', forecast)

async def broadcast_health_status(status: dict):
    """Broadcast a health status update."""
    await manager.broadcast_scaling_event('health_status', status)
