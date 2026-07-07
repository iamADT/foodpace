import AsyncStorage from '@react-native-async-storage/async-storage';
import { TimeMode, TimerStatus } from '../types';

const ACTIVE_KEY = '@foodpace:activeSession';
const LAST_MEAL_KEY = '@foodpace:lastMeal';
const HISTORY_KEY = '@foodpace:history';

export interface MealSession {
  id: string;
  startedAt: number;
  durationSeconds: number;
  elapsedSeconds: number;
  reason: 'complete' | 'early';
  fullnessLevel?: 'hungry' | 'comfortable' | 'full' | 'overfull';
}

export async function saveSession(session: MealSession): Promise<void> {
  try {
    const existing = await loadSessions();
    const updated = [session, ...existing];
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch {
    // best-effort
  }
}

export async function loadSessions(): Promise<MealSession[]> {
  try {
    const raw = await AsyncStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as MealSession[];
  } catch {
    return [];
  }
}

export async function deleteSession(id: string): Promise<void> {
  try {
    const existing = await loadSessions();
    const updated = existing.filter((s) => s.id !== id);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch {
    // best-effort
  }
}

export interface ActiveSession {
  durationSeconds: number;
  /** Epoch ms that corresponds to elapsed=0 for a running session. */
  startedAtEpoch: number;
  status: Exclude<TimerStatus, 'complete'>;
  /** Seconds elapsed at the moment of pausing (valid when paused). */
  pausedElapsed: number;
  timeMode: TimeMode;
  /** When this record was written, to detect stale sessions. */
  savedAt: number;
}

// A session older than this is considered abandoned and ignored on launch.
const MAX_AGE_MS = 6 * 60 * 60 * 1000; // 6 hours

export async function saveActiveSession(s: ActiveSession): Promise<void> {
  try {
    await AsyncStorage.setItem(ACTIVE_KEY, JSON.stringify(s));
  } catch {
    // best-effort
  }
}

export async function loadActiveSession(): Promise<ActiveSession | null> {
  try {
    const raw = await AsyncStorage.getItem(ACTIVE_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as ActiveSession;
    if (Date.now() - s.savedAt > MAX_AGE_MS) {
      await clearActiveSession();
      return null;
    }
    // If a running session has already run past its duration, treat as done.
    if (s.status === 'running') {
      const elapsed = (Date.now() - s.startedAtEpoch) / 1000;
      if (elapsed >= s.durationSeconds) {
        await clearActiveSession();
        return null;
      }
    }
    return s;
  } catch {
    return null;
  }
}

export async function clearActiveSession(): Promise<void> {
  try {
    await AsyncStorage.removeItem(ACTIVE_KEY);
  } catch {
    // best-effort
  }
}

export async function saveLastMeal(elapsedSeconds: number): Promise<void> {
  try {
    await AsyncStorage.setItem(LAST_MEAL_KEY, String(Math.round(elapsedSeconds)));
  } catch {
    // best-effort
  }
}

export async function loadLastMeal(): Promise<number | null> {
  try {
    const raw = await AsyncStorage.getItem(LAST_MEAL_KEY);
    if (!raw) return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}
