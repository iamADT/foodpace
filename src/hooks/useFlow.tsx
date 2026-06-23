import React, { createContext, useContext, useMemo, useState } from 'react';

interface FlowContextValue {
  flowing: boolean;
  setFlowing: (v: boolean) => void;
}

const FlowContext = createContext<FlowContextValue>({
  flowing: false,
  setFlowing: () => {},
});

/**
 * Tracks whether the ambient background should be "flowing" (animated). The
 * timer screen turns this on while focused so the page background drifts only
 * there — without drawing a separate gradient inside the phone frame.
 */
export function FlowProvider({ children }: { children: React.ReactNode }) {
  const [flowing, setFlowing] = useState(false);
  const value = useMemo(() => ({ flowing, setFlowing }), [flowing]);
  return <FlowContext.Provider value={value}>{children}</FlowContext.Provider>;
}

export function useFlow() {
  return useContext(FlowContext);
}
