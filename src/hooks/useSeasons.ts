import { useState, useEffect } from 'react';
import type { Season } from '../types/season';
import { SEASON_SEARCH_URL } from '../constants';

export function useSeasons(searchTerm: string) {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Season[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadSeasons = async () => {
      await Promise.resolve();
      if (cancelled) return;

      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (searchTerm) {
          params.append('title', searchTerm);
        }

        const response = await fetch(SEASON_SEARCH_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: params,
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        if (!cancelled) {
          setResults(data.seasons || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to fetch seasons');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadSeasons();

    return () => {
      cancelled = true;
    };
  }, [searchTerm]);

  return { loading, results, error };
}
