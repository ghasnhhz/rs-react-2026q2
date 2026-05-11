import { render, screen } from '@testing-library/react';
import CardList from '../CardList';
import { describe, it, expect } from 'vitest';

describe('CardList Component', () => {
  const mockSeasons = [
    {
      uid: '1',
      title: 'DIS Season 1',
      series: {
        uid: '101',
        title: 'Star Trek: Discovery',
      },
      numberOfEpisodes: 15,
    },
    {
      uid: '2',
      title: 'DIS Season 2',
      series: {
        uid: '101',
        title: 'Star Trek: Discovery',
      },
      numberOfEpisodes: 14,
    },
  ];

  it('should render correct number of items when data is provided', () => {
    render(<CardList seasons={mockSeasons} />);

    const cards = screen.getAllByText(/DIS Season/);
    expect(cards).toHaveLength(2);
  });

  it('should display "no results" message when data array is empty', () => {
    render(<CardList seasons={[]} />);

    expect(screen.getByText('No results found')).toBeInTheDocument();
  });

  it('should correctly display item names and descriptions', () => {
    render(<CardList seasons={mockSeasons} />);

    expect(screen.getByText('DIS Season 1')).toBeInTheDocument();
    expect(screen.getByText('Star Trek: Discovery (15 episodes)')).toBeInTheDocument();

    expect(screen.getByText('DIS Season 2')).toBeInTheDocument();
    expect(screen.getByText('Star Trek: Discovery (14 episodes)')).toBeInTheDocument();
  });

  it('should handle missing episode count gracefully', () => {
    const seasonNoEpisodes = {
      uid: '3',
      title: 'SNW Season 1',
      series: {
        uid: '102',
        title: 'Star Trek: Strange New Worlds',
      },
      numberOfEpisodes: 0,
    };

    render(<CardList seasons={[seasonNoEpisodes]} />);

    expect(screen.getByText(/N\/A/)).toBeInTheDocument();
  });
});