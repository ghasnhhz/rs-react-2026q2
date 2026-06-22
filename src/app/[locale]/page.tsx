import { setRequestLocale } from 'next-intl/server';
import SearchResultsView from '@/components/SearchResultsView';
import { searchSeasons, getSeasonDetails } from '@/lib/seasons';
import { ITEMS_PER_PAGE } from '@/constants';
import type { Season, SeasonDetails } from '@/types/season';

interface HomePageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function HomePage({ params, searchParams }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const sp = await searchParams;
  const q = firstParam(sp.q)?.trim() ?? '';
  const detailsId = firstParam(sp.details);
  const pageParam = Number(firstParam(sp.page));

  let seasons: Season[] = [];
  let listError = false;
  try {
    seasons = await searchSeasons(q);
  } catch {
    listError = true;
  }

  const totalPages = Math.max(1, Math.ceil(seasons.length / ITEMS_PER_PAGE));
  const currentPage =
    Number.isInteger(pageParam) && pageParam >= 1 ? Math.min(pageParam, totalPages) : 1;
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleSeasons = seasons.slice(start, start + ITEMS_PER_PAGE);

  let season: SeasonDetails | null = null;
  let detailsError = false;
  if (detailsId) {
    try {
      season = await getSeasonDetails(detailsId);
    } catch {
      detailsError = true;
    }
  }

  // Search params preserved across navigation (search term, page, open details panel).
  const query: Record<string, string> = {};
  if (q) query.q = q;
  if (currentPage > 1) query.page = String(currentPage);
  if (detailsId) query.details = detailsId;

  return (
    <SearchResultsView
      seasons={visibleSeasons}
      currentPage={currentPage}
      totalPages={totalPages}
      query={query}
      detailsId={detailsId}
      season={season}
      listError={listError}
      detailsError={detailsError}
    />
  );
}
