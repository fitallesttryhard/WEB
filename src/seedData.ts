import { supabase } from './supabaseClient';

export const SEED_CATEGORIES = [
  {
    name: 'Nẹp Nhôm Trang Trí',
    slug: 'nep-nhom-trang-tri',
    description: 'Nẹp nhôm chữ T, V, U, L mạ Anode cao cấp chống ăn mòn và tạo đường chỉ sắc nét cho công trình.'
  },
  {
    name: 'Nẹp Inox 304 Cao Cấp',
    slug: 'nep-inox-304-cao-cap',
    description: 'Nẹp inox 304 mạ PVD vàng gương, vàng xước, đen bóng đạt chuẩn sang trọng và chịu lực va đập tốt.'
  },
  {
    name: 'Nẹp Nhựa PVC & Chống Thấm',
    slug: 'nep-nhua-pvc-chong-tham',
    description: 'Nẹp nhựa bo góc gạch men, nẹp kết thúc sàn gỗ và nẹp cao su chống trượt bậc cầu thang.'
  },
  {
    name: 'Nẹp Đồng & Nẹp Nối Thảm',
    slug: 'nep-dong-nep-noi-tham',
    description: 'Nẹp đồng thau nguyên chất tân cổ điển và nẹp nhôm răng cưa giữ chắc mép thảm trải sàn.'
  }
];

export const SEED_PRODUCTS = [
  // 1. Nẹp Nhôm
  {
    name: 'Nẹp Nhôm Chữ T T10mm Vàng Xước',
    slug: 'nep-nhom-chu-t-t10mm-vang-xuoc',
    category_slug: 'nep-nhom-trang-tri',
    sku: 'NEP-T10-VX',
    original_price: 120000,
    sale_price: 95000,
    stock_status: 'in_stock',
    is_hot: true,
    status: 'published',
    thumbnail_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
    tags: ['Nẹp nhôm', 'Chữ T', 'Trang trí nội thất'],
    seo_description: 'Nẹp nhôm chữ T10mm xử lý khe hở giữa các mảng tường, sàn gỗ và gạch men. Mạ Anode chống phai màu.',
    description: `
      <h3>Nẹp Nhôm Chữ T T10mm Vàng Xước Cao Cấp</h3>
      <p>Nẹp nhôm chữ T10mm là giải pháp hoàn hảo để xử lý các khe giãn cách, khe nối giữa các vật liệu lát sàn như gạch, đá, gỗ, kính trong thi công nội thất hiện đại.</p>
      <h4>Ưu điểm nổi bật:</h4>
      <ul>
        <li>Chất liệu hợp kim nhôm 6063-T5 mạ Anode độ bền màu trên 10 năm.</li>
        <li>Tạo đường nét trang trí sang trọng, tinh tế trên vách tường và sàn nhà.</li>
        <li>Thi công đơn giản bằng keo chuyên dụng (Silicon / Titebond).</li>
      </ul>
    `,
    specs: `<p><strong>Quy cách:</strong> Rộng 10mm x Dài 2.5m</p><p><strong>Màu sắc:</strong> Vàng xước (Gold Brushed)</p><p><strong>Chất liệu:</strong> Hợp kim nhôm cao cấp</p>`
  },
  {
    name: 'Nẹp Nhôm Góc V V20mm Bạc Mờ',
    slug: 'nep-nhom-goc-v-v20mm-bac-mo',
    category_slug: 'nep-nhom-trang-tri',
    sku: 'NEP-V20-BM',
    original_price: 110000,
    sale_price: 85000,
    stock_status: 'in_stock',
    is_hot: true,
    status: 'published',
    thumbnail_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop',
    tags: ['Nẹp nhôm', 'Góc V', 'Bảo vệ góc'],
    seo_description: 'Nẹp V20mm bảo vệ góc tường, cạnh cột chống sứt mẻ và tạo đường gờ sắc nét cho công trình.',
    description: `
      <h3>Nẹp Nhôm Góc V20mm Bạc Mờ</h3>
      <p>Sản phẩm chuyên dùng để ốp bảo vệ các góc vuông 90 độ, mép cột, cạnh tủ vừa tránh trầy xước va đập vừa trang trí không gian sắc nét.</p>
    `,
    specs: `<p><strong>Quy cách:</strong> 20mm x 20mm x Dài 2.5m</p><p><strong>Màu sắc:</strong> Bạc mờ (Silver Matte)</p><p><strong>Độ dày:</strong> 1.0mm</p>`
  },
  {
    name: 'Nẹp Nhôm Chỉ Âm U12mm Nhôm Mờ',
    slug: 'nep-nhom-chi-am-u12mm-nhom-mo',
    category_slug: 'nep-nhom-trang-tri',
    sku: 'NEP-U12-NM',
    original_price: 135000,
    sale_price: 105000,
    stock_status: 'in_stock',
    is_hot: false,
    status: 'published',
    thumbnail_url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=800&auto=format&fit=crop',
    tags: ['Nẹp nhôm', 'Chỉ âm', 'Vách thạch cao'],
    seo_description: 'Nẹp U12mm tạo chỉ âm trang trí vách tường thạch cao, vách gỗ nội thất cao cấp.',
    description: `
      <h3>Nẹp Nhôm Chỉ Âm U12mm</h3>
      <p>Tạo khe âm trang trí hiện đại cho vách gỗ, vách đá tự nhiên hoặc trần thạch cao kiến trúc Minimalist.</p>
    `,
    specs: `<p><strong>Quy cách:</strong> Rộng 12mm x Sâu 10mm x Dài 2.5m</p><p><strong>Màu sắc:</strong> Nhôm nguyên bản mờ</p>`
  },

  // 2. Nẹp Inox
  {
    name: 'Nẹp Inox 304 Chữ T T15mm Vàng Gương PVD',
    slug: 'nep-inox-304-chu-t-t15mm-vang-guong',
    category_slug: 'nep-inox-304-cao-cap',
    sku: 'INOX-T15-VG',
    original_price: 220000,
    sale_price: 185000,
    stock_status: 'in_stock',
    is_hot: true,
    status: 'published',
    thumbnail_url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=800&auto=format&fit=crop',
    tags: ['Nẹp Inox', 'Inox 304', 'Vàng gương'],
    seo_description: 'Nẹp inox 304 nhập khẩu mạ PVD vàng gương độ bền vượt trội, không rỉ sét, chịu lực va đập tốt.',
    description: `
      <h3>Nẹp Inox 304 Chữ T T15mm Vàng Gương PVD</h3>
      <p>Sản phẩm cao cấp gia công từ thép không gỉ Inox 304 chuẩn chất lượng, phủ công nghệ mạ PVD chân không tạo bề mặt vàng gương lộng lẫy.</p>
    `,
    specs: `<p><strong>Chất liệu:</strong> Inox 304 cao cấp</p><p><strong>Quy cách:</strong> Rộng 15mm x Dài 2.44m</p><p><strong>Màu sắc:</strong> Gold Mirror (Vàng gương)</p>`
  },
  {
    name: 'Nẹp Inox 304 V25mm Đen Phản Quang',
    slug: 'nep-inox-304-v25mm-den-phan-quang',
    category_slug: 'nep-inox-304-cao-cap',
    sku: 'INOX-V25-BLACK',
    original_price: 250000,
    sale_price: 210000,
    stock_status: 'in_stock',
    is_hot: false,
    status: 'published',
    thumbnail_url: 'https://images.unsplash.com/photo-1541888086925-920a0b40eb45?q=80&w=800&auto=format&fit=crop',
    tags: ['Nẹp Inox', 'Đen gương', 'Góc V'],
    seo_description: 'Nẹp góc V25mm inox 304 màu đen xước/gương tạo vẻ đẹp hiện đại, tối giản sang trọng cho căn hộ.',
    description: `
      <h3>Nẹp Inox 304 V25mm Đen Phản Quang Modern Dark</h3>
      <p>Mang lại nét cá tính kiến trúc Modern Black cho căn hộ cao cấp, villa và khu nghỉ dưỡng xa xỉ.</p>
    `,
    specs: `<p><strong>Chất liệu:</strong> Inox 304 chấn góc</p><p><strong>Quy cách:</strong> 25mm x 25mm x Dài 2.44m</p>`
  },
  {
    name: 'Nẹp Inox Lập Là Flat Bar 20x2mm Vàng Xước',
    slug: 'nep-inox-lap-la-flat-bar-20x2mm',
    category_slug: 'nep-inox-304-cao-cap',
    sku: 'INOX-FLAT-202',
    original_price: 195000,
    sale_price: 160000,
    stock_status: 'in_stock',
    is_hot: false,
    status: 'published',
    thumbnail_url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800&auto=format&fit=crop',
    tags: ['Nẹp Inox', 'Lập là', 'Trang trí phẳng'],
    seo_description: 'Thanh inox lập là phẳng 20x2mm trang trí điểm nối đá hoa cương, kính cường lực và vách tivi.',
    description: `
      <h3>Nẹp Inox Lập Là Flat Bar 20x2mm</h3>
      <p>Dán trực tiếp trên bề mặt phẳng vách đá tự nhiên, gỗ ốp tường tạo đường chỉ ánh kim nổi bật.</p>
    `,
    specs: `<p><strong>Kích thước:</strong> Bản rộng 20mm x Dày 2mm x Dài 2.44m</p>`
  },

  // 3. Nẹp Nhựa PVC
  {
    name: 'Nẹp Nhựa PVC Bo Góc Tròn Gạch Men 10mm',
    slug: 'nep-nhua-pvc-bo-goc-tron-gach-men-10mm',
    category_slug: 'nep-nhua-pvc-chong-tham',
    sku: 'PVC-GOC-10',
    original_price: 45000,
    sale_price: 35000,
    stock_status: 'in_stock',
    is_hot: false,
    status: 'published',
    thumbnail_url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop',
    tags: ['Nẹp nhựa', 'Bo góc gạch', 'Thi công gạch'],
    seo_description: 'Nẹp nhựa bo tròn góc cột gạch men, thi công nhanh chóng, phối màu hoàn hảo với gạch ốp tường.',
    description: `
      <h3>Nẹp Nhựa PVC Bo Góc Tròn Ốp Gạch Men</h3>
      <p>Giúp người thợ thi công gạch ốp tường không phải mài mòi góc 45 độ, vừa tiết kiệm thời gian vừa tránh rủi ro sứt mẻ gạch.</p>
    `,
    specs: `<p><strong>Chất liệu:</strong> Nhựa PVC nguyên sinh</p><p><strong>Đường kính bo:</strong> 10mm</p>`
  },
  {
    name: 'Nẹp Kết Thúc Sàn Gỗ Nhựa PVC L25mm',
    slug: 'nep-ket-thuc-san-go-nhua-pvc-l25mm',
    category_slug: 'nep-nhua-pvc-chong-tham',
    sku: 'PVC-SAN-L25',
    original_price: 55000,
    sale_price: 40000,
    stock_status: 'in_stock',
    is_hot: false,
    status: 'published',
    thumbnail_url: 'https://images.unsplash.com/photo-1504307651254-35680f356f58?q=80&w=800&auto=format&fit=crop',
    tags: ['Nẹp nhựa', 'Sàn gỗ', 'Nẹp kết thúc'],
    seo_description: 'Nẹp nhựa L25mm che mép sàn gỗ tại cửa ra vào, chân tường và mép thảm trải sàn.',
    description: `
      <h3>Nẹp Kết Thúc Sàn Gỗ Nhựa PVC L25mm</h3>
      <p>Xử lý điểm kết thúc của sàn gỗ công nghiệp, sàn nhựa hèm khóa bảo vệ mép sàn khỏi ẩm mốc.</p>
    `,
    specs: `<p><strong>Quy cách:</strong> L25mm x Dài 2.7m</p>`
  },
  {
    name: 'Nẹp Cao Su Chống Trượt Cầu Thang Mũi Bậc',
    slug: 'nep-cao-su-chong-truot-cau-thang-mui-bac',
    category_slug: 'nep-nhua-pvc-chong-tham',
    sku: 'NEP-CAOSU-TRUOT',
    original_price: 85000,
    sale_price: 65000,
    stock_status: 'in_stock',
    is_hot: true,
    status: 'published',
    thumbnail_url: 'https://images.unsplash.com/photo-1541888086925-920a0b40eb45?q=80&w=800&auto=format&fit=crop',
    tags: ['Nẹp cao su', 'Chống trượt', 'Cầu thang'],
    seo_description: 'Nẹp cao su kết hợp gờ nhôm chống trơn trượt bậc cầu thang gạch đá, an toàn cho trẻ nhỏ và người già.',
    description: `
      <h3>Nẹp Cao Su Mũi Bậc Cầu Thang Chống Trơn Trượt</h3>
      <p>Sản phẩm thiết yếu cho bậc cầu thang trường học, bệnh viện, tòa nhà văn phòng và nhà ở gia đình.</p>
    `,
    specs: `<p><strong>Quy cách:</strong> Mặt 50mm x Đô sâu 20mm</p><p><strong>Tính năng:</strong> Chống trượt Ma sát cao</p>`
  },

  // 4. Nẹp Đồng & Nẹp Thảm
  {
    name: 'Nẹp Đồng Thau Nguyên Chất Chữ T T20mm',
    slug: 'nep-dong-thau-nguyen-chat-chu-t-t20mm',
    category_slug: 'nep-dong-nep-noi-tham',
    sku: 'DONG-T20-PURE',
    original_price: 350000,
    sale_price: 295000,
    stock_status: 'in_stock',
    is_hot: false,
    status: 'published',
    thumbnail_url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=800&auto=format&fit=crop',
    tags: ['Nẹp đồng', 'Đồng thau', 'Cổ điển'],
    seo_description: 'Nẹp đồng thau nguyên khối T20mm độ bền hàng chục năm, mang phong cách cổ điển hoài cổ tân cổ điển.',
    description: `
      <h3>Nẹp Đồng Thau Nguyên Chất Chữ T20mm Premium</h3>
      <p>Chế tác từ đồng thau vàng đúc nguyên khối, chống mài mòn tuyệt đối, màu sắc tự nhiên theo thời gian càng dùng càng bóng đẹp.</p>
    `,
    specs: `<p><strong>Chất liệu:</strong> Đồng thau CuZn39 (Đồng > 58%)</p><p><strong>Quy cách:</strong> Rộng 20mm x Dài 3.0m</p>`
  },
  {
    name: 'Nẹp Đồng V25mm Nổi Gờ Chống Trượt',
    slug: 'nep-dong-v25mm-noi-go-chong-truot',
    category_slug: 'nep-dong-nep-noi-tham',
    sku: 'DONG-V25-GO',
    original_price: 380000,
    sale_price: 320000,
    stock_status: 'in_stock',
    is_hot: false,
    status: 'published',
    thumbnail_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
    tags: ['Nẹp đồng', 'Góc V', 'Mũi bậc'],
    seo_description: 'Nẹp đồng góc V25mm gờ sọc mạ bóng cao cấp bảo vệ đá granit cầu thang và vách đá tự nhiên.',
    description: `
      <h3>Nẹp Đồng V25mm Sọc Gờ Mũi Bậc Cầu Thang</h3>
      <p>Thiết kế gờ sọc chống trượt sang trọng cho cầu thang đá Marble, Granite biệt thự gia đình.</p>
    `,
    specs: `<p><strong>Kích thước:</strong> V25mm x V25mm x Dài 3.0m</p>`
  },
  {
    name: 'Nẹp Nối Thảm Nhôm Răng Cưa N20mm',
    slug: 'nep-noi-tham-nhom-cao-cap-n20mm',
    category_slug: 'nep-dong-nep-noi-tham',
    sku: 'NHOM-THAM-N20',
    original_price: 150000,
    sale_price: 125000,
    stock_status: 'in_stock',
    is_hot: false,
    status: 'published',
    thumbnail_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop',
    tags: ['Nẹp thảm', 'Nẹp răng cưa', 'Nối thảm'],
    seo_description: 'Nẹp nhôm răng cưa giữ chắc mép thảm khách sạn, văn phòng và khu vực sảnh hội nghị.',
    description: `
      <h3>Nẹp Nối Thảm Nhôm Răng Cưa Khách Sạn</h3>
      <p>Cố định chắc chắn nếp thảm trải sàn tại sảnh đón tiếp, hành lang khách sạn và trung tâm hội nghị.</p>
    `,
    specs: `<p><strong>Quy cách:</strong> Bản 20mm x Dài 2.5m</p>`
  }
];

export async function seedTrimDatabase() {
  try {
    // 1. Get default tenant id
    const { data: tenant } = await supabase.from('tenants').select('id').limit(1).maybeSingle();
    const tenantId = tenant?.id;

    // 2. Insert Categories
    const categoryMap: Record<string, string> = {};
    for (const cat of SEED_CATEGORIES) {
      const { data: existing } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', cat.slug)
        .maybeSingle();

      if (existing?.id) {
        categoryMap[cat.slug] = existing.id;
      } else {
        const payload: any = {
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
        };
        if (tenantId) payload.tenant_id = tenantId;

        const { data: inserted, error } = await supabase
          .from('categories')
          .insert([payload])
          .select('id')
          .single();

        if (inserted?.id) {
          categoryMap[cat.slug] = inserted.id;
        } else if (error) {
          console.warn('Lỗi insert category:', error);
        }
      }
    }

    // 3. Insert Products
    let count = 0;
    for (const prod of SEED_PRODUCTS) {
      const catId = categoryMap[prod.category_slug];

      const { data: existingProd } = await supabase
        .from('products')
        .select('id')
        .eq('slug', prod.slug)
        .maybeSingle();

      const prodPayload: any = {
        name: prod.name,
        slug: prod.slug,
        category_id: catId || null,
        sku: prod.sku,
        original_price: prod.original_price,
        sale_price: prod.sale_price,
        regular_price: prod.original_price,
        stock_status: prod.stock_status,
        is_hot: prod.is_hot,
        status: prod.status,
        thumbnail_url: prod.thumbnail_url,
        image_url: prod.thumbnail_url,
        tags: prod.tags,
        seo_description: prod.seo_description,
        description: prod.description,
        specs: prod.specs,
      };

      if (tenantId) prodPayload.tenant_id = tenantId;

      if (existingProd?.id) {
        await supabase.from('products').update(prodPayload).eq('id', existingProd.id);
        count++;
      } else {
        await supabase.from('products').insert([prodPayload]);
        count++;
      }
    }

    return { success: true, count };
  } catch (error: any) {
    console.error('Lỗi khi nạp seed nẹp xây dựng:', error);
    return { success: false, error: error.message };
  }
}
