import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  AlertTriangle, 
  Bell, 
  CheckCircle, 
  XCircle,
  Clock,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import { Alert, SystemMetrics } from '@/types/api';

interface AlertsTableProps {
  alerts: Alert[];
  systemMetrics: SystemMetrics;
}

export const AlertsTable: React.FC<AlertsTableProps> = ({ alerts, systemMetrics }) => {
  const [showResolved, setShowResolved] = React.useState(false);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'low':
        return <Bell className="h-4 w-4 text-blue-600" />;
      default:
        return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'high_load':
        return <AlertTriangle className="h-4 w-4" />;
      case 'anomaly':
        return <XCircle className="h-4 w-4" />;
      case 'scaling_failure':
        return <RefreshCw className="h-4 w-4" />;
      case 'system_error':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const filteredAlerts = showResolved 
    ? alerts 
    : alerts.filter(alert => !alert.resolved);

  const activeAlerts = alerts.filter(alert => !alert.resolved);
  const criticalAlerts = activeAlerts.filter(alert => alert.severity === 'critical');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>System Alerts</span>
            {criticalAlerts.length > 0 && (
              <Badge variant="destructive" className="text-xs">
                {criticalAlerts.length} critical
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {activeAlerts.length} active
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowResolved(!showResolved)}
              className="h-6 px-2"
            >
              {showResolved ? (
                <>
                  <EyeOff className="h-3 w-3 mr-1" />
                  Hide Resolved
                </>
              ) : (
                <>
                  <Eye className="h-3 w-3 mr-1" />
                  Show Resolved
                </>
              )}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <p className="text-muted-foreground">
              {showResolved ? 'No alerts found' : 'No active alerts'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              System is running smoothly
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {filteredAlerts.map((alert, index) => (
                <div 
                  key={alert.id}
                  className={`flex items-start space-x-3 p-3 rounded-lg border ${getSeverityColor(alert.severity)} ${alert.resolved ? 'opacity-60' : ''}`}
                >
                  <div className="flex-shrink-0 mt-1">
                    {getSeverityIcon(alert.severity)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">
                          {alert.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                        <Badge 
                          variant={alert.severity === 'critical' ? 'destructive' : 'outline'} 
                          className="text-xs"
                        >
                          {alert.severity}
                        </Badge>
                        {alert.resolved && (
                          <Badge variant="secondary" className="text-xs">
                            Resolved
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{formatTime(alert.timestamp)}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {alert.message}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(alert.type)}
                        <span className="text-xs text-muted-foreground">
                          {alert.type.replace('_', ' ')}
                        </span>
                      </div>
                      
                      {!alert.resolved && (
                        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                          Mark Resolved
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
        
        {/* System Status Summary */}
        <div className="mt-4 pt-4 border-t">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="text-center p-2 bg-green-50 rounded">
              <div className="font-medium text-green-600">
                {activeAlerts.length === 0 ? 'Healthy' : 'Issues Detected'}
              </div>
              <div className="text-green-500">
                {activeAlerts.length} active alerts
              </div>
            </div>
            <div className="text-center p-2 bg-blue-50 rounded">
              <div className="font-medium text-blue-600">
                System Status
              </div>
              <div className="text-blue-500">
                Load: {systemMetrics.load_1m.toFixed(1)}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


