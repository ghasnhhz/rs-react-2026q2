import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import './not-found.css';

export default async function NotFound() {
  const t = await getTranslations('NotFound');

  return (
    <div className="not-found">
      <h1>{t('title')}</h1>
      <p>{t('heading')}</p>
      <p>{t('message')}</p>
      <Link href="/" className="home-link">
        {t('backHome')}
      </Link>
    </div>
  );
}
