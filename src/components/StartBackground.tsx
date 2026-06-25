import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { DotField } from './DotField';
import { ScreenGradient } from './ScreenGradient';

export function StartBackground({ children }: { children: React.ReactNode }) {
  if (Platform.OS === 'web') {
    return (
      <View style={styles.fill}>
        <DotField />
        {children}
      </View>
    );
  }
  return <ScreenGradient>{children}</ScreenGradient>;
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: 'transparent' },
});
