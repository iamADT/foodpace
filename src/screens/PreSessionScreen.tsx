import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { StartBackground } from '../components/StartBackground';
import { colors } from '../constants/colors';
import { LAST_DURATION_KEY } from '../constants/durations';
import { RootStackParamList } from '../types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PreSession'>;
  route: RouteProp<RootStackParamList, 'PreSession'>;
};

const DELAY_MS = 5000;

export function PreSessionScreen({ navigation, route }: Props) {
  const { durationSeconds } = route.params;
  const progress = useRef(new Animated.Value(0)).current;
  const currentValueRef = useRef(0);
  const animRef = useRef<Animated.CompositeAnimation | null>(null);
  const [paused, setPaused] = useState(false);

  const startFrom = (fromValue: number) => {
    const remaining = (1 - fromValue) * DELAY_MS;
    const anim = Animated.timing(progress, {
      toValue: 1,
      duration: remaining,
      useNativeDriver: false,
    });
    animRef.current = anim;
    anim.start(({ finished }) => {
      if (finished) {
        navigation.replace('Session', { durationSeconds });
      }
    });
  };

  useEffect(() => {
    AsyncStorage.setItem(LAST_DURATION_KEY, String(durationSeconds));

    const listenerId = progress.addListener(({ value }) => {
      currentValueRef.current = value;
    });

    startFrom(0);

    return () => {
      animRef.current?.stop();
      progress.removeListener(listenerId);
    };
  }, []);

  const togglePause = () => {
    if (paused) {
      setPaused(false);
      startFrom(currentValueRef.current);
    } else {
      animRef.current?.stop();
      setPaused(true);
    }
  };

  const barWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <StartBackground>
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>

          <View style={styles.content}>
            <View style={styles.iconMark} accessible={false}>
              <Text style={styles.iconMarkText}>🔕</Text>
            </View>
            <Text style={styles.heading}>
              Before you eat, turn on Do Not Disturb
            </Text>
            <Text style={styles.body}>
              Eating without notifications gives your full attention to the meal. It is one of the simplest ways to practise mindful eating.
            </Text>

            <View style={styles.progressRow}>
              <TouchableOpacity
                style={styles.playPauseButton}
                onPress={togglePause}
                activeOpacity={0.6}
                accessibilityRole="button"
                accessibilityLabel={paused ? 'Resume' : 'Pause'}
              >
                <Text style={styles.playPauseIcon}>
                  {paused ? '▶' : '⏸'}
                </Text>
              </TouchableOpacity>
              <View style={styles.progressTrack}>
                <Animated.View style={[styles.progressFill, { width: barWidth }]} />
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </StartBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'transparent' },
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 16,
    paddingBottom: 40,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 22,
    color: colors.deepOlive,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  iconMark: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.mint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  iconMarkText: {
    fontSize: 32,
  },
  heading: {
    fontSize: 26,
    fontWeight: '300',
    color: colors.deepOlive,
    textAlign: 'center',
    lineHeight: 34,
    letterSpacing: -0.3,
  },
  body: {
    fontSize: 15,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 23,
    maxWidth: 320,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 12,
  },
  playPauseButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playPauseIcon: {
    fontSize: 15,
    color: colors.textMuted,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(38,56,45,0.08)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.clay,
    borderRadius: 2,
  },
});
