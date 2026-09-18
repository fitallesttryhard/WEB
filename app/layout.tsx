import type { Metadata } from 'next';
import '../src/index.css';
import { Providers } from '../src/components/Providers';

import ErrorBoundary from '../src/components/ErrorBoundary';

export const metadata: Metadata = {
  title: 'Fitallest - Đỉnh Cao Công Nghệ Thiết Kế Website & Apps',
  description: 'Fitallest kiến tạo các sản phẩm Website và Ứng dụng di động độc bản, tối ưu chuẩn UX/UI.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700;800;900&family=Be+Vietnam+Pro:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ErrorBoundary>
          <Providers>
            <div className="min-h-screen flex flex-col bg-[#050A14] bg-cyber-grid text-slate-100 font-sans selection:bg-cyan-500 selection:text-white relative">
              {/* Global background glow & dot matrix overlay */}
              <div className="fixed inset-0 pointer-events-none z-0 bg-cyber-radial opacity-70" />
              <div className="fixed inset-0 pointer-events-none z-0 bg-dot-matrix opacity-25" />
              
              <div className="relative z-10 flex flex-col min-h-screen flex-grow">
                {children}
              </div>
            </div>
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}


