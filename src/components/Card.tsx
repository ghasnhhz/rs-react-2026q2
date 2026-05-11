import { Component } from 'react';
import './Card.css';

interface Season {
  uid: string;
  title: string;
  series: {
    uid: string;
    title: string;
  };
  numberOfEpisodes: number;
}

interface CardProps {
  season: Season;
}

class Card extends Component<CardProps> {
  render() {
    const { season } = this.props;
    const episodeCount = season.numberOfEpisodes 
      ? `${season.numberOfEpisodes} episodes`
      : 'N/A';

    return (
      <div className="card">
        <div className="card-name">{season.title}</div>
        <div className="card-description">
          {season.series.title} ({episodeCount})
        </div>
      </div>
    );
  }
}

export default Card;
