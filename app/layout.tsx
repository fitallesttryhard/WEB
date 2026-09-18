import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://sbuild.vn'),
  title: {
    default: 'Sbuild - Giải Pháp & Vật Tư Xây Dựng Thông Minh',
    template: '%s | Sbuild',
  },
  description: 'Sbuild cung cấp giải pháp vật tư xây dựng thông minh, phụ kiện thi công cao cấp và công nghệ xây dựng hiện đại.',
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://sbuild.vn',
    siteName: 'Sbuild',
    title: 'Sbuild - Giải Pháp & Vật Tư Xây Dựng Thông Minh',
    description: 'Sbuild cung cấp giải pháp vật tư xây dựng thông minh, phụ kiện thi công cao cấp và công nghệ xây dựng hiện đại.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sbuild - Giải Pháp & Vật Tư Xây Dựng Thông Minh',
    description: 'Sbuild cung cấp giải pháp vật tư xây dựng thông minh, phụ kiện thi công cao cấp và công nghệ xây dựng hiện đại.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

import '../src/index.css';
import { Providers } from '../src/components/Providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700;800;900&family=Be+Vietnam+Pro:wght@400;500;600;700;800;900&family=Oswald:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
