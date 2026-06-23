import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { colors } from '../constants/colors';
import { useReducedMotion } from '../hooks/useReducedMotion';

// A celebratory but on-brand palette (greens/blues + warm accents).
const PALETTE = [
  colors.mint,
  colors.softSky,
  colors.clay,
  '#FBEFD8',
  '#F2C879',
  '#E8A07A',
  '#E6B7C9',
];

type Shape = 'rect' | 'streamer' | 'circle';
const SHAPES: Shape[] = ['rect', 'streamer', 'circle'];

interface PieceParams {
  leftPct: number;
  size: number;
  color: string;
  shape: Shape;
  delay: number;
  duration: number;
  swayAmp: number;
  spins: number;
  flips: number;
  startY: number;
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function makePieces(count: number): PieceParams[] {
  return Array.from({ length: count }).map(() => {
    const dir = Math.random() < 0.5 ? -1 : 1;
    return {
      leftPct: Math.random() * 100,
      size: rand(7, 15),
      color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      // Initial burst then a steady fall: most start quickly.
      delay: Math.random() * 2600,
      duration: rand(4200, 8000),
      swayAmp: dir * rand(18, 48),
      spins: dir * rand(1, 4),
      flips: Math.floor(rand(3, 8)),
      startY: rand(-80, -20),
    };
  });
}

function shapeStyle(p: PieceParams) {
  switch (p.shape) {
    case 'streamer':
      return { width: p.size * 0.35, height: p.size * 2.4, borderRadius: 2 };
    case 'circle':
      return { width: p.size, height: p.size, borderRadius: p.size / 2 };
    default:
      return { width: p.size, height: p.size * 0.55, borderRadius: 2 };
  }
}

function Piece({ p, containerH }: { p: PieceParams; containerH: number }) {
  const t = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.timing(t, {
        toValue: 1,
        duration: p.duration,
        delay: p.delay,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    anim.start();
    return () => anim.stop();
  }, [t, p.duration, p.delay]);

  const translateY = t.interpolate({
    inputRange: [0, 1],
    outputRange: [p.startY, containerH + 40],
  });
  const translateX = t.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
    outputRange: [
      0,
      p.swayAmp,
      -p.swayAmp,
      p.swayAmp * 0.7,
      -p.swayAmp * 0.5,
      0,
    ],
  });
  const rotate = t.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', `${p.spins * 360}deg`],
  });
  // Fluttering "flip" by oscillating scaleX between flat and full.
  const flipStops = Array.from({ length: p.flips * 2 + 1 }, (_, i) => i / (p.flips * 2));
  const flipValues = flipStops.map((_, i) => (i % 2 === 0 ? 1 : 0.25));
  const scaleX = t.interpolate({ inputRange: flipStops, outputRange: flipValues });
  const opacity = t.interpolate({
    inputRange: [0, 0.06, 0.9, 1],
    outputRange: [0, 1, 1, 0],
  });

  return (
    <Animated.View
      style={[
        styles.piece,
        shapeStyle(p),
        {
          left: `${p.leftPct}%`,
          backgroundColor: p.color,
          opacity,
          transform: [{ translateY }, { translateX }, { rotate }, { scaleX }],
        },
      ]}
    />
  );
}

/**
 * Elaborate, on-palette confetti: mixed shapes (rectangles, streamers, circles)
 * in varied colors that flutter, spin and drift down across the whole screen.
 * Non-interactive (pointerEvents none) and disabled under reduced motion.
 */
export function Confetti({ count = 64 }: { count?: number }) {
  const reduced = useReducedMotion();
  const [height, setHeight] = useState(0);
  const pieces = useMemo(() => makePieces(count), [count]);

  if (reduced) return null;

  return (
    <View
      pointerEvents="none"
      style={StyleSheet.absoluteFill}
      onLayout={(e) => setHeight(e.nativeEvent.layout.height)}
    >
      {height > 0 &&
        pieces.map((p, i) => <Piece key={i} p={p} containerH={height} />)}
    </View>
  );
}

const styles = StyleSheet.create({
  piece: { position: 'absolute', top: 0 },
});
