import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
  Linking,
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Overlay } from '../components/Overlay';
import { StartBackground } from '../components/StartBackground';
import { colors } from '../constants/colors';
import {
  DEFAULT_DURATION,
  formatDurationWords,
  LAST_DURATION_KEY,
  PRESET_DURATIONS,
} from '../constants/durations';
import { useSettings } from '../hooks/useSettings';
import { RootStackParamList } from '../types';
import { loadLastMeal } from '../utils/sessionStore';
import { unlockAudio } from '../utils/feedback';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Start'>;
};

const PACING_ARTICLE_URL =
  'https://www.eufic.org/en/healthy-living/article/mindless-to-mindful-eating';

export function StartScreen({ navigation }: Props) {
  const { settings, update } = useSettings();
  const [selected, setSelected] = useState<number>(DEFAULT_DURATION);
  const [showCustom, setShowCustom] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [customMinutes, setCustomMinutes] = useState('');
  const [customError, setCustomError] = useState('');
  const [lastMeal, setLastMeal] = useState<number | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(LAST_DURATION_KEY).then((val) => {
      if (val) setSelected(Number(val));
    });
    loadLastMeal().then(setLastMeal);
  }, []);

  const handleStart = async () => {
    unlockAudio(); // allow the gentle completion chime on web
    await AsyncStorage.setItem(LAST_DURATION_KEY, String(selected));
    navigation.navigate('Session', { durationSeconds: selected });
  };

  const handleCustomConfirm = () => {
    const mins = parseInt(customMinutes, 10);
    if (isNaN(mins) || mins < 5 || mins > 60) {
      setCustomError('Please enter a duration between 5 and 60 minutes.');
      return;
    }
    setSelected(mins * 60);
    setCustomMinutes('');
    setCustomError('');
    setShowCustom(false);
  };

  const selectedLabel = () => {
    const preset = PRESET_DURATIONS.find((d) => d.seconds === selected);
    return preset ? preset.label : `${Math.round(selected / 60)} min`;
  };

  const openPacingArticle = () => {
    Linking.openURL(PACING_ARTICLE_URL).catch(() => {});
  };

  return (
    <StartBackground>
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <View style={styles.mainBlock}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.appName} maxFontSizeMultiplier={1.4}>
              Foodpace
            </Text>
            <Text style={styles.tagline} maxFontSizeMultiplier={1.6}>
              A calm timer for eating more slowly.
            </Text>
            {lastMeal !== null && (
              <Text style={styles.continuity} maxFontSizeMultiplier={1.6}>
                Your last meal took {formatDurationWords(lastMeal)}.
              </Text>
            )}
          </View>

          {/* Duration picker */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>How long would you like?</Text>
            <View style={styles.durationGrid}>
              {PRESET_DURATIONS.map((d) => (
                <TouchableOpacity
                  key={d.seconds}
                  style={[
                    styles.durationChip,
                    selected === d.seconds && styles.durationChipSelected,
                  ]}
                  onPress={() => setSelected(d.seconds)}
                  activeOpacity={0.75}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: selected === d.seconds }}
                  accessibilityLabel={`${d.label} meal`}
                >
                  <Text
                    style={[
                      styles.durationChipText,
                      selected === d.seconds && styles.durationChipTextSelected,
                    ]}
                    maxFontSizeMultiplier={1.4}
                  >
                    {d.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Custom chip — its own line */}
            <TouchableOpacity
              style={[
                styles.durationChip,
                !PRESET_DURATIONS.some((d) => d.seconds === selected) &&
                  styles.durationChipSelected,
              ]}
              onPress={() => setShowCustom(true)}
              activeOpacity={0.75}
              accessibilityRole="radio"
              accessibilityState={{
                selected: !PRESET_DURATIONS.some((d) => d.seconds === selected),
              }}
              accessibilityLabel="Custom duration"
            >
              <Text
                style={[
                  styles.durationChipText,
                  !PRESET_DURATIONS.some((d) => d.seconds === selected) &&
                    styles.durationChipTextSelected,
                ]}
                maxFontSizeMultiplier={1.4}
              >
                {!PRESET_DURATIONS.some((d) => d.seconds === selected)
                  ? selectedLabel()
                  : 'Custom'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Start button */}
          <View style={styles.startWrapper}>
            <TouchableOpacity
              style={styles.startButton}
              onPress={handleStart}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel={`Start ${selectedLabel()} meal`}
            >
              <Text style={styles.startButtonText} maxFontSizeMultiplier={1.4}>
                Start meal
              </Text>
            </TouchableOpacity>
            <Text style={styles.startHint} maxFontSizeMultiplier={1.4}>
              or
            </Text>

            <TouchableOpacity
              style={styles.trainButton}
              onPress={() => navigation.navigate('PaceTrainer')}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Practise your pace"
            >
              <Text style={styles.trainButtonText} maxFontSizeMultiplier={1.4}>
                Practise your pace
              </Text>
            </TouchableOpacity>
          </View>
          </View>

          {/* Footer: external read-more link */}
          <TouchableOpacity
            style={styles.footerLink}
            onPress={openPacingArticle}
            activeOpacity={0.7}
            accessibilityRole="link"
            accessibilityLabel="Read about why pacing helps fullness. Opens an article in your browser."
          >
            <Text style={styles.footerLinkText} maxFontSizeMultiplier={1.4}>
              Read about why pacing helps fullness
            </Text>
          </TouchableOpacity>

          {/* Settings — thumb-friendly, at the bottom */}
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => setShowSettings(true)}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityLabel="Sound and haptics settings"
          >
            <Text style={styles.settingsIcon}>⚙</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Custom duration modal */}
      <Overlay visible={showCustom} onRequestClose={() => setShowCustom(false)}>
        <View style={styles.modalCard}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowCustom(false)}
            accessibilityRole="button"
            accessibilityLabel="Close"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Custom duration</Text>
          <TextInput
            style={styles.input}
            value={customMinutes}
            onChangeText={(t) => {
              setCustomMinutes(t.replace(/[^0-9]/g, ''));
              setCustomError('');
            }}
            placeholder="Minutes (5–60)"
            placeholderTextColor={colors.textMuted}
            keyboardType="number-pad"
            maxLength={2}
            autoFocus
          />
          {customError ? (
            <Text style={styles.inputError}>{customError}</Text>
          ) : null}
          <TouchableOpacity
            style={styles.modalConfirm}
            onPress={handleCustomConfirm}
            activeOpacity={0.85}
            accessibilityRole="button"
          >
            <Text style={styles.modalConfirmText}>Set duration</Text>
          </TouchableOpacity>
        </View>
      </Overlay>

      {/* Settings modal */}
      <Overlay visible={showSettings} onRequestClose={() => setShowSettings(false)}>
        <View style={styles.modalCard}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowSettings(false)}
            accessibilityRole="button"
            accessibilityLabel="Close"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Settings</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingTextWrap}>
              <Text style={styles.settingLabel}>Gentle sound</Text>
              <Text style={styles.settingSub}>A soft chime when your meal completes</Text>
            </View>
            <Switch
              value={settings.soundEnabled}
              onValueChange={(v) => update({ soundEnabled: v })}
              trackColor={{ false: 'rgba(38,56,45,0.18)', true: colors.mint }}
              thumbColor={colors.white}
              accessibilityLabel="Gentle sound"
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingTextWrap}>
              <Text style={styles.settingLabel}>Haptics</Text>
              <Text style={styles.settingSub}>A subtle buzz on prompts and completion</Text>
            </View>
            <Switch
              value={settings.hapticsEnabled}
              onValueChange={(v) => update({ hapticsEnabled: v })}
              trackColor={{ false: 'rgba(38,56,45,0.18)', true: colors.mint }}
              thumbColor={colors.white}
              accessibilityLabel="Haptics"
            />
          </View>

          <TouchableOpacity
            style={styles.modalConfirm}
            onPress={() => setShowSettings(false)}
            activeOpacity={0.85}
            accessibilityRole="button"
          >
            <Text style={styles.modalConfirmText}>Done</Text>
          </TouchableOpacity>
        </View>
      </Overlay>
    </StartBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'transparent' },
  container: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: 12,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  mainBlock: {
    flex: 1,
    justifyContent: 'space-evenly',
  },
  settingsButton: {
    alignSelf: 'center',
    width: 52,
    height: 52,
    borderRadius: 26,
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderWidth: 1.5,
    borderColor: 'rgba(38,56,45,0.18)',
  },
  settingsIcon: {
    fontSize: 22,
    color: colors.deepOlive,
    opacity: 0.7,
  },
  // Close button for overlay cards
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
    color: colors.deepOlive,
    opacity: 0.55,
    fontWeight: '500',
  },
  header: { gap: 8, alignItems: 'center' },
  appName: {
    fontSize: 34,
    fontWeight: '300',
    color: colors.deepOlive,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    color: colors.textMuted,
    fontWeight: '400',
    lineHeight: 22,
    textAlign: 'center',
  },
  continuity: {
    fontSize: 14,
    color: colors.deepOlive,
    opacity: 0.5,
    textAlign: 'center',
    marginTop: 4,
    fontStyle: 'italic',
  },
  section: { gap: 22, alignItems: 'center' },
  sectionLabel: {
    fontSize: 15,
    color: colors.deepOlive,
    fontWeight: '500',
    opacity: 0.7,
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  durationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  durationChip: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: 'rgba(38, 56, 45, 0.18)',
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  durationChipSelected: {
    backgroundColor: colors.deepOlive,
    borderColor: colors.deepOlive,
  },
  durationChipText: {
    fontSize: 15,
    color: colors.deepOlive,
    fontWeight: '500',
  },
  durationChipTextSelected: {
    color: colors.bgOat,
  },
  startWrapper: {
    alignItems: 'center',
    gap: 10,
  },
  startButton: {
    backgroundColor: colors.clay,
    paddingVertical: 18,
    paddingHorizontal: 56,
    borderRadius: 50,
    shadowColor: colors.clay,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  startButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  startHint: {
    fontSize: 14,
    color: colors.textMuted,
  },
  trainButton: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: 'rgba(38,56,45,0.25)',
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  trainButtonText: {
    fontSize: 15,
    color: colors.deepOlive,
    fontWeight: '500',
  },
  footerLink: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  footerLinkText: {
    fontSize: 13,
    color: colors.deepOlive,
    opacity: 0.6,
    textDecorationLine: 'underline',
  },
  // Modal
  modalCard: {
    backgroundColor: colors.overlayCard,
    borderRadius: 24,
    padding: 28,
    width: '100%',
    maxWidth: 340,
    gap: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: colors.deepOlive,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1.5,
    borderColor: 'rgba(38,56,45,0.2)',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 18,
    color: colors.deepOlive,
    textAlign: 'center',
    backgroundColor: colors.white,
  },
  inputError: {
    fontSize: 13,
    color: colors.clay,
    textAlign: 'center',
    marginTop: -8,
  },
  modalConfirm: {
    backgroundColor: colors.clay,
    paddingVertical: 14,
    borderRadius: 50,
    alignItems: 'center',
  },
  modalConfirmText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  // Settings rows
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  settingTextWrap: { flex: 1, gap: 2 },
  settingLabel: {
    fontSize: 16,
    color: colors.deepOlive,
    fontWeight: '500',
  },
  settingSub: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
  },
});
