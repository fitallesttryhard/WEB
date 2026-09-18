import { Metadata } from 'next';
import { QuotePage } from '@/src/views/QuotePage';

export const metadata: Metadata = {
  title: 'Báo Giá Dự Án | Fitallest',
  description: 'Nhận báo giá tự động và tư vấn chuyên sâu cho dự án phát triển phần mềm của bạn.',
};

export default function Page() {
  return <QuotePage />;
}
