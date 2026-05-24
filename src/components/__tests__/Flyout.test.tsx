import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Flyout from '../Flyout';
import selectedItemsReducer from '../../store/slices/selectedItemsSlice';
import type { Season } from '../../types/season';

const mockSeason: Season = {
  uid: '1',
  title: 'DIS Season 1',
  series: { uid: '101', title: 'Star Trek: Discovery' },
  numberOfEpisodes: 15,
};

const mockSeason2: Season = {
  uid: '2',
  title: 'DIS Season 2',
  series: { uid: '101', title: 'Star Trek: Discovery' },
  numberOfEpisodes: 14,
};

function renderFlyout(items: Season[] = []) {
  const store = configureStore({
    reducer: { selectedItems: selectedItemsReducer },
    preloadedState: { selectedItems: { items } },
  });
  return {
    store,
    ...render(
      <Provider store={store}>
        <Flyout />
      </Provider>
    ),
  };
}

describe('Flyout', () => {
  beforeEach(() => {
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = vi.fn();
  });

  it('renders nothing when no items are selected', () => {
    const { container } = renderFlyout([]);
    expect(container.firstChild).toBeNull();
  });

  it('renders when one item is selected', () => {
    renderFlyout([mockSeason]);
    expect(screen.getByText(/1 item selected/)).toBeInTheDocument();
  });

  it('shows correct count for multiple items', () => {
    renderFlyout([mockSeason, mockSeason2]);
    expect(screen.getByText(/2 items selected/)).toBeInTheDocument();
  });

  it('renders "Unselect All" and "Download" buttons', () => {
    renderFlyout([mockSeason]);
    expect(screen.getByRole('button', { name: /unselect all/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /download/i })).toBeInTheDocument();
  });

  it('clears all items when "Unselect All" is clicked', () => {
    const { store } = renderFlyout([mockSeason, mockSeason2]);
    fireEvent.click(screen.getByRole('button', { name: /unselect all/i }));
    expect(store.getState().selectedItems.items).toHaveLength(0);
  });

  it('hides itself after "Unselect All" clears all items', () => {
    const { container } = renderFlyout([mockSeason]);
    fireEvent.click(screen.getByRole('button', { name: /unselect all/i }));
    expect(container.firstChild).toBeNull();
  });

  it('calls URL.createObjectURL when "Download" is clicked', () => {
    renderFlyout([mockSeason]);
    fireEvent.click(screen.getByRole('button', { name: /download/i }));
    expect(global.URL.createObjectURL).toHaveBeenCalled();
  });

  it('generates a filename with the item count', () => {
    const appendSpy = vi.spyOn(document.body, 'appendChild');
    renderFlyout([mockSeason, mockSeason2]);
    fireEvent.click(screen.getByRole('button', { name: /download/i }));

    const link = appendSpy.mock.calls
      .map((call) => call[0])
      .find((node): node is HTMLAnchorElement => node instanceof HTMLAnchorElement);
    expect(link?.getAttribute('download')).toBe('2_items.csv');
    appendSpy.mockRestore();
  });
});
