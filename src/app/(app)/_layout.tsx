import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from 'expo-router';

import * as SplashScreen from 'expo-splash-screen';

import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';

import {
  AuthProvider,
  useAuth,
} from '@/context/AuthContext';

import { Redirect } from 'expo-router';

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
        <RootNavigator />
      </ThemeProvider>
    </AuthProvider>
  );
}

function RootNavigator() {
  const {
    user,
    isLoading,
  } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  return <AppTabs />;
}