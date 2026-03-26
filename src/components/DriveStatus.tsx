import React, { useState, useEffect } from 'react';
import { faces } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Cloud, CloudOff, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

export const DriveStatus: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    try {
      const data = await faces.getStats();
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000); // 30s poll
    return () => clearInterval(interval);
  }, []);

  const handleSync = async () => {
    setLoading(true);
    await faces.sync();
    await fetchStats();
    setLoading(false);
  };

  if (!stats) return null;

  const isConnected = stats.last_sync > 0;

  return (
    <Badge 
      variant="outline" 
      className={cn(
        "flex items-center gap-2 px-3 py-1 bg-background/50 border-border cursor-help",
        isConnected ? "text-green-500" : "text-muted-foreground"
      )}
      title={`Last Sync: ${isConnected ? new Date(stats.last_sync * 1000).toLocaleTimeString() : 'Never'}`}
    >
      {isConnected ? <Cloud className="w-3 h-3" /> : <CloudOff className="w-3 h-3" />}
      <span className="text-[10px] font-medium tracking-tight">
        {stats.total_uploaded} UPLOADED
      </span>
      <button 
        onClick={(e) => { e.stopPropagation(); handleSync(); }}
        disabled={loading}
        className="ml-1 hover:text-foreground transition-colors disabled:opacity-50"
      >
        <RefreshCw className={cn("w-3 h-3", loading && "animate-spin")} />
      </button>
    </Badge>
  );
};
