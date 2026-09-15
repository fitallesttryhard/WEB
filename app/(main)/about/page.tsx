import { Metadata } from 'next';
import AboutUs from '@/src/components/AboutUs';

export const metadata: Metadata = {
  title: 'Giới thiệu | Sbuild',
  description: 'Giới thiệu về Sbuild - Nhà cung cấp giải pháp vật tư chuyên nghiệp.',
};

export default function Page() {
  return <AboutUs isFullPage={true} />;
}
