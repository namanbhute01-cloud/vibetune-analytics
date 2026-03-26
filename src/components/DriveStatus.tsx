import React, { useState, useEffect } from 'react';
import { faces } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Cloud, CloudOff, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

export const DriveStatus: React.FC = () => {
  const [status, setStatus] = useState<any>(null);

  const fetchStatus = async () => {
    try {
      const data = await faces.getDriveStatus();
      setStatus(data);
    } catch (err) {
      console.error('Failed to fetch drive status', err);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!status) return null;

  const isConnected = status.connected;

  return (
    <Badge 
      variant="outline" 
      className={cn(
        "gap-1.5 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider transition-colors",
        isConnected ? "text-green-500 border-green-500/20 bg-green-500/5" : "text-muted-foreground border-border bg-muted/5"
      )}
    >
      {isConnected ? (
        <>
          <Cloud className="w-3 h-3" />
          <span>Synced</span>
          {status.pending_count > 0 && (
            <span className="text-[8px] opacity-70 ml-1">({status.pending_count} pending)</span>
          )}
        </>
      ) : (
        <>
          <CloudOff className="w-3 h-3" />
          <span>Local Only</span>
        </>
      )}
    </Badge>
  );
};
