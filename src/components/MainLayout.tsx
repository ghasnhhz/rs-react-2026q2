import { useState } from 'react';
import { Outlet, useMatch, useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { toggleItem } from '../store/slices/selectedItemsSlice';
import type { Season } from '../types/season';
import { ITEMS_PER_PAGE } from '../constants';
import { useSeasons } from '../hooks/useSeasons';
import { useUrlPagination } from '../hooks/useUrlPagination';
import CardList from './CardList';
import Pagination from './Pagination';
import './Main.css';

interface MainLayoutProps {
  searchTerm: string;
}

function MainLayout({ searchTerm }: MainLayoutProps) {
  const { loading, results, error } = useSeasons(searchTerm);
  const { currentPage, totalPages, setPage, paginatedItems } =
    useUrlPagination(results.length, ITEMS_PER_PAGE);
  const detailsMatch = useMatch('/details/:detailsId');
  const detailsId = detailsMatch?.params.detailsId;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [shouldThrowError, setShouldThrowError] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const selectedItems = useSelector((state: RootState) => state.selectedItems.items);
  const selectedItemIds = selectedItems.map((item) => item.uid);
  const handleCheckboxChange = (season: Season) => dispatch(toggleItem(season));

  const visibleSeasons = paginatedItems(results);
  const isDetailsOpen = Boolean(detailsId);

  const handleCardSelect = (uid: string) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('details', uid);
    navigate({
      pathname: `/details/${uid}`,
      search: nextParams.toString(),
    });
  };

  const handleListPanelClick = () => {
    if (!isDetailsOpen) return;
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('details');
    const search = nextParams.toString();
    navigate({ pathname: '/', search: search ? `?${search}` : '' });
  };

  const handleErrorButtonClick = () => {
    setShouldThrowError(true);
  };

  if (shouldThrowError) {
    throw new Error('Test error from Main component');
  }

  return (
    <main className={`main ${isDetailsOpen ? 'main--split' : ''}`}>
      <div
        className="main-list-panel"
        onClick={handleListPanelClick}
        role={isDetailsOpen ? 'button' : undefined}
        tabIndex={isDetailsOpen ? 0 : undefined}
        onKeyDown={(e) => {
          if (isDetailsOpen && (e.key === 'Enter' || e.key === ' ')) {
            handleListPanelClick();
          }
        }}
        aria-label={isDetailsOpen ? 'Close details panel' : undefined}
      >
        {loading && <div className="loading">Loading...</div>}
        {error && <div className="error">{error}</div>}
        {!loading && !error && (
          <>
            <CardList
              seasons={visibleSeasons}
              selectedId={detailsId}
              selectedItemIds={selectedItemIds}
              onSelect={handleCardSelect}
              onCheckboxChange={handleCheckboxChange}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleErrorButtonClick();
          }}
          className="error-button"
        >
          Error
        </button>
      </div>
      {isDetailsOpen && <Outlet />}
    </main>
  );
}

export default MainLayout;
