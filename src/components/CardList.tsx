import type { Season } from '../types/season';
import Card from './Card';
import './CardList.css';

interface CardListProps {
  seasons: Season[];
  selectedId?: string;
  selectedItemIds?: string[];
  onSelect?: (uid: string) => void;
  onCheckboxChange?: (season: Season) => void;
}

function CardList({ seasons, selectedItemIds, onSelect, onCheckboxChange }: CardListProps) {
  if (seasons.length === 0) {
    return <div className="no-results">No results found</div>;
  }

  return (
    <div className="card-list">
      {seasons.map((season) => (
        <Card
          key={season.uid}
          season={season}
          isSelected={selectedItemIds?.includes(season.uid) ?? false}
          onSelect={onSelect}
          onCheckboxChange={onCheckboxChange}
        />
      ))}
    </div>
  );
}

export default CardList;
