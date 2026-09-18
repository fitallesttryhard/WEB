import { Metadata } from 'next';
import { HostingPage } from '@/src/views/HostingPage';

export const metadata: Metadata = {
  title: 'Cloud Hosting & Server | Fitallest',
  description: 'Hạ tầng máy chủ đám mây cực nhanh, an toàn và bảo mật với NVMe. Tối ưu cho mọi website.',
};

export default function Page() {
  return <HostingPage />;
}
