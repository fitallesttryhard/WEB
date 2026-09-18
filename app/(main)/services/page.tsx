import { Metadata } from 'next';
import { ServicesPage } from '@/src/views/ServicesPage';

export const metadata: Metadata = {
  title: 'Dịch Vụ Thiết Kế Web & App | Fitallest',
  description: 'Dịch vụ thiết kế Website và Web App chuyên nghiệp, chuẩn UX/UI, tối ưu hóa tỷ lệ chuyển đổi cho doanh nghiệp.',
};

export default function Page() {
  return <ServicesPage />;
}
