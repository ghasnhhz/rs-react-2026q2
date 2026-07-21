import 'server-only';
import type { Season, SeasonDetails } from '../types/season';
import { SEASON_SEARCH_URL, seasonDetailsUrl } from '../constants';

const DEFAULT_CACHE_TTL = 60;
const CACHE_TTL = Number(process.env.NEXT_PUBLIC_CACHE_TTL) || DEFAULT_CACHE_TTL;

interface SeasonSearchResponse {
  seasons?: Season[];
}

interface SeasonDetailsResponse {
  season?: SeasonDetails;
}

/** Server-side search mirroring the former RTK Query `searchSeasons` endpoint. */
export async function searchSeasons(searchTerm: string): Promise<Season[]> {
  const response = await fetch(SEASON_SEARCH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: searchTerm ? `title=${encodeURIComponent(searchTerm)}` : '',
    next: { revalidate: CACHE_TTL },
  });

  if (!response.ok) {
    throw new Error(`Failed to load seasons (${response.status})`);
  }

  const data: SeasonSearchResponse = await response.json();
  return data.seasons ?? [];
}

/** Server-side detail fetch mirroring the former RTK Query `getSeasonDetails` endpoint. */
export async function getSeasonDetails(uid: string): Promise<SeasonDetails | null> {
  const response = await fetch(seasonDetailsUrl(uid), {
    next: { revalidate: CACHE_TTL },
  });

  if (!response.ok) {
    throw new Error(`Failed to load season details (${response.status})`);
  }

  const data: SeasonDetailsResponse = await response.json();
  return data.season ?? null;
}
