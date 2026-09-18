import { Metadata } from 'next';
import { DomainPage } from '@/src/views/DomainPage';

export const metadata: Metadata = {
  title: 'Đăng Ký Tên Miền | Fitallest',
  description: 'Đăng ký và bảo vệ tên miền thương hiệu của bạn. Hỗ trợ tên miền .VN, .COM, và nhiều đuôi khác.',
};

export default function Page() {
  return <DomainPage />;
}
