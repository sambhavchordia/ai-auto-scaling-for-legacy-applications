import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Activity, CheckCircle, XCircle, Clock, Zap } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import type { ScalingAction } from '../../types/dashboard';

interface ActionLogProps {
  actions: ScalingAction[];
}

export const ActionLog: React.FC<ActionLogProps> = ({ actions }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'failure':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-warning animate-pulse" />;
      default:
        return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-success/10 text-success border-success/20';
      case 'failure':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  return (
    <Card className="gradient-card border-border/50 shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground flex items-center">
          <Zap className="h-5 w-5 mr-2 text-primary" />
          Scaling Actions Log
          <Badge variant="secondary" className="ml-auto">
            {actions.length} actions
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {actions.map((action) => (
              <div 
                key={action.id} 
                className="flex items-start space-x-4 p-4 bg-muted/5 rounded-lg border border-border/30 hover:bg-muted/10 transition-colors"
              >
                <div className="flex-shrink-0 mt-1">
                  {getStatusIcon(action.status)}
                </div>
                
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-foreground truncate">
                      {action.action}
                    </h4>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getStatusColor(action.status)}`}
                    >
                      {action.status}
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {action.details}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {format(new Date(action.timestamp), 'MMM d, yyyy HH:mm')}
                    </span>
                    <span>
                      {formatDistanceToNow(new Date(action.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            {actions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No scaling actions recorded yet</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};