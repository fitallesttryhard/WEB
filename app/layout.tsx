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
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/icon.png', type: 'image/png', sizes: '512x512' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
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
