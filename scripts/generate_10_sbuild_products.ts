import { createProduct } from '../src/productServices';
import { SBUILD_TENANT_ID } from '../src/articleServices';

const sbuildProducts = [
  {
    name: 'Khung Giàn Giáo Kẽm 1.7m Đạt Chuẩn',
    slug: 'khung-gian-giao-kem-1-7m',
    original_price: 320000,
    is_hot: true,
    status: 'published' as const,
    thumbnail_url: 'https://images.unsplash.com/photo-1541888086425-d81bb19240f5?q=80&w=800&auto=format&fit=crop',
    short_description: 'Giàn giáo mạ kẽm cao cấp, chịu tải lớn, chống rỉ sét ngoài trời. Phù hợp cho mọi công trình.',
    html_content: '<p>Khung giàn giáo H 1.7m dày 2mm, được sản xuất theo công nghệ hàn MIG hiện đại, đảm bảo độ an toàn tuyệt đối cho công trình cao tầng.</p>'
  },
  {
    name: 'Nẹp Nhôm Trang Trí Chữ T Vàng Gương',
    slug: 'nep-nhom-trang-tri-chu-t-vang-guong',
    original_price: 65000,
    is_hot: true,
    status: 'published' as const,
    thumbnail_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
    short_description: 'Nẹp nhôm mạ Anode màu Vàng Gương cao cấp dùng để che khuyết điểm ron nối gạch, gỗ.',
    html_content: '<p>Kích thước mặt 20mm. Sử dụng hợp kim nhôm 6063-T5 cao cấp. Không bay màu, không bong tróc trong suốt quá trình sử dụng.</p>'
  },
  {
    name: 'Ván Ép Phủ Phim 18mm Cốt Gỗ Cứng',
    slug: 'van-ep-phu-phim-18mm',
    original_price: 450000,
    is_hot: false,
    status: 'published' as const,
    thumbnail_url: 'https://images.unsplash.com/photo-1621844962450-48e0d456720f?q=80&w=800&auto=format&fit=crop',
    short_description: 'Cốp pha gỗ phủ phim 1220x2440x18mm, tái sử dụng 8-10 lần, cho bề mặt bê tông láng mịn.',
    html_content: '<p>Keo WBP Melamine chống đun sôi nước 12h không bong tách lớp. Phim Dynea màu nâu đen, mặt ván siêu phẳng.</p>'
  },
  {
    name: 'Kích Tăng U (Kích Đầu) 500mm',
    slug: 'kich-tang-u-500mm',
    original_price: 45000,
    is_hot: false,
    status: 'published' as const,
    thumbnail_url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800&auto=format&fit=crop',
    short_description: 'Kích U rỗng Ø34 dầy 3.5ly, tiện ren suốt đảm bảo độ vững chắc cho hệ đỡ cốp pha.',
    html_content: '<p>Chiều dài 0.5m. Sản phẩm chống trượt ren tuyệt đối kể cả khi đội tải nặng, giúp căn chỉnh cao độ linh hoạt.</p>'
  },
  {
    name: 'Mâm Giàn Giáo Mạ Kẽm Dập Gân',
    slug: 'mam-gian-giao-ma-kem',
    original_price: 250000,
    is_hot: true,
    status: 'published' as const,
    thumbnail_url: 'https://images.unsplash.com/photo-1504307651254-35680f356f27?q=80&w=800&auto=format&fit=crop',
    short_description: 'Mâm giáo (Sàn công tác) 1.6m có khóa an toàn hai đầu, mặt dập lỗ chống trượt.',
    html_content: '<p>Tải trọng kiểm định lên tới 250kg. Độ dày 1.2mm, đảm bảo thao tác thi công trên cao an toàn tuyệt đối.</p>'
  },
  {
    name: 'Thang Giàn Giáo Thép Mạ Kẽm',
    slug: 'thang-gian-giao-thep-ma-kem',
    original_price: 380000,
    is_hot: false,
    status: 'published' as const,
    thumbnail_url: 'https://images.unsplash.com/photo-1542621334-a254cf47733d?q=80&w=800&auto=format&fit=crop',
    short_description: 'Thang leo giàn giáo có tay vịn hai bên, bậc thang chống trơn trượt.',
    html_content: '<p>Giúp công nhân di chuyển an toàn giữa các tầng giáo, đạt tiêu chuẩn khắt khe về an toàn lao động.</p>'
  },
  {
    name: 'Nẹp Inox Chữ V30 Bảo Vệ Góc Cột',
    slug: 'nep-inox-chu-v30',
    original_price: 120000,
    is_hot: false,
    status: 'published' as const,
    thumbnail_url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop',
    short_description: 'Nẹp inox 304 mạ PVD chống rỉ sét, bảo vệ góc tường tránh sứt mẻ.',
    html_content: '<p>Kích thước 30x30mm, dài 2.4m. Thiết kế hiện đại giúp việc thi công mép gạch, ốp kính trở nên dễ dàng và sang trọng.</p>'
  },
  {
    name: 'Ống Thép Mạ Kẽm Nhúng Nóng Phi 42',
    slug: 'ong-thep-ma-kem-nhung-nong-phi-42',
    original_price: 185000,
    is_hot: false,
    status: 'published' as const,
    thumbnail_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    short_description: 'Thép ống Hòa Phát tiêu chuẩn ASTM, chuyên dùng cho hệ thống PCCC, lan can, khung chống.',
    html_content: '<p>Lớp kẽm nhúng nóng dày dặn chống chọi cực tốt trong môi trường nước và khí hậu biển.</p>'
  },
  {
    name: 'Nẹp Nhựa PVC Bo Góc Tròn',
    slug: 'nep-nhua-pvc-bo-goc-tron',
    original_price: 18000,
    is_hot: true,
    status: 'published' as const,
    thumbnail_url: 'https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?q=80&w=800&auto=format&fit=crop',
    short_description: 'Nẹp nhựa PVC nguyên sinh chống nứt vỡ góc tường, không cần mài mòi gạch 45 độ.',
    html_content: '<p>Màu trắng sứ / Kem sáng. Chiều dài 2.5m/thanh. Thi công nhanh, giảm hao hụt vật tư.</p>'
  },
  {
    name: 'Cốp Pha Nhựa Composite Tái Sử Dụng 100 Lần',
    slug: 'cop-pha-nhua-composite',
    original_price: 520000,
    is_hot: true,
    status: 'published' as const,
    thumbnail_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop',
    short_description: 'Giải pháp cốp pha xanh siêu nhẹ, chống thấm tuyệt đối, bề mặt bê tông bóng láng.',
    html_content: '<p>Giải pháp tiên tiến thay thế gỗ phủ phim. Dễ dàng cưa cắt và đóng đinh như gỗ thông thường. Tiết kiệm 40% chi phí dài hạn.</p>'
  }
];

async function main() {
  console.log('Đang tạo 10 sản phẩm cho S-BUILD...');
  for (const product of sbuildProducts) {
    const payload = { ...product, tenant_id: SBUILD_TENANT_ID };
    const { success, data, error } = await createProduct(payload);
    if (success) {
      console.log('✅ Đã lưu thành công: ' + data?.name);
    } else {
      console.log('❌ Lỗi lưu sản phẩm: ' + product.name, error);
    }
  }
  console.log('✅ Hoàn tất việc tạo 10 sản phẩm S-BUILD.');
}

main().catch(console.error);
