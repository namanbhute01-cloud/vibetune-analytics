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

export const CameraGrid: React.FC = () => {
  const { list, updateSettings } = useCameras();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {list.length > 0 ? (
        list.map((source, index) => (
          <CameraTile 
            key={index} 
            id={index} 
            name={`Camera ${index + 1}`} 
            source={source}
            onUpdate={updateSettings}
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
  onUpdate: (id: number, settings: any) => void;
}

const CameraTile: React.FC<CameraTileProps> = ({ id, name, source, onUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState({ brightness: 1.0, contrast: 1.0, sharpness: 0.0 });

  const handleSliderChange = (key: string, val: number[]) => {
    const newSettings = { ...settings, [key]: val[0] };
    setSettings(newSettings);
    // Debounce could be added here, but following the "wire" instruction for now
    onUpdate(id, newSettings);
  };

  return (
    <Card className="overflow-hidden bg-card/50 border-border group">
      <CardHeader className="p-3 flex flex-row items-center justify-between bg-muted/30">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <CardTitle className="text-sm font-medium">{name}</CardTitle>
        </div>
        <Badge variant="outline" className="text-[10px] uppercase opacity-70">
          {source.length > 10 ? 'RTSP' : 'USB'}
        </Badge>
      </CardHeader>
      
      <CardContent className="p-0 relative">
        {/* MJPEG Stream */}
        <div className="aspect-video bg-black flex items-center justify-center overflow-hidden">
          <img 
            src={`/api/cameras/feed/${id}?t=${Date.now()}`} 
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://placehold.co/640x360/000000/FFFFFF?text=No+Signal';
            }}
          />
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
          
          <CollapsibleContent className="bg-background/95 backdrop-blur-xl border-t border-border p-4 space-y-4 shadow-2xl animate-in slide-in-from-bottom-2">
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] uppercase font-bold text-muted-foreground">
                  <span>Brightness</span>
                  <span>{settings.brightness.toFixed(1)}</span>
                </div>
                <Slider 
                  value={[settings.brightness]} 
                  min={0.5} max={2.0} step={0.1}
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
                  min={0.5} max={2.0} step={0.1}
                  onValueChange={(v) => handleSliderChange('contrast', v)}
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] uppercase font-bold text-muted-foreground">
                  <span>Sharpness</span>
                  <span>{settings.sharpness.toFixed(1)}</span>
                </div>
                <Slider 
                  value={[settings.sharpness]} 
                  min={0} max={1.0} step={0.1}
                  onValueChange={(v) => handleSliderChange('sharpness', v)}
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};
