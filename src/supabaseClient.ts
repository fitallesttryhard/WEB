import { createClient } from '@supabase/supabase-js';

// Cấu hình kết nối dự án Supabase WEB
const DEFAULT_SUPABASE_URL = 'https://lovnvngvvojmxhywctpq.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_CVFmneYHaqcm_yvMsiIueA_bebes4Vs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_KEY;

// Khởi tạo và export Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
