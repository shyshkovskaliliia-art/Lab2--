// @ts-ignore The polyfill package may not provide declarations in this environment.
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
// @ts-ignore Supabase package types may be unavailable in this environment.
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL ?? 'https://jdnnnmvuiwkrsdzsdghc.supabase.co';
const supabasePublishableKey =
  process.env.SUPABASE_ANON_KEY ?? '';

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});