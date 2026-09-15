import { Metadata } from 'next';
import { AdminArea } from '@/src/views/AdminArea';

export const metadata: Metadata = {
  title: 'Quản trị hệ thống | Sbuild',
  description: 'Hệ thống quản trị nội dung và sản phẩm Sbuild.',
};

export default function Page() {
  return <AdminArea  />;
}
