import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
  Stack,
} from 'expo-router';

import * as SplashScreen from 'expo-splash-screen';

import { useColorScheme } from 'react-native';

import { AuthProvider } from '@/context/AuthContext';

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