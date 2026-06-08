import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'سيرتي | Sirati', template: '%s | سيرتي' },
  description: 'منصة ذكاء اصطناعي لإنشاء سيرة ذاتية احترافية بالعربية والإنجليزية في ثوانٍ',
  keywords: ['سيرة ذاتية', 'CV', 'Resume', 'AI', 'ذكاء اصطناعي', 'سيرتي'],
  authors: [{ name: 'Hatim Al-Sfyani' }],
  creator: 'Sirati',
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    alternateLocale: 'en_US',
    url: 'https://sirati.sa',
    siteName: 'سيرتي | Sirati',
    title: 'سيرتي — سيرتك، بكلمة.',
    description: 'أنشئ سيرتك الذاتية بالذكاء الاصطناعي في ثوانٍ',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'سيرتي | Sirati',
    description: 'أنشئ سيرتك الذاتية بالذكاء الاصطناعي في ثوانٍ',
  },
  robots: { index: true, follow: true },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
