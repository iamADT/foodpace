import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { FlowingBackground } from './src/components/FlowingBackground';
import { FlowProvider, useFlow } from './src/hooks/useFlow';
import { SettingsProvider } from './src/hooks/useSettings';
import { ActiveSessionScreen } from './src/screens/ActiveSessionScreen';
import { CompletionScreen } from './src/screens/CompletionScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { PaceTrainerScreen } from './src/screens/PaceTrainerScreen';
import { PreSessionScreen } from './src/screens/PreSessionScreen';
import { StartScreen } from './src/screens/StartScreen';
import { TrainingCompleteScreen } from './src/screens/TrainingCompleteScreen';
import { RootStackParamList, SessionResume } from './src/types';
import { loadActiveSession } from './src/utils/sessionStore';

const Stack = createNativeStackNavigator<RootStackParamList>();

const TransparentTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: 'transparent' },
};

function AppNavigator({ initialState }: { initialState?: any }) {
  return (
    <NavigationContainer
      theme={TransparentTheme}
      initialState={initialState}
      documentTitle={{ formatter: () => 'Foodpace — a calm timer for eating more slowly' }}
    >
      <StatusBar style="dark" />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="Start" component={StartScreen} />
        <Stack.Screen name="Session" component={ActiveSessionScreen} />
        <Stack.Screen name="Completion" component={CompletionScreen} />
        <Stack.Screen name="PreSession" component={PreSessionScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name="PaceTrainer" component={PaceTrainerScreen} />
        <Stack.Screen name="TrainingComplete" component={TrainingCompleteScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function WebShell({ children }: { children: React.ReactNode }) {
  const { flowing } = useFlow();
  return (
    <FlowingBackground active={flowing}>
      {children}
    </FlowingBackground>
  );
}

export default function App() {
  const [ready, setReady] = useState(false);
  const [initialNavState, setInitialNavState] = useState<any>(undefined);

  // Set the web document meta (description) once on mount.
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    const ensureMeta = (name: string, content: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };
    ensureMeta(
      'description',
      'Foodpace is a calm timer that helps you slow down, pace your meals, and notice fullness.'
    );
  }, []);

  // Restore an in-progress meal (if any) before showing the navigator.
  useEffect(() => {
    loadActiveSession().then((session) => {
      if (session) {
        const resume: SessionResume = {
          status: session.status,
          startedAtEpoch: session.startedAtEpoch,
          pausedElapsed: session.pausedElapsed,
          timeMode: session.timeMode,
        };
        setInitialNavState({
          index: 1,
          routes: [
            { name: 'Start' },
            {
              name: 'Session',
              params: { durationSeconds: session.durationSeconds, resume },
            },
          ],
        });
      }
      setReady(true);
    });
  }, []);

  const content = ready ? (
    <SettingsProvider>
      <AppNavigator initialState={initialNavState} />
    </SettingsProvider>
  ) : null;

  return (
    <FlowProvider>
      {Platform.OS === 'web' ? <WebShell>{content}</WebShell> : content}
    </FlowProvider>
  );
}

const styles = StyleSheet.create({});
