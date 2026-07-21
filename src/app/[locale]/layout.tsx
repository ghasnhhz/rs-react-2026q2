import { type ReactNode, Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import Providers from '@/components/Providers';
import Header from '@/components/Header';
import Flyout from '@/components/Flyout';
import ErrorBoundary from '@/components/ErrorBoundary';
import '../globals.css';

export const metadata: Metadata = {
  title: 'rs-react-app',
  description: 'Star Trek Seasons Explorer',
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <NextIntlClientProvider>
          <Providers>
            <div className="app-container">
              <ErrorBoundary>
                <Suspense>
                  <Header />
                </Suspense>
                {children}
                <Flyout />
              </ErrorBoundary>
            </div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
