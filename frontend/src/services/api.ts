import { API_BASE_URL } from '@/config';
import { 
  SystemMetrics, 
  ScalingDecision, 
  ForecastResponse,
  HealthResponse 
} from '@/types/api';

/**
 * A helper function to handle fetch responses and errors.
 * @param response The fetch Response object.
 * @returns The JSON response.
 * @throws An error if the response is not ok.
 */
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'API request failed');
  }
  return response.json();
};

/**
 * Fetches health status from the API.
 * @returns A promise that resolves to the health response.
 */
export const getHealthStatus = async (): Promise<HealthResponse> => {
  const response = await fetch(`${API_BASE_URL}/health`);
  return handleResponse<HealthResponse>(response);
};

/**
 * Fetches load forecast from the API.
 * @param metrics The system metrics for forecasting
 * @param hours Number of hours to forecast
 * @returns A promise that resolves to the forecast response.
 */
export const getForecast = async (metrics: SystemMetrics, hours: number = 2): Promise<ForecastResponse> => {
  const response = await fetch(`${API_BASE_URL}/predictions/forecast`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ metrics, forecast_hours: hours }),
  });
  return handleResponse<ForecastResponse>(response);
};

/**
 * Detects anomalies in system metrics.
 * @param metrics The system metrics to analyze
 * @returns A promise that resolves to the anomaly detection response.
 */
export const detectAnomaly = async (metrics: SystemMetrics) => {
  const response = await fetch(`${API_BASE_URL}/predictions/anomaly`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(metrics),
  });
  return handleResponse(response);
};

/**
 * Gets scaling decision based on system metrics.
 * @param metrics The system metrics for decision making
 * @returns A promise that resolves to the scaling decision.
 */
export const getScalingDecision = async (metrics: SystemMetrics): Promise<ScalingDecision> => {
  const response = await fetch(`${API_BASE_URL}/scaling/decide`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(metrics),
  });
  return handleResponse<ScalingDecision>(response);
};

/**
 * Executes a scaling decision.
 * @param decision The scaling decision to execute
 * @returns A promise that resolves to the execution result.
 */
export const executeScaling = async (decision: ScalingDecision) => {
  const response = await fetch(`${API_BASE_URL}/scaling/execute`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(decision),
  });
  return handleResponse(response);
};

/**
 * Gets current scaling status.
 * @returns A promise that resolves to the scaling status.
 */
export const getScalingStatus = async () => {
  const response = await fetch(`${API_BASE_URL}/scaling/status`);
  return handleResponse(response);
};

/**
 * Fetches system metrics (mock data for now).
 * @returns A promise that resolves to system metrics.
 */
export const getSystemMetrics = async (): Promise<SystemMetrics> => {
  // For now, return mock data. In production, this would call a real metrics endpoint
  return {
    timestamp: new Date().toISOString(),
    load_1m: Math.random() * 100,
    load_5m: Math.random() * 100,
    load_15m: Math.random() * 100,
    cpu_user: Math.random() * 100,
    cpu_system: Math.random() * 20,
    cpu_iowait: Math.random() * 10,
    sys_mem_available: Math.random() * 8192000,
    sys_mem_total: 8192000,
    disk_io_time: Math.random() * 100,
    disk_io_read: Math.random() * 1000000,
    disk_io_write: Math.random() * 500000,
    requests_per_ip: Math.random() * 50,
    source_variety: Math.random() * 20
  };
};
