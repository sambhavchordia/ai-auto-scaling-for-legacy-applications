import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Save, 
  RefreshCw, 
  AlertTriangle,
  CheckCircle,
  Server,
  Brain,
  Shield
} from 'lucide-react';

interface ConfigViewerProps {
  config?: any;
  onSave?: (config: any) => void;
}

export const ConfigViewer: React.FC<ConfigViewerProps> = ({ config, onSave }) => {
  const [localConfig, setLocalConfig] = React.useState(config || {});
  const [isEditing, setIsEditing] = React.useState(false);
  const [hasChanges, setHasChanges] = React.useState(false);

  React.useEffect(() => {
    setLocalConfig(config || {});
    setHasChanges(false);
  }, [config]);

  const handleConfigChange = (key: string, value: any) => {
    setLocalConfig(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(localConfig);
    }
    setIsEditing(false);
    setHasChanges(false);
  };

  const handleReset = () => {
    setLocalConfig(config || {});
    setHasChanges(false);
    setIsEditing(false);
  };

  const defaultConfig = {
    scaling: {
      min_instances: 2,
      max_instances: 10,
      scale_up_threshold: 80,
      scale_down_threshold: 20,
      cooldown_period: 300,
      enabled: true
    },
    monitoring: {
      collection_interval: 30,
      retention_days: 7,
      anomaly_threshold: 0.95,
      enabled: true
    },
    ml_models: {
      primary_model: 'prophet_rf',
      secondary_model: 'isolation_forest',
      retrain_interval_hours: 24,
      confidence_threshold: 0.8,
      enabled: true
    },
    notifications: {
      email_enabled: false,
      webhook_enabled: true,
      webhook_url: 'https://api.example.com/webhook',
      critical_alerts: true,
      scaling_notifications: true
    }
  };

  const currentConfig = localConfig || defaultConfig;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center space-x-2">
          <Settings className="h-6 w-6" />
          <span>System Configuration</span>
        </h2>
        <div className="flex items-center space-x-2">
          {hasChanges && (
            <Badge variant="outline" className="text-xs text-orange-600">
              Unsaved Changes
            </Badge>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
          {isEditing && hasChanges && (
            <Button
              size="sm"
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700"
            >
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scaling Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Server className="h-5 w-5" />
              <span>Scaling Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="scaling-enabled">Auto-scaling enabled</Label>
              <Switch
                id="scaling-enabled"
                checked={currentConfig.scaling?.enabled}
                onCheckedChange={(checked) => 
                  handleConfigChange('scaling', { ...currentConfig.scaling, enabled: checked })
                }
                disabled={!isEditing}
              />
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="min-instances">Min Instances</Label>
                <Input
                  id="min-instances"
                  type="number"
                  value={currentConfig.scaling?.min_instances}
                  onChange={(e) => 
                    handleConfigChange('scaling', { 
                      ...currentConfig.scaling, 
                      min_instances: parseInt(e.target.value) 
                    })
                  }
                  disabled={!isEditing}
                  min="1"
                  max="20"
                />
              </div>
              <div>
                <Label htmlFor="max-instances">Max Instances</Label>
                <Input
                  id="max-instances"
                  type="number"
                  value={currentConfig.scaling?.max_instances}
                  onChange={(e) => 
                    handleConfigChange('scaling', { 
                      ...currentConfig.scaling, 
                      max_instances: parseInt(e.target.value) 
                    })
                  }
                  disabled={!isEditing}
                  min="1"
                  max="50"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="scale-up-threshold">Scale Up Threshold (%)</Label>
                <Input
                  id="scale-up-threshold"
                  type="number"
                  value={currentConfig.scaling?.scale_up_threshold}
                  onChange={(e) => 
                    handleConfigChange('scaling', { 
                      ...currentConfig.scaling, 
                      scale_up_threshold: parseInt(e.target.value) 
                    })
                  }
                  disabled={!isEditing}
                  min="50"
                  max="100"
                />
              </div>
              <div>
                <Label htmlFor="scale-down-threshold">Scale Down Threshold (%)</Label>
                <Input
                  id="scale-down-threshold"
                  type="number"
                  value={currentConfig.scaling?.scale_down_threshold}
                  onChange={(e) => 
                    handleConfigChange('scaling', { 
                      ...currentConfig.scaling, 
                      scale_down_threshold: parseInt(e.target.value) 
                    })
                  }
                  disabled={!isEditing}
                  min="10"
                  max="50"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monitoring Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <RefreshCw className="h-5 w-5" />
              <span>Monitoring Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="monitoring-enabled">Monitoring enabled</Label>
              <Switch
                id="monitoring-enabled"
                checked={currentConfig.monitoring?.enabled}
                onCheckedChange={(checked) => 
                  handleConfigChange('monitoring', { ...currentConfig.monitoring, enabled: checked })
                }
                disabled={!isEditing}
              />
            </div>
            
            <Separator />
            
            <div>
              <Label htmlFor="collection-interval">Collection Interval (seconds)</Label>
              <Input
                id="collection-interval"
                type="number"
                value={currentConfig.monitoring?.collection_interval}
                onChange={(e) => 
                  handleConfigChange('monitoring', { 
                    ...currentConfig.monitoring, 
                    collection_interval: parseInt(e.target.value) 
                  })
                }
                disabled={!isEditing}
                min="10"
                max="300"
              />
            </div>
            
            <div>
              <Label htmlFor="retention-days">Data Retention (days)</Label>
              <Input
                id="retention-days"
                type="number"
                value={currentConfig.monitoring?.retention_days}
                onChange={(e) => 
                  handleConfigChange('monitoring', { 
                    ...currentConfig.monitoring, 
                    retention_days: parseInt(e.target.value) 
                  })
                }
                disabled={!isEditing}
                min="1"
                max="30"
              />
            </div>
            
            <div>
              <Label htmlFor="anomaly-threshold">Anomaly Detection Threshold</Label>
              <Input
                id="anomaly-threshold"
                type="number"
                step="0.01"
                value={currentConfig.monitoring?.anomaly_threshold}
                onChange={(e) => 
                  handleConfigChange('monitoring', { 
                    ...currentConfig.monitoring, 
                    anomaly_threshold: parseFloat(e.target.value) 
                  })
                }
                disabled={!isEditing}
                min="0.5"
                max="1.0"
              />
            </div>
          </CardContent>
        </Card>

        {/* ML Models Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5" />
              <span>ML Models Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="ml-enabled">ML predictions enabled</Label>
              <Switch
                id="ml-enabled"
                checked={currentConfig.ml_models?.enabled}
                onCheckedChange={(checked) => 
                  handleConfigChange('ml_models', { ...currentConfig.ml_models, enabled: checked })
                }
                disabled={!isEditing}
              />
            </div>
            
            <Separator />
            
            <div>
              <Label htmlFor="primary-model">Primary Model</Label>
              <Input
                id="primary-model"
                value={currentConfig.ml_models?.primary_model}
                onChange={(e) => 
                  handleConfigChange('ml_models', { 
                    ...currentConfig.ml_models, 
                    primary_model: e.target.value 
                  })
                }
                disabled={!isEditing}
              />
            </div>
            
            <div>
              <Label htmlFor="secondary-model">Secondary Model</Label>
              <Input
                id="secondary-model"
                value={currentConfig.ml_models?.secondary_model}
                onChange={(e) => 
                  handleConfigChange('ml_models', { 
                    ...currentConfig.ml_models, 
                    secondary_model: e.target.value 
                  })
                }
                disabled={!isEditing}
              />
            </div>
            
            <div>
              <Label htmlFor="confidence-threshold">Confidence Threshold</Label>
              <Input
                id="confidence-threshold"
                type="number"
                step="0.01"
                value={currentConfig.ml_models?.confidence_threshold}
                onChange={(e) => 
                  handleConfigChange('ml_models', { 
                    ...currentConfig.ml_models, 
                    confidence_threshold: parseFloat(e.target.value) 
                  })
                }
                disabled={!isEditing}
                min="0.5"
                max="1.0"
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Notifications Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-enabled">Email notifications</Label>
              <Switch
                id="email-enabled"
                checked={currentConfig.notifications?.email_enabled}
                onCheckedChange={(checked) => 
                  handleConfigChange('notifications', { ...currentConfig.notifications, email_enabled: checked })
                }
                disabled={!isEditing}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="webhook-enabled">Webhook notifications</Label>
              <Switch
                id="webhook-enabled"
                checked={currentConfig.notifications?.webhook_enabled}
                onCheckedChange={(checked) => 
                  handleConfigChange('notifications', { ...currentConfig.notifications, webhook_enabled: checked })
                }
                disabled={!isEditing}
              />
            </div>
            
            <Separator />
            
            <div>
              <Label htmlFor="webhook-url">Webhook URL</Label>
              <Input
                id="webhook-url"
                value={currentConfig.notifications?.webhook_url}
                onChange={(e) => 
                  handleConfigChange('notifications', { 
                    ...currentConfig.notifications, 
                    webhook_url: e.target.value 
                  })
                }
                disabled={!isEditing}
                placeholder="https://api.example.com/webhook"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="critical-alerts">Critical alerts</Label>
              <Switch
                id="critical-alerts"
                checked={currentConfig.notifications?.critical_alerts}
                onCheckedChange={(checked) => 
                  handleConfigChange('notifications', { ...currentConfig.notifications, critical_alerts: checked })
                }
                disabled={!isEditing}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="scaling-notifications">Scaling notifications</Label>
              <Switch
                id="scaling-notifications"
                checked={currentConfig.notifications?.scaling_notifications}
                onCheckedChange={(checked) => 
                  handleConfigChange('notifications', { ...currentConfig.notifications, scaling_notifications: checked })
                }
                disabled={!isEditing}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Configuration Status */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <div className="text-sm font-medium text-green-800">Scaling</div>
              <div className="text-xs text-green-600">
                {currentConfig.scaling?.enabled ? 'Enabled' : 'Disabled'}
              </div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <RefreshCw className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <div className="text-sm font-medium text-blue-800">Monitoring</div>
              <div className="text-xs text-blue-600">
                {currentConfig.monitoring?.enabled ? 'Active' : 'Inactive'}
              </div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <Brain className="h-6 w-6 mx-auto mb-2 text-purple-600" />
              <div className="text-sm font-medium text-purple-800">ML Models</div>
              <div className="text-xs text-purple-600">
                {currentConfig.ml_models?.enabled ? 'Ready' : 'Disabled'}
              </div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <Shield className="h-6 w-6 mx-auto mb-2 text-orange-600" />
              <div className="text-sm font-medium text-orange-800">Notifications</div>
              <div className="text-xs text-orange-600">
                {currentConfig.notifications?.webhook_enabled ? 'Webhook' : 'Email'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


