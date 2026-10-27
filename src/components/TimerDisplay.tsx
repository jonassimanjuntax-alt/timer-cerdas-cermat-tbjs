interface TimerDisplayProps {
  timeFormatted: string;
  isUrgent: boolean;
  isFinished: boolean;
  progressRatio: number;
  status: 'idle' | 'running' | 'paused' | 'finished';
}

export function TimerDisplay({
  timeFormatted,
  isUrgent,
  isFinished,
  progressRatio,
  status,
}: TimerDisplayProps) {
  // Color configuration according to timer urgency & finished state
  const isRedMode = isUrgent || isFinished;

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-6xl mx-auto px-4 my-auto select-none">
      {/* Outer ambient glow ring/container */}
      <div
        className={`relative flex flex-col items-center justify-center w-full rounded-3xl py-6 sm:py-10 md:py-14 px-4 sm:px-8 border transition-all duration-500 backdrop-blur-md ${
          isFinished
            ? 'border-rose-500/80 bg-rose-950/20 shadow-[0_0_80px_rgba(244,63,94,0.35)]'
            : isUrgent
            ? 'border-rose-500/70 bg-rose-950/25 shadow-[0_0_70px_rgba(244,63,94,0.3)] animate-urgent-pulse'
            : status === 'paused'
            ? 'border-amber-400/50 bg-slate-900/40 shadow-[0_0_40px_rgba(251,191,36,0.15)]'
            : 'border-cyan-500/40 bg-slate-900/40 shadow-[0_0_60px_rgba(6,182,212,0.2)]'
        }`}
      >
        {/* Status Chip (Berjalan / Dijeda / Siap) */}
        <div className="absolute -top-4 sm:-top-5 px-5 py-1 rounded-full text-xs sm:text-sm font-extrabold uppercase tracking-widest border shadow-lg backdrop-blur-md transition-all duration-300">
          {status === 'idle' && (
            <span className="text-cyan-300 bg-slate-900/90 border-cyan-500/50 px-4 py-1 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              SIAP MULAI
            </span>
          )}
          {status === 'running' && !isUrgent && (
            <span className="text-cyan-300 bg-slate-900/90 border-cyan-500/60 px-4 py-1 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.4)] animate-pulse">
              COUNTDOWN AKTIF
            </span>
          )}
          {status === 'running' && isUrgent && (
            <span className="text-rose-300 bg-rose-950/90 border-rose-500/80 px-4 py-1 rounded-full shadow-[0_0_25px_rgba(244,63,94,0.6)] font-black">
              DETIK KRITIS
            </span>
          )}
          {status === 'paused' && (
            <span className="text-amber-300 bg-slate-900/90 border-amber-500/60 px-4 py-1 rounded-full shadow-[0_0_20px_rgba(251,191,36,0.35)]">
              WAKTU DIJEDA
            </span>
          )}
          {status === 'finished' && (
            <span className="text-rose-400 bg-rose-950/90 border-rose-500/90 px-4 py-1 rounded-full shadow-[0_0_30px_rgba(244,63,94,0.7)] font-black">
              SELESAI
            </span>
          )}
        </div>

        {/* GIANT COUNTDOWN DIGITS */}
        <div
          data-testid="timer-digits"
          className={`font-digital font-bold text-center leading-none tracking-tight transition-all duration-300 select-none ${
            // Ultra-responsive scaling ensuring massive view on projector & IFP
            'text-[20vw] sm:text-[18vw] md:text-[16vw] lg:text-[14vw] xl:text-[13rem]'
          } ${
            isRedMode
              ? 'text-rose-500 glow-red'
              : 'text-cyan-300 glow-blue'
          }`}
          style={{ textShadow: isRedMode ? '0 0 40px #ff2a5f, 0 0 80px rgba(255,42,95,0.6)' : '0 0 35px #00d2ff, 0 0 75px rgba(0,210,255,0.5)' }}
        >
          {timeFormatted}
        </div>

        {/* WAKTU HABIS! Banner when finished */}
        {isFinished ? (
          <div
            data-testid="waktu-habis-banner"
            className="mt-3 sm:mt-5 px-8 sm:px-14 py-2.5 sm:py-4 rounded-2xl bg-gradient-to-r from-rose-950/95 via-red-700 to-rose-950/95 border-2 border-rose-400 shadow-[0_0_60px_rgba(244,63,94,0.95)]"
          >
            <h3 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-[0.25em] text-white uppercase drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              WAKTU HABIS!
            </h3>
          </div>
        ) : (
          /* High Precision Progress Bar (Visible while counting down) */
          <div className="w-full max-w-3xl mt-4 sm:mt-6 px-4">
            <div className="h-3 sm:h-4 w-full bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-700/60 shadow-inner">
              <div
                className={`h-full rounded-full transition-all duration-150 ${
                  isRedMode
                    ? 'bg-gradient-to-r from-red-600 to-rose-400 shadow-[0_0_20px_#f43f5e]'
                    : 'bg-gradient-to-r from-blue-600 via-cyan-400 to-sky-300 shadow-[0_0_20px_#00d2ff]'
                }`}
                style={{ width: `${progressRatio * 100}%` }}
              />
            </div>
            {/* Subtle fraction indicator */}
            <div className="flex justify-between items-center text-[10px] sm:text-xs font-semibold tracking-wider text-slate-400 mt-1.5 px-1 uppercase">
              <span>00:00</span>
              <span className="font-mono text-cyan-400/80 font-bold">
                {Math.round(progressRatio * 30)}s / 30s
              </span>
              <span>00:30</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
