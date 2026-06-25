import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useRef, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ScreenGradient } from '../components/ScreenGradient';
import { colors } from '../constants/colors';
import { useLayout } from '../hooks/useLayout';
import { useSettings } from '../hooks/useSettings';
import { RootStackParamList } from '../types';
import { controlFeedback } from '../utils/feedback';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PaceTrainer'>;
};

export function PaceTrainerScreen({ navigation }: Props) {
  const { settings } = useSettings();
  const { vertPad } = useLayout();
  const [bites, setBites] = useState(0);
  const startRef = useRef<number>(Date.now());

  // One tap per bite: tap each time you set your cutlery back down.
  const handleTap = () => {
    controlFeedback(settings.hapticsEnabled);
    setBites((b) => b + 1);
  };

  const handleEnd = () => {
    const totalSeconds = Math.round((Date.now() - startRef.current) / 1000);
    navigation.replace('TrainingComplete', { bites, totalSeconds });
  };

  return (
    <ScreenGradient>
      <SafeAreaView style={styles.safe}>
        <View style={[styles.container, { paddingTop: vertPad, paddingBottom: vertPad }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title} maxFontSizeMultiplier={1.4}>
              Pace practice
            </Text>
            <Text style={styles.intro} maxFontSizeMultiplier={1.6}>
              Rest your cutlery between bites.
            </Text>
          </View>

          {/* Square tap button — count + instruction inside */}
          <View style={styles.middle}>
            <TouchableOpacity
              style={styles.squareButton}
              onPress={handleTap}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Tap after each bite, once your cutlery is back down."
              accessibilityValue={{ text: `${bites} ${bites === 1 ? 'bite' : 'bites'}` }}
            >
              <Text style={styles.squareCount} maxFontSizeMultiplier={1.3}>
                {bites}
              </Text>
              <Text style={styles.squareCountLabel} maxFontSizeMultiplier={1.3}>
                {bites === 1 ? 'bite' : 'bites'}
              </Text>
              <Text style={styles.squareHint} maxFontSizeMultiplier={1.3}>
                Tap after each bite, once your cutlery is back down.
              </Text>
            </TouchableOpacity>
          </View>

          {/* End training */}
          <TouchableOpacity
            onPress={handleEnd}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Finish"
            style={styles.endButton}
          >
            <Text style={styles.endText} maxFontSizeMultiplier={1.4}>
              Finish
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ScreenGradient>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'transparent' },
  container: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 48,
    paddingBottom: 36,
    alignItems: 'center',
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  header: { alignItems: 'center', gap: 8 },
  title: {
    fontSize: 28,
    fontWeight: '300',
    color: colors.deepOlive,
    letterSpacing: -0.4,
  },
  intro: {
    fontSize: 16,
    color: colors.deepOlive,
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 22,
  },
  middle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    width: '100%',
  },
  squareButton: {
    width: 250,
    height: 250,
    borderRadius: 36,
    backgroundColor: colors.clay,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  squareCount: {
    fontSize: 64,
    fontWeight: '300',
    color: colors.white,
    letterSpacing: -1,
    includeFontPadding: false,
  },
  squareCountLabel: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.85,
    letterSpacing: 1,
    marginBottom: 16,
  },
  squareHint: {
    fontSize: 13,
    color: colors.white,
    opacity: 0.85,
    textAlign: 'center',
    lineHeight: 18,
  },
  endButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  endText: {
    fontSize: 16,
    color: colors.deepOlive,
    opacity: 0.7,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});
