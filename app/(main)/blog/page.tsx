import { Metadata } from 'next';
import { BlogPage } from '@/src/views/BlogPage';

export const metadata: Metadata = {
  title: 'Blog Kiến Thức & Tin Tức | Fitallest',
  description: 'Cập nhật kiến thức công nghệ, lập trình, SEO và xu hướng thiết kế mới nhất.',
};

export default function Page() {
  return <BlogPage />;
}
