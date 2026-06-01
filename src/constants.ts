export const ITEMS_PER_PAGE = 10;

export const STAPI_BASE_URL = 'https://stapi.co/api/v1/rest';

export const SEASON_SEARCH_URL = `${STAPI_BASE_URL}/season/search`;

export const seasonDetailsUrl = (uid: string) =>
  `${STAPI_BASE_URL}/season?uid=${uid}`;
