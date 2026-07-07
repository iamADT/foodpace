import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Confetti } from '../components/Confetti';
import { ScreenGradient } from '../components/ScreenGradient';
import { colors } from '../constants/colors';
import { formatDurationWords } from '../constants/durations';
import { useLayout } from '../hooks/useLayout';
import { RootStackParamList } from '../types';
import { saveLastMeal, saveSession } from '../utils/sessionStore';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Completion'>;
  route: RouteProp<RootStackParamList, 'Completion'>;
};

type FullnessLevel = 'hungry' | 'comfortable' | 'full' | 'overfull';

const FULLNESS_OPTIONS: { level: FullnessLevel; label: string; sub: string }[] = [
  { level: 'hungry', label: 'Still hungry', sub: 'Could eat a bit more' },
  { level: 'comfortable', label: 'Comfortable', sub: 'Just right' },
  { level: 'full', label: 'Full', sub: 'Satisfied' },
  { level: 'overfull', label: 'Overfull', sub: 'More than I needed' },
];

export function CompletionScreen({ navigation, route }: Props) {
  const { durationSeconds, elapsedSeconds, reason } = route.params;
  const { vertPad } = useLayout();
  const [selected, setSelected] = useState<FullnessLevel | null>(null);
  const savedRef = React.useRef(false);

  const isEarlyEnd = reason === 'early';

  useEffect(() => {
    const actual = isEarlyEnd ? elapsedSeconds : durationSeconds;
    saveLastMeal(actual);
  }, [isEarlyEnd, elapsedSeconds, durationSeconds]);

  const handleDone = async () => {
    if (!savedRef.current) {
      savedRef.current = true;
      await saveSession({
        id: Date.now().toString(),
        startedAt: Date.now() - elapsedSeconds * 1000,
        durationSeconds,
        elapsedSeconds: isEarlyEnd ? elapsedSeconds : durationSeconds,
        reason,
        fullnessLevel: selected ?? undefined,
      });
    }
    navigation.navigate('Start');
  };

  return (
    <ScreenGradient>
      <SafeAreaView style={styles.safe}>
        <View style={[styles.container, { paddingVertical: vertPad }]}>
          <View style={styles.header}>
            <View style={styles.iconMark} accessible={false}>
              <Text style={styles.iconMarkText}>✓</Text>
            </View>
            <Text style={styles.headline} maxFontSizeMultiplier={1.4}>
              {isEarlyEnd ? 'Session ended' : 'Meal complete'}
            </Text>
            <Text style={styles.subheadline} maxFontSizeMultiplier={1.6}>
              {isEarlyEnd
                ? `You took ${formatDurationWords(elapsedSeconds)} today.`
                : `You spent ${formatDurationWords(durationSeconds)} with this meal.`}
            </Text>
          </View>

          <View style={styles.fullnessSection}>
            <Text style={styles.fullnessQuestion} maxFontSizeMultiplier={1.5}>
              How full do you feel?
            </Text>
            <View accessibilityRole="radiogroup">
            <View style={styles.fullnessGrid}>
              {FULLNESS_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.level}
                  style={[
                    styles.fullnessOption,
                    selected === opt.level && styles.fullnessOptionSelected,
                  ]}
                  onPress={() => setSelected(opt.level)}
                  activeOpacity={0.8}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: selected === opt.level }}
                  accessibilityLabel={`${opt.label}. ${opt.sub}`}
                >
                  <Text
                    style={[
                      styles.fullnessLabel,
                      selected === opt.level && styles.fullnessLabelSelected,
                    ]}
                    maxFontSizeMultiplier={1.4}
                  >
                    {opt.label}
                  </Text>
                  <Text
                    style={[
                      styles.fullnessSub,
                      selected === opt.level && styles.fullnessSubSelected,
                    ]}
                    maxFontSizeMultiplier={1.3}
                  >
                    {opt.sub}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            </View>
          </View>

          <View style={styles.ctaGroup}>
            <Text style={styles.dndReminder} maxFontSizeMultiplier={1.4}>
              Remember to turn off Do Not Disturb.
            </Text>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleDone}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Go to dashboard"
            >
              <Text style={styles.primaryButtonText} maxFontSizeMultiplier={1.4}>
                Go to dashboard
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
      <Confetti />
    </ScreenGradient>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'transparent' },
  container: {
    flex: 1,
    paddingHorizontal: 28,
    paddingVertical: 40,
    justifyContent: 'space-between',
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  header: { alignItems: 'center', gap: 12 },
  iconMark: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.mint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  iconMarkText: { fontSize: 24, color: colors.deepOlive },
  headline: {
    fontSize: 30,
    fontWeight: '300',
    color: colors.deepOlive,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  subheadline: {
    fontSize: 15,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  dndReminder: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
    fontStyle: 'italic',
  },
  fullnessSection: { gap: 20 },
  fullnessQuestion: {
    fontSize: 18,
    fontWeight: '400',
    color: colors.deepOlive,
    textAlign: 'center',
  },
  fullnessGrid: { gap: 10 },
  fullnessOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: colors.cardBg,
    borderWidth: 1.5,
    borderColor: 'rgba(38,56,45,0.1)',
  },
  fullnessOptionSelected: {
    backgroundColor: colors.mint,
    borderColor: colors.mint,
  },
  fullnessLabel: {
    fontSize: 16,
    color: colors.deepOlive,
    fontWeight: '500',
  },
  fullnessLabelSelected: {
    fontWeight: '600',
  },
  fullnessSub: {
    fontSize: 13,
    color: colors.textMuted,
  },
  fullnessSubSelected: {
    color: colors.deepOlive,
    opacity: 0.7,
  },
  ctaGroup: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: colors.clay,
    paddingVertical: 18,
    borderRadius: 50,
    alignItems: 'center',
    shadowColor: colors.clay,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '600',
  },
});
