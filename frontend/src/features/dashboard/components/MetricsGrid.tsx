import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Server, 
  HardDrive, 
  Network, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle
} from 'lucide-react';
import { SystemMetrics, ScalingStatusResponse } from '@/types/api';

interface MetricsGridProps {
  metrics: SystemMetrics;
  scalingStatus?: ScalingStatusResponse;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ metrics, scalingStatus }) => {
  const calculateMemoryUsage = () => {
    if (metrics.sys_mem_total === 0) return 0;
    return ((metrics.sys_mem_total - metrics.sys_mem_available) / metrics.sys_mem_total) * 100;
  };

  const getLoadSeverity = (load: number) => {
    if (load > 80) return 'critical';
    if (load > 60) return 'high';
    if (load > 40) return 'medium';
    return 'low';
  };

  const getCpuSeverity = (cpu: number) => {
    if (cpu > 90) return 'critical';
    if (cpu > 70) return 'high';
    if (cpu > 50) return 'medium';
    return 'low';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="h-4 w-4" />;
      case 'medium':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <TrendingDown className="h-4 w-4" />;
    }
  };

  const loadSeverity = getLoadSeverity(metrics.load_1m);
  const cpuSeverity = getCpuSeverity(metrics.cpu_user);
  const memoryUsage = calculateMemoryUsage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* System Load */}
      <Card className={`border ${getSeverityColor(loadSeverity)}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">System Load</CardTitle>
          {getSeverityIcon(loadSeverity)}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.load_1m.toFixed(2)}</div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <span>5m: {metrics.load_5m.toFixed(2)}</span>
            <span>15m: {metrics.load_15m.toFixed(2)}</span>
          </div>
          <Progress value={metrics.load_1m} className="mt-2" />
          <Badge variant="outline" className="mt-2 text-xs">
            {loadSeverity} severity
          </Badge>
        </CardContent>
      </Card>

      {/* CPU Usage */}
      <Card className={`border ${getSeverityColor(cpuSeverity)}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
          <Activity className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.cpu_user.toFixed(1)}%</div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <span>System: {metrics.cpu_system.toFixed(1)}%</span>
            <span>IO: {metrics.cpu_iowait.toFixed(1)}%</span>
          </div>
          <Progress value={metrics.cpu_user} className="mt-2" />
          <Badge variant="outline" className="mt-2 text-xs">
            {cpuSeverity} usage
          </Badge>
        </CardContent>
      </Card>

      {/* Memory Usage */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
          <Server className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{memoryUsage.toFixed(1)}%</div>
          <div className="text-xs text-muted-foreground">
            {(metrics.sys_mem_total / 1024 / 1024 / 1024).toFixed(1)} GB total
          </div>
          <Progress value={memoryUsage} className="mt-2" />
          <div className="text-xs text-muted-foreground mt-2">
            Available: {(metrics.sys_mem_available / 1024 / 1024 / 1024).toFixed(1)} GB
          </div>
        </CardContent>
      </Card>

      {/* Active Instances */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Instances</CardTitle>
          <TrendingUp className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {scalingStatus?.active_instances || 0}
          </div>
          <div className="text-xs text-muted-foreground">
            Last updated: {new Date(metrics.timestamp).toLocaleTimeString()}
          </div>
          {scalingStatus?.scaling_history && scalingStatus.scaling_history.length > 0 && (
            <div className="mt-2">
              <div className="text-xs text-muted-foreground">Recent actions:</div>
              <div className="text-xs">
                {scalingStatus.scaling_history.slice(-2).map((action, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{action.action}</span>
                    <span>{action.target_instances} instances</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Disk I/O */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Disk I/O</CardTitle>
          <HardDrive className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.disk_io_time.toFixed(1)}%</div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <span>Read: {(metrics.disk_io_read / 1024 / 1024).toFixed(1)} MB/s</span>
            <span>Write: {(metrics.disk_io_write / 1024 / 1024).toFixed(1)} MB/s</span>
          </div>
          <Progress value={metrics.disk_io_time} className="mt-2" />
        </CardContent>
      </Card>

      {/* Network Activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Network Activity</CardTitle>
          <Network className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {metrics.requests_per_ip ? metrics.requests_per_ip.toFixed(1) : '--'}
          </div>
          <div className="text-xs text-muted-foreground">
            Requests per IP
          </div>
          {metrics.source_variety && (
            <div className="text-xs text-muted-foreground mt-1">
              Source variety: {metrics.source_variety.toFixed(1)}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Scaling Status */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Scaling Status</CardTitle>
          <TrendingUp className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {scalingStatus?.current_load?.cpu ? `${(scalingStatus.current_load.cpu * 100).toFixed(1)}%` : '--'}
          </div>
          <div className="text-xs text-muted-foreground">
            Current load
          </div>
          {scalingStatus?.scaling_history && scalingStatus.scaling_history.length > 0 && (
            <div className="mt-2">
              <div className="text-xs text-muted-foreground">Last action:</div>
              <div className="text-xs font-medium">
                {scalingStatus.scaling_history[scalingStatus.scaling_history.length - 1]?.action}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* System Health */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">System Health</CardTitle>
          <Activity className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loadSeverity === 'low' && cpuSeverity === 'low' ? 'Good' : 'Warning'}
          </div>
          <div className="text-xs text-muted-foreground">
            Overall status
          </div>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-xs">
              <span>Load:</span>
              <Badge variant={loadSeverity === 'low' ? 'default' : 'destructive'} className="text-xs">
                {loadSeverity}
              </Badge>
            </div>
            <div className="flex justify-between text-xs">
              <span>CPU:</span>
              <Badge variant={cpuSeverity === 'low' ? 'default' : 'destructive'} className="text-xs">
                {cpuSeverity}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


