import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Season, SeasonDetails } from '../../types/season';
import { STAPI_BASE_URL } from '../../constants';

const DEFAULT_CACHE_TTL = 60;
const CACHE_TTL = Number(import.meta.env.VITE_CACHE_TTL) || DEFAULT_CACHE_TTL;

interface SeasonSearchResponse {
  seasons?: Season[];
}

interface SeasonDetailsResponse {
  season?: SeasonDetails;
}

export const seasonsApi = createApi({
  reducerPath: 'seasonsApi',
  baseQuery: fetchBaseQuery({ baseUrl: STAPI_BASE_URL }),
  tagTypes: ['Seasons', 'SeasonDetails'],
  keepUnusedDataFor: CACHE_TTL,
  endpoints: (builder) => ({
    searchSeasons: builder.query<Season[], string>({
      query: (searchTerm) => ({
        url: '/season/search',
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: searchTerm ? `title=${encodeURIComponent(searchTerm)}` : '',
      }),
      transformResponse: (response: SeasonSearchResponse) => response.seasons ?? [],
      providesTags: (_result, _error, searchTerm) => [
        { type: 'Seasons', id: searchTerm || 'ALL' },
      ],
    }),
    getSeasonDetails: builder.query<SeasonDetails | null, string>({
      query: (uid) => `/season?uid=${uid}`,
      transformResponse: (response: SeasonDetailsResponse) => response.season ?? null,
      providesTags: (_result, _error, uid) => [{ type: 'SeasonDetails', id: uid }],
    }),
  }),
});

export const { useSearchSeasonsQuery, useGetSeasonDetailsQuery } = seasonsApi;
