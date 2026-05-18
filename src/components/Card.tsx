import type { KeyboardEvent, MouseEvent } from 'react';
import type { Season } from '../types/season';
import './Card.css';

interface CardProps {
  season: Season;
  isSelected?: boolean;
  onSelect?: (uid: string) => void;
}

function Card({ season, isSelected = false, onSelect }: CardProps) {
  const episodeCount = season.numberOfEpisodes
    ? `${season.numberOfEpisodes} episodes`
    : 'N/A';

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onSelect?.(season.uid);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect?.(season.uid);
    }
  };

  return (
    <div
      className={`card ${isSelected ? 'card--selected' : ''} ${onSelect ? 'card--clickable' : ''}`}
      onClick={onSelect ? handleClick : undefined}
      onKeyDown={onSelect ? handleKeyDown : undefined}
      role={onSelect ? 'button' : undefined}
      tabIndex={onSelect ? 0 : undefined}
      aria-pressed={onSelect ? isSelected : undefined}
    >
      <div className="card-name">{season.title}</div>
      <div className="card-description">
        {season.series.title} ({episodeCount})
      </div>
    </div>
  );
}

export default Card;
