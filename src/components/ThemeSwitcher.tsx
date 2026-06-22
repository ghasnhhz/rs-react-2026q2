'use client';

import { useTranslations } from 'next-intl';
import { useTheme } from '../hooks/useTheme';
import './ThemeSwitcher.css';

function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();
  const t = useTranslations('Theme');
  const targetTheme = theme === 'light' ? t('dark') : t('light');

  return (
    <button
      type="button"
      className="theme-switcher"
      onClick={toggleTheme}
      aria-label={t('switchTo', { theme: targetTheme })}
      title={t('current', { theme: theme === 'light' ? t('light') : t('dark') })}
      suppressHydrationWarning
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}

export default ThemeSwitcher;
