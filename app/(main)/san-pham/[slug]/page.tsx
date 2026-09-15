import { Metadata } from 'next';
import ProductDetail from '@/src/components/ProductDetail';

export const metadata: Metadata = {
  title: 'Chi tiết sản phẩm | Sbuild',
  description: 'Chi tiết sản phẩm',
};

export default function Page({ params }: { params: { slug: string } }) {
  return <ProductDetail slug={params.slug} />;
}
