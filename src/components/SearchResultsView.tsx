import { getTranslations } from 'next-intl/server';
import type { Season, SeasonDetails as SeasonDetailsType } from '../types/season';
import CardList from './CardList';
import Pagination from './Pagination';
import SeasonDetails from './SeasonDetails';
import RefreshButton from './RefreshButton';
import ThrowErrorButton from './ThrowErrorButton';
import './Main.css';

interface SearchResultsViewProps {
  seasons: Season[];
  currentPage: number;
  totalPages: number;
  query: Record<string, string>;
  detailsId?: string;
  season: SeasonDetailsType | null;
  listError?: boolean;
  detailsError?: boolean;
}

async function SearchResultsView({
  seasons,
  currentPage,
  totalPages,
  query,
  detailsId,
  season,
  listError = false,
  detailsError = false,
}: SearchResultsViewProps) {
  const t = await getTranslations('Search');
  const isDetailsOpen = Boolean(detailsId);

  return (
    <main className={`main ${isDetailsOpen ? 'main--split' : ''}`}>
      <div className="main-list-panel">
        {listError ? (
          <div className="error">{t('error')}</div>
        ) : (
          <>
            <CardList
              seasons={seasons}
              query={query}
              selectedId={detailsId}
              emptyLabel={t('noResults')}
            />
            <Pagination currentPage={currentPage} totalPages={totalPages} query={query} />
          </>
        )}
        <RefreshButton
          className="refresh-button"
          label={t('refresh')}
          refreshingLabel={t('refreshing')}
        />
        <ThrowErrorButton className="error-button" label={t('errorButton')} />
      </div>
      {isDetailsOpen && (
        <SeasonDetails season={season} query={query} hasError={detailsError} />
      )}
    </main>
  );
}

export default SearchResultsView;
