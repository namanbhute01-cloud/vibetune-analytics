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
        .then(data => {
          setStatus({
            ...data,
            playing: !data.paused
          })
        })
        .catch(err => console.error('[Playback] Poll error:', err))
    }
    poll()
    const id = setInterval(poll, 1000)
    return () => clearInterval(id)
  }, [])

  const actions = {
    pause:   () => {
      api.playbackAction('pause')
        .then(() => setStatus(prev => prev ? {...prev, paused: true, playing: false} : prev))
        .catch(console.error)
    },
    play:    () => {
      api.playbackAction('play')
        .then(() => setStatus(prev => prev ? {...prev, paused: false, playing: true} : prev))
        .catch(console.error)
    },
    next:    (options?: { group?: string }) => {
      api.playbackAction('next', options)
        .catch(console.error)
    },
    prev:    () => {
      api.playbackAction('prev')
        .catch(console.error)
    },
    shuffle: () => {
      api.playbackAction('shuffle')
        .then(() => setStatus(prev => prev ? {...prev, shuffle: !prev.shuffle} : prev))
        .catch(console.error)
    },
    setVol:  (level: number) => {
      api.playbackAction('volume', { level })
        .then(() => setStatus(prev => prev ? {...prev, volume: level} : prev))
        .catch(console.error)
    },
  }

  return {
    status,
    ...actions
  }
}
