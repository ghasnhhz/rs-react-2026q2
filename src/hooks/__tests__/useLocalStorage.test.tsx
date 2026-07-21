import { render, screen, fireEvent } from '@testing-library/react';
import { readLocalStorage, SEARCH_TERM_KEY, useLocalStorage } from '../useLocalStorage';
import { describe, it, expect, beforeEach, vi } from 'vitest';

function StorageHarness() {
  const { value, setValue, saveValue } = useLocalStorage(SEARCH_TERM_KEY, '');

  return (
    <div>
      <input aria-label="storage-input" value={value} onChange={(e) => setValue(e.target.value)} />
      <button type="button" onClick={() => saveValue()}>
        Save
      </button>
      <button type="button" onClick={() => saveValue('saved-term')}>
        Save explicit
      </button>
    </div>
  );
}

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should read initial value from localStorage', () => {
    localStorage.setItem(SEARCH_TERM_KEY, 'Discovery');
    expect(readLocalStorage(SEARCH_TERM_KEY)).toBe('Discovery');
  });

  it('should update value in memory without persisting until save', () => {
    render(<StorageHarness />);

    fireEvent.change(screen.getByLabelText('storage-input'), {
      target: { value: 'Voyager' },
    });

    expect(screen.getByLabelText('storage-input')).toHaveValue('Voyager');
    expect(localStorage.getItem(SEARCH_TERM_KEY)).toBeNull();
  });

  it('should persist value when saveValue is called', () => {
    render(<StorageHarness />);

    fireEvent.click(screen.getByRole('button', { name: /^save$/i }));
    expect(localStorage.getItem(SEARCH_TERM_KEY)).toBe('');

    fireEvent.click(screen.getByRole('button', { name: /save explicit/i }));
    expect(localStorage.getItem(SEARCH_TERM_KEY)).toBe('saved-term');
  });

  it('should return initial value when localStorage throws', () => {
    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });

    expect(readLocalStorage('any-key', 'fallback')).toBe('fallback');
    getItemSpy.mockRestore();
  });
});
