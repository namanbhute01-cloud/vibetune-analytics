import { useEffect, useState, useRef } from 'react'

export interface VibeState {
  status: string
  detected_group: string
  current_vibe: string
  age: string
  journal_count: number
  percent_pos: number
  is_playing: boolean
  paused: boolean
  shuffle: boolean
  current_song: string
  next_vibe: string | null
}

export function useVibeStream(): VibeState | null {
  const [state, setState] = useState<VibeState | null>(null)
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    function connect() {
      // MUST use window.location.host — not hardcoded localhost
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      const ws = new WebSocket(`${protocol}//${window.location.host}/ws`)
      wsRef.current = ws
      ws.onmessage = (e) => {
        try { setState(JSON.parse(e.data)) } catch {}
      }
      ws.onclose = () => {
        console.log("WS Closed. Reconnecting in 2s...")
        setTimeout(connect, 2000)
      }
      ws.onerror = () => ws.close()
    }
    connect()
    return () => { wsRef.current?.close() }
  }, [])

  return state
}
