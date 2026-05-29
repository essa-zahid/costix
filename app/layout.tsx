import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  preload: true,
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Costix | Factory Costing Calculator',
  description: 'The simplest way to price what you make. Built for manufacturers.',
  openGraph: {
    title: 'Costix | Factory Costing Calculator',
    description: 'The simplest way to price what you make. Built for manufacturers.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className="font-sans antialiased text-slate-900 bg-white"
        style={{ fontFeatureSettings: '"cv11"' }}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
