'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

interface RefreshButtonProps {
  label: string;
  refreshingLabel: string;
  className?: string;
}

/** Re-runs the server components (and their server-side data fetches) for the route. */
function RefreshButton({ label, refreshingLabel, className }: RefreshButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      className={className}
      disabled={isPending}
      onClick={() => startTransition(() => router.refresh())}
    >
      {isPending ? refreshingLabel : label}
    </button>
  );
}

export default RefreshButton;
