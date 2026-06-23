import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { TimerInit, TimerStatus } from '../types';

export interface TimerSnapshot {
  status: TimerStatus;
  startedAtEpoch: number;
  pausedElapsed: number;
}

interface UseTimerResult {
  elapsed: number;
  status: TimerStatus;
  pause: () => void;
  resume: () => void;
  complete: () => void;
  getSnapshot: () => TimerSnapshot;
}

export function useTimer(
  durationSeconds: number,
  onComplete: () => void,
  init?: TimerInit
): UseTimerResult {
  const initialStatus: TimerStatus = init?.status ?? 'running';

  // runOrigin: the Date.now() value that corresponds to elapsed=0 for the current run.
  //   elapsed = (Date.now() - runOrigin) / 1000
  //   pausing  → save current elapsed in pausedElapsed
  //   resuming → runOrigin = Date.now() - pausedElapsed * 1000
  const runOriginRef = useRef<number>(init?.startedAtEpoch ?? Date.now());
  const pausedElapsedRef = useRef<number>(init?.pausedElapsed ?? 0);

  const [elapsed, setElapsed] = useState<number>(() => {
    if (initialStatus === 'paused') return init?.pausedElapsed ?? 0;
    const e = (Date.now() - runOriginRef.current) / 1000;
    return Math.min(Math.max(e, 0), durationSeconds);
  });
  const [status, setStatus] = useState<TimerStatus>(initialStatus);

  const statusRef = useRef<TimerStatus>(initialStatus);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const tick = useCallback(() => {
    if (statusRef.current !== 'running') return;
    const now = (Date.now() - runOriginRef.current) / 1000;
    if (now >= durationSeconds) {
      setElapsed(durationSeconds);
      setStatus('complete');
      statusRef.current = 'complete';
      onCompleteRef.current();
    } else {
      setElapsed(now);
    }
  }, [durationSeconds]);

  const startInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(tick, 100);
  }, [tick]);

  const stopInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Initial start — only run the interval if we mount in a running state.
  useEffect(() => {
    if (statusRef.current === 'running') {
      tick(); // sync immediately (handles a restored running session)
      startInterval();
    }
    return stopInterval;
  }, [startInterval, stopInterval, tick]);

  // Background/foreground handling
  useEffect(() => {
    const handleAppState = (nextState: AppStateStatus) => {
      if (statusRef.current !== 'running') return;
      if (nextState === 'active') {
        // App came back — runOrigin is still correct, just resync + restart
        tick();
        startInterval();
      } else if (nextState === 'background' || nextState === 'inactive') {
        stopInterval();
      }
    };
    const sub = AppState.addEventListener('change', handleAppState);
    return () => sub.remove();
  }, [startInterval, stopInterval, tick]);

  const pause = useCallback(() => {
    if (statusRef.current !== 'running') return;
    pausedElapsedRef.current = (Date.now() - runOriginRef.current) / 1000;
    stopInterval();
    setStatus('paused');
    statusRef.current = 'paused';
  }, [stopInterval]);

  const resume = useCallback(() => {
    if (statusRef.current !== 'paused') return;
    runOriginRef.current = Date.now() - pausedElapsedRef.current * 1000;
    setStatus('running');
    statusRef.current = 'running';
    startInterval();
  }, [startInterval]);

  const complete = useCallback(() => {
    stopInterval();
    setStatus('complete');
    statusRef.current = 'complete';
  }, [stopInterval]);

  const getSnapshot = useCallback(
    (): TimerSnapshot => ({
      status: statusRef.current,
      startedAtEpoch: runOriginRef.current,
      pausedElapsed: pausedElapsedRef.current,
    }),
    []
  );

  return { elapsed, status, pause, resume, complete, getSnapshot };
}
