import { useEffect } from 'react';
import { useCountdownTimer } from './hooks/useCountdownTimer';
import { Header } from './components/Header';
import { TimerDisplay } from './components/TimerDisplay';
import { ControlButtons } from './components/ControlButtons';
import { TopBar } from './components/TopBar';

export default function App() {
  const {
    status,
    timeFormatted,
    isUrgent,
    isFinished,
    progressRatio,
    isMuted,
    handleStart,
    handlePause,
    handleReset,
    handleToggleMute,
  } = useCountdownTimer(30);

  // Check ?autostart=1 parameter for testability
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1') {
        handleStart();
      }
    }
  }, [handleStart]);

  // Global keyboard shortcuts for quick competition operator control
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is focusing an input (if any)
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        if (status === 'running') {
          handlePause();
        } else {
          handleStart();
        }
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleReset();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        handleToggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [status, handleStart, handlePause, handleReset, handleToggleMute]);

  return (
    <main className="relative min-h-screen w-full flex flex-col justify-between items-center bg-ambient-gradient text-slate-100 overflow-hidden py-3 sm:py-6 px-4">
      {/* Top right floating utility buttons (Sound & Fullscreen only) */}
      <TopBar isMuted={isMuted} onToggleMute={handleToggleMute} />

      {/* Header section with event & school branding */}
      <Header isUrgent={isUrgent} isFinished={isFinished} />

      {/* Center hero: Giant 00:30 Countdown & Waktu Habis Banner */}
      <TimerDisplay
        timeFormatted={timeFormatted}
        isUrgent={isUrgent}
        isFinished={isFinished}
        progressRatio={progressRatio}
        status={status}
      />

      {/* Bottom section: 3 Main Control Buttons (MULAI, JEDA, RESET) */}
      <footer className="w-full flex flex-col items-center">
        <ControlButtons
          status={status}
          onStart={handleStart}
          onPause={handlePause}
          onReset={handleReset}
        />

        {/* Discreet keyboard shortcuts helper for operator */}
        <div className="text-[11px] sm:text-xs text-slate-400/80 font-medium tracking-wider flex items-center gap-3 pb-1 select-none">
          <span>Pintasan:</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-cyan-300">Spasi</kbd> Mulai/Jeda</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-rose-300">R</kbd> Reset</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">M</kbd> Audio</span>
        </div>
      </footer>
    </main>
  );
}
