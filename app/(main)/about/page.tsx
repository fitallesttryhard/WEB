import { Metadata } from 'next';
import AboutPageDetail from '@/src/components/AboutPageDetail';

export const metadata: Metadata = {
  title: 'Giới thiệu | Sbuild - Vật Tư & Giải Pháp Hoàn Thiện Công Trình',
  description: 'Từ lựa chọn vật liệu đến từng chi tiết hoàn thiện, SBUILD đồng hành cùng nhu cầu thi công thực tế.',
};

export default function Page() {
  return <AboutPageDetail />;
}
