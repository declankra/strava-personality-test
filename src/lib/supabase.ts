import { createClient } from '@supabase/supabase-js';

let supabase: any;

export const getSupabase = (): any => {
  if (supabase) return supabase;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing required Supabase environment variables');
  }

  try {
    supabase = createClient<any>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false // Since we're using Strava's OAuth
      }
    });
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    throw error;
  }

  return supabase;
};
