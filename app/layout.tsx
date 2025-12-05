// app/layout.tsx
import '../styles/globals.css'; // Global CSS
import Header from '../components/Header';
import { ReactNode } from 'react';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="id">
      <head>
        <title>KatalisAi</title>
        <meta name="description" content="Website AI bantu UMKM buat katalog produk profesional" />
      </head>
      <body className="bg-gray-50 text-gray-900">
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
