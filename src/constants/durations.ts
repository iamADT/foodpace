export interface Duration {
  label: string;
  seconds: number;
}

export const PRESET_DURATIONS: Duration[] = [
  { label: '10 min', seconds: 600 },
  { label: '20 min', seconds: 1200 },
  { label: '30 min', seconds: 1800 },
];

export const LAST_DURATION_KEY = '@foodpace:lastDuration';
export const DEFAULT_DURATION = 1200; // 20 minutes

export function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/** Human-readable duration, e.g. "less than a minute", "1 minute", "18 minutes". */
export function formatDurationWords(totalSeconds: number): string {
  const minutes = Math.round(totalSeconds / 60);
  if (totalSeconds < 60) return 'less than a minute';
  return `${minutes} minute${minutes === 1 ? '' : 's'}`;
}
