import { supabase } from './supabase';

export async function testSupabaseConnection() {
  const { data, error } = await supabase
    .from('users')
    .select('id, name, login');

  if (error) {
    console.log('❌ Помилка Supabase:', error);

    return {
      success: false,
      message: error.message,
    };
  }

  console.log('✅ Supabase підключено!');
  console.log('Користувачі:', data);

  return {
    success: true,
    data,
  };
}