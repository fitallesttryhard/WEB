import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lovnvngvvojmxhywctpq.supabase.co';
const supabaseKey = 'sb_publishable_CVFmneYHaqcm_yvMsiIueA_bebes4Vs';

const supabase = createClient(supabaseUrl, supabaseKey);

const SEED_CATEGORIES = [
  {
    name: 'Nẹp Nhôm Trang Trí',
    slug: 'nep-nhom-trang-tri',
  },
  {
    name: 'Nẹp Inox 304 Cao Cấp',
    slug: 'nep-inox-304-cao-cap',
  },
  {
    name: 'Nẹp Nhựa PVC & Chống Thấm',
    slug: 'nep-nhua-pvc-chong-tham',
  },
  {
    name: 'Nẹp Đồng & Nẹp Nối Thảm',
    slug: 'nep-dong-nep-noi-tham',
  }
];

const SEED_PRODUCTS = [
  {
    name: 'Nẹp Nhôm Chữ T T10mm Vàng Xước',
    slug: 'nep-nhom-chu-t-t10mm-vang-xuoc',
    category_slug: 'nep-nhom-trang-tri',
    original_price: 120000,
    is_hot: true,
    status: 'published',
    thumbnail_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
    short_description: 'Nẹp nhôm chữ T10mm xử lý khe hở giữa các mảng tường, sàn gỗ và gạch men. Mạ Anode chống phai màu.',
    html_content: '<p>Nẹp nhôm chữ T10mm là giải pháp hoàn hảo để xử lý các khe giãn cách, khe nối giữa các vật liệu lát sàn như gạch, đá, gỗ, kính trong thi công nội thất hiện đại.</p>'
  },
  {
    name: 'Nẹp Nhôm Góc V V20mm Bạc Mờ',
    slug: 'nep-nhom-goc-v-v20mm-bac-mo',
    category_slug: 'nep-nhom-trang-tri',
    original_price: 110000,
    is_hot: true,
    status: 'published',
    thumbnail_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop',
    short_description: 'Nẹp V20mm bảo vệ góc tường, cạnh cột chống sứt mẻ và tạo đường gờ sắc nét cho công trình.',
    html_content: '<p>Sản phẩm chuyên dùng để ốp bảo vệ các góc vuông 90 độ, mép cột, cạnh tủ vừa tránh trầy xước va đập vừa trang trí không gian sắc nét.</p>'
  },
  {
    name: 'Nẹp Nhôm Chỉ Âm U12mm Nhôm Mờ',
    slug: 'nep-nhom-chi-am-u12mm-nhom-mo',
    category_slug: 'nep-nhom-trang-tri',
    original_price: 135000,
    is_hot: false,
    status: 'published',
    thumbnail_url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=800&auto=format&fit=crop',
    short_description: 'Nẹp U12mm tạo chỉ âm trang trí vách tường thạch cao, vách gỗ nội thất cao cấp.',
    html_content: '<p>Tạo khe âm trang trí hiện đại cho vách gỗ, vách đá tự nhiên hoặc trần thạch cao kiến trúc Minimalist.</p>'
  },
  {
    name: 'Nẹp Inox 304 Chữ T T15mm Vàng Gương PVD',
    slug: 'nep-inox-304-chu-t-t15mm-vang-guong',
    category_slug: 'nep-inox-304-cao-cap',
    original_price: 220000,
    is_hot: true,
    status: 'published',
    thumbnail_url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=800&auto=format&fit=crop',
    short_description: 'Nẹp inox 304 nhập khẩu mạ PVD vàng gương độ bền vượt trội, không rỉ sét, chịu lực va đập tốt.',
    html_content: '<p>Sản phẩm cao cấp gia công từ thép không gỉ Inox 304 chuẩn chất lượng, phủ công nghệ mạ PVD chân không tạo bề mặt vàng gương lộng lẫy.</p>'
  },
  {
    name: 'Nẹp Inox 304 V25mm Đen Phản Quang',
    slug: 'nep-inox-304-v25mm-den-phan-quang',
    category_slug: 'nep-inox-304-cao-cap',
    original_price: 250000,
    is_hot: false,
    status: 'published',
    thumbnail_url: 'https://images.unsplash.com/photo-1541888086925-920a0b40eb45?q=80&w=800&auto=format&fit=crop',
    short_description: 'Nẹp góc V25mm inox 304 màu đen xước/gương tạo vẻ đẹp hiện đại, tối giản sang trọng cho căn hộ.',
    html_content: '<p>Mang lại nét cá tính kiến trúc Modern Black cho căn hộ cao cấp, villa và khu nghỉ dưỡng xa xỉ.</p>'
  },
  {
    name: 'Nẹp Inox Lập Là Flat Bar 20x2mm Vàng Xước',
    slug: 'nep-inox-lap-la-flat-bar-20x2mm',
    category_slug: 'nep-inox-304-cao-cap',
    original_price: 195000,
    is_hot: false,
    status: 'published',
    thumbnail_url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800&auto=format&fit=crop',
    short_description: 'Thanh inox lập là phẳng 20x2mm trang trí điểm nối đá hoa cương, kính cường lực và vách tivi.',
    html_content: '<p>Dán trực tiếp trên bề mặt phẳng vách đá tự nhiên, gỗ ốp tường tạo đường chỉ ánh kim nổi bật.</p>'
  },
  {
    name: 'Nẹp Nhựa PVC Bo Góc Tròn Gạch Men 10mm',
    slug: 'nep-nhua-pvc-bo-goc-tron-gach-men-10mm',
    category_slug: 'nep-nhua-pvc-chong-tham',
    original_price: 45000,
    is_hot: false,
    status: 'published',
    thumbnail_url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop',
    short_description: 'Nẹp nhựa bo tròn góc cột gạch men, thi công nhanh chóng, phối màu hoàn hảo với gạch ốp tường.',
    html_content: '<p>Giúp người thợ thi công gạch ốp tường không phải mài mòi góc 45 độ, vừa tiết kiệm thời gian vừa tránh rủi ro sứt mẻ gạch.</p>'
  },
  {
    name: 'Nẹp Kết Thúc Sàn Gỗ Nhựa PVC L25mm',
    slug: 'nep-ket-thuc-san-go-nhua-pvc-l25mm',
    category_slug: 'nep-nhua-pvc-chong-tham',
    original_price: 55000,
    is_hot: false,
    status: 'published',
    thumbnail_url: 'https://images.unsplash.com/photo-1504307651254-35680f356f58?q=80&w=800&auto=format&fit=crop',
    short_description: 'Nẹp nhựa L25mm che mép sàn gỗ tại cửa ra vào, chân tường và mép thảm trải sàn.',
    html_content: '<p>Xử lý điểm kết thúc của sàn gỗ công nghiệp, sàn nhựa hèm khóa bảo vệ mép sàn khỏi ẩm mốc.</p>'
  },
  {
    name: 'Nẹp Cao Su Chống Trượt Cầu Thang Mũi Bậc',
    slug: 'nep-cao-su-chong-truot-cau-thang-mui-bac',
    category_slug: 'nep-nhua-pvc-chong-tham',
    original_price: 85000,
    is_hot: true,
    status: 'published',
    thumbnail_url: 'https://images.unsplash.com/photo-1541888086925-920a0b40eb45?q=80&w=800&auto=format&fit=crop',
    short_description: 'Nẹp cao su kết hợp gờ nhôm chống trơn trượt bậc cầu thang gạch đá, an toàn cho trẻ nhỏ và người già.',
    html_content: '<p>Sản phẩm thiết yếu cho bậc cầu thang trường học, bệnh viện, tòa nhà văn phòng và nhà ở gia đình.</p>'
  },
  {
    name: 'Nẹp Đồng Thau Nguyên Chất Chữ T T20mm',
    slug: 'nep-dong-thau-nguyen-chat-chu-t-t20mm',
    category_slug: 'nep-dong-nep-noi-tham',
    original_price: 350000,
    is_hot: false,
    status: 'published',
    thumbnail_url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=800&auto=format&fit=crop',
    short_description: 'Nẹp đồng thau nguyên khối T20mm độ bền hàng chục năm, mang phong cách cổ điển hoài cổ tân cổ điển.',
    html_content: '<p>Chế tác từ đồng thau vàng đúc nguyên khối, chống mài mòn tuyệt đối, màu sắc tự nhiên theo thời gian càng dùng càng bóng đẹp.</p>'
  },
  {
    name: 'Nẹp Đồng V25mm Nổi Gờ Chống Trượt',
    slug: 'nep-dong-v25mm-noi-go-chong-truot',
    category_slug: 'nep-dong-v25mm-noi-go-chong-truot',
    original_price: 380000,
    is_hot: false,
    status: 'published',
    thumbnail_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
    short_description: 'Nẹp đồng góc V25mm gờ sọc mạ bóng cao cấp bảo vệ đá granit cầu thang và vách đá tự nhiên.',
    html_content: '<p>Thiết kế gờ sọc chống trượt sang trọng cho cầu thang đá Marble, Granite biệt thự gia đình.</p>'
  },
  {
    name: 'Nẹp Nối Thảm Nhôm Răng Cưa N20mm',
    slug: 'nep-noi-tham-nhom-cao-cap-n20mm',
    category_slug: 'nep-dong-nep-noi-tham',
    original_price: 150000,
    is_hot: false,
    status: 'published',
    thumbnail_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop',
    short_description: 'Nẹp nhôm răng cưa giữ chắc mép thảm khách sạn, văn phòng và khu vực sảnh hội nghị.',
    html_content: '<p>Cố định chắc chắn nếp thảm trải sàn tại sảnh đón tiếp, hành lang khách sạn và trung tâm hội nghị.</p>'
  }
];

async function run() {
  console.log('Testing connection to Supabase...');
  const { data: tenant, error: tErr } = await supabase.from('tenants').select('id').limit(1).maybeSingle();
  console.log('Tenant query:', tenant, 'Err:', tErr);

  let tenantId = tenant?.id;

  if (!tenantId) {
    console.log('No tenant found. Creating default tenant...');
    const { data: newTenant, error: insTErr } = await supabase
      .from('tenants')
      .insert([{ name: 'S-BUILD Vật Tư Xây Dựng', subdomain: 'sbuild-store' }])
      .select('id')
      .single();
    if (insTErr) {
      console.error('Cannot create tenant:', insTErr);
    } else {
      tenantId = newTenant.id;
    }
  }

  console.log('Using tenant_id:', tenantId);

  // 1. Insert Categories
  const catMap = {};
  for (const cat of SEED_CATEGORIES) {
    const { data: existing } = await supabase.from('categories').select('id').eq('slug', cat.slug).maybeSingle();
    if (existing?.id) {
      catMap[cat.slug] = existing.id;
      console.log(`[Category Exists] ${cat.name}`);
    } else {
      const payload = { name: cat.name, slug: cat.slug };
      if (tenantId) payload.tenant_id = tenantId;
      const { data: inserted, error } = await supabase.from('categories').insert([payload]).select('id').single();
      if (error) {
        console.error(`[Category Error] ${cat.name}:`, error.message);
      } else {
        catMap[cat.slug] = inserted.id;
        console.log(`[Category Created] ${cat.name}`);
      }
    }
  }

  // 2. Insert Products
  for (const prod of SEED_PRODUCTS) {
    const catId = catMap[prod.category_slug];
    const { data: existing } = await supabase.from('products').select('id').eq('slug', prod.slug).maybeSingle();

    const payload = {
      name: prod.name,
      slug: prod.slug,
      category_id: catId || null,
      original_price: prod.original_price,
      is_hot: prod.is_hot,
      status: prod.status,
      thumbnail_url: prod.thumbnail_url,
      short_description: prod.short_description,
      html_content: prod.html_content
    };
    if (tenantId) payload.tenant_id = tenantId;

    if (existing?.id) {
      const { error } = await supabase.from('products').update(payload).eq('id', existing.id);
      if (error) console.error(`[Product Update Err] ${prod.name}:`, error.message);
      else console.log(`[Product Updated] ${prod.name}`);
    } else {
      const { error } = await supabase.from('products').insert([payload]);
      if (error) console.error(`[Product Insert Err] ${prod.name}:`, error.message);
      else console.log(`[Product Created] ${prod.name}`);
    }
  }

  console.log('Seed check complete.');
}

run();
