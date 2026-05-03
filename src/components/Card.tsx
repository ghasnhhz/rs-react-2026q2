import { Component } from 'react';

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

    return (
      <div className="card">
        <div className="card-name">{season.title}</div>
        <div className="card-description">
          {season.series.title} ({season.numberOfEpisodes} episodes)
        </div>
      </div>
    );
  }
}

export default Card;