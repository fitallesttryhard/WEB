import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/src/supabaseServer';
import ProductDetailClient from '@/src/components/ProductDetailClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Hàm fetch sản phẩm — dùng chung cho generateMetadata và page
async function getProduct(slug: string) {
  const supabase = createServerSupabaseClient();

  // Tìm theo slug
  const { data: bySlug } = await supabase
    .from('products')
    .select('*, categories(name)')
    .eq('slug', slug)
    .maybeSingle();

  if (bySlug) return bySlug;

  // Fallback: tìm theo id
  const { data: byId } = await supabase
    .from('products')
    .select('*, categories(name)')
    .eq('id', slug)
    .maybeSingle();

  return byId;
}

async function getRelatedProducts(productId: string) {
  const supabase = createServerSupabaseClient();

  const { data: related } = await supabase
    .from('products')
    .select('*, categories(name)')
    .eq('status', 'published')
    .limit(5);

  return (related || []).filter((p) => p.id !== productId).slice(0, 4);
}

// Dynamic metadata cho từng sản phẩm
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: 'Sản phẩm không tồn tại | Fitallest',
    };
  }

  const description = product.seo_description
    || product.description?.replace(/<[^>]*>?/gm, '').slice(0, 160)
    || `${product.name} — Sản phẩm từ Fitallest`;

  const image = product.thumbnail_url || product.image_url;

  return {
    title: `${product.name} | Fitallest`,
    description,
    openGraph: {
      title: product.name,
      description,
      url: `https://fitallest.io.vn/san-pham/${product.slug || product.id}`,
      siteName: 'Fitallest',
      type: 'website',
      images: image
        ? [{ url: image, width: 1200, height: 630, alt: product.name }]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description,
      images: image ? [image] : [],
    },
    alternates: {
      canonical: `https://fitallest.io.vn/san-pham/${product.slug || product.id}`,
    },
  };
}

// Pre-render sản phẩm phổ biến tại build time
export async function generateStaticParams() {
  const supabase = createServerSupabaseClient();

  const { data: products } = await supabase
    .from('products')
    .select('slug, id')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(50);

  return (products || []).map((product) => ({
    slug: product.slug || product.id,
  }));
}

export default async function ProductSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.id);

  // JSON-LD Structured Data cho sản phẩm
  const price = product.sale_price || product.original_price || product.regular_price || 0;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.seo_description || product.description?.replace(/<[^>]*>?/gm, '').slice(0, 300) || '',
    image: product.thumbnail_url || product.image_url || undefined,
    sku: product.sku || undefined,
    brand: {
      '@type': 'Brand',
      name: 'Fitallest',
    },
    offers: {
      '@type': 'Offer',
      url: `https://fitallest.io.vn/san-pham/${product.slug || product.id}`,
      priceCurrency: 'VND',
      price: price || undefined,
      availability: product.stock_status === 'out_of_stock'
        ? 'https://schema.org/OutOfStock'
        : 'https://schema.org/InStock',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient product={product} initialRelatedProducts={relatedProducts} />
    </>
  );
}
