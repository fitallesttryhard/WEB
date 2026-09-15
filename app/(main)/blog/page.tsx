import { Metadata } from 'next';
import BlogList from '@/src/components/BlogList';

export const metadata: Metadata = {
  title: 'Tin tức & Sự kiện | Sbuild',
  description: 'Tin tức kiến trúc, kinh nghiệm xây dựng và cập nhật mới nhất từ Sbuild.',
};

export default function Page() {
  return <BlogList  />;
}
