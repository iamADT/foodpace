import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { colors } from '../constants/colors';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * The base screen gradient with a soft mint/sky glow that drifts slowly
 * left↔right, giving the timer page a calm, flowing feel. The motion is a
 * GPU transform (native driver) and is disabled under reduced motion or when
 * `active` is false.
 */
export function FlowingBackground({
  children,
  active = true,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  const reduced = useReducedMotion();
  const [width, setWidth] = useState(0);
  const tx = useRef(new Animated.Value(0)).current;
  const animate = active && !reduced;

  useEffect(() => {
    if (!animate || width === 0) {
      tx.stopAnimation();
      tx.setValue(0);
      return;
    }
    const travel = width * 0.55;
    tx.setValue(-travel / 2);
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(tx, {
          toValue: travel / 2,
          duration: 9000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(tx, {
          toValue: -travel / 2,
          duration: 9000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [animate, width, tx]);

  return (
    <View
      style={styles.fill}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
    >
      {/* Base gradient */}
      <LinearGradient
        colors={colors.bgGradient}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.3, y: 1 }}
      />

      {/* Drifting mint/sky glow band (full height) */}
      {animate && width > 0 && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.glow,
            { width: width * 1.8, left: -width * 0.4, transform: [{ translateX: tx }] },
          ]}
        >
          <LinearGradient
            colors={[
              'rgba(169,216,194,0)',
              'rgba(169,216,194,0.55)',
              'rgba(168,207,232,0.40)',
              'rgba(169,216,194,0)',
            ]}
            locations={[0, 0.4, 0.6, 1]}
            start={{ x: 0, y: 0.4 }}
            end={{ x: 1, y: 0.6 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      )}

      {/* Static off-white veil over the top half: re-asserts the calm upper
          gradient and feathers out by mid-screen, so the moving glow only
          shows through the lower half with no hard seam. */}
      {animate && (
        <LinearGradient
          pointerEvents="none"
          colors={['#F7F1E7', '#EAF5EF', 'rgba(234,245,239,0)']}
          locations={[0, 0.4, 0.62]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      )}

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, overflow: 'hidden', backgroundColor: 'transparent' },
  glow: { position: 'absolute', top: 0, bottom: 0 },
});
