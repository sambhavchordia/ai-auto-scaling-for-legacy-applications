import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { 
  Bell, 
  Settings, 
  User, 
  LogOut, 
  Activity,
  Shield,
  Download
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { toast } from '../../hooks/use-toast';

export const Header = () => {
  const [notifications] = useState(3);
  const { user, signOut } = useAuth();

  const handleNotifications = () => {
    toast({
      title: "Notifications",
      description: `You have ${notifications} new notifications`,
    });
  };

  const handleExport = () => {
    // Generate and download a sample report
    const reportData = {
      timestamp: new Date().toISOString(),
      metrics: {
        cpu: '65%',
        memory: '48%',
        users: 1247
      },
      alerts: notifications,
      status: 'All Systems Operational'
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dashboard-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export Complete",
      description: "Dashboard report has been downloaded",
    });
  };

  const handleProfile = () => {
    toast({
      title: "Profile",
      description: "Opening profile settings...",
    });
  };

  const handleSettings = () => {
    toast({
      title: "Settings",
      description: "Opening system settings...",
    });
  };

  const handleSecurity = () => {
    toast({
      title: "Security",
      description: "Opening security dashboard...",
    });
  };

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };

  const userDisplayName = user?.email?.split('@')[0] || 'User';
  const userInitials = userDisplayName.slice(0, 2).toUpperCase();

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo and Title */}
        <div className="flex items-center space-x-4">
          <div className="gradient-primary p-2 rounded-lg animate-pulse-glow">
            <Activity className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              System Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Real-time monitoring & analytics
            </p>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="hidden md:flex items-center space-x-2">
          <div className="flex items-center space-x-2 bg-success/10 text-success px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">All Systems Operational</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative" onClick={handleNotifications}>
            <Bell className="h-5 w-5" />
            {notifications > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {notifications}
              </Badge>
            )}
          </Button>

          {/* Download Report */}
          <Button variant="ghost" size="sm" onClick={handleExport}>
            <Download className="h-5 w-5 mr-2" />
            Export
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/api/placeholder/32/32" />
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
                <span className="hidden md:block">{userDisplayName}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfile}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSettings}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSecurity}>
                <Shield className="mr-2 h-4 w-4" />
                Security
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};