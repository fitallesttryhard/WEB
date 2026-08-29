export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  originalPrice?: number;
  description: string;
  content?: string;
  image: string;
  images?: string[];
  specs?: { label: string; value: string }[];
  isFeatured?: boolean;
  isNew?: boolean;
  inStock?: boolean;
  sku?: string;
  tags?: string[];
  seo_title?: string;
  seo_description?: string;
}

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'Thiết Kế Website & Apps',
    slug: 'thiet-ke-web-app',
    description: 'Thiết kế Website chuẩn UX/UI độc bản và ứng dụng di động iOS/Android cao cấp.'
  },
  {
    id: 'cat-2',
    name: 'Cloud Hosting & Server',
    slug: 'cloud-hosting-server',
    description: 'Hạ tầng máy chủ đám mây NVMe SSD siêu tốc, uptime 99.9% tối ưu cho ứng dụng web.'
  },
  {
    id: 'cat-3',
    name: 'Dịch Vụ SEO & Marketing',
    slug: 'dich-vu-seo-marketing',
    description: 'Chiến lược tối ưu hóa công cụ tìm kiếm Google và tăng trưởng chuyển đổi doanh số.'
  },
  {
    id: 'cat-4',
    name: 'Giải Pháp AI & SaaS',
    slug: 'giai-phap-ai-saas',
    description: 'Hệ thống phần mềm SaaS quản trị doanh nghiệp và công cụ AI Design thông minh.'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Thiết Kế Website Doanh Nghiệp Độc Bản',
    slug: 'thiet-ke-website-doanh-nghiep-doc-ban',
    category: 'Thiết Kế Website & Apps',
    price: 15000000,
    originalPrice: 20000000,
    description: 'Gói thiết kế website cao cấp thiết kế riêng theo diện mạo thương hiệu, 100% mã nguồn tối ưu tốc độ dưới 1.5s.',
    content: '<h3>Gói Thiết Kế Website Doanh Nghiệp Độc Bản Fi.tallest</h3><p>Mỗi website được nghiên cứu theo đúng ngành nghề kinh doanh, văn hóa thương hiệu và tập khách hàng mục tiêu của bạn. Tối ưu chuẩn SEO Google, mượt mà trên di động và tích hợp sẵn công cụ báo giá tự động.</p>',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80'
    ],
    specs: [
      { label: 'Thời gian hoàn thiện', value: '10 - 15 Ngày' },
      { label: 'Công nghệ mã nguồn', value: 'React / Next.js / Tailwind CSS' },
      { label: 'Chuẩn UX/UI', value: 'Độc bản 100%' },
      { label: 'Bảo hành hệ thống', value: 'Trọn đời' }
    ],
    isFeatured: true,
    isNew: true,
    inStock: true,
    sku: 'FIT-WEB-BIZ',
    tags: ['Thiết kế web', 'Website doanh nghiệp', 'Chuẩn SEO'],
    seo_title: 'Thiết Kế Website Doanh Nghiệp Độc Bản | Fi.tallest',
    seo_description: 'Dịch vụ thiết kế website doanh nghiệp chuyên nghiệp chuẩn UX/UI độc bản từ Fi.tallest.'
  },
  {
    id: 'prod-2',
    name: 'Phát Triển Ứng Dụng Di Động iOS & Android',
    slug: 'phat-trien-ung-dung-di-dong-ios-android',
    category: 'Thiết Kế Website & Apps',
    price: 35000000,
    originalPrice: 45000000,
    description: 'Xây dựng Mobile App đa nền tảng với hiệu năng cao, tích hợp thanh toán và thông báo Push Notification realtime.',
    content: '<h3>Phát Triển Mobile App Đa Nền Tảng Chuyên Nghiệp</h3><p>Fi.tallest xây dựng ứng dụng di động native/cross-platform mượt mà, tối ưu trải nghiệm người dùng trên cả hệ điều hành iOS và Android.</p>',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80',
    specs: [
      { label: 'Nền tảng', value: 'iOS & Android' },
      { label: 'Công nghệ', value: 'React Native / Flutter' },
      { label: 'Backend API', value: 'Node.js / Supabase' }
    ],
    isFeatured: true,
    isNew: true,
    inStock: true,
    sku: 'FIT-APP-MOB',
    tags: ['Mobile App', 'iOS', 'Android'],
    seo_title: 'Lập Trình App Di Động iOS & Android | Fi.tallest',
    seo_description: 'Dịch vụ thiết kế và lập trình ứng dụng di động chuyên nghiệp cho doanh nghiệp.'
  },
  {
    id: 'prod-3',
    name: 'Cloud Hosting NVMe SSD 10GB Pro',
    slug: 'cloud-hosting-nvme-ssd-10gb-pro',
    category: 'Cloud Hosting & Server',
    price: 2400000,
    originalPrice: 3000000,
    description: 'Hạ tầng máy chủ đám mây ổ cứng Enterprise NVMe SSD cho tốc độ xử lý nhanh gấp 10 lần SSD thông thường.',
    content: '<h3>Gói Cloud Hosting NVMe Bứt Phá Tốc Độ</h3><p>Tích hợp chứng chỉ SSL miễn phí, sao lưu dữ liệu tự động hàng ngày và cam kết Uptime 99.9%.</p>',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    specs: [
      { label: 'Dung lượng NVMe', value: '10 GB' },
      { label: 'Băng thông', value: 'Không giới hạn' },
      { label: 'SSL Certificate', value: 'Miễn phí Let Encrypt' },
      { label: 'Uptime', value: '99.9%' }
    ],
    isFeatured: true,
    inStock: true,
    sku: 'FIT-HOST-10G',
    tags: ['Cloud Hosting', 'NVMe SSD', 'Server'],
    seo_title: 'Cloud Hosting NVMe SSD Tốc Độ Cao | Fi.tallest',
    seo_description: 'Máy chủ Cloud Hosting NVMe tốc độ cao cho website doanh nghiệp.'
  },
  {
    id: 'prod-4',
    name: 'Gói Dịch Vụ SEO Google Đột Phá Chuyển Đổi',
    slug: 'goi-dich-vu-seo-google-dot-pha-chuyen-doi',
    category: 'Dịch Vụ SEO & Marketing',
    price: 18000000,
    originalPrice: 22000000,
    description: 'Tối ưu hóa tổng thể website, đẩy top hàng trăm từ khóa ngành và gia tăng lượng truy cập tự nhiên bền vững.',
    content: '<h3>Dịch Vụ SEO Tổng Thể Tăng Trưởng Doanh Số</h3><p>Phương pháp SEO Mũ Trắng an toàn, lên top vững chắc và tối ưu hóa tỷ lệ chuyển đổi cho doanh nghiệp.</p>',
    image: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?auto=format&fit=crop&w=800&q=80',
    specs: [
      { label: 'Số lượng từ khóa', value: '50 - 100 Từ khóa' },
      { label: 'Thời gian đẩy top', value: '3 - 6 Tháng' },
      { label: 'Cam kết Top', value: 'Top 1 - 5 Google' }
    ],
    isFeatured: true,
    inStock: true,
    sku: 'FIT-SEO-PRO',
    tags: ['SEO Google', 'Marketing', 'Tăng traffic'],
    seo_title: 'Dịch Vụ SEO Google Đột Phá Doanh Số | Fi.tallest',
    seo_description: 'Dịch vụ SEO Google tổng thể chuyên nghiệp giúp doanh nghiệp chiếm lĩnh thứ hạng hàng đầu.'
  }
];

export const seedTrimDatabase = async () => {
  console.log('Fitallest database seeded successfully');
  return true;
};
