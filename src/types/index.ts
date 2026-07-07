export type TimerStatus = 'running' | 'paused' | 'complete';
export type TimeMode = 'remaining' | 'elapsed';

export interface TimerInit {
  status: Exclude<TimerStatus, 'complete'>;
  /** Epoch ms corresponding to elapsed=0 (for a running session). */
  startedAtEpoch?: number;
  /** Seconds elapsed when paused (for a paused session). */
  pausedElapsed?: number;
}

export interface SessionResume extends TimerInit {
  timeMode: TimeMode;
}

export type RootStackParamList = {
  Start: undefined;
  Session: { durationSeconds: number; resume?: SessionResume };
  Completion: {
    durationSeconds: number;
    elapsedSeconds: number;
    reason: 'complete' | 'early';
  };
  PreSession: { durationSeconds: number };
  History: undefined;
  PaceTrainer: undefined;
  TrainingComplete: { bites: number; totalSeconds: number };
};
