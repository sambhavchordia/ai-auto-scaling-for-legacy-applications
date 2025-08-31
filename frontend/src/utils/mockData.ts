import { 
  ChartData, 
  ChartDataPoint, 
  ScalingAction, 
  Alert, 
  DashboardMetrics 
} from '../types/api';

export const generateMockData = () => {
  const now = new Date();
  
  // Generate chart data for the last 24 hours
  const loadHistory: ChartDataPoint[] = [];
  const cpuHistory: ChartDataPoint[] = [];
  const memoryHistory: ChartDataPoint[] = [];
  const scalingHistory: ChartDataPoint[] = [];
  
  for (let i = 23; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
    const baseLoad = 30 + Math.sin(i / 24 * Math.PI) * 40; // Simulate daily pattern
    const baseCpu = 25 + Math.sin(i / 24 * Math.PI) * 35;
    const baseMemory = 40 + Math.sin(i / 24 * Math.PI) * 20;
    
    loadHistory.push({
      timestamp: timestamp.toISOString(),
      value: baseLoad + Math.random() * 20,
      label: `Load ${i}h ago`
    });
    
    cpuHistory.push({
      timestamp: timestamp.toISOString(),
      value: baseCpu + Math.random() * 15,
      label: `CPU ${i}h ago`
    });
    
    memoryHistory.push({
      timestamp: timestamp.toISOString(),
      value: baseMemory + Math.random() * 10,
      label: `Memory ${i}h ago`
    });
    
    scalingHistory.push({
      timestamp: timestamp.toISOString(),
      value: 2 + Math.floor(Math.random() * 8), // 2-10 instances
      label: `Instances ${i}h ago`
    });
  }

  const chartData: ChartData = {
    load_history: loadHistory,
    cpu_history: cpuHistory,
    memory_history: memoryHistory,
    scaling_history: scalingHistory
  };

  // Generate mock scaling actions
  const actions: ScalingAction[] = [
    {
      id: '1',
      timestamp: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
      action: 'scale_up',
      instances_before: 3,
      instances_after: 5,
      reason: 'High CPU usage detected',
      confidence: 0.87,
      status: 'completed'
    },
    {
      id: '2',
      timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      action: 'scale_down',
      instances_before: 6,
      instances_after: 4,
      reason: 'Low load conditions',
      confidence: 0.92,
      status: 'completed'
    },
    {
      id: '3',
      timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
      action: 'scale_up',
      instances_before: 2,
      instances_after: 4,
      reason: 'Predicted traffic spike',
      confidence: 0.78,
      status: 'completed'
    },
    {
      id: '4',
      timestamp: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
      action: 'maintain',
      instances_before: 3,
      instances_after: 3,
      reason: 'Stable load conditions',
      confidence: 0.95,
      status: 'completed'
    }
  ];

  // Generate mock alerts
  const alerts: Alert[] = [
    {
      id: '1',
      timestamp: new Date(now.getTime() - 15 * 60 * 1000).toISOString(),
      type: 'high_load',
      severity: 'high',
      message: 'CPU usage exceeded 85% threshold',
      resolved: false
    },
    {
      id: '2',
      timestamp: new Date(now.getTime() - 45 * 60 * 1000).toISOString(),
      type: 'anomaly',
      severity: 'medium',
      message: 'Unusual network activity detected',
      resolved: true
    },
    {
      id: '3',
      timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      type: 'scaling_failure',
      severity: 'low',
      message: 'Scale-down operation took longer than expected',
      resolved: true
    }
  ];

  // Generate mock configs
  const configs = {
    scaling: {
      min_instances: 2,
      max_instances: 20,
      scale_up_threshold: 0.8,
      scale_down_threshold: 0.3,
      cooldown_period: 300
    },
    monitoring: {
      metrics_interval: 30,
      anomaly_threshold: 0.95,
      alert_channels: ['email', 'slack']
    },
    models: {
      primary_model: 'prophet_rf_ensemble',
      secondary_model: 'isolation_forest',
      retrain_interval: 86400
    }
  };

  return {
    chartData,
    actions,
    alerts,
    configs
  };
};