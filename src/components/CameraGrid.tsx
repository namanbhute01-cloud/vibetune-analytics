import { useCameras } from '@/hooks/useCameras'
import { api } from '@/lib/api'
import { useState, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'

export function CameraGrid() {
  const cameras = useCameras()
  const [settings, setSettings] = useState<Record<number, any>>({})
  const debounceRef = useRef<Record<number, any>>({})

  const handleSlider = (cam_id: number, key: string, value: number) => {
    setSettings(prev => ({...prev, [cam_id]: {...(prev[cam_id]||{}), [key]: value}}))
    if (debounceRef.current[cam_id]) clearTimeout(debounceRef.current[cam_id])
    debounceRef.current[cam_id] = setTimeout(() => {
      api.setCameraSettings(cam_id, {...(settings[cam_id]||{}), [key]: value})
    }, 500)
  }

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
              src={api.feedUrl(cam.id)}
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
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white/80">{cam.name}</span>
              <Badge variant={cam.status === 'online' ? 'default' : 'secondary'} className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                {cam.status}
              </Badge>
            </div>
            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
                  <span>Brightness</span>
                  <span>{((settings[cam.id]?.brightness ?? 0) * 100).toFixed(0)}%</span>
                </div>
                <Slider min={-1} max={1} step={0.05}
                  value={[settings[cam.id]?.brightness ?? 0]}
                  onValueChange={([v]) => handleSlider(cam.id, 'brightness', v)} />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
                  <span>Contrast</span>
                  <span>{(settings[cam.id]?.contrast ?? 1).toFixed(2)}</span>
                </div>
                <Slider min={0.5} max={2} step={0.05}
                  value={[settings[cam.id]?.contrast ?? 1]}
                  onValueChange={([v]) => handleSlider(cam.id, 'contrast', v)} />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
                  <span>Sharpness</span>
                  <span>{(settings[cam.id]?.sharpness ?? 0).toFixed(2)}</span>
                </div>
                <Slider min={0} max={1} step={0.05}
                  value={[settings[cam.id]?.sharpness ?? 0]}
                  onValueChange={([v]) => handleSlider(cam.id, 'sharpness', v)} />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
