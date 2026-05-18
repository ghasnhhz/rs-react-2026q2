import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useUrlPagination(totalItems: number, itemsPerPage: number) {
  const [searchParams, setSearchParams] = useSearchParams();

  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  const currentPage = useMemo(() => {
    const parsed = parseInt(searchParams.get('page') || '1', 10);
    if (Number.isNaN(parsed) || parsed < 1) return 1;
    return Math.min(parsed, totalPages);
  }, [searchParams, totalPages]);

  const setPage = useCallback(
    (page: number) => {
      const nextPage = Math.max(1, Math.min(page, totalPages));
      const nextParams = new URLSearchParams(searchParams);
      if (nextPage === 1) {
        nextParams.delete('page');
      } else {
        nextParams.set('page', String(nextPage));
      }
      setSearchParams(nextParams, { replace: true });
    },
    [searchParams, setSearchParams, totalPages]
  );

  const resetPage = useCallback(() => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('page');
    setSearchParams(nextParams, { replace: true });
  }, [searchParams, setSearchParams]);

  const paginatedItems = useCallback(
    <T,>(items: T[]): T[] => {
      const start = (currentPage - 1) * itemsPerPage;
      return items.slice(start, start + itemsPerPage);
    },
    [currentPage, itemsPerPage]
  );

  return { currentPage, totalPages, setPage, resetPage, paginatedItems };
}
