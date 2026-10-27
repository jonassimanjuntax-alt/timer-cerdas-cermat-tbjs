interface HeaderProps {
  isUrgent?: boolean;
  isFinished?: boolean;
}

export function Header({ isUrgent, isFinished }: HeaderProps) {
  return (
    <header className="flex flex-col items-center justify-center text-center px-4 pt-10 sm:pt-4 select-none transition-all duration-300 w-full max-w-4xl">
      {/* Decorative top badge */}
      <div className="hidden sm:flex items-center gap-2 mb-1.5 sm:mb-2">
        <span
          className={`h-1.5 sm:h-2 w-8 sm:w-16 rounded-full transition-colors duration-500 ${
            isFinished
              ? 'bg-rose-500 shadow-[0_0_12px_#f43f5e]'
              : isUrgent
              ? 'bg-amber-400 shadow-[0_0_12px_#fbbf24]'
              : 'bg-cyan-400 shadow-[0_0_12px_#22d3ee]'
          }`}
        />
        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-cyan-300/80">
          Official Competition Timer
        </span>
        <span
          className={`h-1.5 sm:h-2 w-8 sm:w-16 rounded-full transition-colors duration-500 ${
            isFinished
              ? 'bg-rose-500 shadow-[0_0_12px_#f43f5e]'
              : isUrgent
              ? 'bg-amber-400 shadow-[0_0_12px_#fbbf24]'
              : 'bg-rose-500 shadow-[0_0_12px_#f43f5e]'
          }`}
        />
      </div>

      {/* Main Title: LOMBA CERDAS CERMAT */}
      <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-wider uppercase text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
        <span className="bg-gradient-to-r from-cyan-300 via-sky-200 to-rose-400 bg-clip-text text-transparent">
          LOMBA CERDAS CERMAT
        </span>
      </h1>

      {/* School Name: SMAS TUNAS BARU JIN SEUNG BATAM */}
      <div className="mt-1 sm:mt-2.5 px-4 py-1 sm:py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.15)] backdrop-blur-sm">
        <h2 className="text-xs sm:text-base md:text-xl lg:text-2xl font-bold tracking-[0.18em] text-cyan-200 uppercase">
          SMAS TUNAS BARU JIN SEUNG BATAM
        </h2>
      </div>
    </header>
  );
}
