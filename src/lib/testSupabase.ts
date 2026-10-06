import { supabase } from './supabase';

export async function testSupabaseConnection() {
  const { data, error } = await supabase
    .from('users')
    .select('id, name, login');

  if (error) {
    console.log('❌ Помилка Supabase:', error);
    return;
  }

  console.log('✅ Supabase підключено!');
  console.log('Користувачі:', data);
}