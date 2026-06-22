import type { NextRequest } from 'next/server';
import type { Season } from '../../../types/season';
import { buildSeasonsCsv } from '../../../lib/csv';

function isSeason(value: unknown): value is Season {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.uid === 'string' &&
    typeof candidate.title === 'string' &&
    typeof candidate.series === 'object' &&
    candidate.series !== null
  );
}

function parseItems(raw: FormDataEntryValue | null): Season[] {
  if (typeof raw !== 'string') return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isSeason) : [];
  } catch {
    return [];
  }
}

export async function POST(request: NextRequest): Promise<Response> {
  const formData = await request.formData();
  const items = parseItems(formData.get('items'));

  if (items.length === 0) {
    return new Response('No items selected', { status: 400 });
  }

  const csv = buildSeasonsCsv(items);

  return new Response(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv;charset=utf-8',
      'Content-Disposition': `attachment; filename="${items.length}_items.csv"`,
    },
  });
}
