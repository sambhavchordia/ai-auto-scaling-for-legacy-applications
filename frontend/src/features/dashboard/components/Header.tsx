import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Activity, 
  Server, 
  TrendingUp, 
  AlertTriangle,
  Play,
  Loader2,
  Wifi,
  WifiOff
} from 'lucide-react';
import { HealthResponse } from '@/types/api';

interface HeaderProps {
  healthStatus?: HealthResponse;
  onManualScaling?: () => void;
  isLoading?: boolean;
  wsConnected?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  healthStatus, 
  onManualScaling, 
  isLoading = false,
  wsConnected = false
}) => {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-500';
      case 'degraded':
        return 'bg-yellow-500';
      case 'unhealthy':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'healthy':
        return 'Healthy';
      case 'degraded':
        return 'Degraded';
      case 'unhealthy':
        return 'Unhealthy';
      default:
        return 'Unknown';
    }
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Server className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold">AI Auto-Scaling</h1>
                <p className="text-sm text-muted-foreground">Intelligent Infrastructure Management</p>
              </div>
            </div>
          </div>

          {/* Center - Status indicators */}
          <div className="flex items-center space-x-6">
            {/* System Health */}
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(healthStatus?.status)}`} />
              <span className="text-sm font-medium">
                {getStatusText(healthStatus?.status)}
              </span>
            </div>

            {/* Active Instances */}
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {healthStatus?.active_instances || 0} instances
              </span>
            </div>

            {/* Models Status */}
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <div className="flex space-x-1">
                {healthStatus?.models_loaded ? (
                  Object.entries(healthStatus.models_loaded).map(([model, loaded]) => (
                    <Badge 
                      key={model} 
                      variant={loaded ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {model}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="secondary" className="text-xs">No models</Badge>
                )}
              </div>
            </div>

            {/* WebSocket Status */}
            <div className="flex items-center space-x-2">
              {wsConnected ? (
                <Wifi className="h-4 w-4 text-green-500" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm">
                {wsConnected ? 'Live' : 'Offline'}
              </span>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-4">
            {/* Manual Scaling Button */}
            <Button
              onClick={onManualScaling}
              disabled={isLoading}
              size="sm"
              className="flex items-center space-x-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              <span>Trigger Scaling</span>
            </Button>

            {/* Version */}
            <Badge variant="outline" className="text-xs">
              v{healthStatus?.version || '1.0.0'}
            </Badge>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="mt-4 grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">CPU Usage</p>
                  <p className="text-lg font-semibold">
                    {healthStatus?.active_instances ? '65%' : '--'}
                  </p>
                </div>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Memory</p>
                  <p className="text-lg font-semibold">
                    {healthStatus?.active_instances ? '78%' : '--'}
                  </p>
                </div>
                <Server className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Load</p>
                  <p className="text-lg font-semibold">
                    {healthStatus?.active_instances ? '2.4' : '--'}
                  </p>
                </div>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Alerts</p>
                  <p className="text-lg font-semibold">0</p>
                </div>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </header>
  );
};


