import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Overlay } from '../components/Overlay';
import { ProgressRing } from '../components/ProgressRing';
import { PromptCard } from '../components/PromptCard';
import { SessionBackground } from '../components/SessionBackground';
import { colors } from '../constants/colors';
import { formatTime } from '../constants/durations';
import { usePrompts } from '../hooks/usePrompts';
import { useSettings } from '../hooks/useSettings';
import { useTimer } from '../hooks/useTimer';
import {
  clearActiveSession,
  saveActiveSession,
} from '../utils/sessionStore';
import {
  completionFeedback,
  controlFeedback,
  promptFeedback,
  unlockAudio,
} from '../utils/feedback';
import { RootStackParamList, TimeMode, TimerInit } from '../types';

/** A spoken description of the time for screen readers. */
function spokenTime(seconds: number, mode: TimeMode): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  const parts: string[] = [];
  if (m) parts.push(`${m} minute${m === 1 ? '' : 's'}`);
  if (s || !m) parts.push(`${s} second${s === 1 ? '' : 's'}`);
  return `${parts.join(' ')} ${mode}`;
}

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Session'>;
  route: RouteProp<RootStackParamList, 'Session'>;
};

const RING_SIZE = 280;
const RING_STROKE = 14;

export function ActiveSessionScreen({ navigation, route }: Props) {
  const { durationSeconds, resume: resumeParam } = route.params;
  const { settings } = useSettings();
  const [timeMode, setTimeMode] = useState<TimeMode>(
    resumeParam?.timeMode ?? 'remaining'
  );
  const [showEndDialog, setShowEndDialog] = useState(false);

  const timerInit: TimerInit | undefined = resumeParam
    ? {
        status: resumeParam.status,
        startedAtEpoch: resumeParam.startedAtEpoch,
        pausedElapsed: resumeParam.pausedElapsed,
      }
    : undefined;

  const goToCompletion = useCallback(
    (reason: 'complete' | 'early', elapsedSeconds: number) => {
      clearActiveSession();
      navigation.replace('Completion', {
        durationSeconds,
        elapsedSeconds,
        reason,
      });
    },
    [navigation, durationSeconds]
  );

  const handleNaturalComplete = useCallback(() => {
    completionFeedback(settings.soundEnabled, settings.hapticsEnabled);
    goToCompletion('complete', durationSeconds);
  }, [settings.soundEnabled, settings.hapticsEnabled, goToCompletion, durationSeconds]);

  const { elapsed, status, pause, resume, complete, getSnapshot } = useTimer(
    durationSeconds,
    handleNaturalComplete,
    timerInit
  );

  const { currentPrompt, dismiss } = usePrompts(
    durationSeconds,
    elapsed,
    status === 'running'
  );

  const progress = Math.min(elapsed / durationSeconds, 1);
  const isRunning = status === 'running';
  const isPaused = status === 'paused';

  const displayedSeconds =
    timeMode === 'remaining'
      ? Math.max(0, durationSeconds - elapsed)
      : elapsed;

  // Persist the session whenever its status or time mode changes, so a refresh
  // or backgrounding can restore the meal in progress.
  useEffect(() => {
    if (status === 'complete') return;
    const snap = getSnapshot();
    if (snap.status === 'complete') return;
    saveActiveSession({
      durationSeconds,
      startedAtEpoch: snap.startedAtEpoch,
      status: snap.status,
      pausedElapsed: snap.pausedElapsed,
      timeMode,
      savedAt: Date.now(),
    });
  }, [status, timeMode, durationSeconds, getSnapshot]);

  // Gentle feedback when a new prompt appears.
  useEffect(() => {
    if (currentPrompt) {
      promptFeedback(settings.soundEnabled, settings.hapticsEnabled);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPrompt]);

  const switchMode = (mode: TimeMode) => {
    setTimeMode(mode);
    controlFeedback(settings.hapticsEnabled);
  };

  const handlePauseResume = () => {
    unlockAudio();
    if (isRunning) {
      pause();
    } else {
      resume();
    }
    controlFeedback(settings.hapticsEnabled);
  };

  const handleEndPress = () => {
    if (isRunning) pause();
    setShowEndDialog(true);
  };

  const handleEndConfirm = (action: 'continue' | 'end') => {
    setShowEndDialog(false);
    if (action === 'continue') {
      if (isPaused || !isRunning) resume();
    } else {
      complete();
      goToCompletion('early', elapsed);
    }
  };

  return (
    <SessionBackground>
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          {/* Pause indicator */}
          {isPaused && (
            <View style={styles.pausedBadge} accessibilityLiveRegion="polite">
              <Text style={styles.pausedText}>Paused</Text>
            </View>
          )}

          {/* Timer ring + display */}
          <View style={styles.ringWrapper}>
            <ProgressRing
              size={RING_SIZE}
              strokeWidth={RING_STROKE}
              progress={progress}
              timeMode={timeMode}
              pulse={isRunning}
            />
            <View style={styles.timerOverlay}>
              <Text
                style={styles.timerText}
                maxFontSizeMultiplier={1.4}
                accessibilityRole="text"
                accessibilityLabel={spokenTime(displayedSeconds, timeMode)}
              >
                {formatTime(displayedSeconds)}
              </Text>
              <View
                style={styles.timeModeToggle}
                accessibilityRole="radiogroup"
              >
                <TouchableOpacity
                  style={[styles.timeModeTab, timeMode === 'remaining' && styles.timeModeTabActive]}
                  onPress={() => switchMode('remaining')}
                  activeOpacity={0.8}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: timeMode === 'remaining' }}
                  accessibilityLabel="Show time remaining"
                  hitSlop={{ top: 10, bottom: 10, left: 4, right: 4 }}
                >
                  <Text
                    style={[styles.timeModeTabText, timeMode === 'remaining' && styles.timeModeTabTextActive]}
                    maxFontSizeMultiplier={1.3}
                  >
                    remaining
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.timeModeTab, timeMode === 'elapsed' && styles.timeModeTabActive]}
                  onPress={() => switchMode('elapsed')}
                  activeOpacity={0.8}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: timeMode === 'elapsed' }}
                  accessibilityLabel="Show time elapsed"
                  hitSlop={{ top: 10, bottom: 10, left: 4, right: 4 }}
                >
                  <Text
                    style={[styles.timeModeTabText, timeMode === 'elapsed' && styles.timeModeTabTextActive]}
                    maxFontSizeMultiplier={1.3}
                  >
                    elapsed
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Prompt */}
          <View style={styles.promptArea}>
            <PromptCard text={currentPrompt} onDismiss={dismiss} />
          </View>

          {/* Controls */}
          <View style={styles.controls}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleEndPress}
              activeOpacity={0.75}
              accessibilityRole="button"
              accessibilityLabel="End session"
            >
              <Text style={styles.secondaryButtonText} maxFontSizeMultiplier={1.4}>
                End
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handlePauseResume}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel={isRunning ? 'Pause timer' : 'Resume timer'}
            >
              <Text style={styles.primaryButtonText} maxFontSizeMultiplier={1.4}>
                {isRunning ? 'Pause' : 'Resume'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* Early end dialog */}
      <Overlay
        visible={showEndDialog}
        onRequestClose={() => handleEndConfirm('continue')}
      >
        <View style={styles.modalCard}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => handleEndConfirm('continue')}
            accessibilityRole="button"
            accessibilityLabel="Close"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Finished eating?</Text>
          <Text style={styles.modalSubtitle}>
            {formatTime(elapsed)} into your{' '}
            {Math.round(durationSeconds / 60)}-minute meal
          </Text>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.modalPrimary}
              onPress={() => handleEndConfirm('continue')}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Continue timer"
            >
              <Text style={styles.modalPrimaryText}>Continue timer</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalSecondary}
              onPress={() => handleEndConfirm('end')}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="End session"
            >
              <Text style={styles.modalSecondaryText}>End session</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Overlay>
    </SessionBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'transparent' },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: 24,
    paddingHorizontal: 24,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  pausedBadge: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 50,
    backgroundColor: 'rgba(38,56,45,0.08)',
  },
  pausedText: {
    fontSize: 13,
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  ringWrapper: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  timerText: {
    fontSize: 56,
    fontWeight: '200',
    color: colors.deepOlive,
    letterSpacing: -2,
    includeFontPadding: false,
  },
  timeModeToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(38,56,45,0.07)',
    borderRadius: 50,
    padding: 3,
  },
  timeModeTab: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 50,
  },
  timeModeTabActive: {
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  timeModeTabText: {
    fontSize: 12,
    color: colors.textMuted,
    letterSpacing: 0.4,
  },
  timeModeTabTextActive: {
    color: colors.deepOlive,
    fontWeight: '600',
  },
  promptArea: {
    width: '100%',
    minHeight: 80,
    justifyContent: 'center',
  },
  controls: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: colors.clay,
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 50,
    shadowColor: colors.clay,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 5,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: 'rgba(38,56,45,0.2)',
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  secondaryButtonText: {
    color: colors.deepOlive,
    fontSize: 17,
    fontWeight: '500',
  },
  // Modal
  modalCard: {
    width: '100%',
    maxWidth: 360,
    alignSelf: 'center',
    backgroundColor: colors.overlayCard,
    borderRadius: 28,
    padding: 28,
    gap: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  closeIcon: {
    fontSize: 20,
    color: colors.textMuted,
    fontWeight: '500',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '500',
    color: colors.deepOlive,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: -12,
  },
  modalActions: { gap: 12 },
  modalPrimary: {
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: colors.clay,
    alignItems: 'center',
  },
  modalPrimaryText: {
    fontSize: 16,
    color: colors.white,
    fontWeight: '600',
  },
  modalSecondary: {
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: colors.mint,
    alignItems: 'center',
  },
  modalSecondaryText: {
    fontSize: 16,
    color: colors.deepOlive,
    fontWeight: '600',
  },
});
