import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  History, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { ScalingStatusResponse } from '@/types/api';

interface ActionLogProps {
  actions: ScalingStatusResponse['scaling_history'];
  isLoading?: boolean;
}

export const ActionLog: React.FC<ActionLogProps> = ({ actions, isLoading = false }) => {
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'scale_up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'scale_down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'maintain':
        return <Minus className="h-4 w-4 text-gray-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'scale_up':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'scale_down':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'maintain':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'scale_up':
        return 'Scale Up';
      case 'scale_down':
        return 'Scale Down';
      case 'maintain':
        return 'Maintain';
      default:
        return action;
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

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <History className="h-5 w-5" />
            <span>Scaling Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">Loading actions...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <History className="h-5 w-5" />
            <span>Scaling Actions</span>
          </div>
          <Badge variant="outline" className="text-xs">
            {actions?.length || 0} actions
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!actions || actions.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-muted-foreground">No scaling actions yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Actions will appear here when scaling decisions are made
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {actions.map((action, index) => (
                <div 
                  key={index}
                  className={`flex items-start space-x-3 p-3 rounded-lg border ${getActionColor(action.action)}`}
                >
                  <div className="flex-shrink-0 mt-1">
                    {getActionIcon(action.action)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">
                          {getActionLabel(action.action)}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {action.target_instances} instances
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{formatTime(action.timestamp)}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {action.reason}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">Confidence:</span>
                        <div className="flex items-center space-x-1">
                          {action.confidence >= 0.9 ? (
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          ) : action.confidence >= 0.7 ? (
                            <AlertTriangle className="h-3 w-3 text-yellow-600" />
                          ) : (
                            <XCircle className="h-3 w-3 text-red-600" />
                          )}
                          <span className="text-xs font-medium">
                            {(action.confidence * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-xs">
                        <span className="text-muted-foreground">Instances:</span>
                        <span className="font-mono">
                          {action.target_instances}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
        
        {actions && actions.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Showing last {actions.length} actions</span>
              <Button variant="ghost" size="sm" className="h-6 px-2">
                View All
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};


