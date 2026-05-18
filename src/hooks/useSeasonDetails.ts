import { useState, useEffect } from 'react';
import type { SeasonDetails } from '../types/season';
import { seasonDetailsUrl } from '../constants';

export function useSeasonDetails(uid: string | undefined) {
  const [loading, setLoading] = useState(false);
  const [season, setSeason] = useState<SeasonDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uid) return;

    let cancelled = false;

    const loadDetails = async () => {
      await Promise.resolve();
      if (cancelled) return;

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(seasonDetailsUrl(uid));
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        if (!cancelled) {
          setSeason(data.season ?? null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Failed to fetch season details'
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadDetails();

    return () => {
      cancelled = true;
    };
  }, [uid]);

  if (!uid) {
    return { loading: false, season: null, error: null };
  }

  return { loading, season, error };
}
