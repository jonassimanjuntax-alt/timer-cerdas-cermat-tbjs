import { useState, useEffect, useCallback } from 'react';
import { Volume2, VolumeX, Maximize2, Minimize2 } from 'lucide-react';

interface TopBarProps {
  isMuted: boolean;
  onToggleMute: () => void;
}

export function TopBar({ isMuted, onToggleMute }: TopBarProps) {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Sync fullscreen state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleToggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch {
      // Graceful fallback if iframe sandbox prohibits native fullscreen
      setIsFullscreen((prev) => !prev);
    }
  }, []);

  return (
    <div className="absolute top-3 sm:top-5 right-3 sm:right-6 flex items-center gap-2.5 z-50 select-none">
      {/* Sound Toggle Icon Button */}
      <button
        type="button"
        onClick={onToggleMute}
        aria-label={isMuted ? 'Aktifkan Suara Tik & Buzzer' : 'Bisukan Suara'}
        title={isMuted ? 'Aktifkan Suara' : 'Bisukan Suara'}
        className={`p-2.5 sm:p-3 rounded-xl border transition-all duration-200 cursor-pointer shadow-lg backdrop-blur-md active:scale-90 ${
          isMuted
            ? 'bg-rose-950/70 border-rose-500/50 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
            : 'bg-slate-900/70 border-cyan-500/40 text-cyan-300 hover:text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
        }`}
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5 sm:w-6 sm:h-6" />
        ) : (
          <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />
        )}
      </button>

      {/* Fullscreen Toggle Icon Button */}
      <button
        type="button"
        onClick={handleToggleFullscreen}
        aria-label={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh (Fullscreen)'}
        title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'}
        className="p-2.5 sm:p-3 rounded-xl bg-slate-900/70 border border-cyan-500/40 text-cyan-300 hover:text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.25)] transition-all duration-200 cursor-pointer shadow-lg backdrop-blur-md active:scale-90"
      >
        {isFullscreen ? (
          <Minimize2 className="w-5 h-5 sm:w-6 sm:h-6" />
        ) : (
          <Maximize2 className="w-5 h-5 sm:w-6 sm:h-6" />
        )}
      </button>
    </div>
  );
}
