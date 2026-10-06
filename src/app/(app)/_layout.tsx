import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export default function AppLayout() {
  const { user, isLoading } = useAuth();

  // Поки перевіряємо авторизацію — нічого не показуємо
  if (isLoading) {
    return null;
  }

  // Якщо користувач не авторизований — на сторінку входу
  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}