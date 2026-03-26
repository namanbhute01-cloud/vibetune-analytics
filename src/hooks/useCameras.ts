import { useState, useEffect, useCallback } from 'react';
import { cameras } from '@/lib/api';

export const useCameras = () => {
  const [list, setList] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchCameras = useCallback(async () => {
    try {
      const data = await cameras.list();
      setList(Array.isArray(data) ? data : (data.sources || []));
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    fetchCameras();
    const interval = setInterval(fetchCameras, 5000);
    return () => clearInterval(interval);
  }, [fetchCameras]);

  const updateSettings = async (id: number, settings: any) => {
    try {
      await cameras.updateSettings(id, settings);
      fetchCameras();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return { list, error, updateSettings, refresh: fetchCameras };
};
