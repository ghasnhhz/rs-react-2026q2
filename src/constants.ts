export const ITEMS_PER_PAGE = 10;

export const SEASON_SEARCH_URL = 'https://stapi.co/api/v1/rest/season/search';

export const seasonDetailsUrl = (uid: string) =>
  `https://stapi.co/api/v1/rest/season?uid=${uid}`;
