import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/src/supabaseServer';
import ProductDetailClient from '@/src/components/ProductDetailClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string) {
  const supabase = createServerSupabaseClient();

  const { data: bySlug } = await supabase
    .from('products')
    .select('*, categories(name)')
    .eq('slug', slug)
    .maybeSingle();
  if (bySlug) return bySlug;

  const { data: byId } = await supabase
    .from('products')
    .select('*, categories(name)')
    .eq('id', slug)
    .maybeSingle();
  return byId;
}

async function getRelatedProducts(productId: string) {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from('products')
    .select('*, categories(name)')
    .eq('status', 'published')
    .limit(5);
  return (data || []).filter((p) => p.id !== productId).slice(0, 4);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return { title: 'Sản phẩm không tồn tại | Sbuild' };
  }

  const description = product.seo_description
    || product.description?.replace(/<[^>]*>?/gm, '').slice(0, 160)
    || `${product.name} — Sản phẩm từ Sbuild`;
  const image = product.thumbnail_url || product.image_url;

  return {
    title: `${product.name} | Sbuild`,
    description,
    openGraph: {
      title: product.name,
      description,
      url: `https://sbuild.vn/san-pham/${product.slug || product.id}`,
      siteName: 'Sbuild',
      type: 'website',
      images: image ? [{ url: image, width: 1200, height: 630, alt: product.name }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description,
      images: image ? [image] : [],
    },
    alternates: {
      canonical: `https://sbuild.vn/san-pham/${product.slug || product.id}`,
    },
  };
}

export async function generateStaticParams() {
  const supabase = createServerSupabaseClient();
  const { data: products } = await supabase
    .from('products')
    .select('slug, id')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(50);

  return (products || []).map((p) => ({ slug: p.slug || p.id }));
}

export default async function ProductSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) { notFound(); }

  const relatedProducts = await getRelatedProducts(product.id);
  const price = product.sale_price || product.original_price || product.regular_price || 0;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.seo_description || product.description?.replace(/<[^>]*>?/gm, '').slice(0, 300) || '',
    image: product.thumbnail_url || product.image_url || undefined,
    sku: product.sku || undefined,
    brand: { '@type': 'Brand', name: 'Sbuild' },
    offers: {
      '@type': 'Offer',
      url: `https://sbuild.vn/san-pham/${product.slug || product.id}`,
      priceCurrency: 'VND',
      price: price || undefined,
      availability: product.stock_status === 'out_of_stock' ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductDetailClient product={product} initialRelatedProducts={relatedProducts} />
    </>
  );
}