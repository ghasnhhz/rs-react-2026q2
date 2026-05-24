import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useSeasons } from '../useSeasons';

describe('useSeasons', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('starts with loading false and empty results', () => {
    global.fetch = vi.fn((): Promise<Response> => new Promise(() => {}));
    const { result } = renderHook(() => useSeasons(''));
    expect(result.current.results).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('returns seasons from response', async () => {
    const seasons = [
      { uid: '1', title: 'DIS Season 1', series: { uid: '101', title: 'Discovery' }, numberOfEpisodes: 15 },
    ];
    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: true, json: async () => ({ seasons }) } as Response)
    );

    const { result } = renderHook(() => useSeasons(''));

    await waitFor(() => expect(result.current.results).toHaveLength(1));
    expect(result.current.results).toEqual(seasons);
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('falls back to empty array when data.seasons is missing', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: true, json: async () => ({}) } as Response)
    );

    const { result } = renderHook(() => useSeasons(''));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.results).toEqual([]);
  });

  it('sets error message on failed response', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: false, status: 404, json: async () => ({}) } as Response)
    );

    const { result } = renderHook(() => useSeasons(''));

    await waitFor(() => expect(result.current.error).not.toBeNull());
    expect(result.current.error).toBe('Error: 404');
  });

  it('uses "Failed to fetch seasons" for non-Error rejections', async () => {
    global.fetch = vi.fn(() => Promise.reject('network down'));

    const { result } = renderHook(() => useSeasons(''));

    await waitFor(() => expect(result.current.error).not.toBeNull());
    expect(result.current.error).toBe('Failed to fetch seasons');
  });

  it('omits title param when searchTerm is empty', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: true, json: async () => ({ seasons: [] }) } as Response)
    );

    renderHook(() => useSeasons(''));

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    const [, options] = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0] as [string, RequestInit];
    expect((options.body as URLSearchParams).toString()).toBe('');
  });

  it('includes title param when searchTerm is provided', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: true, json: async () => ({ seasons: [] }) } as Response)
    );

    renderHook(() => useSeasons('Voyager'));

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    const [, options] = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0] as [string, RequestInit];
    expect((options.body as URLSearchParams).toString()).toContain('title=Voyager');
  });
});
