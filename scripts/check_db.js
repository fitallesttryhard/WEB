import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lovnvngvvojmxhywctpq.supabase.co';
const supabaseKey = 'sb_publishable_CVFmneYHaqcm_yvMsiIueA_bebes4Vs';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const tables = ['products', 'categories', 'posts', 'orders', 'leads', 'tenant_settings', 'tenants'];
  for (const t of tables) {
    const { data, error } = await supabase.from(t).select('*').limit(1);
    if (error) {
      console.log(`Table ${t}: Error ->`, error.message);
    } else {
      console.log(`Table ${t}: Success. Columns ->`, Object.keys(data[0] || {}));
    }
  }
}
run();
