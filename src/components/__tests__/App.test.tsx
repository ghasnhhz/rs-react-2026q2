import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import App from '../../App';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('App Component', () => {
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
  ];

  const mockResponse = {
    ok: true,
    json: async () => ({ seasons: mockSeasons }),
  };

  beforeEach(() => {
    localStorage.clear();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should render Header and Main components', async () => {
    global.fetch = vi.fn(() => Promise.resolve(mockResponse as Response));

    await act(async () => {
      render(<App />);
    });

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('should load saved search term from localStorage on mount', async () => {
    localStorage.setItem('searchTerm', 'Discovery');
    global.fetch = vi.fn(() => Promise.resolve(mockResponse as Response));

    await act(async () => {
      render(<App />);
    });

    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('Discovery');
  });

  it('should pass search term to Main when Header is submitted', async () => {
    global.fetch = vi.fn(() => Promise.resolve(mockResponse as Response));

    await act(async () => {
      render(<App />);
    });

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /search/i });

    await act(async () => {
      fireEvent.change(input, { target: { value: 'Voyager' } });
      fireEvent.click(button);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  it('should not fetch if search term is unchanged', async () => {
    localStorage.setItem('searchTerm', 'Discovery');
    global.fetch = vi.fn(() => Promise.resolve(mockResponse as Response));

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    const asMocked = (f: typeof global.fetch) =>
      f as typeof global.fetch & { mock: { calls: unknown[] } };

    const callCount = asMocked(global.fetch).mock.calls.length;

    await act(async () => {
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Discovery' } });
      fireEvent.click(screen.getByRole('button', { name: /search/i }));
    });

    expect(asMocked(global.fetch).mock.calls.length).toBe(callCount);
  });

  it('should display Main component with search results', async () => {
    global.fetch = vi.fn(() => Promise.resolve(mockResponse as Response));

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText('DIS Season 1')).toBeInTheDocument();
    });
  });
});