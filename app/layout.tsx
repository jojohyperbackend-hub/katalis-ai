// app/layout.tsx
import '../styles/globals.css'; // Global CSS
import Header from '../components/Header';
import { ReactNode } from 'react';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <title>KatalisAi</title>
        <meta name="description" content="Website AI bantu UMKM buat katalog produk profesional" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme') || 
                  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
        {/* Header selalu tampil */}
        <Header />

        {/* Konten halaman */}
        <main className="container mx-auto p-4">
          {children}
        </main>
      </body>
    </html>
  );
}
