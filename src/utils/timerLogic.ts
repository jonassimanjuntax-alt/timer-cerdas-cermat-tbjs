/**
 * Pure timer logic and formatting functions for Lomba Cerdas Cermat timer.
 * Fully decoupled for high-precision testing.
 */

export const DEFAULT_DURATION_SECONDS = 30;
export const URGENT_THRESHOLD_SECONDS = 10;

export type TimerStatus = 'idle' | 'running' | 'paused' | 'finished';

/**
 * Format remaining seconds into MM:SS format (e.g. 30 -> "00:30", 9 -> "00:09", 0 -> "00:00")
 */
export function formatTime(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(minutes)}:${pad(seconds)}`;
}

/**
 * Check if the current time is in the urgent zone (<= 10 seconds and > 0 seconds)
 */
export function isUrgentTime(remainingSeconds: number): boolean {
  return remainingSeconds <= URGENT_THRESHOLD_SECONDS && remainingSeconds > 0;
}

/**
 * Check if timer has reached zero
 */
export function isTimeFinished(remainingSeconds: number): boolean {
  return remainingSeconds <= 0;
}

/**
 * Calculate progress ratio from 0 to 1
 */
export function calculateProgress(remainingSeconds: number, totalDuration: number = DEFAULT_DURATION_SECONDS): number {
  if (totalDuration <= 0) return 0;
  const clamped = Math.max(0, Math.min(remainingSeconds, totalDuration));
  return clamped / totalDuration;
}

/**
 * Pure transition handler for timer actions
 */
export interface TimerState {
  status: TimerStatus;
  remainingSeconds: number;
  totalDuration: number;
}

export function handleStart(state: TimerState): TimerState {
  if (state.status === 'running') return state;
  if (state.status === 'finished') {
    return {
      ...state,
      status: 'running',
      remainingSeconds: state.totalDuration,
    };
  }
  return {
    ...state,
    status: 'running',
  };
}

export function handlePause(state: TimerState): TimerState {
  if (state.status !== 'running') return state;
  return {
    ...state,
    status: 'paused',
  };
}

export function handleReset(state: TimerState, totalDuration: number = DEFAULT_DURATION_SECONDS): TimerState {
  return {
    totalDuration,
    remainingSeconds: totalDuration,
    status: 'idle',
  };
}

export function handleSecondTick(state: TimerState): TimerState {
  if (state.status !== 'running') return state;
  const nextRemaining = Math.max(0, state.remainingSeconds - 1);
  return {
    ...state,
    remainingSeconds: nextRemaining,
    status: nextRemaining === 0 ? 'finished' : 'running',
  };
}
