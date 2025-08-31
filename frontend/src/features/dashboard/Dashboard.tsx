import React, { useState } from 'react';
import { Header } from './components/Header';
import { MetricsGrid } from './components/MetricsGrid';
import { ChartsSection } from './components/ChartsSection';
import { PredictiveAnalytics } from './components/PredictiveAnalytics';
import { ActionLog } from './components/ActionLog';
import { AlertsTable } from './components/AlertsTable';
import { ConfigViewer } from './components/ConfigViewer';
import { DateRangePicker } from './components/DateRangePicker';
import { 
  useHealthStatus, 
  useSystemMetrics, 
  useForecast, 
  useScalingStatus,
  useScalingWorkflow 
} from '@/hooks/useApi';
import { useWebSocket } from '@/hooks/useWebSocket';
import { generateMockData } from '@/utils/mockData';
import { ScalingStatusResponse } from '@/types/api';

const Dashboard = () => {
  const [dateRange, setDateRange] = useState({ 
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 
    to: new Date() 
  });

  // WebSocket connection for real-time updates
  const { isConnected: wsConnected, error: wsError } = useWebSocket({
    url: 'ws://localhost:8000/ws',
    enabled: true
  });

  // API hooks
  const healthQuery = useHealthStatus();
  const systemMetricsQuery = useSystemMetrics();
  const scalingStatusQuery = useScalingStatus();
  const scalingWorkflow = useScalingWorkflow();

  // Forecast query (only when we have metrics)
  const forecastQuery = useForecast(
    systemMetricsQuery.data || {
      timestamp: new Date().toISOString(),
      load_1m: 0,
      load_5m: 0,
      load_15m: 0,
      cpu_user: 0,
      cpu_system: 0,
      cpu_iowait: 0,
      sys_mem_available: 0,
      sys_mem_total: 8192000,
      disk_io_time: 0,
      disk_io_read: 0,
      disk_io_write: 0
    },
    24
  );

  // Mock data for components that need it
  const mockData = generateMockData();

  // Handle manual scaling trigger
  const handleManualScaling = async () => {
    if (systemMetricsQuery.data) {
      try {
        await scalingWorkflow.triggerScaling(systemMetricsQuery.data);
      } catch (error) {
        console.error('Manual scaling failed:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        healthStatus={healthQuery.data}
        onManualScaling={handleManualScaling}
        isLoading={scalingWorkflow.isLoading}
        wsConnected={wsConnected}
      />
      
      <main className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">AI Auto-Scaling Dashboard</h1>
            {healthQuery.data && (
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                healthQuery.data.status === 'healthy' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {healthQuery.data.status}
              </div>
            )}
          </div>
          <DateRangePicker 
            dateRange={dateRange} 
            onDateRangeChange={setDateRange} 
          />
        </div>

        {/* Loading states */}
        {systemMetricsQuery.isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Loading system metrics...</p>
          </div>
        )}

        {/* Error states */}
        {systemMetricsQuery.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">Error loading system metrics: {systemMetricsQuery.error.message}</p>
          </div>
        )}

        {/* Main content */}
        {systemMetricsQuery.data && (
          <>
            <MetricsGrid 
              metrics={systemMetricsQuery.data}
              scalingStatus={scalingStatusQuery.data as ScalingStatusResponse}
            />

            <ChartsSection 
              chartData={mockData.chartData}
              systemMetrics={systemMetricsQuery.data}
            />

            <PredictiveAnalytics 
              forecastQuery={forecastQuery}
              systemMetrics={systemMetricsQuery.data}
            />

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <ActionLog 
                actions={(scalingStatusQuery.data as ScalingStatusResponse)?.scaling_history || []}
                isLoading={scalingStatusQuery.isLoading}
              />
              <AlertsTable 
                alerts={mockData.alerts}
                systemMetrics={systemMetricsQuery.data}
              />
            </div>

            <ConfigViewer 
              config={mockData.configs}
            />
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;


