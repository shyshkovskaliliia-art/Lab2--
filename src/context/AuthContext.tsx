import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react';

import { loginUser, type User } from '@/lib/auth';

const SESSION_STORAGE_KEY = 'lab5_session';

const SESSION_DURATION = 10 * 60 * 1000;

type SessionData = {
  user: User;
  startedAt: number;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  sessionTimeLeft: number;
  signIn: (login: string) => Promise<{
    success: boolean;
    message?: string;
  }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
  children,
}: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [sessionTimeLeft, setSessionTimeLeft] =
    useState(0);

  useEffect(() => {
    loadSession();
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    const interval = setInterval(() => {
      checkSession();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [user]);

  async function loadSession() {
    try {
      const savedSession =
        await AsyncStorage.getItem(
          SESSION_STORAGE_KEY
        );

      if (!savedSession) {
        setIsLoading(false);
        return;
      }

      const session: SessionData =
        JSON.parse(savedSession);

      const elapsed =
        Date.now() - session.startedAt;

      const remaining =
        SESSION_DURATION - elapsed;

      if (remaining <= 0) {
        await signOut();
        setIsLoading(false);
        return;
      }

      setUser(session.user);
      setSessionTimeLeft(remaining);
    } catch (error) {
      console.log(
        '❌ Помилка завантаження сесії:',
        error
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function checkSession() {
    const savedSession =
      await AsyncStorage.getItem(
        SESSION_STORAGE_KEY
      );

    if (!savedSession) {
      return;
    }

    const session: SessionData =
      JSON.parse(savedSession);

    const elapsed =
      Date.now() - session.startedAt;

    const remaining =
      SESSION_DURATION - elapsed;

    if (remaining <= 0) {
      await signOut();
      return;
    }

    setSessionTimeLeft(remaining);
  }

  async function signIn(login: string) {
    const result = await loginUser(login);

    if (!result.success) {
      return {
        success: false,
        message: result.message,
      };
    }

    const session: SessionData = {
      user: result.user,
      startedAt: Date.now(),
    };

    await AsyncStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify(session)
    );

    setUser(result.user);
    setSessionTimeLeft(
      SESSION_DURATION
    );

    return {
      success: true,
    };
  }

  async function signOut() {
    await AsyncStorage.removeItem(
      SESSION_STORAGE_KEY
    );

    setUser(null);
    setSessionTimeLeft(0);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        sessionTimeLeft,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider'
    );
  }

  return context;
}