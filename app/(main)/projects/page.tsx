import { Metadata } from 'next';
import { ProjectsShowcaseWrap } from '@/src/views/ProjectsShowcaseWrap';

export const metadata: Metadata = {
  title: 'Dự án tiêu biểu | Sbuild',
  description: 'Danh sách các công trình dự án lớn đã sử dụng giải pháp nẹp và vật tư Sbuild.',
};

export default function Page() {
  return <ProjectsShowcaseWrap  />;
}
