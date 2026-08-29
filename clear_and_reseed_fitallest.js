import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lovnvngvvojmxhywctpq.supabase.co';
const supabaseKey = 'sb_publishable_CVFmneYHaqcm_yvMsiIueA_bebes4Vs';
const supabase = createClient(supabaseUrl, supabaseKey);

const FITALLEST_CATEGORIES = [
  {
    name: 'Thiết Kế Website & Apps',
    slug: 'thiet-ke-web-app',
    description: 'Thiết kế Website chuẩn UX/UI độc bản và ứng dụng di động iOS/Android cao cấp.'
  },
  {
    name: 'Cloud Hosting & Server',
    slug: 'cloud-hosting-server',
    description: 'Hạ tầng máy chủ đám mây NVMe SSD siêu tốc, uptime 99.9% tối ưu cho ứng dụng web.'
  },
  {
    name: 'Dịch Vụ SEO & Marketing',
    slug: 'dich-vu-seo-marketing',
    description: 'Chiến lược tối ưu hóa công cụ tìm kiếm Google và tăng trưởng chuyển đổi doanh số.'
  },
  {
    name: 'Giải Pháp AI & SaaS',
    slug: 'giai-phap-ai-saas',
    description: 'Hệ thống phần mềm SaaS quản trị doanh nghiệp và công cụ AI Design thông minh.'
  }
];

const FITALLEST_PRODUCTS = [
  {
    name: 'Thiết Kế Website Doanh Nghiệp Độc Bản',
    slug: 'thiet-ke-website-doanh-nghiep-doc-ban',
    category_slug: 'thiet-ke-web-app',
    original_price: 15000000,
    regular_price: 20000000,
    sale_price: 15000000,
    is_hot: true,
    status: 'published',
    thumbnail_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    short_description: 'Gói thiết kế website cao cấp thiết kế riêng theo diện mạo thương hiệu, 100% mã nguồn tối ưu tốc độ dưới 1.5s.',
    html_content: '<h3>Gói Thiết Kế Website Doanh Nghiệp Độc Bản Fi.tallest</h3><p>Mỗi website được nghiên cứu theo đúng ngành nghề kinh doanh, văn hóa thương hiệu và tập khách hàng mục tiêu của bạn. Tối ưu chuẩn SEO Google, mượt mà trên di động và tích hợp sẵn công cụ báo giá tự động.</p>',
    sku: 'FIT-WEB-BIZ',
    stock_status: 'instock',
    tags: ['Thiết kế web', 'Website doanh nghiệp', 'Chuẩn SEO'],
    seo_title: 'Thiết Kế Website Doanh Nghiệp Độc Bản | Fi.tallest',
    seo_description: 'Dịch vụ thiết kế website doanh nghiệp chuyên nghiệp chuẩn UX/UI độc bản từ Fi.tallest.'
  },
  {
    name: 'Phát Triển Ứng Dụng Di Động iOS & Android',
    slug: 'phat-trien-ung-dung-di-dong-ios-android',
    category_slug: 'thiet-ke-web-app',
    original_price: 35000000,
    regular_price: 45000000,
    sale_price: 35000000,
    is_hot: true,
    status: 'published',
    thumbnail_url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80',
    short_description: 'Xây dựng Mobile App đa nền tảng với hiệu năng cao, tích hợp thanh toán và thông báo Push Notification realtime.',
    html_content: '<h3>Phát Triển Mobile App Đa Nền Tảng Chuyên Nghiệp</h3><p>Fi.tallest xây dựng ứng dụng di động native/cross-platform mượt mà, tối ưu trải nghiệm người dùng trên cả hệ điều hành iOS và Android.</p>',
    sku: 'FIT-APP-MOB',
    stock_status: 'instock',
    tags: ['Mobile App', 'iOS', 'Android'],
    seo_title: 'Lập Trình App Di Động iOS & Android | Fi.tallest',
    seo_description: 'Dịch vụ thiết kế và lập trình ứng dụng di động chuyên nghiệp cho doanh nghiệp.'
  },
  {
    name: 'Cloud Hosting NVMe SSD 10GB Pro',
    slug: 'cloud-hosting-nvme-ssd-10gb-pro',
    category_slug: 'cloud-hosting-server',
    original_price: 2400000,
    regular_price: 3000000,
    sale_price: 2400000,
    is_hot: true,
    status: 'published',
    thumbnail_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    short_description: 'Hạ tầng máy chủ đám mây ổ cứng Enterprise NVMe SSD cho tốc độ xử lý nhanh gấp 10 lần SSD thông thường.',
    html_content: '<h3>Gói Cloud Hosting NVMe Bứt Phá Tốc Độ</h3><p>Tích hợp chứng chỉ SSL miễn phí, sao lưu dữ liệu tự động hàng ngày và cam kết Uptime 99.9%.</p>',
    sku: 'FIT-HOST-10G',
    stock_status: 'instock',
    tags: ['Cloud Hosting', 'NVMe SSD', 'Server'],
    seo_title: 'Cloud Hosting NVMe SSD Tốc Độ Cao | Fi.tallest',
    seo_description: 'Máy chủ Cloud Hosting NVMe tốc độ cao cho website doanh nghiệp.'
  },
  {
    name: 'Gói Dịch Vụ SEO Google Đột Phá Chuyển Đổi',
    slug: 'goi-dich-vu-seo-google-dot-pha-chuyen-doi',
    category_slug: 'dich-vu-seo-marketing',
    original_price: 18000000,
    regular_price: 22000000,
    sale_price: 18000000,
    is_hot: true,
    status: 'published',
    thumbnail_url: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?auto=format&fit=crop&w=800&q=80',
    short_description: 'Tối ưu hóa tổng thể website, đẩy top hàng trăm từ khóa ngành và gia tăng lượng truy cập tự nhiên bền vững.',
    html_content: '<h3>Dịch Vụ SEO Tổng Thể Tăng Trưởng Doanh Số</h3><p>Phương pháp SEO Mũ Trắng an toàn, lên top vững chắc và tối ưu hóa tỷ lệ chuyển đổi cho doanh nghiệp.</p>',
    sku: 'FIT-SEO-PRO',
    stock_status: 'instock',
    tags: ['SEO Google', 'Marketing', 'Tăng traffic'],
    seo_title: 'Dịch Vụ SEO Google Đột Phá Doanh Số | Fi.tallest',
    seo_description: 'Dịch vụ SEO Google tổng thể chuyên nghiệp giúp doanh nghiệp chiếm lĩnh thứ hạng hàng đầu.'
  }
];

const FITALLEST_POSTS = [
  {
    title: 'Top 10 Xu Hướng Thiết Kế Website & Apps Dẫn Đầu 2026',
    slug: 'top-10-xu-huong-thiet-ke-web-2026',
    cover_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop',
    excerpt: 'Khám phá phong cách Bento Grid cao cấp, Micro-Interactions mượt mà, hiệu ứng 3D Canvas và giải pháp tối ưu tỷ lệ chuyển đổi cho doanh nghiệp.',
    html_content: 'Trong kỷ nguyên số 2026, trải nghiệm người dùng (UX) và giao diện số (UI) không chỉ đơn thuần là sự đẹp mắt mà là chìa khóa then chốt quyết định doanh thu...',
    is_published: true
  },
  {
    title: 'Chiến Lược SEO Tổng Thể Thống Trị Top 1 Google Năm 2026',
    slug: 'chien-luoc-seo-tong-the-top-1-google',
    cover_image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=1000&auto=format&fit=crop',
    excerpt: 'Bí quyết tối ưu cấu trúc dữ liệu Semantic HTML5, Schema Markup và tốc độ Core Web Vitals giúp website đạt thứ hạng cao bền vững.',
    html_content: 'Thuật toán xếp hạng của Google ngày càng ưu tiên trải nghiệm người dùng thực tế và độ chuyên sâu của nội dung...',
    is_published: true
  },
  {
    title: 'Tối Ưu Tốc Độ Tải Trang Với Hạ Tầng Cloud Server NVMe',
    slug: 'toi-uu-toc-do-cloud-server-nvme',
    cover_image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1000&auto=format&fit=crop',
    excerpt: 'Tại sao tốc độ tải trang ảnh hưởng trực tiếp đến 70% quyết định mua hàng và cách nâng cấp hạ tầng lưu trữ đám mây cho doanh nghiệp.',
    html_content: 'Khảo sát từ Google chỉ ra rằng hơn 53% người dùng sẽ rời bỏ website nếu trang tải chậm quá 3 giây...',
    is_published: true
  },
  {
    title: 'Ứng Dụng Trí Tuệ Nhân Tạo (AI) Trong Tự Động Hóa Giao Diện Website',
    slug: 'ung-dung-ai-tu-dong-hoa-giao-dien',
    cover_image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=1000&auto=format&fit=crop',
    excerpt: 'Công nghệ AI Design giúp tạo mẫu trang landing page tự động, cá nhân hóa nội dung cho từng phân khúc khách hàng tiềm năng.',
    html_content: 'Trí tuệ nhân tạo đang tái định nghĩa cách chúng ta xây dựng phần mềm và trang web...',
    is_published: true
  }
];

async function reseed() {
  console.log('Fetching default tenant...');
  const { data: tenant, error: tErr } = await supabase.from('tenants').select('id').limit(1).maybeSingle();
  if (tErr || !tenant) {
    console.error('Cannot query tenant:', tErr);
    return;
  }
  const tenantId = tenant.id;
  console.log('Using Tenant ID:', tenantId);

  // 1. Clear products, categories, posts
  console.log('Clearing old categories...');
  await supabase.from('categories').delete().eq('tenant_id', tenantId);

  console.log('Clearing old products...');
  await supabase.from('products').delete().eq('tenant_id', tenantId);

  console.log('Clearing old posts...');
  await supabase.from('posts').delete().eq('tenant_id', tenantId);

  // 2. Insert new Categories
  const catMap = {};
  for (const cat of FITALLEST_CATEGORIES) {
    const payload = { 
      tenant_id: tenantId,
      name: cat.name,
      slug: cat.slug,
      description: cat.description
    };
    const { data, error } = await supabase.from('categories').insert([payload]).select('id').single();
    if (error) {
      console.error(`Error inserting category ${cat.name}:`, error.message);
    } else {
      catMap[cat.slug] = data.id;
      console.log(`Successfully created category: ${cat.name} (${data.id})`);
    }
  }

  // 3. Insert new Products
  for (const prod of FITALLEST_PRODUCTS) {
    const catId = catMap[prod.category_slug];
    const payload = {
      tenant_id: tenantId,
      category_id: catId || null,
      name: prod.name,
      slug: prod.slug,
      original_price: prod.original_price,
      regular_price: prod.regular_price,
      sale_price: prod.sale_price,
      is_hot: prod.is_hot,
      status: prod.status,
      thumbnail_url: prod.thumbnail_url,
      short_description: prod.short_description,
      html_content: prod.html_content,
      sku: prod.sku,
      stock_status: prod.stock_status,
      tags: prod.tags,
      seo_title: prod.seo_title,
      seo_description: prod.seo_description
    };

    const { error } = await supabase.from('products').insert([payload]);
    if (error) {
      console.error(`Error inserting product ${prod.name}:`, error.message);
    } else {
      console.log(`Successfully created product: ${prod.name}`);
    }
  }

  // 4. Insert new Posts
  for (const post of FITALLEST_POSTS) {
    const payload = {
      tenant_id: tenantId,
      title: post.title,
      slug: post.slug,
      cover_image: post.cover_image,
      excerpt: post.excerpt,
      html_content: post.html_content,
      is_published: post.is_published
    };
    const { error } = await supabase.from('posts').insert([payload]);
    if (error) {
      console.error(`Error inserting post ${post.title}:`, error.message);
    } else {
      console.log(`Successfully created post: ${post.title}`);
    }
  }

  console.log('Reseeding complete!');
}

reseed();
