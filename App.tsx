import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, useWindowDimensions, View } from 'react-native';
import { FlowingBackground } from './src/components/FlowingBackground';
import { FlowProvider, useFlow } from './src/hooks/useFlow';
import { SettingsProvider } from './src/hooks/useSettings';
import { ActiveSessionScreen } from './src/screens/ActiveSessionScreen';
import { CompletionScreen } from './src/screens/CompletionScreen';
import { PaceTrainerScreen } from './src/screens/PaceTrainerScreen';
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
        <Stack.Screen name="PaceTrainer" component={PaceTrainerScreen} />
        <Stack.Screen name="TrainingComplete" component={TrainingCompleteScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/**
 * Web layout: the app-root gradient spans the whole viewport and the phone
 * frame is transparent on top of it, so the inside and outside are one
 * continuous background. The flow animates only while the timer screen is
 * focused (via the shared flow flag).
 */
function WebShell({ children }: { children: React.ReactNode }) {
  const { flowing } = useFlow();
  const { width, height } = useWindowDimensions();
  const frameWidth = Math.floor(width / 3);
  // Phone aspect ratio ~9:19.5 (iPhone); cap at 90% viewport height
  const frameHeight = Math.min(Math.floor(frameWidth * (844 / 390)), height * 0.9);

  return (
    <FlowingBackground active={flowing}>
      <View style={styles.center}>
        <View style={[styles.phoneFrame, { width: frameWidth, height: frameHeight }]}>
          {children}
        </View>
      </View>
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

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneFrame: {
    overflow: 'hidden',
    borderRadius: 40,
    backgroundColor: 'transparent',
  },
});
