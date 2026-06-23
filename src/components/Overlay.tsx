import React from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { colors } from '../constants/colors';

interface OverlayProps {
  visible: boolean;
  onRequestClose: () => void;
  align?: 'center' | 'bottom';
  children: React.ReactNode;
}

// On web, `position: fixed` covers the whole viewport (escaping the phone
// frame). On native there is no frame, so absoluteFill covers the screen.
const fillStyle =
  Platform.OS === 'web'
    ? ({ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 } as any)
    : StyleSheet.absoluteFill;

/**
 * A modal overlay. The dim backdrop covers the entire screen; the content
 * (passed as children) is centered or bottom-aligned. Tapping the backdrop
 * dismisses it.
 */
export function Overlay({
  visible,
  onRequestClose,
  align = 'center',
  children,
}: OverlayProps) {
  if (!visible) return null;
  return (
    <View
      style={[
        fillStyle,
        styles.root,
        align === 'bottom' ? styles.bottom : styles.center,
      ]}
    >
      <Pressable
        style={[StyleSheet.absoluteFill, styles.backdrop]}
        onPress={onRequestClose}
        accessibilityRole="button"
        accessibilityLabel="Dismiss"
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    zIndex: 1000,
    padding: 20,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottom: {
    justifyContent: 'flex-end',
    paddingBottom: 28,
  },
  backdrop: {
    backgroundColor: colors.overlay,
  },
});
