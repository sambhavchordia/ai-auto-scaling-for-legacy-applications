import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { 
  getHealthStatus, 
  getForecast, 
  detectAnomaly,
  getScalingDecision, 
  executeScaling,
  getScalingStatus,
  getSystemMetrics
} from '@/services/api';
import { 
  SystemMetrics, 
  ScalingDecision, 
  ForecastResponse, 
  HealthResponse,
  AnomalyResponse,
  ScalingStatusResponse,
  ScalingExecutionResponse
} from '@/types/api';

// Hook to fetch health status
export const useHealthStatus = (options?: Omit<UseQueryOptions<HealthResponse, Error>, 'queryKey' | 'queryFn'>) => {
  return useQuery<HealthResponse, Error>({
    queryKey: ['health'],
    queryFn: getHealthStatus,
    refetchInterval: 30000, // Refresh every 30 seconds
    ...options,
  });
};

// Hook to fetch forecast
export const useForecast = (
  metrics: SystemMetrics, 
  hours: number = 2,
  options?: Omit<UseQueryOptions<ForecastResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<ForecastResponse, Error>({
    queryKey: ['forecast', metrics, hours],
    queryFn: () => getForecast(metrics, hours),
    enabled: !!metrics,
    ...options,
  });
};

// Hook to detect anomalies
export const useAnomalyDetection = (
  options?: UseMutationOptions<AnomalyResponse, Error, SystemMetrics>
) => {
  return useMutation<AnomalyResponse, Error, SystemMetrics>({
    mutationFn: detectAnomaly,
    ...options,
  });
};

// Hook to get scaling decision
export const useScalingDecision = (
  options?: UseMutationOptions<ScalingDecision, Error, SystemMetrics>
) => {
  return useMutation<ScalingDecision, Error, SystemMetrics>({
    mutationFn: getScalingDecision,
    ...options,
  });
};

// Hook to execute scaling
export const useExecuteScaling = (
  options?: UseMutationOptions<ScalingExecutionResponse, Error, ScalingDecision>
) => {
  return useMutation<ScalingExecutionResponse, Error, ScalingDecision>({
    mutationFn: executeScaling,
    ...options,
  });
};

// Hook to fetch scaling status
export const useScalingStatus = (
  options?: Omit<UseQueryOptions<ScalingStatusResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<ScalingStatusResponse, Error>({
    queryKey: ['scalingStatus'],
    queryFn: getScalingStatus,
    refetchInterval: 10000, // Refresh every 10 seconds
    ...options,
  });
};

// Hook to fetch system metrics
export const useSystemMetrics = (
  options?: Omit<UseQueryOptions<SystemMetrics, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<SystemMetrics, Error>({
    queryKey: ['systemMetrics'],
    queryFn: getSystemMetrics,
    refetchInterval: 5000, // Refresh every 5 seconds
    ...options,
  });
};

// Hook for real-time scaling workflow
export const useScalingWorkflow = () => {
  const scalingDecision = useScalingDecision();
  const executeScaling = useExecuteScaling();
  
  const triggerScaling = async (metrics: SystemMetrics) => {
    try {
      // Get scaling decision
      const decision = await scalingDecision.mutateAsync(metrics);
      
      // Execute scaling if action is needed
      if (decision.action !== 'maintain') {
        await executeScaling.mutateAsync(decision);
      }
      
      return decision;
    } catch (error) {
      console.error('Scaling workflow failed:', error);
      throw error;
    }
  };
  
  return {
    triggerScaling,
    isLoading: scalingDecision.isPending || executeScaling.isPending,
    error: scalingDecision.error || executeScaling.error,
  };
};
