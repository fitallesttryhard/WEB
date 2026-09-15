import { Metadata } from 'next';
import { HomePage } from '@/src/views/HomePage';

export const metadata: Metadata = {
  title: 'Sbuild - Giải Pháp Vật Tư Xây Dựng Toàn Diện',
  description: 'Chuyên cung cấp vật tư xây dựng, phụ kiện giàn giáo, băng cản nước và nẹp trang trí chất lượng cao.',
};

export default function Page() {
  return <HomePage  />;
}
