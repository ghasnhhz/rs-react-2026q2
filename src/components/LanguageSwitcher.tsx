'use client';

import { type ChangeEvent } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { usePathname, useRouter } from '../i18n/navigation';
import { routing } from '../i18n/routing';
import './LanguageSwitcher.css';

function LanguageSwitcher() {
  const t = useTranslations('Language');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;
    const query = searchParams.toString();
    const href = query ? `${pathname}?${query}` : pathname;
    router.replace(href, { locale: nextLocale });
  };

  return (
    <select
      className="language-switcher"
      value={locale}
      onChange={handleChange}
      aria-label={t('label')}
    >
      {routing.locales.map((loc) => (
        <option key={loc} value={loc}>
          {t(loc)}
        </option>
      ))}
    </select>
  );
}

export default LanguageSwitcher;
