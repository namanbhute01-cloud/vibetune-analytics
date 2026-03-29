import { useCameras } from '@/hooks/useCameras'
import { api } from '@/lib/api'
import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function CameraGrid() {
  const cameras = useCameras()
  const [feedTimestamp, setFeedTimestamp] = useState(Date.now())

  // Refresh feed URL every 30 seconds to prevent stale connections
  useEffect(() => {
    const interval = setInterval(() => setFeedTimestamp(Date.now()), 30000)
    return () => clearInterval(interval)
  }, [])

  if (cameras.length === 0) {
    return (
      <Card className="flex items-center justify-center h-48 text-muted-foreground border-dashed">
        No cameras connected. Add CAMERA_SOURCES to the backend .env file.
      </Card>
    )
  }

  return (
    <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))', gap:16}}>
      {cameras.map(cam => (
        <Card key={cam.id} className="overflow-hidden bg-black/40 border-white/5 backdrop-blur-md">
          <div className="relative aspect-video bg-black">
            <img
              src={`${api.feedUrl(cam.id)}?t=${feedTimestamp}`}
              className="w-full h-full object-contain"
              onError={e => {
                const t = e.target as HTMLImageElement
                t.style.display = 'none'
                if (t.nextSibling) (t.nextSibling as HTMLElement).style.display = 'flex'
              }}
            />
            <div className="absolute inset-0 items-center justify-center text-muted-foreground hidden">
              No signal
            </div>
            {/* Auto-enhancement indicator */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-emerald-500/20 backdrop-blur-sm px-2 py-1 rounded border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[9px] font-medium text-emerald-400 uppercase tracking-wider">Auto-Enhance</span>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white/80">{cam.name}</span>
              <Badge variant={cam.status === 'online' ? 'default' : 'secondary'} className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                {cam.status}
              </Badge>
            </div>
            {/* Auto-settings display */}
            <div className="pt-2 space-y-2 text-xs text-muted-foreground">
              <div className="flex justify-between items-center">
                <span className="uppercase tracking-widest text-[10px]">Image Enhancement</span>
                <span className="text-emerald-400 font-medium">Active</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span>Auto-Brightness</span>
                <span className="text-muted-foreground">Adjusting to lighting</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span>Auto-Contrast</span>
                <span className="text-muted-foreground">Histogram-based</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span>Auto-Sharpness</span>
                <span className="text-muted-foreground">Edge enhancement</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
