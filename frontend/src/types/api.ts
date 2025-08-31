// System metrics interface matching our backend SystemMetrics schema
export interface SystemMetrics {
  timestamp: string;
  load_1m: number;
  load_5m: number;
  load_15m: number;
  cpu_user: number;
  cpu_system: number;
  cpu_iowait: number;
  sys_mem_available: number;
  sys_mem_total: number;
  disk_io_time: number;
  disk_io_read: number;
  disk_io_write: number;
  requests_per_ip?: number;
  source_variety?: number;
  source_ip?: string;
}

// Scaling decision interface matching our backend ScalingDecision schema
export interface ScalingDecision {
  action: string;
  confidence: number;
  reason: string;
  source: string;
  scores: Record<string, number>;
  target_instances?: number;
  service_name?: string;
  timestamp: string;
}

// Forecast response interface matching our backend ForecastResponse schema
export interface ForecastResponse {
  forecast_hours: number;
  generated_at: string;
  forecast: Array<{
    timestamp: string;
    predicted_load: number;
    confidence: number;
    model_used: string;
  }>;
}

// Health response interface matching our backend HealthResponse schema
export interface HealthResponse {
  status: string;
  timestamp: string;
  models_loaded: Record<string, boolean>;
  active_instances: number;
  version: string;
}

// Anomaly detection response
export interface AnomalyResponse {
  timestamp: string;
  anomaly_detected: boolean;
  anomaly_score: number;
  model_used: string;
}

// Scaling status response
export interface ScalingStatusResponse {
  timestamp: string;
  active_instances: number;
  scaling_history: Array<{
    timestamp: string;
    action: string;
    reason: string;
    target_instances: number;
    confidence: number;
  }>;
  current_load: {
    cpu: number;
    memory: number;
  };
}

// Scaling execution response
export interface ScalingExecutionResponse {
  timestamp: string;
  action: string;
  success: boolean;
  message: string;
}

// Request interfaces for API calls
export interface ForecastRequest {
  metrics: SystemMetrics;
  forecast_hours: number;
}

// Dashboard data interfaces
export interface DashboardMetrics {
  current_load: number;
  cpu_usage: number;
  memory_usage: number;
  active_instances: number;
  response_time: number;
  error_rate: number;
}

export interface ScalingAction {
  id: string;
  timestamp: string;
  action: 'scale_up' | 'scale_down' | 'maintain';
  instances_before: number;
  instances_after: number;
  reason: string;
  confidence: number;
  status: 'pending' | 'completed' | 'failed';
}

export interface Alert {
  id: string;
  timestamp: string;
  type: 'high_load' | 'anomaly' | 'scaling_failure' | 'system_error';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  resolved: boolean;
}

export interface ChartDataPoint {
  timestamp: string;
  value: number;
  label?: string;
}

export interface ChartData {
  load_history: ChartDataPoint[];
  cpu_history: ChartDataPoint[];
  memory_history: ChartDataPoint[];
  scaling_history: ChartDataPoint[];
}
