import type { MetadataRoute } from 'next';
import { createServerSupabaseClient, SBUILD_TENANT_ID } from '@/src/supabaseServer';

const BASE_URL = 'https://sbuild.vn';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createServerSupabaseClient();

  // 1. Cac trang tinh
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/products`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/projects`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ];

  // 2. Lay bai viet tu Supabase (bang pages, template_type = article)
  const { data: posts } = await supabase
    .from('pages')
    .select('slug, id, created_at')
    .eq('tenant_id', SBUILD_TENANT_ID)
    .eq('template_type', 'article')
    .order('created_at', { ascending: false });

  const postPages: MetadataRoute.Sitemap = (posts || []).map((post) => ({
    url: `${BASE_URL}/bai-viet/${post.slug || post.id}`,
    lastModified: new Date(post.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // 3. Lay san pham tu Supabase
  const { data: products } = await supabase
    .from('products')
    .select('slug, id, created_at, updated_at')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  const productPages: MetadataRoute.Sitemap = (products || []).map((product) => ({
    url: `${BASE_URL}/san-pham/${product.slug || product.id}`,
    lastModified: new Date(product.updated_at || product.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...postPages, ...productPages];
}