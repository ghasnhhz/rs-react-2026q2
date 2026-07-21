import { render, screen, fireEvent } from '@testing-library/react';
import Card from '../Card';
import { describe, it, expect, vi } from 'vitest';


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

    it('should call onSelect when card is clicked', () => {
        const onSelect = vi.fn();
        render(<Card season={season} onSelect={onSelect} />);

        fireEvent.click(screen.getByRole('button'));
        expect(onSelect).toHaveBeenCalledWith(season.uid);
    });

    it('should call onSelect on Enter or Space key press', () => {
        const onSelect = vi.fn();
        render(<Card season={season} onSelect={onSelect} isSelected />);

        const card = screen.getByRole('button');
        fireEvent.keyDown(card, { key: 'Enter' });
        fireEvent.keyDown(card, { key: ' ' });

        expect(onSelect).toHaveBeenCalledTimes(2);
    });

    it('should apply selected styles when isSelected is true', () => {
        const { container } = render(<Card season={season} onSelect={vi.fn()} isSelected />);

        expect(container.firstChild).toHaveClass('card--selected');
    });
});