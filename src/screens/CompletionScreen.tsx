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
import { FullnessLevel, RootStackParamList } from '../types';
import { saveLastMeal } from '../utils/sessionStore';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Completion'>;
  route: RouteProp<RootStackParamList, 'Completion'>;
};

const FULLNESS_OPTIONS: { level: FullnessLevel; label: string; sub: string }[] =
  [
    { level: 'hungry', label: 'Still hungry', sub: 'Could eat a bit more' },
    { level: 'comfortable', label: 'Comfortable', sub: 'Just right' },
    { level: 'full', label: 'Full', sub: 'Satisfied' },
    { level: 'overfull', label: 'Overfull', sub: 'More than I needed' },
  ];

export function CompletionScreen({ navigation, route }: Props) {
  const { durationSeconds, elapsedSeconds, reason } = route.params;
  const [selected, setSelected] = useState<FullnessLevel | null>(null);
  const [reflected, setReflected] = useState(false);

  const isEarlyEnd = reason === 'early';

  // Remember this meal's length so the start screen can show a gentle thread.
  useEffect(() => {
    saveLastMeal(isEarlyEnd ? elapsedSeconds : durationSeconds);
  }, [isEarlyEnd, elapsedSeconds, durationSeconds]);

  const handleDone = () => {
    navigation.navigate('Start');
  };

  const handleReflect = (level: FullnessLevel) => {
    setSelected(level);
    setReflected(true);
  };

  const handleSkip = () => {
    setReflected(true);
  };

  return (
    <ScreenGradient>
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          {/* Completion message */}
          <View style={styles.header}>
            <View style={styles.iconMark}>
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

          {/* Reflection or done state */}
          {!reflected ? (
            <View style={styles.reflection}>
              <Text style={styles.reflectionQuestion} maxFontSizeMultiplier={1.5}>
                How full do you feel?
              </Text>
              <View style={styles.fullnessGrid}>
                {FULLNESS_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt.level}
                    style={styles.fullnessOption}
                    onPress={() => handleReflect(opt.level)}
                    activeOpacity={0.8}
                    accessibilityRole="button"
                    accessibilityLabel={`${opt.label}. ${opt.sub}`}
                  >
                    <Text style={styles.fullnessLabel} maxFontSizeMultiplier={1.4}>
                      {opt.label}
                    </Text>
                    <Text style={styles.fullnessSub} maxFontSizeMultiplier={1.3}>
                      {opt.sub}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                onPress={handleSkip}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel="Skip reflection"
              >
                <Text style={styles.skipText} maxFontSizeMultiplier={1.4}>
                  Skip reflection
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.doneArea}>
              {selected && (
                <View style={styles.reflectionResult}>
                  <Text style={styles.reflectionResultText} maxFontSizeMultiplier={1.4}>
                    {FULLNESS_OPTIONS.find((o) => o.level === selected)?.label}
                  </Text>
                  <Text style={styles.reflectionResultSub} maxFontSizeMultiplier={1.5}>
                    Noted — no pressure either way.
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Bottom CTA */}
          <TouchableOpacity
            style={reflected ? styles.primaryButton : styles.ghostButton}
            onPress={handleDone}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={
              reflected ? 'Start another meal' : 'End without reflecting'
            }
          >
            <Text
              style={reflected ? styles.primaryButtonText : styles.ghostButtonText}
              maxFontSizeMultiplier={1.4}
            >
              {reflected ? 'Start another meal' : 'End without reflecting'}
            </Text>
          </TouchableOpacity>
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
  reflection: { gap: 20 },
  reflectionQuestion: {
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
  fullnessLabel: {
    fontSize: 16,
    color: colors.deepOlive,
    fontWeight: '500',
  },
  fullnessSub: {
    fontSize: 13,
    color: colors.textMuted,
  },
  skipText: {
    textAlign: 'center',
    fontSize: 15,
    color: colors.deepOlive,
    opacity: 0.7,
    fontWeight: '500',
    marginTop: 4,
    textDecorationLine: 'underline',
  },
  doneArea: { alignItems: 'center', gap: 16 },
  reflectionResult: {
    backgroundColor: colors.cardBg,
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 28,
    alignItems: 'center',
    gap: 6,
    width: '100%',
  },
  reflectionResultText: {
    fontSize: 22,
    fontWeight: '400',
    color: colors.deepOlive,
  },
  reflectionResultSub: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
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
  ghostButton: {
    paddingVertical: 16,
    borderRadius: 50,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(38,56,45,0.35)',
  },
  ghostButtonText: {
    color: colors.deepOlive,
    fontSize: 15,
    fontWeight: '500',
  },
});
