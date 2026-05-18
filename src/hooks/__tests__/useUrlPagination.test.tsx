import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useSearchParams } from 'react-router-dom';
import { useUrlPagination } from '../useUrlPagination';
import { describe, it, expect } from 'vitest';

function PaginationTestHarness({ totalItems }: { totalItems: number }) {
  const { currentPage, totalPages, setPage, resetPage, paginatedItems } =
    useUrlPagination(totalItems, 10);
  const [searchParams] = useSearchParams();
  const items = Array.from({ length: totalItems }, (_, i) => `item-${i + 1}`);

  return (
    <div>
      <span data-testid="current-page">{currentPage}</span>
      <span data-testid="total-pages">{totalPages}</span>
      <span data-testid="visible">{paginatedItems(items).join(',')}</span>
      <span data-testid="search">{searchParams.toString()}</span>
      <button type="button" onClick={() => setPage(2)}>
        Go to page 2
      </button>
      <button type="button" onClick={() => setPage(1)}>
        Go to page 1
      </button>
      <button type="button" onClick={() => resetPage()}>
        Reset page
      </button>
    </div>
  );
}

function renderHarness(totalItems: number, initialEntry = '/') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/" element={<PaginationTestHarness totalItems={totalItems} />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('useUrlPagination', () => {
  it('should default to page 1 and slice items', () => {
    renderHarness(25);

    expect(screen.getByTestId('current-page')).toHaveTextContent('1');
    expect(screen.getByTestId('total-pages')).toHaveTextContent('3');
    expect(screen.getByTestId('visible')).toHaveTextContent(
      Array.from({ length: 10 }, (_, i) => `item-${i + 1}`).join(',')
    );
  });

  it('should read page from URL search params', () => {
    renderHarness(25, '/?page=2');

    expect(screen.getByTestId('current-page')).toHaveTextContent('2');
    expect(screen.getByTestId('visible')).toHaveTextContent(
      Array.from({ length: 10 }, (_, i) => `item-${i + 11}`).join(',')
    );
  });

  it('should clamp invalid page values', () => {
    renderHarness(25, '/?page=99');

    expect(screen.getByTestId('current-page')).toHaveTextContent('3');
  });

  it('should update URL when changing pages', () => {
    renderHarness(25);

    fireEvent.click(screen.getByRole('button', { name: /go to page 2/i }));
    expect(screen.getByTestId('search')).toHaveTextContent('page=2');
    expect(screen.getByTestId('current-page')).toHaveTextContent('2');

    fireEvent.click(screen.getByRole('button', { name: /go to page 1/i }));
    expect(screen.getByTestId('search')).toHaveTextContent('');
  });

  it('should reset page in URL', () => {
    renderHarness(25, '/?page=2');

    fireEvent.click(screen.getByRole('button', { name: /reset page/i }));
    expect(screen.getByTestId('search')).toHaveTextContent('');
    expect(screen.getByTestId('current-page')).toHaveTextContent('1');
  });
});
