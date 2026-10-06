import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from 'expo-router';

import * as SplashScreen from 'expo-splash-screen';

import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';

import {
  AuthProvider,
} from '@/context/AuthContext';

import { Stack } from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider
        value={
          colorScheme === 'dark'
            ? DarkTheme
            : DefaultTheme
        }
      >
        <AnimatedSplashOverlay />

        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen
            name="login"
          />

          <Stack.Screen
            name="(app)"
          />

          <Stack.Screen
            name="message"
          />
        </Stack>
      </ThemeProvider>
    </AuthProvider>
  );
}