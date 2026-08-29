import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lovnvngvvojmxhywctpq.supabase.co';
const supabaseKey = 'sb_publishable_CVFmneYHaqcm_yvMsiIueA_bebes4Vs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect() {
  const { data, error } = await supabase.from('products').select('*').limit(1);
  console.log('Error:', error);
  if (data && data.length > 0) {
    console.log('Existing columns in products:', Object.keys(data[0]));
  } else {
    console.log('No rows in products, trying insert dummy row...');
    const { data: insData, error: insErr } = await supabase.from('products').insert([{ name: 'Test' }]).select();
    console.log('Insert res:', insData, 'Ins err:', insErr);
  }
}

inspect();
