import { usePrimaryForecast, useSecondaryPrediction, useSystemMetrics } from '@/hooks/useApi';
import { useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SecondaryPredictionRequest } from '@/types/api';

const PredictiveAnalytics = () => {
  const { toast } = useToast();

  const { data: forecastData, isLoading: isForecastLoading, error: forecastError } = usePrimaryForecast();

  const { data: systemMetrics, error: metricsError } = useSystemMetrics({
    refetchInterval: 5000,
  });

  const { mutate: predict, data: predictionResponse, isLoading: isPredictionLoading, error: predictionError } = useSecondaryPrediction();

  useEffect(() => {
    if (systemMetrics) {
      const request: Partial<SecondaryPredictionRequest> = {
        'cpu-user': systemMetrics['cpu-user'],
        'cpu-system': systemMetrics['cpu-system'],
        'cpu-iowait': systemMetrics['cpu-iowait'],
        'load-1m': systemMetrics['load-1m'],
        'load-5m': systemMetrics['load-5m'],
        'load-15m': systemMetrics['load-15m'],
        'sys-mem-swap-total': systemMetrics['sys-mem-swap-total'],
        'sys-mem-swap-free': systemMetrics['sys-mem-swap-free'],
        'sys-mem-free': systemMetrics['sys-mem-free'],
        'sys-mem-available': systemMetrics['sys-mem-available'],
        'sys-mem-total': systemMetrics['sys-mem-total'],
        'disk-bytes-read': systemMetrics['disk-bytes-read'],
        'disk-bytes-written': systemMetrics['disk-bytes-written'],
        'disk-io-read': systemMetrics['disk-io-read'],
        'disk-io-write': systemMetrics['disk-io-write'],
        'net-bytes-sent-rate': systemMetrics['net-bytes-sent-rate'],
        'net-bytes-recv-rate': systemMetrics['net-bytes-recv-rate'],
        instances: 1, // Default to 1 instance, should be dynamic in a real app
      };
      predict(request as SecondaryPredictionRequest);
    }
  }, [systemMetrics, predict]);

  useEffect(() => {
    if (predictionResponse) {
      toast({
        title: `Scaling Action: ${predictionResponse.action}`,
        description: `${predictionResponse.reason}. Instances: ${predictionResponse.instances_before} -> ${predictionResponse.instances_after}.`,
      });
    }
  }, [predictionResponse, toast]);

  if (forecastError || metricsError) {
    return <div>Error: {forecastError?.message || metricsError?.message}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Predictive Analytics & Auto-Scaling</CardTitle>
      </CardHeader>
      <CardContent>
        {isForecastLoading ? (
          <p>Loading forecast...</p>
        ) : forecastData ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={forecastData.timestamps.map((ts, i) => ({ name: new Date(ts).toLocaleTimeString(), demand: forecastData['predicted-demand'][i] }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="demand" fill="#8884d8" name="Predicted Demand" />
            </BarChart>
          </ResponsiveContainer>
        ) : null}

        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {systemMetrics ? (
            Object.entries(systemMetrics).map(([key, value]) => (
              <div key={key} className="p-2 bg-gray-100 dark:bg-gray-800 rounded">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{key}</p>
                <p className="text-lg font-bold">{typeof value === 'number' ? value.toFixed(2) : String(value)}</p>
              </div>
            ))
          ) : (
            <p>Loading system metrics...</p>
          )}
        </div>

        {isPredictionLoading && <p className="mt-4">Evaluating scaling decision...</p>}
        {predictionError && <p className="mt-4 text-red-500">Error making scaling decision: {predictionError.message}</p>}
        {predictionResponse && (
          <div className="mt-4 p-4 bg-green-100 dark:bg-green-900 rounded">
            <p className="font-bold">Last Scaling Decision:</p>
            <p>Action: {predictionResponse.action}</p>
            <p>Reason: {predictionResponse.reason}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PredictiveAnalytics;