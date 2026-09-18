import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/src/supabaseServer';
import ArticleDetailClient from '@/src/components/ArticleDetailClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Hàm fetch bài viết — dùng chung cho generateMetadata và page
async function getPost(slug: string) {
  const supabase = createServerSupabaseClient();

  // Tìm theo slug
  const { data: bySlug } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (bySlug) return bySlug;

  // Fallback: tìm theo id
  const { data: byId } = await supabase
    .from('posts')
    .select('*')
    .eq('id', slug)
    .maybeSingle();

  return byId;
}

// Dynamic metadata cho từng bài viết — Google đọc được ngay trong HTML
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: 'Bài viết không tồn tại | Fitallest',
    };
  }

  const description = post.excerpt
    || post.content?.replace(/<[^>]*>?/gm, '').slice(0, 160)
    || 'Bài viết từ Fitallest';

  return {
    title: `${post.title} | Fitallest`,
    description,
    openGraph: {
      title: post.title,
      description,
      url: `https://fitallest.io.vn/bai-viet/${post.slug || post.id}`,
      siteName: 'Fitallest',
      type: 'article',
      publishedTime: post.created_at,
      modifiedTime: post.updated_at || post.created_at,
      images: post.cover_image
        ? [{ url: post.cover_image, width: 1200, height: 630, alt: post.title }]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: post.cover_image ? [post.cover_image] : [],
    },
    alternates: {
      canonical: `https://fitallest.io.vn/bai-viet/${post.slug || post.id}`,
    },
  };
}

// Pre-render các bài viết phổ biến nhất tại build time
export async function generateStaticParams() {
  const supabase = createServerSupabaseClient();

  const { data: posts } = await supabase
    .from('posts')
    .select('slug, id')
    .eq('is_published', true)
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

  // JSON-LD Structured Data cho Google
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || post.content?.replace(/<[^>]*>?/gm, '').slice(0, 160) || '',
    image: post.cover_image || undefined,
    datePublished: post.created_at,
    dateModified: post.updated_at || post.created_at,
    author: {
      '@type': 'Organization',
      name: 'Fitallest',
      url: 'https://fitallest.io.vn',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Fitallest',
      url: 'https://fitallest.io.vn',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://fitallest.io.vn/bai-viet/${post.slug || post.id}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleDetailClient post={post} />
    </>
  );
}
