import { Metadata } from 'next';
import { HomePage } from '@/src/views/HomePage';

export const metadata: Metadata = {
  title: 'Thiết Kế Website, Web App & Cloud Hosting Tốc Độ Cao | Fitallest',
  description: 'Fitallest cung cấp dịch vụ thiết kế Website/Web App cao cấp, tối ưu SEO, hiệu năng vượt trội và giải pháp Cloud Hosting mạnh mẽ cho doanh nghiệp.',
};

export default function Page() {
  return <HomePage />;
}
