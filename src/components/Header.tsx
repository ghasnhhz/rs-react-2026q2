'use client';

import { type ChangeEvent, useState, useSyncExternalStore } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '../i18n/navigation';
import { SEARCH_TERM_KEY, readLocalStorage } from '../hooks/useLocalStorage';
import { searchAction } from '../lib/actions';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeSwitcher from './ThemeSwitcher';
import './Header.css';

function Header() {
  const tNav = useTranslations('Nav');
  const tSearch = useTranslations('Search');
  // Read the persisted term from localStorage with a proper server snapshot ('')
  // so the server and first client render match; user edits overlay it via `edited`.
  const stored = useSyncExternalStore(
    () => () => {}, // no-op subscribe (value is read once on mount)
    () => readLocalStorage(SEARCH_TERM_KEY).trim(), // client snapshot
    () => '' // server snapshot (avoids hydration mismatch)
  );
  const [edited, setEdited] = useState<string | null>(null);
  const input = edited ?? stored;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEdited(e.target.value);
  };

  // Persist the term, then delegate to the server action which redirects to the results.
  const handleSubmit = (formData: FormData) => {
    const term = (formData.get('q') ?? '').toString().trim();
    try {
      localStorage.setItem(SEARCH_TERM_KEY, term);
    } catch {
      // localStorage may be unavailable; ignore persistence errors
    }
    return searchAction(formData);
  };

  return (
    <header className="header">
      <nav className="header-nav" aria-label={tNav('ariaLabel')}>
        <Link href="/" className="nav-link">
          {tNav('home')}
        </Link>
        <Link href="/about" className="nav-link">
          {tNav('about')}
        </Link>
      </nav>
      <form className="header-search" action={handleSubmit}>
        <input
          type="text"
          name="q"
          className="search-input"
          onChange={handleInputChange}
          value={input}
          aria-label={tSearch('inputLabel')}
          placeholder={tSearch('placeholder')}
        />
        <button type="submit" className="search-button">
          {tSearch('submit')}
        </button>
      </form>
      <LanguageSwitcher />
      <ThemeSwitcher />
    </header>
  );
}

export default Header;
