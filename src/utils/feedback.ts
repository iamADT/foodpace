import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/**
 * Gentle, optional feedback. Sound is synthesized on web via Web Audio (no
 * asset needed); haptics use expo-haptics on native. Both are no-ops unless
 * the corresponding setting is enabled.
 *
 * Note: native sound would require a bundled audio asset + expo-audio. Since
 * the app is currently driven on web, sound is web-only for now and the native
 * path falls back to haptics.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (Platform.OS !== 'web') return null;
  if (typeof window === 'undefined') return null;
  const Ctx =
    (window as any).AudioContext || (window as any).webkitAudioContext;
  if (!Ctx) return null;
  if (!audioCtx) audioCtx = new Ctx();
  return audioCtx;
}

/**
 * Browsers block audio until a user gesture. Call this from a tap handler
 * (e.g. "Start meal") so later, gesture-less playback (timer completion) works.
 */
export function unlockAudio() {
  const ctx = getAudioContext();
  if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {});
}

/** A soft two-note rise with a gentle envelope — calm, not an alarm. */
function playWebChime() {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});

  const notes = [523.25, 659.25]; // C5, E5
  const now = ctx.currentTime;

  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;

    const start = now + i * 0.18;
    const attack = 0.04;
    const release = 0.9;
    const peak = 0.12;

    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(peak, start + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + attack + release);

    osc.connect(gain).connect(ctx.destination);
    osc.start(start);
    osc.stop(start + attack + release + 0.05);
  });
}

/** Light tap feedback for control presses (pause, toggle). */
export function controlFeedback(hapticsEnabled: boolean) {
  if (hapticsEnabled && Platform.OS !== 'web') {
    Haptics.selectionAsync().catch(() => {});
  }
}

/** Fired when a prompt gently appears. Subtle by design. */
export function promptFeedback(soundEnabled: boolean, hapticsEnabled: boolean) {
  if (hapticsEnabled && Platform.OS !== 'web') {
    Haptics.selectionAsync().catch(() => {});
  }
  // Intentionally no sound on prompt appearance — too frequent to chime.
}

/** Fired once when the meal completes. */
export function completionFeedback(
  soundEnabled: boolean,
  hapticsEnabled: boolean
) {
  if (hapticsEnabled && Platform.OS !== 'web') {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
      () => {}
    );
  }
  if (soundEnabled) {
    if (Platform.OS === 'web') playWebChime();
    // Native sound: see note above — falls back to haptic.
  }
}
