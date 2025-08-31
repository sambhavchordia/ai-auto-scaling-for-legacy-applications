import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { 
  Cpu, 
  MemoryStick, 
  Users, 
  Clock,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import type { Metric } from '../../types/dashboard';

interface MetricsGridProps {
  metrics: Metric[];
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ metrics }) => {
  const getIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'cpu usage':
        return <Cpu className="h-5 w-5" />;
      case 'memory usage':
        return <MemoryStick className="h-5 w-5" />;
      case 'active users':
        return <Users className="h-5 w-5" />;
      case 'response time':
        return <Clock className="h-5 w-5" />;
      default:
        return <TrendingUp className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'danger':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-success';
      case 'warning':
        return 'bg-warning';
      case 'danger':
        return 'bg-destructive';
      default:
        return 'bg-primary';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => (
        <Card key={metric.id} className="gradient-card border-border/50 shadow-card hover:shadow-elegant transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {metric.name}
            </CardTitle>
            <div className={getStatusColor(metric.status)}>
              {getIcon(metric.name)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-foreground">
                  {metric.value.toFixed(1)}
                </span>
                <span className="text-sm text-muted-foreground">
                  {metric.unit}
                </span>
              </div>
              
              {/* Progress bar for percentage metrics */}
              {metric.unit === '%' && (
                <div className="space-y-1">
                  <Progress 
                    value={metric.value} 
                    className="h-2"
                  />
                </div>
              )}
              
              {/* Change indicator */}
              <div className="flex items-center space-x-2">
                {metric.change > 0 ? (
                  <TrendingUp className="h-3 w-3 text-success" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-destructive" />
                )}
                <span className={`text-xs font-medium ${
                  metric.change > 0 ? 'text-success' : 'text-destructive'
                }`}>
                  {Math.abs(metric.change).toFixed(1)}{metric.unit === '%' ? '%' : ''}
                </span>
                <span className="text-xs text-muted-foreground">
                  vs last hour
                </span>
              </div>

              {/* Status badge */}
              <Badge 
                variant={metric.status === 'success' ? 'default' : 'destructive'}
                className={`text-xs ${
                  metric.status === 'success' 
                    ? 'bg-success/10 text-success border-success/20' 
                    : metric.status === 'warning'
                    ? 'bg-warning/10 text-warning border-warning/20'
                    : 'bg-destructive/10 text-destructive border-destructive/20'
                }`}
              >
                {metric.status.charAt(0).toUpperCase() + metric.status.slice(1)}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};