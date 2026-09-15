import { Metadata } from 'next';
import SuperAdminDashboard from '@/src/components/SuperAdminDashboard';

export const metadata: Metadata = {
  title: 'Super Admin Control Portal | Sbuild SaaS',
  description: 'Super Admin Control Portal dành riêng cho chủ sở hữu nền tảng SaaS.',
};

export default function Page() {
  return <SuperAdminDashboard  />;
}
