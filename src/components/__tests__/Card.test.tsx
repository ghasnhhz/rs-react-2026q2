import { render, screen } from '@testing-library/react';
import Card from '../Card';
import { describe, it, expect } from 'vitest';


describe('Card Component', () => {
    const season = {
        uid: String(1),
        title: "DIS Season 1",
        series: {
          uid: String(2),
          title: "Star Trek: Discovery",
        },
        numberOfEpisodes: 10,
    }

    it('should render season title', () => {
        render(<Card key={season.uid} season={season} />);

        expect(screen.getByText("DIS Season 1")).toBeInTheDocument();
    });

    it('should render series name and episode count', () => {
        render(<Card key={season.uid} season={season} />);
    
        expect(screen.getByText('Star Trek: Discovery (10 episodes)')).toBeInTheDocument();
    });

    it('should show "N/A" when episode count is missing', () => {
        const seasonNoEpisodes = {
          ...season,
          numberOfEpisodes: 0, 
        };
    
        render(<Card key={seasonNoEpisodes.uid} season={seasonNoEpisodes} />);
    
        expect(screen.getByText(/N\/A/)).toBeInTheDocument();
    });
});