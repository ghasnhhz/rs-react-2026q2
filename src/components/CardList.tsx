import type { Season } from '../types/season';
import Card from './Card';
import './CardList.css';

interface CardListProps {
  seasons: Season[];
  query: Record<string, string>;
  selectedId?: string;
  emptyLabel?: string;
}

function CardList({ seasons, query, selectedId, emptyLabel = 'No results found' }: CardListProps) {
  if (seasons.length === 0) {
    return <div className="no-results">{emptyLabel}</div>;
  }

  return (
    <div className="card-list">
      {seasons.map((season) => (
        <Card
          key={season.uid}
          season={season}
          query={query}
          isActive={selectedId === season.uid}
        />
      ))}
    </div>
  );
}

export default CardList;
