import { useState, useEffect, useCallback } from 'react';

export const useWebSocket = (url?: string) => {
  const [data, setData] = useState<any>(null);
  const [status, setStatus] = useState<'connecting' | 'open' | 'closed'>('connecting');
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    // Determine WS URL: use provided, or derive from window.location
    // If we're on port 8080 (Vite), we want to use the proxy /ws
    // If we're on port 8000 (Backend), we want /ws
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const defaultUrl = `${protocol}//${window.location.host}/ws`;
    const finalUrl = url || defaultUrl;

    console.log(`Connecting to WS: ${finalUrl}`);
    const socket = new WebSocket(finalUrl);

    socket.onopen = () => {
      setStatus('open');
      console.log('WS Connected');
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setData(message);
    };

    socket.onclose = () => {
      setStatus('closed');
      console.log('WS Disconnected');
      // Reconnect logic could go here
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, [url]);

  const sendMessage = useCallback((message: any) => {
    if (ws && status === 'open') {
      ws.send(JSON.stringify(message));
    }
  }, [ws, status]);

  return { data, status, sendMessage };
};
