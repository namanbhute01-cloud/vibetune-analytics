import { useState, useEffect } from 'react'
import { api } from '@/lib/api'

export interface PlaybackStatus {
  song: string
  percent: number
  paused: boolean
  shuffle: boolean
  group: string
  volume: number
  playing: boolean
}

export function usePlayback() {
  const [status, setStatus] = useState<PlaybackStatus | null>(null)

  useEffect(() => {
    const poll = () => {
      api.getPlayback()
        .then(setStatus)
        .catch(err => console.error('[Playback] Poll error:', err))
    }
    poll()
    const id = setInterval(poll, 1000)
    return () => clearInterval(id)
  }, [])

  return {
    status,
    pause:   () => api.playbackAction('pause').catch(console.error),
    play:    () => api.playbackAction('play').catch(console.error),
    next:    (options?: { group?: string }) => api.playbackAction('next', options).catch(console.error),
    prev:    () => api.playbackAction('prev').catch(console.error),
    shuffle: () => api.playbackAction('shuffle').catch(console.error),
    setVol:  (level: number) => api.playbackAction('volume', { level }).catch(console.error),
  }
}
