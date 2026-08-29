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
    title: 'Dự Án Thực Tế: Website Kiến Trúc Phong Thủy Kỳ Nam',
    slug: 'du-an-website-kien-truc-phong-thuy-ky-nam',
    cover_image: '/assets/images/da/ptkn.webp',
    excerpt: 'Hệ thống website thương hiệu kiến trúc phong thủy tích hợp công cụ tra cứu Thước Lỗ Ban 3D, blog kinh nghiệm xây dựng và portfolio 50+ công trình hoàn thiện.',
    html_content: '<h3>Tổng quan dự án Kiến Trúc Phong Thủy Kỳ Nam</h3><p>Fi.tallest thiết kế giao diện độc bản sang trọng theo tông màu phong thủy mệnh chủ. Tích hợp bộ công cụ tự động tính kích thước Thước Lỗ Ban âm trạch và dương trạch, chuẩn UX/UI giúp tăng 180% lượt đăng ký tư vấn phong thủy trực tuyến.</p>',
    is_published: true
  },
  {
    title: 'Dự Án Thực Tế: Website Tập Đoàn Máy Làm Đá Viên Việt An',
    slug: 'du-an-website-tap-doan-may-lam-da-vien-viet-an',
    cover_image: '/assets/images/da/va.png',
    excerpt: 'Hệ thống thương mại điện tử đa ngôn ngữ (Việt - Anh - Trung - Pháp), tích hợp cổng thanh toán VNPay và hệ thống ERP quản lý tiến độ thi công nhà máy.',
    html_content: '<h3>Tổng quan dự án Tập Đoàn Việt An</h3><p>Hệ thống cổng thông tin và thương mại điện tử công nghiệp đạt chuẩn ISO, tích hợp catalogue sản phẩm 3D, thanh toán trực tuyến VNPay và tự động kết nối hệ thống ERP quản lý quy trình lắp đặt máy làm đá công nghiệp trên toàn quốc.</p>',
    is_published: true
  },
  {
    title: 'Dự Án Thực Tế: Website Công Ty Xây Dựng Happy House',
    slug: 'du-an-website-xay-dung-happy-house',
    cover_image: '/assets/images/da/hph.webp',
    excerpt: 'Giải pháp website doanh nghiệp xây dựng cao cấp tích hợp bộ tính dự toán chi phí thi công biệt thự, nhà phố theo m2 tự động trong 5 giây.',
    html_content: '<h3>Tổng quan dự án Xây Dựng Happy House</h3><p>Giao diện hiện đại thể hiện trọn vẹn 50+ case study công trình thi công thực tế. Tích hợp tính năng nhận dự toán ngân sách tự động theo diện tích giúp khách hàng dễ dàng đưa ra quyết định giao thầu.</p>',
    is_published: true
  },
  {
    title: 'Dự Án Thực Tế: Website Chuyên Khoa BS. Tuấn - BV Phương Nam',
    slug: 'du-an-website-bs-tuan-bv-phuong-nam',
    cover_image: '/assets/images/da/bst.png',
    excerpt: 'Website tư vấn y tế chuẩn Y Khoa, tích hợp hệ thống đặt lịch khám trực tuyến, đặt lịch tư vấn từ xa và tự động nhắc lịch qua Zalo/SMS.',
    html_content: '<h3>Tổng quan dự án Bác Sĩ Tuấn</h3><p>Website thương hiệu cá nhân chuyên gia y tế được tối ưu chuẩn bảo mật dữ liệu y khoa, tốc độ phản hồi nhanh <1 giây và giao diện thân thiện với bệnh nhân trên thiết bị di động.</p>',
    is_published: true
  },
  {
    title: 'Dự Án Thực Tế: Website BS. Hiếu - Trưởng Khoa BV Quân Y 7A',
    slug: 'du-an-website-bs-hieu-bv-quan-y-7a',
    cover_image: '/assets/images/da/bsh.webp',
    excerpt: 'Chiến dịch thiết kế website & SEO Google đột phá: Đạt Top 3 Google với 15 từ khóa cốt lõi ngành Cơ Xương Khớp, điểm Google PageSpeed 95/100.',
    html_content: '<h3>Tổng quan dự án Bác Sĩ Hiếu</h3><p>Xây dựng hệ thống bài viết tư vấn y học chuyên sâu, tối ưu cấu trúc SEO Onpage và Schema Markup y tế. Đem lại hàng ngàn lượt truy cập tự nhiên mỗi tháng từ người bệnh.</p>',
    is_published: true
  },
  {
    title: 'Dự Án Thực Tế: Website Thương Hiệu Sơn Trường Thịnh (Haky & Alpes)',
    slug: 'du-an-website-son-truong-thinh-haky-alpes',
    cover_image: '/assets/images/da/sonth.png',
    excerpt: 'Ứng dụng công nghệ sơn thử màu thông minh bằng trí tuệ nhân tạo (AI), bảng màu kỹ thuật số tương tác và công cụ tính định mức lượng sơn công trình.',
    html_content: '<h3>Tổng quan dự án Sơn Trường Thịnh</h3><p>Giải pháp đột phá ngành sơn nước: Người mua chỉ cần tải ảnh ngôi nhà lên là có thể sơn thử màu trực tiếp trực quan trên website trước khi mua hàng.</p>',
    is_published: true
  },
  {
    title: 'Dự Án Thực Tế: Website Thương Mại Điện Tử Nguyên Liệu Thành Huy',
    slug: 'du-an-website-nguyen-lieu-thanh-huy',
    cover_image: '/assets/images/da/nlth.png',
    excerpt: 'Kênh bán hàng nguyên liệu pha chế chính chủ, tối ưu chi phí hoa hồng 0% so với sàn TMĐT trung gian, quản lý danh mục 1000+ sản phẩm.',
    html_content: '<h3>Tổng quan dự án Nguyên Liệu Thành Huy</h3><p>Tự chủ kênh phân phối số giúp doanh nghiệp bảo vệ biên lợi nhuận, tích hợp giỏ hàng thanh toán mượt mà và quản lý dữ liệu khách hàng thân thiết.</p>',
    is_published: true
  },
  {
    title: 'Dự Án Thực Tế: Website Thiết Bị Xây Dựng HD',
    slug: 'du-an-website-thiet-bi-xay-dung-hd',
    cover_image: '/assets/images/da/tbhd.png',
    excerpt: 'Cổng thông tin sản phẩm máy móc thiết bị xây dựng công nghiệp, tối ưu lazy loading hình ảnh và tốc độ tải trang phản hồi tức thì.',
    html_content: '<h3>Tổng quan dự án Thiết Bị HD</h3><p>Thiết kế danh mục sản phẩm chuyên nghiệp, tích hợp catalog PDF và nút gọi báo giá nhanh giúp đội ngũ kinh doanh chốt đơn cấp tốc.</p>',
    is_published: true
  },
  {
    title: 'Dự Án Thực Tế: Website Giấy Cúng An Thành Phát',
    slug: 'du-an-website-giay-cung-an-thanh-phat',
    cover_image: '/assets/images/da/atp.webp',
    excerpt: 'Tối ưu hóa tổng thể SEO từ khóa thương hiệu và ngành hàng, phủ sóng Top Google toàn quốc tìm kiếm sản phẩm văn hóa tâm linh.',
    html_content: '<h3>Tổng quan dự án An Thành Phát</h3><p>Thiết kế website tối giản mượt mà, tối ưu SEO Local và SEO toàn quốc mang lại lượng đơn đặt hàng sỉ lẻ liên tục cho doanh nghiệp.</p>',
    is_published: true
  },
  {
    title: 'Dự Án Thực Tế: Website Cơ Khí Chính Xác DHT',
    slug: 'du-an-website-co-khi-chinh-xac-dht',
    cover_image: '/assets/images/da/dht.png',
    excerpt: 'Hồ sơ năng lực số (Digital Profile) giới thiệu hệ thống máy gia công cơ khí CNC, thu hút đối tác đầu tư và đơn hàng sản xuất quy mô lớn.',
    html_content: '<h3>Tổng quan dự án Cơ Khí DHT</h3><p>Trình bày quy trình công nghệ CNC hiện đại, chứng nhận tiêu chuẩn kỹ thuật và năng lực gia công linh kiện chính xác cho các đối tác công nghiệp.</p>',
    is_published: true
  },
  {
    title: 'Dự Án Thực Tế: Website Nội Thất Cũ Xưa Tịnh Quang',
    slug: 'du-an-website-noi-that-cu-xua-tinh-quang',
    cover_image: '/assets/images/da/chu-tinh.webp',
    excerpt: 'Showroom ảo 360 độ trực tuyến, công cụ phối cảnh sản phẩm gỗ cổ truyền xịn sò và quản lý danh mục đồ gỗ thu mua quý hiếm.',
    html_content: '<h3>Tổng quan dự án Nội Thất Tịnh Quang</h3><p>Kết nối người yêu thích sản phẩm gỗ cổ xưa với bộ sưu tập độc bản, trải nghiệm xem đồ gỗ 360 độ và tư vấn định giá tận nơi.</p>',
    is_published: true
  },
  {
    title: 'Dự Án Thực Tế: Website Đại Long Bình Phước (Cho Thuê Xe Nâng & Việc Làm)',
    slug: 'du-an-website-dai-long-binh-phuoc',
    cover_image: '/assets/images/da/dlbp.webp',
    excerpt: 'Cổng thông tin dịch vụ xe nâng hạ hàng hóa công nghiệp và kết nối việc làm uy tín tại khu vực Bình Phước & Đông Nam Bộ.',
    html_content: '<h3>Tổng quan dự án Đại Long Bình Phước</h3><p>Website cung cấp dịch vụ hạ tầng kỹ thuật, cho thuê xe nâng hàng trọng tải lớn và đăng tin tuyển dụng nhân sự cho các khu công nghiệp.</p>',
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
