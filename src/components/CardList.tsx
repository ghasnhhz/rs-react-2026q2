import { Component } from 'react';
import Card from './Card';
import './CardList.css';

interface Season {
  uid: string;
  title: string;
  series: {
    uid: string;
    title: string;
  };
  numberOfEpisodes: number;
}

interface CardListProps {
  seasons: Season[];
}

class CardList extends Component<CardListProps> {
  render() {
    const { seasons } = this.props;

    if (seasons.length === 0) {
      return <div className="no-results">No results found</div>;
    }

    return (
      <div className="card-list">
        {seasons.map((season) => (
          <Card key={season.uid} season={season} />
        ))}
      </div>
    );
  }
}

export default CardList;
