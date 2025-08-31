import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { 
  AlertTriangle, 
  Check, 
  X, 
  Eye,
  Shield,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { toast } from '../../hooks/use-toast';
import type { Alert } from '../../types/dashboard';

interface AlertsTableProps {
  alerts: Alert[];
}

export const AlertsTable: React.FC<AlertsTableProps> = ({ alerts }) => {
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null);
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState<Set<string>>(new Set());
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'high':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'medium':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'low':
        return 'bg-success/10 text-success border-success/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const handleAcknowledge = (alertId: string) => {
    setAcknowledgedAlerts(prev => new Set([...prev, alertId]));
    toast({
      title: "Alert Acknowledged",
      description: "The alert has been marked as acknowledged",
    });
  };

  const handleDismiss = (alertId: string) => {
    setDismissedAlerts(prev => new Set([...prev, alertId]));
    toast({
      title: "Alert Dismissed",
      description: "The alert has been dismissed and will no longer appear",
    });
  };

  const handleViewDetails = (alert: Alert) => {
    toast({
      title: `${alert.title} - Details`,
      description: alert.description,
      duration: 5000,
    });
  };

  const toggleExpanded = (alertId: string) => {
    setExpandedAlert(expandedAlert === alertId ? null : alertId);
  };

  return (
    <Card className="gradient-card border-border/50 shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground flex items-center">
          <Shield className="h-5 w-5 mr-2 text-primary" />
          Security Alerts
          <Badge variant="secondary" className="ml-auto">
            {alerts.filter(alert => !alert.acknowledged && !acknowledgedAlerts.has(alert.id) && !dismissedAlerts.has(alert.id)).length} active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-2">
            {alerts.filter(alert => !dismissedAlerts.has(alert.id)).map((alert) => {
              const isAcknowledged = alert.acknowledged || acknowledgedAlerts.has(alert.id);
              return (
              <div key={alert.id} className="space-y-2">
                <div 
                  className={`p-4 rounded-lg border transition-all duration-200 ${
                    isAcknowledged 
                      ? 'bg-muted/5 border-border/30 opacity-60' 
                      : 'bg-muted/10 border-border/50 hover:bg-muted/15'
                  }`}
                >
                  <div className="flex items-start justify-between space-x-4">
                    <div className="flex items-start space-x-3 flex-1 min-w-0">
                      <div className="flex-shrink-0 mt-0.5">
                        {getSeverityIcon(alert.severity)}
                      </div>
                      
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-medium text-foreground truncate">
                            {alert.title}
                          </h4>
                          <Badge 
                            variant="outline" 
                            className={`text-xs flex-shrink-0 ${getSeverityColor(alert.severity)}`}
                          >
                            {alert.severity}
                          </Badge>
                          {isAcknowledged && (
                            <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/20">
                              Acknowledged
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>
                            {format(new Date(alert.timestamp), 'MMM d, yyyy HH:mm')}
                          </span>
                          <span>
                            {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpanded(alert.id)}
                        className="h-6 w-6 p-0"
                      >
                        {expandedAlert === alert.id ? (
                          <ChevronDown className="h-3 w-3" />
                        ) : (
                          <ChevronRight className="h-3 w-3" />
                        )}
                      </Button>
                      
                      {!isAcknowledged && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAcknowledge(alert.id)}
                            className="h-6 w-6 p-0 hover:bg-success/20"
                          >
                            <Check className="h-3 w-3 text-success" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDismiss(alert.id)}
                            className="h-6 w-6 p-0 hover:bg-destructive/20"
                          >
                            <X className="h-3 w-3 text-destructive" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {expandedAlert === alert.id && (
                    <div className="mt-3 pt-3 border-t border-border/30">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {alert.description}
                      </p>
                      
                      <div className="mt-3 flex items-center space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewDetails(alert)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                        {!isAcknowledged && (
                          <Button 
                            size="sm" 
                            className="bg-success hover:bg-success/80"
                            onClick={() => handleAcknowledge(alert.id)}
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Acknowledge
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );})}
            
            {alerts.filter(alert => !dismissedAlerts.has(alert.id)).length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No alerts at this time</p>
                <p className="text-xs mt-1">All systems are secure</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};