import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useFlow } from '../hooks/useFlow';
import { FlowingBackground } from './FlowingBackground';

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
