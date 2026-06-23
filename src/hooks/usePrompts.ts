import { useEffect, useRef, useState } from 'react';
import { buildPromptSchedule, shufflePrompts } from '../constants/prompts';

interface UsePromptsResult {
  currentPrompt: string | null;
  dismiss: () => void;
}

export function usePrompts(
  durationSeconds: number,
  elapsed: number,
  isRunning: boolean
): UsePromptsResult {
  const [currentPrompt, setCurrentPrompt] = useState<string | null>(null);

  const promptTextsRef = useRef<string[]>([]);
  const promptTimesRef = useRef<number[]>([]);
  const nextIndexRef = useRef<number>(0);
  // Capture elapsed at mount (non-zero when resuming a saved session).
  const elapsedAtMountRef = useRef<number>(elapsed);

  useEffect(() => {
    const shuffled = shufflePrompts();
    promptTextsRef.current = shuffled;
    const times = buildPromptSchedule(durationSeconds);
    promptTimesRef.current = times;

    // Skip prompts whose time has already passed (so a restored session does
    // not replay them). Strict "<" keeps the t=0 prompt for a fresh session.
    let idx = 0;
    while (idx < times.length && times[idx] < elapsedAtMountRef.current) idx++;
    nextIndexRef.current = idx;
  }, [durationSeconds]);

  // Watch elapsed to trigger prompts. Each prompt lingers until the next one
  // appears (no auto-dismiss) — the user can also tap to dismiss.
  useEffect(() => {
    if (!isRunning) return;

    const times = promptTimesRef.current;
    const texts = promptTextsRef.current;
    const next = nextIndexRef.current;

    if (next >= times.length) return;
    if (elapsed >= times[next]) {
      setCurrentPrompt(texts[next % texts.length]);
      nextIndexRef.current = next + 1;
    }
  }, [elapsed, isRunning]);

  const dismiss = () => setCurrentPrompt(null);

  return { currentPrompt, dismiss };
}
