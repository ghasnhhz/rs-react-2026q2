import type { Season } from '../types/season';
import { seasonDetailsUrl } from '../constants';

const CSV_HEADERS = ['Title', 'Series', 'Season Number', 'Episodes', 'Details URL'];

const escapeCell = (value: string): string => `"${value.replace(/"/g, '""')}"`;

export function buildSeasonsCsv(items: Season[]): string {
  const rows = items.map((item) => [
    escapeCell(item.title),
    escapeCell(item.series.title),
    item.seasonNumber ?? '',
    item.numberOfEpisodes ?? 'N/A',
    seasonDetailsUrl(item.uid),
  ]);

  return [CSV_HEADERS.join(','), ...rows.map((row) => row.join(','))].join('\n');
}
