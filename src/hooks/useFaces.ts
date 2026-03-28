import { useState, useEffect } from 'react'
import { api } from '@/lib/api'

export function useFaces() {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    const poll = () => api.getFaces().then(setData).catch(() => {})
    poll()
    const id = setInterval(poll, 10000)
    return () => clearInterval(id)
  }, [])

  return data
}
