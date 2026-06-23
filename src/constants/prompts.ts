export const PROMPTS = [
  'Whenever it feels right, your cutlery can rest between bites.',
  'There is room for a slow breath before your next bite, if you would like one.',
  'If you feel like it, notice how your hunger is right now. No need to decide anything.',
  'The next few bites can be as slow as feels good.',
  'There is no rush here. This time is yours.',
  'The flavour and texture of this bite are worth savouring.',
  'A gentle pause is always welcome, whenever you want one.',
  'A sip of water might feel lovely about now.',
  'You could give yourself a quiet moment before the next bite.',
  'Eating slowly can feel a little new, and that is completely okay.',
  'If it feels right, notice whether you are still hungry. There is no wrong answer.',
  'Let this meal take whatever time feels good to you.',
] as const;

export type Prompt = (typeof PROMPTS)[number];

/**
 * Always 6 prompts:
 *   - First 3 at 0 s, 90 s, 180 s (one on start, then every 90 s to establish rhythm)
 *   - Last 3 equally spaced across the remaining session time
 */
export function buildPromptSchedule(durationSeconds: number): number[] {
  const earlyTimes = [0, 90, 180];
  const lastEarly = earlyTimes[earlyTimes.length - 1];
  const remaining = durationSeconds - lastEarly;
  const interval = remaining / 4;
  return [
    ...earlyTimes,
    lastEarly + interval,
    lastEarly + interval * 2,
    lastEarly + interval * 3,
  ];
}

export function shufflePrompts(): string[] {
  const copy = [...PROMPTS];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
