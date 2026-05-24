import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useSeasonDetails } from '../useSeasonDetails';

describe('useSeasonDetails', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns null state immediately when uid is undefined', () => {
    const { result } = renderHook(() => useSeasonDetails(undefined));
    expect(result.current).toEqual({ loading: false, season: null, error: null });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('fetches and returns season when uid is provided', async () => {
    const mockSeason = {
      uid: '1',
      title: 'DIS Season 1',
      series: { uid: '101', title: 'Discovery' },
      numberOfEpisodes: 15,
    };
    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: true, json: async () => ({ season: mockSeason }) } as Response)
    );

    const { result } = renderHook(() => useSeasonDetails('1'));

    await waitFor(() => expect(result.current.season).not.toBeNull());
    expect(result.current.season).toEqual(mockSeason);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('returns null for season when data.season is undefined', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: true, json: async () => ({}) } as Response)
    );

    const { result } = renderHook(() => useSeasonDetails('1'));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.season).toBeNull();
  });

  it('sets error on failed response', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: false, status: 500, json: async () => ({}) } as Response)
    );

    const { result } = renderHook(() => useSeasonDetails('1'));

    await waitFor(() => expect(result.current.error).not.toBeNull());
    expect(result.current.error).toBe('Error: 500');
  });

  it('uses "Failed to fetch season details" for non-Error rejections', async () => {
    global.fetch = vi.fn(() => Promise.reject('network down'));

    const { result } = renderHook(() => useSeasonDetails('1'));

    await waitFor(() => expect(result.current.error).not.toBeNull());
    expect(result.current.error).toBe('Failed to fetch season details');
  });
});
