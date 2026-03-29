import { useEffect } from 'react'
import { usePlayback } from './usePlayback'

export function useKeyboardShortcuts() {
  const { play, pause, next, prev, setVol } = usePlayback()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault()
          // Toggle play/pause
          play()
          setTimeout(() => pause(), 100)
          break
        case 'KeyK':
          e.preventDefault()
          play()
          setTimeout(() => pause(), 100)
          break
        case 'ArrowRight':
          e.preventDefault()
          next()
          break
        case 'ArrowLeft':
          e.preventDefault()
          prev()
          break
        case 'ArrowUp':
          e.preventDefault()
          // Volume up
          setVol(Math.min(100, (e.target as any).volume + 5))
          break
        case 'ArrowDown':
          e.preventDefault()
          // Volume down
          setVol(Math.max(0, (e.target as any).volume - 5))
          break
        case 'KeyM':
          e.preventDefault()
          // Mute (set volume to 0)
          setVol(0)
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [play, pause, next, prev, setVol])
}
