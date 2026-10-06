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

  authElapsedSeconds: number;
};

const AuthContext =
  createContext<AuthContextType | null>(null);

const USER_STORAGE_KEY = 'lab2_auth_user';
const AUTH_START_TIME_KEY = 'lab2_auth_start_time';

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] =
    useState<User | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [authElapsedSeconds, setAuthElapsedSeconds] =
    useState(0);

  /*
   * Завантаження збереженої авторизації
   */
  useEffect(() => {
    const loadSavedAuth = async () => {
      try {
        console.log(
          '🔄 Перевірка збереженої авторизації...'
        );

        const savedUser =
          await AsyncStorage.getItem(
            USER_STORAGE_KEY
          );

        const savedStartTime =
          await AsyncStorage.getItem(
            AUTH_START_TIME_KEY
          );

        if (savedUser) {
          const parsedUser: User =
            JSON.parse(savedUser);

          console.log(
            '🟢 Знайдено збереженого користувача:',
            parsedUser
          );

          setUser(parsedUser);

          /*
           * Якщо час авторизації збережений,
           * відновлюємо таймер
           */
          if (savedStartTime) {
            const startTime =
              Number(savedStartTime);

            const elapsed = Math.floor(
              (Date.now() - startTime) / 1000
            );

            setAuthElapsedSeconds(
              Math.max(0, elapsed)
            );
          }
        } else {
          console.log(
            'ℹ️ Збереженого користувача немає'
          );

          setAuthElapsedSeconds(0);
        }
      } catch (error) {
        console.log(
          '🔴 Помилка завантаження авторизації:',
          error
        );

        setUser(null);
        setAuthElapsedSeconds(0);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedAuth();
  }, []);

  /*
   * Таймер авторизації
   *
   * Працює тільки тоді, коли user існує.
   */
  useEffect(() => {
    if (!user) {
      setAuthElapsedSeconds(0);
      return;
    }

    const updateTimer = async () => {
      try {
        const savedStartTime =
          await AsyncStorage.getItem(
            AUTH_START_TIME_KEY
          );

        if (!savedStartTime) {
          return;
        }

        const startTime =
          Number(savedStartTime);

        const elapsed = Math.floor(
          (Date.now() - startTime) / 1000
        );

        setAuthElapsedSeconds(
          Math.max(0, elapsed)
        );
      } catch (error) {
        console.log(
          '🔴 Помилка таймера авторизації:',
          error
        );
      }
    };

    /*
     * Одразу оновлюємо таймер
     */
    updateTimer();

    /*
     * Оновлюємо кожну секунду
     */
    const interval = setInterval(
      updateTimer,
      1000
    );

    /*
     * При виході з компонента
     * очищаємо interval
     */
    return () => {
      clearInterval(interval);
    };
  }, [user]);

  /*
   * Авторизація
   */
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

      if (!cleanLogin) {
        return {
          success: false,
          message: 'Введіть логін',
        };
      }

      /*
       * Шукаємо користувача в Supabase
       */
      const { data, error } =
        await supabase
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

      /*
       * Користувача з таким логіном немає
       */
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

      /*
       * Фіксуємо момент авторизації
       */
      const startTime = Date.now();

      /*
       * Зберігаємо користувача
       */
      await AsyncStorage.setItem(
        USER_STORAGE_KEY,
        JSON.stringify(loggedUser)
      );

      /*
       * Зберігаємо час початку авторизації
       */
      await AsyncStorage.setItem(
        AUTH_START_TIME_KEY,
        String(startTime)
      );

      /*
       * Встановлюємо користувача
       */
      setUser(loggedUser);

      /*
       * Початкове значення таймера
       */
      setAuthElapsedSeconds(0);

      console.log(
        '🟢 Авторизація успішна:',
        loggedUser
      );

      console.log(
        '⏱️ Таймер авторизації запущено'
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

  /*
   * Вихід із системи
   */
  const signOut = async () => {
    try {
      console.log(
        '🚪 Вихід користувача'
      );

      /*
       * Видаляємо користувача
       */
      setUser(null);

      /*
       * Скидаємо таймер
       */
      setAuthElapsedSeconds(0);

      /*
       * Видаляємо збереженого користувача
       */
      await AsyncStorage.removeItem(
        USER_STORAGE_KEY
      );

      /*
       * Видаляємо час початку авторизації
       */
      await AsyncStorage.removeItem(
        AUTH_START_TIME_KEY
      );

      console.log(
        '⏱️ Таймер авторизації скинуто'
      );

      console.log(
        '✅ Авторизацію завершено'
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
        authElapsedSeconds,
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