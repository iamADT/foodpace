import { useWindowDimensions } from 'react-native';

// iPhone SE (all generations) tops out at 667pt tall.
const COMPACT_HEIGHT = 700;

export function useLayout() {
  const { height } = useWindowDimensions();
  const compact = height < COMPACT_HEIGHT;
  return {
    vertPad: compact ? 20 : 40,
  };
}
