import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { supabase } from '@/lib/supabase';

type User = {
  id: number;
  login: string;
  name: string;
};

type SignInResult = {
  success: boolean;
  message?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signIn: (login: string) => Promise<SignInResult>;
  signOut: () => Promise<void>;
};

const AuthContext =
  createContext<AuthContextType | null>(null);

const USER_STORAGE_KEY = 'lab2_auth_user';

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] =
    useState<User | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  // Завантаження збереженого користувача
  useEffect(() => {
    const loadSavedUser = async () => {
      try {
        console.log(
          '🔄 Перевірка збереженої авторизації...'
        );

        const savedUser =
          await AsyncStorage.getItem(
            USER_STORAGE_KEY
          );

        if (savedUser) {
          const parsedUser: User =
            JSON.parse(savedUser);

          console.log(
            '🟢 Знайдено збереженого користувача:',
            parsedUser
          );

          setUser(parsedUser);
        } else {
          console.log(
            'ℹ️ Збереженого користувача немає'
          );
        }
      } catch (error) {
        console.log(
          '🔴 Помилка завантаження користувача:',
          error
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedUser();
  }, []);

  // Авторизація за логіном
  const signIn = async (
    login: string
  ): Promise<SignInResult> => {
    try {
      const cleanLogin =
        login.trim().toLowerCase();

      console.log(
        '🔐 Спроба авторизації:',
        cleanLogin
      );

      const { data, error } = await supabase
        .from('users')
        .select('id, login, name')
        .eq('login', cleanLogin)
        .maybeSingle();

      if (error) {
        console.log(
          '🔴 Помилка пошуку користувача:',
          error
        );

        return {
          success: false,
          message:
            'Помилка підключення до бази даних',
        };
      }

      if (!data) {
        console.log(
          '🔴 Користувача не знайдено'
        );

        return {
          success: false,
          message:
            'Користувача з таким логіном не знайдено',
        };
      }

      const loggedUser: User = {
        id: data.id,
        login: data.login,
        name: data.name,
      };

      setUser(loggedUser);

      await AsyncStorage.setItem(
        USER_STORAGE_KEY,
        JSON.stringify(loggedUser)
      );

      console.log(
        '🟢 Авторизація успішна:',
        loggedUser
      );

      return {
        success: true,
      };
    } catch (error) {
      console.log(
        '🔴 Помилка авторизації:',
        error
      );

      return {
        success: false,
        message:
          'Сталася помилка під час авторизації',
      };
    }
  };

  // Вихід
  const signOut = async () => {
    try {
      console.log(
        '🚪 Вихід користувача'
      );

      setUser(null);

      await AsyncStorage.removeItem(
        USER_STORAGE_KEY
      );
    } catch (error) {
      console.log(
        '🔴 Помилка виходу:',
        error
      );
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider'
    );
  }

  return context;
}