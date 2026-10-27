import { useState, useRef, useEffect, useCallback } from 'react';
import {
  DEFAULT_DURATION_SECONDS,
  formatTime,
  isUrgentTime,
  isTimeFinished,
  TimerStatus,
} from '../utils/timerLogic';
import { soundController } from '../utils/audio';

export function useCountdownTimer(totalDuration: number = DEFAULT_DURATION_SECONDS) {
  // Check if test duration query parameter exists (e.g. ?duration=12 for test verification)
  const initialDuration = (() => {
    if (typeof window !== 'undefined') {
      const param = new URLSearchParams(window.location.search).get('duration');
      if (param) {
        const parsed = parseInt(param, 10);
        if (!isNaN(parsed) && parsed > 0) return parsed;
      }
    }
    return totalDuration;
  })();

  const [status, setStatus] = useState<TimerStatus>('idle');
  // Store remaining time in milliseconds for sub-millisecond precision
  const [remainingMs, setRemainingMs] = useState<number>(initialDuration * 1000);

  // Audio mute state
  const [isMuted, setIsMuted] = useState<boolean>(soundController.getMuted());

  // Refs for animation frame & timestamp tracking
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const remainingMsRef = useRef<number>(totalDuration * 1000);
  const statusRef = useRef<TimerStatus>('idle');
  const lastSecondRef = useRef<number>(totalDuration);

  // Keep refs in sync
  useEffect(() => {
    remainingMsRef.current = remainingMs;
  }, [remainingMs]);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  // Stop loop
  const stopLoop = useCallback(() => {
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    lastTimeRef.current = null;
  }, []);

  // Timer loop with performance.now()
  const runTimerStep = useCallback(() => {
    if (statusRef.current !== 'running') return;

    const now = performance.now();
    if (lastTimeRef.current === null) {
      lastTimeRef.current = now;
    }

    const delta = now - lastTimeRef.current;
    lastTimeRef.current = now;

    const newRemaining = Math.max(0, remainingMsRef.current - delta);
    remainingMsRef.current = newRemaining;
    setRemainingMs(newRemaining);

    // Current full seconds (e.g. 29.999s -> 29s, 0.05s -> 0s)
    const currentSecond = Math.ceil(newRemaining / 1000);

    // Check if second has ticked down
    if (currentSecond < lastSecondRef.current) {
      const isUrgent = currentSecond <= 10 && currentSecond > 0;
      lastSecondRef.current = currentSecond;

      if (currentSecond > 0) {
        soundController.playTick(isUrgent);
      }
    }

    // Check completion
    if (newRemaining <= 0) {
      remainingMsRef.current = 0;
      setRemainingMs(0);
      setStatus('finished');
      statusRef.current = 'finished';
      stopLoop();
      // Trigger buzzer
      soundController.playBuzzer();
      return;
    }

    animFrameRef.current = requestAnimationFrame(runTimerStep);
  }, [stopLoop]);

  // Start / Resume
  const handleStart = useCallback(() => {
    soundController.initOnUserGesture();

    if (statusRef.current === 'running') return;

    if (statusRef.current === 'finished') {
      // If restarting from finished, reset to initial duration first
      const fullMs = totalDuration * 1000;
      remainingMsRef.current = fullMs;
      lastSecondRef.current = totalDuration;
      setRemainingMs(fullMs);
      soundController.stopAllAudio();
    }

    setStatus('running');
    statusRef.current = 'running';
    lastTimeRef.current = performance.now();
    animFrameRef.current = requestAnimationFrame(runTimerStep);
  }, [totalDuration, runTimerStep]);

  // Pause
  const handlePause = useCallback(() => {
    if (statusRef.current !== 'running') return;
    setStatus('paused');
    statusRef.current = 'paused';
    stopLoop();
    soundController.stopAllAudio();
  }, [stopLoop]);

  // Reset
  const handleReset = useCallback(() => {
    stopLoop();
    soundController.stopAllAudio();
    const fullMs = initialDuration * 1000;
    remainingMsRef.current = fullMs;
    lastSecondRef.current = initialDuration;
    setRemainingMs(fullMs);
    setStatus('idle');
    statusRef.current = 'idle';
  }, [stopLoop, initialDuration]);

  // Toggle Mute
  const handleToggleMute = useCallback(() => {
    soundController.initOnUserGesture();
    const nextMuted = soundController.toggleMute();
    setIsMuted(nextMuted);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopLoop();
      soundController.stopAllAudio();
    };
  }, [stopLoop]);

  // Derived display values
  const currentSeconds = Math.ceil(remainingMs / 1000);
  const timeFormatted = formatTime(currentSeconds);
  const isUrgent = isUrgentTime(currentSeconds) && status !== 'finished';
  const isFinished = status === 'finished' || isTimeFinished(currentSeconds);
  const progressRatio = Math.max(0, Math.min(1, remainingMs / (totalDuration * 1000)));

  return {
    status,
    remainingMs,
    currentSeconds,
    timeFormatted,
    isUrgent,
    isFinished,
    progressRatio,
    isMuted,
    handleStart,
    handlePause,
    handleReset,
    handleToggleMute,
  };
}
