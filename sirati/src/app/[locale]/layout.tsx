import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Toaster } from 'sonner';

const locales = ['ar', 'en'];

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale)) notFound();
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <div dir={locale === 'ar' ? 'rtl' : 'ltr'} style={{ minHeight: '100vh' }}>
        {children}
        <Toaster
          position={locale === 'ar' ? 'bottom-right' : 'bottom-left'}
          toastOptions={{ style: { fontFamily: 'IBM Plex Sans Arabic, system-ui, sans-serif', borderRadius: '14px' } }}
        />
      </div>
    </NextIntlClientProvider>
  );
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
