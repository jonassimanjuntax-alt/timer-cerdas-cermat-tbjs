import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatTime,
  isUrgentTime,
  isTimeFinished,
  calculateProgress,
  handleStart,
  handlePause,
  handleReset,
  handleSecondTick,
  TimerState,
} from './timerLogic';

test('formatTime properly formats seconds to MM:SS', () => {
  assert.equal(formatTime(30), '00:30');
  assert.equal(formatTime(9), '00:09');
  assert.equal(formatTime(0), '00:00');
  assert.equal(formatTime(65), '01:05');
  assert.equal(formatTime(-5), '00:00');
});

test('isUrgentTime correctly flags the final 10 seconds', () => {
  assert.equal(isUrgentTime(30), false);
  assert.equal(isUrgentTime(11), false);
  assert.equal(isUrgentTime(10), true);
  assert.equal(isUrgentTime(5), true);
  assert.equal(isUrgentTime(1), true);
  assert.equal(isUrgentTime(0), false); // 0 is finished, not urgent ticking
});

test('isTimeFinished detects completion', () => {
  assert.equal(isTimeFinished(30), false);
  assert.equal(isTimeFinished(1), false);
  assert.equal(isTimeFinished(0), true);
  assert.equal(isTimeFinished(-1), true);
});

test('calculateProgress returns correct proportions', () => {
  assert.equal(calculateProgress(30, 30), 1);
  assert.equal(calculateProgress(15, 30), 0.5);
  assert.equal(calculateProgress(0, 30), 0);
  assert.equal(calculateProgress(-5, 30), 0);
});

test('timer state transitions work reliably', () => {
  const initial: TimerState = {
    totalDuration: 30,
    remainingSeconds: 30,
    status: 'idle',
  };

  const running = handleStart(initial);
  assert.equal(running.status, 'running');
  assert.equal(running.remainingSeconds, 30);

  const ticked = handleSecondTick(running);
  assert.equal(ticked.status, 'running');
  assert.equal(ticked.remainingSeconds, 29);

  const paused = handlePause(ticked);
  assert.equal(paused.status, 'paused');
  assert.equal(paused.remainingSeconds, 29);

  const resumed = handleStart(paused);
  assert.equal(resumed.status, 'running');
  assert.equal(resumed.remainingSeconds, 29);

  const reset = handleReset(resumed, 30);
  assert.equal(reset.status, 'idle');
  assert.equal(reset.remainingSeconds, 30);
});

test('countdown finishes cleanly at 0 seconds', () => {
  const almostDone: TimerState = {
    totalDuration: 30,
    remainingSeconds: 1,
    status: 'running',
  };

  const finished = handleSecondTick(almostDone);
  assert.equal(finished.status, 'finished');
  assert.equal(finished.remainingSeconds, 0);

  // ticking when finished should not decrement below 0
  const afterFinished = handleSecondTick(finished);
  assert.equal(afterFinished.status, 'finished');
  assert.equal(afterFinished.remainingSeconds, 0);
});
