import type { ReactNode } from 'react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import './about.css';

// Statically generated server component (SSG); no client logic or runtime data fetching.
export const dynamic = 'force-static';

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('About');

  return (
    <div className="about">
      <h1>{t('title')}</h1>
      <p>
        {t.rich('intro', {
          rsLink: (chunks: ReactNode) => (
            <a href="https://rs.school/react" target="_blank" rel="noopener noreferrer">
              {chunks}
            </a>
          ),
        })}
      </p>
      <p>
        {t.rich('description', {
          strong: (chunks: ReactNode) => <strong>{chunks}</strong>,
        })}
      </p>

      <h2>{t('authorHeading')}</h2>
      <p>
        {t.rich('author', {
          ghLink: (chunks: ReactNode) => (
            <a href="https://github.com/ghasnhhz" target="_blank" rel="noopener noreferrer">
              {chunks}
            </a>
          ),
          repoLink: (chunks: ReactNode) => (
            <a
              href="https://github.com/ghasnhhz/rs-react-2026q2"
              target="_blank"
              rel="noopener noreferrer"
            >
              {chunks}
            </a>
          ),
        })}
      </p>

      <h2>{t('featuresHeading')}</h2>
      <ul>
        <li>{t('feature1')}</li>
        <li>{t('feature2')}</li>
        <li>{t('feature3')}</li>
        <li>{t('feature4')}</li>
      </ul>
      <Link href="/" className="back-link">
        {t('backHome')}
      </Link>
    </div>
  );
}
