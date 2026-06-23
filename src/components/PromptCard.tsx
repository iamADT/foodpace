import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors } from '../constants/colors';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface PromptCardProps {
  text: string | null;
  onDismiss: () => void;
}

export function PromptCard({ text, onDismiss }: PromptCardProps) {
  const reduced = useReducedMotion();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(8)).current;
  // The text actually rendered — swapped at the trough of the cross-fade.
  const [shown, setShown] = useState<string | null>(text);

  useEffect(() => {
    if (text === shown) return;

    if (reduced) {
      setShown(text);
      opacity.setValue(text ? 1 : 0);
      translateY.setValue(0);
      return;
    }

    // Fade the current prompt out, swap the text, then fade the new one in.
    Animated.timing(opacity, {
      toValue: 0,
      duration: shown ? 250 : 0,
      useNativeDriver: true,
    }).start(() => {
      setShown(text);
      if (text) {
        translateY.setValue(8);
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start();
      }
    });
  }, [text, shown, reduced, opacity, translateY]);

  return (
    <Animated.View
      style={[styles.card, { opacity, transform: [{ translateY }] }]}
      accessibilityLiveRegion="polite"
      pointerEvents={shown ? 'auto' : 'none'}
    >
      <TouchableOpacity
        onPress={onDismiss}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={shown ?? undefined}
        accessibilityHint="Tap to dismiss this gentle reminder"
      >
        <Text style={styles.text} maxFontSizeMultiplier={1.6}>
          {shown}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    marginHorizontal: 24,
  },
  text: {
    color: colors.deepOlive,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
