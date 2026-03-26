import React, { useState } from 'react';
import { useCameras } from '@/hooks/useCameras';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Settings2, Video, VideoOff } from 'lucide-react';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '@/components/ui/collapsible';
import { cameras as camerasApi } from '@/lib/api';

export const CameraGrid: React.FC = () => {
  const { list } = useCameras();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 p-4">
      {list.length > 0 ? (
        list.map((cam, index) => (
          <CameraTile 
            key={cam.id ?? index} 
            id={cam.id ?? index} 
            name={cam.name || `Camera ${index + 1}`} 
            source={cam.source || '0'}
          />
        ))
      ) : (
        <Card className="col-span-full py-12 flex flex-col items-center justify-center text-muted-foreground border-dashed">
          <VideoOff className="w-12 h-12 mb-4 opacity-20" />
          <p>No camera sources found in .env</p>
        </Card>
      )}
    </div>
  );
};

interface CameraTileProps {
  id: number;
  name: string;
  source: string;
}

const CameraTile: React.FC<CameraTileProps> = ({ id, name, source }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState({ brightness: 1.0, contrast: 1.0, sharpness: 0.0 });
  const [error, setError] = useState(false);

  const handleSliderChange = async (key: string, val: number[]) => {
    const newSettings = { ...settings, [key]: val[0] };
    setSettings(newSettings);
    try {
        await camerasApi.updateSettings(id, newSettings);
    } catch (err) {
        console.error('Failed to update camera settings', err);
    }
  };

  return (
    <Card className="overflow-hidden bg-card/50 border-border group">
      <CardHeader className="p-3 flex flex-row items-center justify-between bg-muted/30">
        <div className="flex items-center gap-2">
          <div className={cn("w-2 h-2 rounded-full", error ? "bg-red-500" : "bg-green-500 animate-pulse")} />
          <CardTitle className="text-sm font-medium">{name}</CardTitle>
        </div>
        <Badge variant="outline" className="text-[10px] uppercase opacity-70">
          {source.length > 2 ? 'RTSP' : 'USB'}
        </Badge>
      </CardHeader>
      
      <CardContent className="p-0 relative">
        {/* MJPEG Stream via Proxy */}
        <div className="aspect-video bg-black flex items-center justify-center overflow-hidden">
          {!error ? (
            <img 
              src={`/api/cameras/feed/${id}?t=${Date.now()}`} 
              alt={name}
              className="w-full h-full object-cover"
              onError={() => setError(true)}
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <VideoOff className="w-8 h-8 opacity-20" />
                <span className="text-[10px] uppercase font-bold tracking-widest">No Signal</span>
            </div>
          )}
        </div>

        {/* Collapsible Settings */}
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="absolute bottom-0 left-0 right-0">
          <div className="flex justify-end p-2">
            <CollapsibleTrigger asChild>
              <button className="p-1.5 rounded-full bg-background/80 backdrop-blur-md border border-border hover:bg-background transition-colors">
                <Settings2 className="w-4 h-4" />
              </button>
            </CollapsibleTrigger>
          </div>
          
          <CollapsibleContent className="bg-background/95 backdrop-blur-xl border-t border-border p-4 space-y-4 shadow-2xl">
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] uppercase font-bold text-muted-foreground">
                  <span>Brightness</span>
                  <span>{settings.brightness.toFixed(1)}</span>
                </div>
                <Slider 
                  value={[settings.brightness]} 
                  min={0.0} max={2.0} step={0.1}
                  onValueChange={(v) => handleSliderChange('brightness', v)}
                />
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] uppercase font-bold text-muted-foreground">
                  <span>Contrast</span>
                  <span>{settings.contrast.toFixed(1)}</span>
                </div>
                <Slider 
                  value={[settings.contrast]} 
                  min={0.0} max={2.0} step={0.1}
                  onValueChange={(v) => handleSliderChange('contrast', v)}
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
