import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client — dùng trong Server Components và Route Handlers
// Không cần "use client", chạy trực tiếp trên server
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lovnvngvvojmxhywctpq.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_CVFmneYHaqcm_yvMsiIueA_bebes4Vs';

export function createServerSupabaseClient() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
  });
}
