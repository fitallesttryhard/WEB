import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lovnvngvvojmxhywctpq.supabase.co';
const supabaseKey = 'sb_publishable_CVFmneYHaqcm_yvMsiIueA_bebes4Vs';
const SBUILD_TENANT_ID = '00000000-0000-0000-0000-000000000002';

const supabase = createClient(supabaseUrl, supabaseKey);

const DEFAULT_CONSTRUCTION_CATEGORIES = [
  { id: 'cc-1', name: 'Ốp lát gạch', slug: 'op-lat-gach', description: 'Nẹp góc gạch men, nẹp chỉ ron, nẹp tạo phẳng bề mặt ốp lát gạch đá cao cấp.' },
  { id: 'cc-2', name: 'Trát tường', slug: 'trat-tuong', description: 'Nẹp góc trát tường, nẹp chỉ ngắt nước mốc trát và định hình cạnh vữa sắc nét.' },
  { id: 'cc-3', name: 'Thạch cao', slug: 'thach-cao', description: 'Nẹp góc thạch cao, nẹp chỉ âm trần, khe co giãn vách ngăn tấm thạch cao.' },
  { id: 'cc-4', name: 'Hoàn thiện nội thất', slug: 'hoan-thien-noi-that', description: 'Nẹp sàn gỗ, nẹp kết thúc sàn, nẹp len chân tường và nẹp thảm trải sàn nội thất.' },
  { id: 'cc-5', name: 'Hoàn thiện ngoại thất', slug: 'hoan-thien-ngoai-that', description: 'Nẹp ban công, nẹp viền cửa sổ ngoài trời chịu nắng mưa và chống nứt cạnh tường.' },
  { id: 'cc-6', name: 'Thi công đèn LED', slug: 'thi-cong-den-led', description: 'Nẹp nhôm định hình dải LED âm trần, tủ kệ, khe sáng trang trí kiến trúc hiện đại.' },
  { id: 'cc-7', name: 'Chống thấm', slug: 'chong-tham', description: 'Nẹp và phụ kiện xử lý mối nối chống thấm cổ ống, mạch ngừng và khe co giãn công trình.' }
];

const PRODUCT_MAPPINGS = [
  { slug: 'nep-nhom-chu-t-t10mm-vang-xuoc', cc: ['Ốp lát gạch', 'Hoàn thiện nội thất'] },
  { slug: 'nep-nhom-goc-v-v20mm-bac-mo', cc: ['Trát tường', 'Hoàn thiện nội thất', 'Hoàn thiện ngoại thất'] },
  { slug: 'nep-nhom-chi-am-u12mm-nhom-mo', cc: ['Thạch cao', 'Hoàn thiện nội thất'] },
  { slug: 'nep-inox-304-chu-t-t15mm-vang-guong', cc: ['Ốp lát gạch', 'Hoàn thiện nội thất'] },
  { slug: 'nep-inox-304-v25mm-den-phan-quang', cc: ['Trát tường', 'Ốp lát gạch', 'Hoàn thiện ngoại thất'] },
  { slug: 'nep-inox-lap-la-flat-bar-20x2mm', cc: ['Ốp lát gạch', 'Hoàn thiện nội thất'] },
  { slug: 'nep-nhua-pvc-bo-goc-tron-gach-men-10mm', cc: ['Ốp lát gạch', 'Chống thấm'] },
  { slug: 'nep-ket-thuc-san-go-nhua-pvc-l25mm', cc: ['Hoàn thiện nội thất'] },
  { slug: 'nep-cao-su-chong-truot-cau-thang-mui-bac', cc: ['Ốp lát gạch', 'Hoàn thiện nội thất', 'Chống thấm'] },
  { slug: 'nep-dong-thau-nguyen-chat-chu-t-t20mm', cc: ['Ốp lát gạch', 'Hoàn thiện nội thất'] },
  { slug: 'nep-dong-v25mm-noi-go-chong-truot', cc: ['Ốp lát gạch', 'Hoàn thiện ngoại thất'] },
  { slug: 'nep-noi-tham-nhom-cao-cap-n20mm', cc: ['Hoàn thiện nội thất'] }
];

async function sync() {
  console.log('1. Syncing tenant_settings with construction_categories...');
  const { data: current } = await supabase
    .from('tenant_settings')
    .select('id, footer_config')
    .eq('tenant_id', SBUILD_TENANT_ID)
    .limit(1)
    .maybeSingle();

  if (current) {
    const fc = current.footer_config || {};
    fc.construction_categories = DEFAULT_CONSTRUCTION_CATEGORIES;
    const { error: tsErr } = await supabase.from('tenant_settings').update({ footer_config: fc }).eq('id', current.id);
    console.log('Tenant settings update:', tsErr ? tsErr.message : 'SUCCESS');
  }

  console.log('2. Syncing product tags with construction categories...');
  const { data: prods } = await supabase.from('products').select('id, name, slug, tags');
  if (prods) {
    for (const p of prods) {
      const mapping = PRODUCT_MAPPINGS.find(m => m.slug === p.slug);
      let ccToAdd = mapping ? mapping.cc : [];
      if (ccToAdd.length === 0) {
        if (p.name.includes('Gạch') || p.name.includes('Bo Góc') || p.name.includes('Chữ T')) {
          ccToAdd = ['Ốp lát gạch', 'Hoàn thiện nội thất'];
        } else if (p.name.includes('Vách') || p.name.includes('U12')) {
          ccToAdd = ['Thạch cao', 'Hoàn thiện nội thất'];
        } else if (p.name.includes('Trát') || p.name.includes('Cột')) {
          ccToAdd = ['Trát tường', 'Hoàn thiện ngoại thất'];
        } else {
          ccToAdd = ['Hoàn thiện nội thất'];
        }
      }

      const existingTags = (p.tags || []).filter(t => !t.startsWith('hm:'));
      const newTags = Array.from(new Set([...existingTags, ...ccToAdd.map(c => `hm:${c}`)]));
      
      const { error: prodErr } = await supabase.from('products').update({ tags: newTags }).eq('id', p.id);
      console.log(`Updated product: ${p.name} -> cc: ${ccToAdd.join(', ')} (${prodErr ? prodErr.message : 'OK'})`);
    }
  }

  console.log('Done sync!');
}

sync();
