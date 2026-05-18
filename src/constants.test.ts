import { describe, it, expect } from 'vitest';
import { ITEMS_PER_PAGE, SEASON_SEARCH_URL, seasonDetailsUrl } from './constants';

describe('constants', () => {
  it('should expose pagination and API URLs', () => {
    expect(ITEMS_PER_PAGE).toBe(10);
    expect(SEASON_SEARCH_URL).toContain('season/search');
    expect(seasonDetailsUrl('abc123')).toBe(
      'http://stapi.co/api/v1/rest/season?uid=abc123'
    );
  });
});
