import { useState, useEffect } from 'react'
import { api } from '@/lib/api'

export function usePlayback() {
  const [status, setStatus] = useState<any>(null)

  useEffect(() => {
    const poll = () => api.getPlayback().then(setStatus).catch(() => {})
    poll()
    const id = setInterval(poll, 1000)
    return () => clearInterval(id)
  }, [])

  return {
    status,
    pause:   () => api.playbackAction('pause'),
    next:    () => api.playbackAction('next'),
    prev:    () => api.playbackAction('prev'),
    shuffle: () => api.playbackAction('shuffle'),
    setVol:  (level: number) => api.playbackAction('volume', { level }),
  }
}
