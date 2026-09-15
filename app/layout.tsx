import '../src/index.css';
import { Providers } from '../src/components/Providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
