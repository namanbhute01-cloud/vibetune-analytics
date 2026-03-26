import { useState, useEffect, useCallback } from 'react';
import { playback } from '@/lib/api';

export const usePlayback = () => {
  const [status, setStatus] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const data = await playback.getStatus();
      setStatus(data);
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 1000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  const play = async () => { try { await playback.play(); fetchStatus(); } catch (err: any) { setError(err.message); } };
  const pause = async () => { try { await playback.pause(); fetchStatus(); } catch (err: any) { setError(err.message); } };
  const next = async () => { try { await playback.next(); fetchStatus(); } catch (err: any) { setError(err.message); } };
  const prev = async () => { try { await playback.prev(); fetchStatus(); } catch (err: any) { setError(err.message); } };
  const toggleShuffle = async () => { try { await playback.shuffle(); fetchStatus(); } catch (err: any) { setError(err.message); } };
  const setVolume = async (vol: number) => { try { await playback.setVolume(vol); fetchStatus(); } catch (err: any) { setError(err.message); } };

  return { status, error, play, pause, next, prev, toggleShuffle, setVolume, refresh: fetchStatus };
};
