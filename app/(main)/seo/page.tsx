import { Metadata } from 'next';
import { SeoPage } from '@/src/views/SeoPage';

export const metadata: Metadata = {
  title: 'Dịch Vụ SEO Tổng Thể | Fitallest',
  description: 'Dịch vụ SEO Google Top 1, tăng trưởng traffic thực và doanh thu bền vững.',
};

export default function Page() {
  return <SeoPage />;
}
