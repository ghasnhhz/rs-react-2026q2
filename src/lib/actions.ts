'use server';

import { getLocale } from 'next-intl/server';
import { redirect } from '../i18n/navigation';

/** Server action: handles a search submission and redirects to the server-rendered results. */
export async function searchAction(formData: FormData): Promise<void> {
  const raw = formData.get('q');
  const q = typeof raw === 'string' ? raw.trim() : '';
  const locale = await getLocale();

  redirect({
    href: q ? { pathname: '/', query: { q } } : { pathname: '/' },
    locale,
  });
}
