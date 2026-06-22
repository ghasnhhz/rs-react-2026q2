import { notFound } from 'next/navigation';

// Catch-all within the locale segment so unknown locale-prefixed routes render the
// localized not-found page (the documented next-intl pattern).
export default function CatchAllPage(): never {
  notFound();
}
