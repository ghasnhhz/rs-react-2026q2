import { skipToken } from '@reduxjs/toolkit/query';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store/store';
import { seasonsApi, useGetSeasonDetailsQuery } from '../store/api/seasonsApi';
import { getErrorMessage } from '../utils/getErrorMessage';
import './SeasonDetails.css';

function SeasonDetails() {
  const { detailsId } = useParams<{ detailsId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const {
    data: season,
    isLoading: loading,
    isFetching,
    error,
  } = useGetSeasonDetailsQuery(detailsId ?? skipToken);

  const handleRefresh = () => {
    if (!detailsId) return;
    dispatch(
      seasonsApi.util.invalidateTags([{ type: 'SeasonDetails', id: detailsId }])
    );
  };

  const handleClose = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('details');
    const search = nextParams.toString();
    navigate({ pathname: '/', search: search ? `?${search}` : '' });
  };

  const episodeCount = season?.numberOfEpisodes
    ? `${season.numberOfEpisodes} episodes`
    : 'N/A';

  return (
    <aside className="season-details" aria-label="Season details">
      <button
        type="button"
        className="season-details-close"
        onClick={handleClose}
        aria-label="Close details"
      >
        ×
      </button>
      <button
        type="button"
        className="season-details-refresh"
        onClick={handleRefresh}
        disabled={isFetching}
      >
        {isFetching ? 'Refreshing…' : 'Refresh'}
      </button>
      {loading && <div className="season-details-loading">Loading...</div>}
      {error && (
        <div className="season-details-error">{getErrorMessage(error)}</div>
      )}
      {!loading && !error && season && (
        <div className="season-details-content">
          <h2 className="season-details-title">{season.title}</h2>
          <p className="season-details-series">{season.series.title}</p>
          {season.seasonNumber != null && (
            <p className="season-details-meta">Season {season.seasonNumber}</p>
          )}
          <p className="season-details-meta">{episodeCount}</p>
          {season.episodes && season.episodes.length > 0 && (
            <section className="season-details-episodes">
              <h3>Episodes</h3>
              <ul>
                {season.episodes.map((episode) => (
                  <li key={episode.uid}>
                    {episode.episodeNumber}. {episode.title}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
      {!loading && !error && !season && (
        <div className="season-details-error">Season not found</div>
      )}
    </aside>
  );
}

export default SeasonDetails;
