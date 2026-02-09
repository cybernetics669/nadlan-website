import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: { default: 'Nadlan Premium | Israel Real Estate', template: '%s | Nadlan Premium' },
  description: 'Premium real estate listings in Israel for international buyers. Apartments, villas, penthouses, and land.',
  openGraph: { locale: 'en_US', type: 'website' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col font-sans antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
