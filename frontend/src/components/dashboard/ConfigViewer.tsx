import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  FileText, 
  Download, 
  Copy, 
  Check,
  ChevronDown,
  ChevronRight,
  Container,
  Server,
  Cog
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '../../hooks/use-toast';
import type { ConfigFile } from '../../types/dashboard';

interface ConfigViewerProps {
  configs: ConfigFile[];
}

export const ConfigViewer: React.FC<ConfigViewerProps> = ({ configs }) => {
  const [expandedConfigs, setExpandedConfigs] = useState<Set<string>>(new Set());
  const [copiedConfig, setCopiedConfig] = useState<string | null>(null);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'docker':
        return <Container className="h-4 w-4" />;
      case 'kubernetes':
        return <Server className="h-4 w-4" />;
      case 'env':
        return <Cog className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'docker':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'kubernetes':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'env':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      default:
        return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  const toggleExpanded = (configId: string) => {
    const newExpanded = new Set(expandedConfigs);
    if (newExpanded.has(configId)) {
      newExpanded.delete(configId);
    } else {
      newExpanded.add(configId);
    }
    setExpandedConfigs(newExpanded);
  };

  const copyToClipboard = async (content: string, configId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedConfig(configId);
      setTimeout(() => setCopiedConfig(null), 2000);
      toast({
        title: "Copied to clipboard",
        description: "Configuration content has been copied",
      });
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const downloadConfig = (config: ConfigFile) => {
    const blob = new Blob([config.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = config.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download started",
      description: `${config.name} is being downloaded`,
    });
  };

  const groupedConfigs = configs.reduce((acc, config) => {
    if (!acc[config.type]) {
      acc[config.type] = [];
    }
    acc[config.type].push(config);
    return acc;
  }, {} as Record<string, ConfigFile[]>);

  return (
    <Card className="gradient-card border-border/50 shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground flex items-center">
          <FileText className="h-5 w-5 mr-2 text-primary" />
          Configuration Files
          <Badge variant="secondary" className="ml-auto">
            {configs.length} files
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={Object.keys(groupedConfigs)[0]} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            {Object.keys(groupedConfigs).map((type) => (
              <TabsTrigger 
                key={type} 
                value={type}
                className="flex items-center space-x-2"
              >
                {getTypeIcon(type)}
                <span className="capitalize">{type}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {Object.entries(groupedConfigs).map(([type, typeConfigs]) => (
            <TabsContent key={type} value={type} className="space-y-4">
              {typeConfigs.map((config) => (
                <div key={config.id} className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-muted/10 rounded-lg border border-border/50">
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpanded(config.id)}
                        className="h-6 w-6 p-0"
                      >
                        {expandedConfigs.has(config.id) ? (
                          <ChevronDown className="h-3 w-3" />
                        ) : (
                          <ChevronRight className="h-3 w-3" />
                        )}
                      </Button>
                      
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(config.type)}
                        <span className="font-medium text-foreground">{config.name}</span>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getTypeColor(config.type)}`}
                        >
                          {config.type}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span>
                        Modified {format(new Date(config.lastModified), 'MMM d, yyyy HH:mm')}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(config.content, config.id)}
                          className="h-6 w-6 p-0"
                        >
                          {copiedConfig === config.id ? (
                            <Check className="h-3 w-3 text-success" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => downloadConfig(config)}
                          className="h-6 w-6 p-0"
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {expandedConfigs.has(config.id) && (
                    <div className="border border-border/50 rounded-lg overflow-hidden">
                      <div className="bg-muted/20 px-4 py-2 border-b border-border/50 flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{config.name}</span>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(config.content, config.id)}
                            className="h-7 px-2"
                          >
                            {copiedConfig === config.id ? (
                              <>
                                <Check className="h-3 w-3 mr-1 text-success" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3 mr-1" />
                                Copy
                              </>
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => downloadConfig(config)}
                            className="h-7 px-2"
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                      <pre className="p-4 text-xs text-foreground bg-background/50 overflow-x-auto max-h-64 overflow-y-auto">
                        <code>{config.content}</code>
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};