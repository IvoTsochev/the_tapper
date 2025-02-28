import { createClient } from '@supabase/supabase-js';
import { Database } from '@/database.types';
import * as SecureStore from 'expo-secure-store';

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    const sessionData = JSON.parse(value);
    const minimalSessionData = {
      access_token: sessionData.access_token,
      refresh_token: sessionData.refresh_token,
      expires_at: sessionData.expires_at,
      userId: sessionData.user.id,
    };
    const minimalValue = JSON.stringify(minimalSessionData);

    return SecureStore.setItemAsync(key, minimalValue);
  },
  removeItem: (key: string) => {
    return SecureStore.deleteItemAsync(key);
  },
};

const supabaseUrl = process.env.EXPO_PUBLIC_CLOUD_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_CLOUD_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL or Anon Key is missing.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
