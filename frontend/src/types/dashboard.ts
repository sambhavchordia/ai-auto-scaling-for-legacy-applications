export interface Metric {
  id: string;
  name: string;
  value: number;
  unit: string;
  change: number;
  status: 'success' | 'warning' | 'danger';
}

export interface ChartDataPoint {
  timestamp: string;
  cpu: number;
  memory: number;
  users: number;
}

export interface Prediction {
  metric: string;
  current: number;
  predicted: number;
  confidence: number;
  timeframe: string;
}

export interface Anomaly {
  id: string;
  metric: string;
  value: number;
  expected: number;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
}

export interface ScalingAction {
  id: string;
  action: string;
  timestamp: string;
  status: 'success' | 'failure' | 'pending';
  details: string;
}

export interface Alert {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  description: string;
  acknowledged: boolean;
}

export interface ConfigFile {
  id: string;
  name: string;
  type: 'docker' | 'kubernetes' | 'env';
  content: string;
  lastModified: string;
}

export interface DashboardData {
  metrics: Metric[];
  chartData: ChartDataPoint[];
  predictions: Prediction[];
  anomalies: Anomaly[];
  actions: ScalingAction[];
  alerts: Alert[];
  configs: ConfigFile[];
}