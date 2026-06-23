import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useFlow } from '../hooks/useFlow';
import { FlowingBackground } from './FlowingBackground';

/**
 * Background for the timer screen.
 *
 * On web, the phone frame is transparent and sits on the app-root gradient, so
 * we must NOT draw a second gradient here (that creates a "screen within a
 * screen"). Instead we flip the shared flow flag while focused and let the root
 * background animate behind the frame.
 *
 * On native there is no frame — the screen fills the device — so we draw the
 * flowing gradient directly.
 */
export function SessionBackground({ children }: { children: React.ReactNode }) {
  const { setFlowing } = useFlow();

  useFocusEffect(
    useCallback(() => {
      setFlowing(true);
      return () => setFlowing(false);
    }, [setFlowing])
  );

  if (Platform.OS === 'web') {
    return <View style={styles.fill}>{children}</View>;
  }
  return <FlowingBackground active>{children}</FlowingBackground>;
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: 'transparent' },
});
