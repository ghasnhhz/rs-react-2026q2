'use client';

import { useState } from 'react';

interface ThrowErrorButtonProps {
  label: string;
  className?: string;
}

/** Throws during render to exercise the ErrorBoundary (parity with the old client view). */
function ThrowErrorButton({ label, className }: ThrowErrorButtonProps) {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error('Test error from Main component');
  }

  return (
    <button type="button" className={className} onClick={() => setShouldThrow(true)}>
      {label}
    </button>
  );
}

export default ThrowErrorButton;
