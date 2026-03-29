import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MusicPlayer } from "@/components/MusicPlayer";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Cameras from "./pages/Cameras.tsx";
import Audience from "./pages/Audience.tsx";
import Playlist from "./pages/Playlist.tsx";
import Analytics from "./pages/Analytics.tsx";
import Settings from "./pages/Settings.tsx";

const queryClient = new QueryClient();

// Keyboard shortcuts wrapper component
function KeyboardShortcuts() {
  useKeyboardShortcuts();
  return null;
}

// Auto-play music on app start
function AutoPlayMusic() {
  const [played, setPlayed] = useState(false);

  useEffect(() => {
    if (!played) {
      // Auto-play music from adults group on first load
      api.playbackAction('next', { group: 'adults' })
        .then(() => setPlayed(true))
        .catch(err => console.error('[AutoPlay] Error:', err));
    }
  }, [played]);

  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <KeyboardShortcuts />
        <AutoPlayMusic />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/cameras" element={<Cameras />} />
          <Route path="/audience" element={<Audience />} />
          <Route path="/playlist" element={<Playlist />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <MusicPlayer />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
