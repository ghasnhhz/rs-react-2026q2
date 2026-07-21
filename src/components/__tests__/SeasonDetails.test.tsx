import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import SeasonDetails from '../SeasonDetails';
import { seasonsApi } from '../../store/api/seasonsApi';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

function makeStore() {
  return configureStore({
    reducer: { [seasonsApi.reducerPath]: seasonsApi.reducer },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(seasonsApi.middleware),
  });
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function renderSeasonDetails(initialEntry = '/details/1') {
  return render(
    <Provider store={makeStore()}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route path="/details/:detailsId" element={<SeasonDetails />} />
        </Routes>
      </MemoryRouter>
    </Provider>
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
    global.fetch = vi.fn(() => Promise.resolve(jsonResponse({ season: mockSeason })));

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
    global.fetch = vi.fn(() => Promise.resolve(jsonResponse({}, 500)));

    renderSeasonDetails();

    await waitFor(() => {
      expect(screen.getByText(/Error: 500/)).toBeInTheDocument();
    });
  });

  it('should display not found when season is null', async () => {
    global.fetch = vi.fn(() => Promise.resolve(jsonResponse({ season: null })));

    renderSeasonDetails();

    await waitFor(() => {
      expect(screen.getByText('Season not found')).toBeInTheDocument();
    });
  });

  it('should show N/A when episode count is missing', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve(
        jsonResponse({
          season: { ...mockSeason, numberOfEpisodes: null, episodes: [] },
        })
      )
    );

    renderSeasonDetails();

    await waitFor(() => {
      expect(screen.getByText('N/A')).toBeInTheDocument();
    });
  });

  it('should navigate home when close button is clicked', async () => {
    global.fetch = vi.fn(() => Promise.resolve(jsonResponse({ season: mockSeason })));

    render(
      <Provider store={makeStore()}>
        <MemoryRouter initialEntries={['/details/1?page=2&details=1']}>
          <Routes>
            <Route path="/" element={<span>Home page</span>} />
            <Route path="/details/:detailsId" element={<SeasonDetails />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('DIS Season 1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /close details/i }));

    await waitFor(() => {
      expect(screen.getByText('Home page')).toBeInTheDocument();
    });
  });

  it('should invalidate the cache and refetch when refresh is clicked', async () => {
    global.fetch = vi.fn(() => Promise.resolve(jsonResponse({ season: mockSeason })));

    renderSeasonDetails();

    await waitFor(() => {
      expect(screen.getByText('DIS Season 1')).toBeInTheDocument();
    });
    expect(global.fetch).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: /refresh/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });

  it('should show a refreshing state while refetching, then restore', async () => {
    let resolveRefetch: () => void = () => {};
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({ season: mockSeason }))
      .mockImplementationOnce(
        () =>
          new Promise<Response>((resolve) => {
            resolveRefetch = () => resolve(jsonResponse({ season: mockSeason }));
          })
      );

    renderSeasonDetails();

    await waitFor(() => {
      expect(screen.getByText('DIS Season 1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /refresh/i }));

    const refreshingButton = await screen.findByRole('button', { name: /refreshing/i });
    expect(refreshingButton).toBeDisabled();

    resolveRefetch();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /^refresh$/i })).toBeEnabled();
    });
  });
});
