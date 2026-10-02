import { Metadata } from 'next';
import BlogList from '@/src/components/BlogList';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Cẩm nang & Kinh nghiệm thi công | Sbuild',
  description: 'Tổng hợp quy chuẩn kỹ thuật lắp đặt nẹp, cẩm nang và kinh nghiệm thi công xây dựng chuyên sâu từ Sbuild.',
};

export default function Page() {
  return <BlogList  />;
}
