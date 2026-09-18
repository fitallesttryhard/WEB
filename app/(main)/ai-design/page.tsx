import { Metadata } from 'next';
import { AiDesignPage } from '@/src/views/AiDesignPage';

export const metadata: Metadata = {
  title: 'Thiết Kế Giao Diện AI | Fitallest',
  description: 'Trải nghiệm sức mạnh của AI trong thiết kế giao diện UI/UX tốc độ cao.',
};

export default function Page() {
  return <AiDesignPage />;
}
