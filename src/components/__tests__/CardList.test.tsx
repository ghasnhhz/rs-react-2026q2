import { render, screen, fireEvent } from '@testing-library/react';
import CardList from '../CardList';
import type { Season } from '../../types/season';
import { describe, it, expect, vi } from 'vitest';

const mockSeasons: Season[] = [
  {
    uid: '1',
    title: 'DIS Season 1',
    series: { uid: '101', title: 'Star Trek: Discovery' },
    numberOfEpisodes: 15,
  },
  {
    uid: '2',
    title: 'DIS Season 2',
    series: { uid: '101', title: 'Star Trek: Discovery' },
    numberOfEpisodes: 14,
  },
];

describe('CardList Component', () => {
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
    const seasonNoEpisodes: Season = {
      uid: '3',
      title: 'SNW Season 1',
      series: { uid: '102', title: 'Star Trek: Strange New Worlds' },
      numberOfEpisodes: 0,
    };
    render(<CardList seasons={[seasonNoEpisodes]} />);
    expect(screen.getByText(/N\/A/)).toBeInTheDocument();
  });

  it('renders checkboxes when onCheckboxChange is provided', () => {
    render(<CardList seasons={mockSeasons} onCheckboxChange={vi.fn()} />);
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(2);
  });

  it('does not render checkboxes when onCheckboxChange is not provided', () => {
    render(<CardList seasons={mockSeasons} />);
    expect(screen.queryAllByRole('checkbox')).toHaveLength(0);
  });

  it('marks checkboxes as checked for selectedItemIds', () => {
    render(
      <CardList
        seasons={mockSeasons}
        selectedItemIds={['1']}
        onCheckboxChange={vi.fn()}
      />
    );
    const checkboxes = screen.getAllByRole('checkbox') as HTMLInputElement[];
    expect(checkboxes[0].checked).toBe(true);
    expect(checkboxes[1].checked).toBe(false);
  });

  it('calls onCheckboxChange with the season when a checkbox is clicked', () => {
    const onCheckboxChange = vi.fn();
    render(<CardList seasons={mockSeasons} onCheckboxChange={onCheckboxChange} />);
    fireEvent.click(screen.getAllByRole('checkbox')[0]);
    expect(onCheckboxChange).toHaveBeenCalledWith(mockSeasons[0]);
  });

  it('does not trigger onSelect when checkbox is clicked', () => {
    const onSelect = vi.fn();
    const onCheckboxChange = vi.fn();
    render(
      <CardList
        seasons={mockSeasons}
        onSelect={onSelect}
        onCheckboxChange={onCheckboxChange}
      />
    );
    fireEvent.click(screen.getAllByRole('checkbox')[0]);
    expect(onSelect).not.toHaveBeenCalled();
  });
});
