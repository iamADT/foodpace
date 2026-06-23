import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { colors } from '../constants/colors';

export function ScreenGradient({ children }: { children: React.ReactNode }) {
  if (Platform.OS === 'web') {
    return <View style={styles.fill}>{children}</View>;
  }
  return (
    <LinearGradient
      colors={colors.bgGradient}
      style={styles.fill}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.3, y: 1 }}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: 'transparent' },
});
