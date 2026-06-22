import { getTranslations } from 'next-intl/server';
import { Link } from '../i18n/navigation';
import type { SeasonDetails as SeasonDetailsType } from '../types/season';
import RefreshButton from './RefreshButton';
import './SeasonDetails.css';

interface SeasonDetailsProps {
  season: SeasonDetailsType | null;
  query: Record<string, string>;
  hasError?: boolean;
}

async function SeasonDetails({ season, query, hasError = false }: SeasonDetailsProps) {
  const t = await getTranslations('Details');

  const closeQuery = { ...query };
  delete closeQuery.details;

  const episodeCount =
    season?.numberOfEpisodes != null
      ? t('episodes', { count: season.numberOfEpisodes })
      : t('episodesNA');

  return (
    <aside className="season-details" aria-label={t('ariaLabel')}>
      <Link
        href={{ pathname: '/', query: closeQuery }}
        className="season-details-close"
        aria-label={t('close')}
      >
        ×
      </Link>
      <RefreshButton
        className="season-details-refresh"
        label={t('refresh')}
        refreshingLabel={t('refreshing')}
      />
      {hasError && <div className="season-details-error">{t('notFound')}</div>}
      {!hasError && season && (
        <div className="season-details-content">
          <h2 className="season-details-title">{season.title}</h2>
          <p className="season-details-series">{season.series.title}</p>
          {season.seasonNumber != null && (
            <p className="season-details-meta">{t('season', { number: season.seasonNumber })}</p>
          )}
          <p className="season-details-meta">{episodeCount}</p>
          {season.episodes && season.episodes.length > 0 && (
            <section className="season-details-episodes">
              <h3>{t('episodesHeading')}</h3>
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
      {!hasError && !season && (
        <div className="season-details-error">{t('notFound')}</div>
      )}
    </aside>
  );
}

export default SeasonDetails;
