import { useState, useEffect, useCallback, useRef } from 'react';

export interface VibeState {
  status: string;
  current_vibe: string;
  detected_group: string;
  journal_count: number;
  next_vibe: string | null;
  type?: string;
  player?: any;
  vibe?: any;
  vault?: any;
  faces?: any;
}

export function useVibeStream(url?: string) {
  const [data, setData] = useState<VibeState | null>(null);
  const [status, setStatus] = useState<'connecting' | 'open' | 'closed'>('connecting');
  const wsRef = useRef<WebSocket | null>(null);

  const connect = useCallback(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const finalUrl = url || `${protocol}//${host}/ws`;

    console.log(`Connecting to WS: ${finalUrl}`);
    const socket = new WebSocket(finalUrl);
    wsRef.current = socket;

    socket.onopen = () => {
      setStatus('open');
      console.log('WS Connected');
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        setData(message);
      } catch (err) {
        console.error('Failed to parse WS message', err);
      }
    };

    socket.onclose = () => {
      setStatus('closed');
      console.log('WS Disconnected - reconnecting in 2s...');
      setTimeout(connect, 2000);
    };

    socket.onerror = (err) => {
      console.error('WS Error', err);
      socket.close();
    };
  }, [url]);

  useEffect(() => {
    connect();
    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, [connect]);

  return { data, status };
}
