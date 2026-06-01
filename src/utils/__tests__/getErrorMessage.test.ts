import { describe, it, expect } from 'vitest';
import { getErrorMessage } from '../getErrorMessage';

describe('getErrorMessage', () => {
  it('returns an empty string when there is no error', () => {
    expect(getErrorMessage(undefined)).toBe('');
  });

  it('formats HTTP status errors', () => {
    expect(getErrorMessage({ status: 500, data: {} })).toBe('Error: 500');
  });

  it('reports a network error for FETCH_ERROR', () => {
    expect(getErrorMessage({ status: 'FETCH_ERROR', error: 'failed' })).toBe(
      'Network error: unable to reach the server'
    );
  });

  it('falls back to the error field for other transport errors', () => {
    expect(
      getErrorMessage({
        status: 'PARSING_ERROR',
        originalStatus: 200,
        data: '',
        error: 'Bad JSON',
      })
    ).toBe('Bad JSON');
  });

  it('uses the message of a serialized runtime error', () => {
    expect(getErrorMessage({ message: 'Something exploded' })).toBe(
      'Something exploded'
    );
  });

  it('falls back to a generic message for an empty serialized error', () => {
    expect(getErrorMessage({})).toBe('Something went wrong');
  });
});
