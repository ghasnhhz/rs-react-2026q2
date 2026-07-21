import { getTranslations } from 'next-intl/server';
import { Link } from '../i18n/navigation';
import './Pagination.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  query: Record<string, string>;
}

function buildQuery(query: Record<string, string>, page: number): Record<string, string> {
  const next = { ...query };
  if (page <= 1) {
    delete next.page;
  } else {
    next.page = String(page);
  }
  return next;
}

async function Pagination({ currentPage, totalPages, query }: PaginationProps) {
  const t = await getTranslations('Pagination');

  if (totalPages <= 1) {
    return null;
  }

  const isFirst = currentPage <= 1;
  const isLast = currentPage >= totalPages;

  return (
    <nav className="pagination" aria-label={t('ariaLabel')}>
      {isFirst ? (
        <span className="pagination-button pagination-button--disabled" aria-disabled="true">
          {t('previous')}
        </span>
      ) : (
        <Link
          href={{ pathname: '/', query: buildQuery(query, currentPage - 1) }}
          className="pagination-button"
          aria-label={t('previous')}
        >
          {t('previous')}
        </Link>
      )}
      <span className="pagination-info">{t('info', { currentPage, totalPages })}</span>
      {isLast ? (
        <span className="pagination-button pagination-button--disabled" aria-disabled="true">
          {t('next')}
        </span>
      ) : (
        <Link
          href={{ pathname: '/', query: buildQuery(query, currentPage + 1) }}
          className="pagination-button"
          aria-label={t('next')}
        >
          {t('next')}
        </Link>
      )}
    </nav>
  );
}

export default Pagination;
