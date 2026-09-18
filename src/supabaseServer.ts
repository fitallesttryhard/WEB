import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client cho Server Components
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lovnvngvvojmxhywctpq.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_CVFmneYHaqcm_yvMsiIueA_bebes4Vs';

export function createServerSupabaseClient() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
  });
}

export const SBUILD_TENANT_ID = '00000000-0000-0000-0000-000000000002';