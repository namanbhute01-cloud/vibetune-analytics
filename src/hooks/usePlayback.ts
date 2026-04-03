import { useState, useEffect, useCallback, useRef } from 'react'
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
  const statusRef = useRef<PlaybackStatus | null>(null)
  const pendingActions = useRef<Set<string>>(new Set())

  // Keep ref in sync
  useEffect(() => {
    statusRef.current = status
  }, [status])

  // Poll for status updates — faster interval (500ms)
  useEffect(() => {
    let cancelled = false

    const poll = async () => {
      try {
        const data = await api.getPlayback()
        if (!cancelled) {
          const newStatus = {
            ...data,
            playing: !data.paused,
          }
          setStatus(newStatus)
          statusRef.current = newStatus
        }
      } catch (err) {
        if (!cancelled) {
          console.error('[Playback] Poll error:', err)
        }
      }
    }

    poll()
    const id = setInterval(poll, 500)  // 500ms polling (was 1000ms)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [])

  // Optimistic action helper
  const optimisticAction = useCallback((
    action: string,
    body?: object,
    optimisticUpdate?: (prev: PlaybackStatus) => PlaybackStatus
  ) => {
    // Apply optimistic update immediately
    if (optimisticUpdate && statusRef.current) {
      setStatus(prev => prev ? optimisticUpdate(prev) : prev)
    }

    // Send to backend
    api.playbackAction(action, body)
      .catch(err => {
        console.error(`[Playback] ${action} failed:`, err)
        // Revert on failure — refetch from server
        api.getPlayback().then(data => {
          setStatus({ ...data, playing: !data.paused })
        }).catch(() => {})
      })
  }, [])

  const actions = {
    pause: useCallback(() => {
      optimisticAction('pause', undefined, prev => ({
        ...prev, paused: true, playing: false
      }))
    }, [optimisticAction]),

    play: useCallback(() => {
      optimisticAction('play', undefined, prev => ({
        ...prev, paused: false, playing: true
      }))
    }, [optimisticAction]),

    next: useCallback((options?: { group?: string }) => {
      // No optimistic update for next — song changes, better to wait for poll
      api.playbackAction('next', options).catch(console.error)
    }, []),

    prev: useCallback(() => {
      api.playbackAction('prev').catch(console.error)
    }, []),

    shuffle: useCallback(() => {
      optimisticAction('shuffle', undefined, prev => ({
        ...prev, shuffle: !prev.shuffle
      }))
    }, [optimisticAction]),

    setVol: useCallback((level: number) => {
      optimisticAction('volume', { level }, prev => ({
        ...prev, volume: level
      }))
    }, [optimisticAction]),

    mute: useCallback(() => {
      optimisticAction('mute', undefined, prev => ({
        ...prev, volume: 0
      }))
    }, [optimisticAction]),

    unmute: useCallback(() => {
      optimisticAction('unmute', undefined, prev => ({
        ...prev, volume: 70
      }))
    }, [optimisticAction]),
  }

  return {
    status,
    ...actions
  }
}
