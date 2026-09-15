import { Metadata } from 'next';
import Products from '@/src/components/Products';

export const metadata: Metadata = {
  title: 'Sản phẩm | Sbuild',
  description: 'Danh sách các sản phẩm vật tư xây dựng cao cấp từ Sbuild.',
};

export default function Page() {
  return <Products  />;
}
