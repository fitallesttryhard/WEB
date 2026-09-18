import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createServerSupabaseClient, SBUILD_TENANT_ID } from '@/src/supabaseServer';
import ArticleDetailClient from '@/src/components/ArticleDetailClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

function parsePageToArticle(row: any) {
  let meta: any = {};
  if (row.html_content) {
    try { meta = JSON.parse(row.html_content); } catch { meta = { content: row.html_content }; }
  }
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: meta.category || 'Kỹ Thuật & Dự Án',
    cover_image: meta.cover_image || '',
    excerpt: meta.excerpt || '',
    html_content: meta.content || meta.html_content || row.html_content || '',
    author: meta.author || 'Ban Kỹ Thuật S-BUILD',
    created_at: row.created_at || new Date().toISOString(),
  };
}

async function getPost(slug: string) {
  const supabase = createServerSupabaseClient();

  const { data: bySlug } = await supabase
    .from('pages')
    .select('*')
    .eq('tenant_id', SBUILD_TENANT_ID)
    .eq('template_type', 'article')
    .eq('slug', slug)
    .maybeSingle();

  if (bySlug) return parsePageToArticle(bySlug);

  const { data: byId } = await supabase
    .from('pages')
    .select('*')
    .eq('tenant_id', SBUILD_TENANT_ID)
    .eq('id', slug)
    .maybeSingle();

  if (byId) return parsePageToArticle(byId);
  return null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return { title: 'Bài viết không tồn tại | Sbuild' };
  }

  const description = post.excerpt
    || post.html_content?.replace(/<[^>]*>?/gm, '').slice(0, 160)
    || 'Bài viết từ Sbuild';

  return {
    title: post.title,
    description,
    openGraph: {
      title: post.title,
      description,
      url: `https://sbuild.vn/bai-viet/${post.slug || post.id}`,
      siteName: 'Sbuild',
      type: 'article',
      publishedTime: post.created_at,
      images: post.cover_image ? [{ url: post.cover_image, width: 1200, height: 630, alt: post.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: post.cover_image ? [post.cover_image] : [],
    },
    alternates: {
      canonical: `https://sbuild.vn/bai-viet/${post.slug || post.id}`,
    },
  };
}

export async function generateStaticParams() {
  const supabase = createServerSupabaseClient();

  const { data: posts } = await supabase
    .from('pages')
    .select('slug, id')
    .eq('tenant_id', SBUILD_TENANT_ID)
    .eq('template_type', 'article')
    .order('created_at', { ascending: false })
    .limit(50);

  return (posts || []).map((post) => ({
    slug: post.slug || post.id,
  }));
}

export default async function ArticleSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || post.html_content?.replace(/<[^>]*>?/gm, '').slice(0, 160) || '',
    image: post.cover_image || undefined,
    datePublished: post.created_at,
    author: { '@type': 'Organization', name: 'Sbuild', url: 'https://sbuild.vn' },
    publisher: { '@type': 'Organization', name: 'Sbuild', url: 'https://sbuild.vn' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://sbuild.vn/bai-viet/${post.slug || post.id}` },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ArticleDetailClient post={post} brandName="Sbuild" />
    </>
  );
}