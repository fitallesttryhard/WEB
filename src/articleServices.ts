import { supabase } from './supabaseClient';

export const SBUILD_TENANT_ID = '00000000-0000-0000-0000-000000000002';

export interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  cover_image: string;
  excerpt: string;
  html_content: string;
  is_published: boolean;
  views: number;
  author: string;
  created_at: string;
}

export const DEFAULT_SBUILD_ARTICLES: Article[] = [
  {
    id: 'd1111111-0000-0000-0000-000000000001',
    title: 'Kinh Nghiệm Chọn Nẹp Nhôm Trang Trí Chuẩn Chống Phai Màu Cho Công Trình 2026',
    slug: 'kinh-nghiem-chon-nep-nhom-trang-tri-2026',
    category: 'Kỹ Thuật Thi Công',
    cover_image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
    excerpt: 'Điểm qua các tiêu chuẩn hợp kim nhôm 6063-T5 mạ Anode giúp nẹp nhôm chống ăn mòn, chịu lực tốt và giữ sắc nét cho vách tường, sàn gỗ.',
    html_content: `
      <p>Nẹp nhôm trang trí ngày càng đóng vai trò quan trọng trong việc hoàn thiện các chi tiết vách tường, chỉ sàn và góc cột cho công trình kiến trúc hiện đại. Để công trình giữ được vẻ đẹp sắc nét và không bị ố vàng, phai màu theo thời gian, chủ đầu tư và kỹ sư cần lưu ý các tiêu chuẩn chọn phôi nhôm 6063-T5 và lớp mạ Anodizing cao cấp.</p>
      <h3>1. Nhận diện phôi hợp kim nhôm chuẩn</h3>
      <p>Nhôm chuẩn 6063-T5 có độ cứng cao từ 8-12 Webster, không bị cong võng khi thi công nẹp dài 2.5m. Khi cắt bằng máy cắt chuyên dụng, cạnh nẹp phẳng mịn, không bị ba-via hay tưa xơ.</p>
      <h3>2. Lớp mạ Anode chống oxy hóa</h3>
      <p>Lớp mạ Anodizing tạo màng oxit nhân tạo dày trên bề mặt thanh nhôm, giúp chống xước, chống bám vân tay và kháng kiềm tuyệt đối kể cả khi tiếp xúc với xi măng tươi trong quá trình thi công.</p>
      <p>Các dòng sản phẩm nẹp nhôm chữ T, nẹp V, nẹp U và nẹp L do S-BUILD phân phối đều được kiểm định nghiêm ngặt về độ dày, độ cứng và công nghệ phủ màu đạt tiêu chuẩn quốc tế.</p>
    `,
    is_published: true,
    views: 245,
    author: 'Ban Kỹ Thuật S-BUILD',
    created_at: '2026-09-08T08:00:00.000Z'
  },
  {
    id: 'd1111111-0000-0000-0000-000000000002',
    title: 'Hướng Dẫn Thi Công Nẹp Nhựa PVC Bo Góc Gạch Men Không Lo Sứt Mẻ',
    slug: 'huong-dan-thi-cong-nep-nhua-pvc-bo-goc-gach-men',
    category: 'Cẩm Nang Vật Tư',
    cover_image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1200&auto=format&fit=crop',
    excerpt: 'Giải pháp thay thế công đoạn mài mòi 45 độ góc gạch giúp tiết kiệm 50% thời gian thi công và bảo vệ tuyệt đối góc tường ốp gạch.',
    html_content: `
      <p>Kỹ thuật ốp góc gạch men bằng nẹp nhựa bo tròn giúp bảo vệ mép gạch, tránh va đập và tạo độ thẩm mỹ liền mạch cho phòng tắm, nhà bếp. Không cần phải tốn công sức mài mòi gạch 45 độ dễ vỡ mẻ cạnh, người thợ chỉ cần gài chân nẹp vào lớp keo dán gạch và vuốt phẳng.</p>
      <h3>Các bước thi công chuẩn:</h3>
      <ol>
        <li>Đo và cắt thanh nẹp PVC theo chiều cao của góc tường ốp gạch.</li>
        <li>Trét keo dán gạch hoặc vữa xi măng lên góc tường, đặt thanh nẹp PVC vào vị trí và căn chỉnh bằng thước nivo.</li>
        <li>Lắp đặt từng viên gạch men ăn khớp vào khe đỡ của thanh nẹp.</li>
        <li>Dùng giẻ mềm lau sạch keo thừa trước khi keo khô cứng hoàn toàn.</li>
      </ol>
      <p>Sản phẩm nẹp PVC nguyên sinh của S-BUILD có độ dẻo dai cao, không bị giòn gãy và chống nấm mốc trong môi trường ẩm ướt.</p>
    `,
    is_published: true,
    views: 180,
    author: 'Ban Kỹ Thuật S-BUILD',
    created_at: '2026-09-07T09:30:00.000Z'
  },
  {
    id: 'd1111111-0000-0000-0000-000000000003',
    title: 'Báo Giá Nẹp Inox 304 Mạ PVD Vàng Gương Cao Cấp Cho Biệt Thự & Chung Cư',
    slug: 'bao-gia-nep-inox-304-ma-pvd-vang-guong',
    category: 'Thị Trường & Báo Giá',
    cover_image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1200&auto=format&fit=crop',
    excerpt: 'Tổng hợp các mẫu nẹp inox 304 chữ T, V, U mạ PVD vàng gương sang trọng, chống gỉ sét tuyệt đối cho các công trình cao cấp.',
    html_content: `
      <p>Lựa chọn nẹp inox 304 mạ PVD không chỉ tăng độ lộng lẫy cho vách đá tivi, vách gỗ phòng khách mà còn đảm bảo độ bền không phai màu theo thời gian. Khác với inox 201 dễ bị hoen ố, inox 304 tiêu chuẩn công nghiệp đem lại bề mặt bóng gương hoàn hảo, phản chiếu ánh sáng sang trọng và chống chịu tốt trong điều kiện khí hậu nóng ẩm.</p>
      <h3>Tại sao biệt thự cao cấp ưa chuộng Inox 304 PVD?</h3>
      <ul>
        <li><strong>Độ cứng và chịu lực va đập tuyệt hảo:</strong> Không móp méo khi va chạm hành lý, xe đẩy hay đồ nội thất nặng.</li>
        <li><strong>Công nghệ mạ bốc hơi vật lý PVD:</strong> Lớp mạ titan vàng gương không bị bong tróc như xi mạ truyền thống.</li>
        <li><strong>Đa dạng ứng dụng:</strong> Chỉ âm tường, chỉ nối sàn đá hoa cương, ốp cạnh kính và viền tủ trang trí.</li>
      </ul>
      <p>Quý khách hàng và đơn vị thi công cần báo giá sỉ cho dự án vui lòng liên hệ hotline S-BUILD để nhận chiết khấu hấp dẫn nhất theo khối lượng đặt hàng.</p>
    `,
    is_published: true,
    views: 320,
    author: 'Phòng Dự Án S-BUILD',
    created_at: '2026-09-06T14:15:00.000Z'
  }
];

function parsePageToArticle(row: any): Article {
  let meta: any = {};
  if (row.html_content) {
    try {
      meta = JSON.parse(row.html_content);
    } catch {
      meta = { content: row.html_content };
    }
  }

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: meta.category || 'Kỹ Thuật & Dự Án',
    cover_image: meta.cover_image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
    excerpt: meta.excerpt || 'Bài viết phân tích kỹ thuật và kinh nghiệm thi công nẹp xây dựng.',
    html_content: meta.content || meta.html_content || row.html_content || '',
    is_published: meta.is_published !== undefined ? meta.is_published : true,
    views: meta.views || 100,
    author: meta.author || 'Ban Kỹ Thuật S-BUILD',
    created_at: row.created_at || new Date().toISOString()
  };
}

export async function getArticles(): Promise<Article[]> {
  try {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('tenant_id', SBUILD_TENANT_ID)
      .eq('template_type', 'article')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return DEFAULT_SBUILD_ARTICLES;
    }

    return data.map(parsePageToArticle);
  } catch (err) {
    console.warn('Lỗi lấy bài viết S-BUILD từ pages:', err);
    return DEFAULT_SBUILD_ARTICLES;
  }
}

export async function getArticleByIdOrSlug(idOrSlug: string): Promise<Article | null> {
  try {
    const articles = await getArticles();
    const found = articles.find(a => a.id === idOrSlug || a.slug === idOrSlug);
    if (found) return found;

    // Direct database query fallback
    const { data } = await supabase
      .from('pages')
      .select('*')
      .eq('tenant_id', SBUILD_TENANT_ID)
      .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
      .maybeSingle();

    if (data) {
      return parsePageToArticle(data);
    }

    return DEFAULT_SBUILD_ARTICLES.find(a => a.id === idOrSlug || a.slug === idOrSlug) || null;
  } catch {
    return DEFAULT_SBUILD_ARTICLES.find(a => a.id === idOrSlug || a.slug === idOrSlug) || null;
  }
}

export async function saveArticle(article: Partial<Article>): Promise<{ success: boolean; data?: Article; error?: string }> {
  try {
    const id = article.id || (crypto.randomUUID ? crypto.randomUUID() : `art_${Date.now()}`);
    const slug = article.slug || (article.title ? article.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `bai-viet-${Date.now()}`);

    const payloadMeta = {
      cover_image: article.cover_image || '',
      category: article.category || 'Kỹ Thuật & Dự Án',
      excerpt: article.excerpt || '',
      content: article.html_content || '',
      is_published: article.is_published !== undefined ? article.is_published : true,
      views: article.views || 0,
      author: article.author || 'Ban Kỹ Thuật S-BUILD'
    };

    const rowPayload = {
      id,
      tenant_id: SBUILD_TENANT_ID,
      title: article.title || 'Bài viết S-BUILD',
      slug,
      template_type: 'article',
      html_content: JSON.stringify(payloadMeta)
    };

    const { data: existing } = await supabase
      .from('pages')
      .select('id')
      .eq('id', id)
      .maybeSingle();

    if (existing?.id) {
      const { error } = await supabase.from('pages').update(rowPayload).eq('id', id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('pages').insert([rowPayload]);
      if (error) throw error;
    }

    return { success: true, data: parsePageToArticle(rowPayload) };
  } catch (err: any) {
    console.error('Lỗi lưu bài viết S-BUILD:', err);
    return { success: false, error: err.message };
  }
}

export async function deleteArticle(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('pages')
      .delete()
      .eq('id', id)
      .eq('tenant_id', SBUILD_TENANT_ID);
    return !error;
  } catch {
    return false;
  }
}
