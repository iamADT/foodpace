import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import React from 'react';
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
import { RootStackParamList } from '../types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'TrainingComplete'>;
  route: RouteProp<RootStackParamList, 'TrainingComplete'>;
};

export function TrainingCompleteScreen({ navigation, route }: Props) {
  const { bites, totalSeconds } = route.params;

  return (
    <ScreenGradient>
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.iconMark}>
              <Text style={styles.iconMarkText}>✓</Text>
            </View>
            <Text style={styles.headline} maxFontSizeMultiplier={1.4}>
              Practice complete
            </Text>
            <Text style={styles.subheadline} maxFontSizeMultiplier={1.6}>
              You practised {bites} {bites === 1 ? 'bite' : 'bites'}.
            </Text>
            {totalSeconds >= 60 && (
              <Text style={styles.detail} maxFontSizeMultiplier={1.6}>
                over {formatDurationWords(totalSeconds)}
              </Text>
            )}
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Start')}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Done"
          >
            <Text style={styles.primaryButtonText} maxFontSizeMultiplier={1.4}>
              Done
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
  header: { alignItems: 'center', gap: 12, flex: 1, justifyContent: 'center' },
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
    fontSize: 16,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  detail: {
    fontSize: 14,
    color: colors.textMuted,
    opacity: 0.8,
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
});
