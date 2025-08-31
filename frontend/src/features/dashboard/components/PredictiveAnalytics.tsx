import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  Brain, 
  Clock, 
  Target,
  RefreshCw,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { UseQueryResult } from '@tanstack/react-query';
import { ForecastResponse, SystemMetrics } from '@/types/api';

interface PredictiveAnalyticsProps {
  forecastQuery: UseQueryResult<ForecastResponse, Error>;
  systemMetrics: SystemMetrics;
}

export const PredictiveAnalytics: React.FC<PredictiveAnalyticsProps> = ({ 
  forecastQuery, 
  systemMetrics 
}) => {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600 bg-green-50 border-green-200';
    if (confidence >= 0.7) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 0.9) return <CheckCircle className="h-4 w-4" />;
    if (confidence >= 0.7) return <AlertTriangle className="h-4 w-4" />;
    return <AlertTriangle className="h-4 w-4" />;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{formatTime(label)}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (forecastQuery.isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>Predictive Analytics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">Loading predictions...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (forecastQuery.error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>Predictive Analytics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-red-500" />
              <p className="text-red-600">Failed to load predictions</p>
              <p className="text-sm text-muted-foreground mt-1">
                {forecastQuery.error.message}
              </p>
              <Button 
                onClick={() => forecastQuery.refetch()} 
                variant="outline" 
                size="sm" 
                className="mt-2"
              >
                Retry
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const forecast = forecastQuery.data;
  if (!forecast || !forecast.forecast.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>Predictive Analytics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">No forecast data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Prepare chart data
  const chartData = forecast.forecast.map((prediction, index) => ({
    time: formatTime(prediction.timestamp),
    timestamp: prediction.timestamp,
    predicted: prediction.predicted_load,
    confidence: prediction.confidence,
    hour: index + 1
  }));

  const averageConfidence = forecast.forecast.reduce((sum, pred) => sum + pred.confidence, 0) / forecast.forecast.length;
  const maxPredictedLoad = Math.max(...forecast.forecast.map(p => p.predicted_load));
  const minPredictedLoad = Math.min(...forecast.forecast.map(p => p.predicted_load));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center space-x-2">
          <Brain className="h-6 w-6" />
          <span>Predictive Analytics</span>
        </h2>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-xs">
            {forecast.forecast_hours}h forecast
          </Badge>
          <Button 
            onClick={() => forecastQuery.refetch()} 
            variant="outline" 
            size="sm"
            disabled={forecastQuery.isRefetching}
          >
            <RefreshCw className={`h-4 w-4 ${forecastQuery.isRefetching ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Forecast Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Load Forecast</CardTitle>
            <p className="text-sm text-muted-foreground">
              Predicted system load for the next {forecast.forecast_hours} hours
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="predicted" 
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.3}
                  name="Predicted Load"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Prediction Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Prediction Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {maxPredictedLoad.toFixed(1)}
                </div>
                <div className="text-xs text-blue-600">Peak Load</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {minPredictedLoad.toFixed(1)}
                </div>
                <div className="text-xs text-green-600">Min Load</div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Average Confidence</span>
                  <span>{(averageConfidence * 100).toFixed(1)}%</span>
                </div>
                <Progress value={averageConfidence * 100} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Model Used</span>
                  <span className="font-medium">{forecast.forecast[0]?.model_used || 'Unknown'}</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Generated At</span>
                  <span className="font-medium">
                    {new Date(forecast.generated_at).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Predictions */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Predictions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {forecast.forecast.map((prediction, index) => (
              <div 
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg border ${getConfidenceColor(prediction.confidence)}`}
              >
                <div className="flex items-center space-x-3">
                  {getConfidenceIcon(prediction.confidence)}
                  <div>
                    <div className="font-medium">
                      Hour {index + 1} - {formatTime(prediction.timestamp)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Model: {prediction.model_used}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">
                    {prediction.predicted_load.toFixed(2)}
                  </div>
                  <div className="text-sm">
                    {(prediction.confidence * 100).toFixed(1)}% confidence
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scaling Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Scaling Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {maxPredictedLoad > 80 && (
              <div className="flex items-center space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <div>
                  <div className="font-medium text-red-800">High Load Predicted</div>
                  <div className="text-sm text-red-600">
                    Peak load of {maxPredictedLoad.toFixed(1)} expected. Consider scaling up.
                  </div>
                </div>
              </div>
            )}
            
            {maxPredictedLoad < 30 && (
              <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium text-green-800">Low Load Expected</div>
                  <div className="text-sm text-green-600">
                    Peak load of {maxPredictedLoad.toFixed(1)} expected. Consider scaling down.
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <div className="font-medium text-blue-800">Current System Status</div>
                <div className="text-sm text-blue-600">
                  Current load: {systemMetrics.load_1m.toFixed(2)} | 
                  CPU: {systemMetrics.cpu_user.toFixed(1)}% | 
                  Memory: {((systemMetrics.sys_mem_total - systemMetrics.sys_mem_available) / systemMetrics.sys_mem_total * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


