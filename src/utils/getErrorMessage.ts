import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { SerializedError } from '@reduxjs/toolkit';

type QueryError = FetchBaseQueryError | SerializedError;

/**
 * Converts an RTK Query error (either a transport/HTTP error or a serialized
 * runtime error) into a clear, human-readable message for display.
 */
export function getErrorMessage(error: QueryError | undefined): string {
  if (!error) {
    return '';
  }

  if ('status' in error) {
    if (typeof error.status === 'number') {
      return `Error: ${error.status}`;
    }
    if (error.status === 'FETCH_ERROR') {
      return 'Network error: unable to reach the server';
    }
    return error.error ?? 'Failed to load data';
  }

  return error.message ?? 'Something went wrong';
}
