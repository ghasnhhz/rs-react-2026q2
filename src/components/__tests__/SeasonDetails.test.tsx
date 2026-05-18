import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import SeasonDetails from '../SeasonDetails';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

function renderSeasonDetails(initialEntry = '/details/1') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/details/:detailsId" element={<SeasonDetails />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('SeasonDetails Component', () => {
  const mockSeason = {
    uid: '1',
    title: 'DIS Season 1',
    series: { uid: '101', title: 'Star Trek: Discovery' },
    seasonNumber: 1,
    numberOfEpisodes: 15,
    episodes: [{ uid: 'e1', title: 'Pilot', episodeNumber: 1 }],
  };

  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading state while fetching details', async () => {
    global.fetch = vi.fn((): Promise<Response> => new Promise(() => {}));

    renderSeasonDetails();

    await waitFor(() => {
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  it('should display season details when fetch succeeds', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => ({ season: mockSeason }),
      } as Response)
    );

    renderSeasonDetails();

    await waitFor(() => {
      expect(screen.getByText('DIS Season 1')).toBeInTheDocument();
    });

    expect(screen.getByText('Star Trek: Discovery')).toBeInTheDocument();
    expect(screen.getByText('Season 1')).toBeInTheDocument();
    expect(screen.getByText('15 episodes')).toBeInTheDocument();
    expect(screen.getByText('1. Pilot')).toBeInTheDocument();
  });

  it('should display error when fetch fails', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        json: async () => ({}),
      } as Response)
    );

    renderSeasonDetails();

    await waitFor(() => {
      expect(screen.getByText(/Error: 500/)).toBeInTheDocument();
    });
  });

  it('should display not found when season is null', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => ({ season: null }),
      } as Response)
    );

    renderSeasonDetails();

    await waitFor(() => {
      expect(screen.getByText('Season not found')).toBeInTheDocument();
    });
  });

  it('should show N/A when episode count is missing', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => ({
          season: { ...mockSeason, numberOfEpisodes: null, episodes: [] },
        }),
      } as Response)
    );

    renderSeasonDetails();

    await waitFor(() => {
      expect(screen.getByText('N/A')).toBeInTheDocument();
    });
  });

  it('should navigate home when close button is clicked', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => ({ season: mockSeason }),
      } as Response)
    );

    render(
      <MemoryRouter initialEntries={['/details/1?page=2&details=1']}>
        <Routes>
          <Route path="/" element={<span>Home page</span>} />
          <Route path="/details/:detailsId" element={<SeasonDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('DIS Season 1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /close details/i }));

    await waitFor(() => {
      expect(screen.getByText('Home page')).toBeInTheDocument();
    });
  });
});
