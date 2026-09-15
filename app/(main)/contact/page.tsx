import { Metadata } from 'next';
import ContactUs from '@/src/components/ContactUs';

export const metadata: Metadata = {
  title: 'Liên hệ | Sbuild',
  description: 'Liên hệ với Sbuild để được tư vấn và báo giá chi tiết.',
};

export default function Page() {
  return <ContactUs  />;
}
