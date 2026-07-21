import { Link } from '../i18n/navigation';
import type { Season } from '../types/season';
import SelectCheckbox from './SelectCheckbox';
import './Card.css';

interface CardProps {
  season: Season;
  query: Record<string, string>;
  isActive?: boolean;
}

function Card({ season, query, isActive = false }: CardProps) {
  const episodeCount = season.numberOfEpisodes
    ? `${season.numberOfEpisodes} episodes`
    : 'N/A';

  return (
    <div className={`card card--clickable ${isActive ? 'card--selected' : ''}`}>
      <SelectCheckbox season={season} />
      <Link
        href={{ pathname: '/', query: { ...query, details: season.uid } }}
        className="card-link"
      >
        <div className="card-name">{season.title}</div>
        <div className="card-description">
          {season.series.title} ({episodeCount})
        </div>
      </Link>
    </div>
  );
}

export default Card;
