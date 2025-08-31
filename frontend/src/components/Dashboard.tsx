import React, { useState, useEffect } from 'react';
import { Header } from './dashboard/Header';
import { MetricsGrid } from './dashboard/MetricsGrid';
import { ChartsSection } from './dashboard/ChartsSection';
import { PredictiveAnalytics } from './dashboard/PredictiveAnalytics';
import { ActionLog } from './dashboard/ActionLog';
import { AlertsTable } from './dashboard/AlertsTable';
import { ConfigViewer } from './dashboard/ConfigViewer';
import { DateRangePicker } from './dashboard/DateRangePicker';
import { generateMockData } from '../utils/mockData';
import type { DashboardData } from '../types/dashboard';

const Dashboard = () => {
  const [data, setData] = useState<DashboardData>(generateMockData());
  const [dateRange, setDateRange] = useState({ start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), end: new Date() });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateMockData());
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="p-6 space-y-6">
        {/* Date Range Picker */}
        <div className="flex justify-end">
          <DateRangePicker 
            dateRange={dateRange} 
            onDateRangeChange={setDateRange} 
          />
        </div>

        {/* Real-time Metrics */}
        <MetricsGrid metrics={data.metrics} />

        {/* Charts Section */}
        <ChartsSection chartData={data.chartData} />

        {/* Predictive Analytics */}
        <PredictiveAnalytics 
          predictions={data.predictions}
          anomalies={data.anomalies}
        />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Action Log */}
          <ActionLog actions={data.actions} />
          
          {/* Alerts Table */}
          <AlertsTable alerts={data.alerts} />
        </div>

        {/* Configuration Viewer */}
        <ConfigViewer configs={data.configs} />
      </main>
    </div>
  );
};

export default Dashboard;