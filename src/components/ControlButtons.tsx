import { Play, Pause, RotateCcw } from 'lucide-react';
import { TimerStatus } from '../utils/timerLogic';

interface ControlButtonsProps {
  status: TimerStatus;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export function ControlButtons({
  status,
  onStart,
  onPause,
  onReset,
}: ControlButtonsProps) {
  const isRunning = status === 'running';

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 w-full max-w-4xl px-4 pb-4 sm:pb-8 select-none">
      {/* TOMBOL 1: MULAI */}
      <button
        type="button"
        onClick={onStart}
        disabled={isRunning}
        aria-label="Mulai atau Lanjutkan Countdown"
        className={`group relative flex items-center justify-center gap-3 px-8 sm:px-12 py-4 sm:py-5 rounded-2xl font-black text-xl sm:text-2xl tracking-wider uppercase transition-all duration-200 active:scale-95 shadow-xl cursor-pointer ${
          isRunning
            ? 'opacity-30 cursor-not-allowed bg-slate-800 text-slate-500 border border-slate-700'
            : 'bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-2 border-cyan-300 shadow-[0_0_35px_rgba(6,182,212,0.5)] hover:shadow-[0_0_50px_rgba(6,182,212,0.8)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]'
        }`}
      >
        <Play className="w-6 h-6 sm:w-8 sm:h-8 fill-white stroke-white" />
        <span>MULAI</span>
      </button>

      {/* TOMBOL 2: JEDA */}
      <button
        type="button"
        onClick={onPause}
        disabled={!isRunning}
        aria-label="Jeda Countdown dan Suara"
        className={`group relative flex items-center justify-center gap-3 px-8 sm:px-12 py-4 sm:py-5 rounded-2xl font-black text-xl sm:text-2xl tracking-wider uppercase transition-all duration-200 active:scale-95 shadow-xl cursor-pointer ${
          !isRunning
            ? 'opacity-30 cursor-not-allowed bg-slate-800 text-slate-500 border border-slate-700'
            : 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 border-2 border-amber-200 shadow-[0_0_35px_rgba(245,158,11,0.6)] hover:shadow-[0_0_50px_rgba(245,158,11,0.9)]'
        }`}
      >
        <Pause className="w-6 h-6 sm:w-8 sm:h-8 fill-slate-950 stroke-slate-950" />
        <span>JEDA</span>
      </button>

      {/* TOMBOL 3: RESET */}
      <button
        type="button"
        onClick={onReset}
        aria-label="Reset Timer ke 00:30"
        className="group relative flex items-center justify-center gap-3 px-8 sm:px-12 py-4 sm:py-5 rounded-2xl font-black text-lg sm:text-2xl tracking-wider uppercase transition-all duration-200 active:scale-95 shadow-xl cursor-pointer bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-500 hover:to-red-500 text-white border-2 border-rose-400 shadow-[0_0_35px_rgba(244,63,94,0.45)] hover:shadow-[0_0_50px_rgba(244,63,94,0.75)]"
      >
        <RotateCcw className="w-6 h-6 sm:w-8 sm:h-8 stroke-[2.5]" />
        <span>RESET</span>
      </button>
    </div>
  );
}
