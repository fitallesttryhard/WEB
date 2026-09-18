import { Metadata } from 'next';
import { ProjectsPage } from '@/src/views/ProjectsPage';

export const metadata: Metadata = {
  title: 'Dự Án Tiêu Biểu | Fitallest',
  description: 'Khám phá các dự án website và ứng dụng thành công do Fitallest thực hiện.',
};

export default function Page() {
  return <ProjectsPage />;
}
