import { useState, useEffect } from 'react'
import { api } from '@/lib/api'

export function useCameras() {
  const [cameras, setCameras] = useState<any[]>([])

  useEffect(() => {
    const poll = () => api.getCameras()
      .then(d => setCameras(Array.isArray(d) ? d : []))
      .catch(() => {})
    poll()
    const id = setInterval(poll, 5000)
    return () => clearInterval(id)
  }, [])

  return cameras
}
