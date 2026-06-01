import { configureStore } from '@reduxjs/toolkit';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { seasonsApi } from '../seasonsApi';

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

const mockSeasons = [
  {
    uid: '1',
    title: 'DIS Season 1',
    series: { uid: '101', title: 'Star Trek: Discovery' },
    numberOfEpisodes: 15,
  },
];

describe('seasonsApi', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('tracks loading state and resolves with transformed data', async () => {
    global.fetch = vi.fn(() => Promise.resolve(jsonResponse({ seasons: mockSeasons })));
    const store = makeStore();

    const promise = store.dispatch(seasonsApi.endpoints.searchSeasons.initiate(''));

    const pending = seasonsApi.endpoints.searchSeasons.select('')(store.getState());
    expect(pending.isLoading).toBe(true);

    const result = await promise;
    expect(result.data).toEqual(mockSeasons);
    expect(result.isLoading).toBe(false);
  });

  it('exposes an error state when the request fails', async () => {
    global.fetch = vi.fn(() => Promise.resolve(jsonResponse({}, 500)));
    const store = makeStore();

    const result = await store.dispatch(
      seasonsApi.endpoints.searchSeasons.initiate('Voyager')
    );

    expect(result.isError).toBe(true);
    expect(result.error).toMatchObject({ status: 500 });
  });

  it('reuses cached data for repeated queries with the same argument', async () => {
    global.fetch = vi.fn(() => Promise.resolve(jsonResponse({ seasons: mockSeasons })));
    const store = makeStore();

    await store.dispatch(seasonsApi.endpoints.searchSeasons.initiate('Discovery'));
    await store.dispatch(seasonsApi.endpoints.searchSeasons.initiate('Discovery'));

    // The second access is served from cache, so fetch runs only once.
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('refetches after the cache is invalidated', async () => {
    global.fetch = vi.fn(() => Promise.resolve(jsonResponse({ seasons: mockSeasons })));
    const store = makeStore();

    await store.dispatch(
      seasonsApi.endpoints.searchSeasons.initiate('Discovery', {
        subscribe: true,
      })
    );
    expect(global.fetch).toHaveBeenCalledTimes(1);

    store.dispatch(
      seasonsApi.util.invalidateTags([{ type: 'Seasons', id: 'Discovery' }])
    );

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it('caches season details separately by uid', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve(
        jsonResponse({
          season: { ...mockSeasons[0], episodes: [] },
        })
      )
    );
    const store = makeStore();

    await store.dispatch(seasonsApi.endpoints.getSeasonDetails.initiate('1'));
    await store.dispatch(seasonsApi.endpoints.getSeasonDetails.initiate('1'));
    expect(global.fetch).toHaveBeenCalledTimes(1);

    await store.dispatch(seasonsApi.endpoints.getSeasonDetails.initiate('2'));
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});
