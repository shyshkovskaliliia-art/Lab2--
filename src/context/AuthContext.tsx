import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { supabase } from '@/lib/supabase';

type User = {
  id: number;
  login: string;
  name: string;
};

type AuthContextType = {
  user: User | null;
  setUser: React.Dispatch<
    React.SetStateAction<User | null>
  >;
  isLoading: boolean;
};

const AuthContext =
  createContext<AuthContextType | null>(null);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] =
    useState<User | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        console.log(
          '🔄 Завантаження користувача...'
        );

        const { data, error } = await supabase
          .from('users')
          .select('id, login, name')
          .eq('login', 'liliia')
          .single();

        if (error) {
          console.log(
            '🔴 Помилка отримання користувача:',
            error.message
          );
          return;
        }

        if (data) {
          console.log(
            '🟢 Користувач завантажений:',
            data
          );

          setUser(data);
        }
      } catch (error) {
        console.log(
          '🔴 Помилка:',
          error
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoading,
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