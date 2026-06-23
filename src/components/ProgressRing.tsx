import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors } from '../constants/colors';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { TimeMode } from '../types';

interface ProgressRingProps {
  size: number;
  strokeWidth: number;
  progress: number; // 0–1, how much of the session has elapsed
  timeMode: TimeMode;
  /** Gently breathe (slow scale loop) — used while the session is running. */
  pulse?: boolean;
}

export function ProgressRing({
  size,
  strokeWidth,
  progress,
  timeMode,
  pulse = false,
}: ProgressRingProps) {
  const reduced = useReducedMotion();
  const scale = useRef(new Animated.Value(1)).current;

  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  // "remaining" → ring empties as progress increases
  // "elapsed"   → ring fills as progress increases
  const filled = timeMode === 'elapsed' ? progress : 1 - progress;
  const dashOffset = circumference * (1 - filled);

  useEffect(() => {
    if (!pulse || reduced) {
      Animated.timing(scale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      return;
    }
    // ~4s breath: slow expand, slow contract.
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.03,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse, reduced, scale]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor={colors.mint} />
            <Stop offset="100%" stopColor={colors.softSky} />
          </LinearGradient>
        </Defs>

        {/* Track */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={colors.trackRing}
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Progress arc */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="url(#ringGrad)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          rotation={-90}
          origin={`${center}, ${center}`}
        />
      </Svg>
    </Animated.View>
  );
}
