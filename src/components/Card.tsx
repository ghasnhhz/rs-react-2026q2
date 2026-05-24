import type { KeyboardEvent, MouseEvent, ChangeEvent } from 'react';
import type { Season } from '../types/season';
import './Card.css';

interface CardProps {
  season: Season;
  isSelected?: boolean;
  onSelect?: (uid: string) => void;
  onCheckboxChange?: (season: Season) => void;
}

function Card({ season, isSelected = false, onSelect, onCheckboxChange }: CardProps) {
  const episodeCount = season.numberOfEpisodes
    ? `${season.numberOfEpisodes} episodes`
    : 'N/A';

  const handleCardClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onSelect?.(season.uid);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect?.(season.uid);
    }
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onCheckboxChange?.(season);
  };

  return (
    <div
      className={`card ${isSelected ? 'card--selected' : ''} ${onSelect ? 'card--clickable' : ''}`}
      onClick={onSelect ? handleCardClick : undefined}
      onKeyDown={onSelect ? handleKeyDown : undefined}
      role={onSelect ? 'button' : undefined}
      tabIndex={onSelect ? 0 : undefined}
      aria-pressed={onSelect ? isSelected : undefined}
    >
      {onCheckboxChange && (
        <input
          type="checkbox"
          className="card-checkbox"
          checked={isSelected}
          onChange={handleCheckboxChange}
          aria-label={`Select ${season.title}`}
          onClick={(e) => e.stopPropagation()}
        />
      )}
      <div className="card-name">{season.title}</div>
      <div className="card-description">
        {season.series.title} ({episodeCount})
      </div>
    </div>
  );
}

export default Card;