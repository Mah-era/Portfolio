import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://mahera-tasfee-portfolio.tagarttboy.chatgpt.site'),
  title: 'Mahera Tasfee | Supply Chain, Operations & Analytics',
  description:
    'Portfolio of Mahera Tasfee, a Supply Chain Management and Marketing BBA candidate focused on operations, planning, analytics, and practical digital systems.',
  keywords: [
    'Mahera Tasfee',
    'supply chain management',
    'operations',
    'demand planning',
    'business analytics',
    'Power BI',
    'Dhaka',
  ],
  authors: [{ name: 'Mahera Tasfee' }],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    title: 'Mahera Tasfee | Supply Chain, Operations & Analytics',
    description:
      'Turning operational complexity into decision-ready clarity through supply-chain thinking, analytics, and practical digital systems.',
    siteName: 'Mahera Tasfee',
    images: [
      {
        url: '/og.png',
        width: 1731,
        height: 909,
        alt: 'Mahera Tasfee — Supply chain, analytics, and digital systems',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mahera Tasfee | Supply Chain, Operations & Analytics',
    description: 'Supply chain · analytics · digital systems',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
