import { Metadata } from 'next';
import ArticleDetail from '@/src/components/ArticleDetail';

export const metadata: Metadata = {
  title: 'Chi tiết bài viết | Sbuild',
  description: 'Chi tiết bài viết tin tức Sbuild',
};

export default function Page({ params }: { params: { slug: string } }) {
  return <ArticleDetail slug={params.slug} />;
}
