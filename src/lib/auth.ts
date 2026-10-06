import { supabase } from './supabase';

export type User = {
  id: number;
  name: string;
  login: string;
};

export async function loginUser(
  login: string
): Promise<
  | { success: true; user: User }
  | { success: false; message: string }
> {
  const normalizedLogin = login.trim().toLowerCase();

  if (!normalizedLogin) {
    return {
      success: false,
      message: 'Введіть логін',
    };
  }

  const { data, error } = await supabase
    .from('users')
    .select('id, name, login')
    .eq('login', normalizedLogin)
    .maybeSingle();

  if (error) {
    console.log('❌ Помилка авторизації:', error);

    return {
      success: false,
      message: 'Помилка підключення до бази даних',
    };
  }

  if (!data) {
    return {
      success: false,
      message: 'Користувача з таким логіном не знайдено',
    };
  }

  return {
    success: true,
    user: data,
  };
}