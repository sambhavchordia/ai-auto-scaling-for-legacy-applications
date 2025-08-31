import { useEffect, useRef, useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface WebSocketMessage {
  type: string;
  event_type?: string;
  data?: any;
  timestamp: string;
  message?: string;
}

interface UseWebSocketOptions {
  url?: string;
  enabled?: boolean;
  onMessage?: (message: WebSocketMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
}

export const useWebSocket = (options: UseWebSocketOptions = {}) => {
  const {
    url = 'ws://localhost:8000/ws',
    enabled = true,
    onMessage,
    onConnect,
    onDisconnect,
    onError
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const queryClient = useQueryClient();

  const connect = useCallback(() => {
    if (!enabled || wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setError(null);
        reconnectAttempts.current = 0;
        onConnect?.();
        
        // Send initial subscription message
        ws.send(JSON.stringify({
          type: 'subscribe',
          events: ['scaling_event', 'system_metrics', 'alert', 'health_status']
        }));
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          setLastMessage(message);
          onMessage?.(message);

          // Handle different message types
          switch (message.type) {
            case 'scaling_event':
              handleScalingEvent(message);
              break;
            case 'system_metrics':
              handleSystemMetrics(message);
              break;
            case 'alert':
              handleAlert(message);
              break;
            case 'health_status':
              handleHealthStatus(message);
              break;
            case 'connection_established':
              console.log('WebSocket connected:', message.message);
              break;
            case 'pong':
              // Handle ping-pong for connection health
              break;
            default:
              console.log('Unknown WebSocket message type:', message.type);
          }
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      };

      ws.onclose = (event) => {
        setIsConnected(false);
        onDisconnect?.();
        
        // Attempt to reconnect if not a clean close
        if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttempts.current++;
            connect();
          }, delay);
        }
      };

      ws.onerror = (event) => {
        setError('WebSocket connection error');
        onError?.(event);
      };

    } catch (err) {
      setError('Failed to create WebSocket connection');
      console.error('WebSocket connection error:', err);
    }
  }, [url, enabled, onMessage, onConnect, onDisconnect, onError]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (wsRef.current) {
      wsRef.current.close(1000, 'Manual disconnect');
      wsRef.current = null;
    }
    
    setIsConnected(false);
  }, []);

  const sendMessage = useCallback((message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  }, []);

  const ping = useCallback(() => {
    sendMessage({ type: 'ping' });
  }, [sendMessage]);

  // Handle scaling events
  const handleScalingEvent = (message: WebSocketMessage) => {
    const { event_type, data } = message;
    
    // Invalidate relevant queries to trigger refetch
    switch (event_type) {
      case 'scaling_decision':
        queryClient.invalidateQueries({ queryKey: ['scalingDecision'] });
        queryClient.invalidateQueries({ queryKey: ['scalingStatus'] });
        break;
      case 'scaling_execution':
        queryClient.invalidateQueries({ queryKey: ['scalingStatus'] });
        queryClient.invalidateQueries({ queryKey: ['systemMetrics'] });
        break;
      case 'anomaly_detection':
        queryClient.invalidateQueries({ queryKey: ['anomalyDetection'] });
        break;
      case 'forecast_update':
        queryClient.invalidateQueries({ queryKey: ['forecast'] });
        break;
      case 'health_status':
        queryClient.invalidateQueries({ queryKey: ['healthStatus'] });
        break;
    }
  };

  // Handle system metrics updates
  const handleSystemMetrics = (message: WebSocketMessage) => {
    queryClient.invalidateQueries({ queryKey: ['systemMetrics'] });
  };

  // Handle alert updates
  const handleAlert = (message: WebSocketMessage) => {
    // You can add toast notifications here
    console.log('Alert received:', message.data);
  };

  // Handle health status updates
  const handleHealthStatus = (message: WebSocketMessage) => {
    queryClient.invalidateQueries({ queryKey: ['healthStatus'] });
  };

  // Connect on mount
  useEffect(() => {
    if (enabled) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [enabled, connect, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  // Auto-reconnect when enabled changes
  useEffect(() => {
    if (enabled && !isConnected) {
      connect();
    } else if (!enabled && isConnected) {
      disconnect();
    }
  }, [enabled, isConnected, connect, disconnect]);

  return {
    isConnected,
    lastMessage,
    error,
    sendMessage,
    ping,
    connect,
    disconnect
  };
};
