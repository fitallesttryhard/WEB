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
  tags?: string[];
  read_time?: string;
}

export const DEFAULT_SBUILD_ARTICLES: Article[] = [];

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
    category: meta.category || 'Kỹ Thuật Thi Công',
    cover_image: meta.cover_image || '',
    excerpt: meta.excerpt || 'Bài viết chia sẻ cẩm nang kỹ thuật và kinh nghiệm thi công nẹp xây dựng.',
    html_content: meta.content || meta.html_content || row.html_content || '',
    is_published: meta.is_published !== undefined ? meta.is_published : true,
    views: meta.views || 150,
    author: meta.author || 'Ban Kỹ Thuật S-BUILD',
    tags: Array.isArray(meta.tags) ? meta.tags : (meta.materials ? (Array.isArray(meta.materials) ? meta.materials : String(meta.materials).split(',')) : ['Chuẩn kỹ thuật', 'Vật tư CO/CQ']),
    read_time: meta.read_time || '4 phút đọc',
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
      return [];
    }

    return data.map(parsePageToArticle);
  } catch (err) {
    console.warn('Lỗi lấy bài viết S-BUILD từ pages:', err);
    return [];
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

    return null;
  } catch {
    return null;
  }
}

function isValidUUID(str?: string): boolean {
  if (!str) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str.trim());
}

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export async function saveArticle(article: Partial<Article>): Promise<{ success: boolean; data?: Article; error?: string }> {
  try {
    const id = (article.id && isValidUUID(article.id)) ? article.id : generateUUID();
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
