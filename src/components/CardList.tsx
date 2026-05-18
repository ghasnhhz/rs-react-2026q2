import type { Season } from '../types/season';
import Card from './Card';
import './CardList.css';

interface CardListProps {
  seasons: Season[];
  selectedId?: string;
  onSelect?: (uid: string) => void;
}

function CardList({ seasons, selectedId, onSelect }: CardListProps) {
  if (seasons.length === 0) {
    return <div className="no-results">No results found</div>;
  }

  return (
    <div className="card-list">
      {seasons.map((season) => (
        <Card
          key={season.uid}
          season={season}
          isSelected={selectedId === season.uid}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

export default CardList;
