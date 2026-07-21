import { describe, it, expect } from 'vitest';
import reducer, {
  toggleItem,
  addItem,
  removeItem,
  clearItems,
} from '../selectedItemsSlice';
import type { Season } from '../../../types/season';

const mockSeason: Season = {
  uid: '1',
  title: 'DIS Season 1',
  series: { uid: '101', title: 'Star Trek: Discovery' },
  numberOfEpisodes: 15,
};

const mockSeason2: Season = {
  uid: '2',
  title: 'DIS Season 2',
  series: { uid: '101', title: 'Star Trek: Discovery' },
  numberOfEpisodes: 14,
};

describe('selectedItemsSlice', () => {
  it('returns initial state', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual({ items: [] });
  });

  describe('toggleItem', () => {
    it('adds item when not present', () => {
      const state = reducer(undefined, toggleItem(mockSeason));
      expect(state.items).toHaveLength(1);
      expect(state.items[0].uid).toBe('1');
    });

    it('removes item when already present', () => {
      const state = reducer({ items: [mockSeason] }, toggleItem(mockSeason));
      expect(state.items).toHaveLength(0);
    });

    it('only removes the matching item, leaving others', () => {
      const state = reducer({ items: [mockSeason, mockSeason2] }, toggleItem(mockSeason));
      expect(state.items).toHaveLength(1);
      expect(state.items[0].uid).toBe('2');
    });
  });

  describe('addItem', () => {
    it('adds item when not present', () => {
      const state = reducer(undefined, addItem(mockSeason));
      expect(state.items).toHaveLength(1);
    });

    it('does not duplicate an existing item', () => {
      const state = reducer({ items: [mockSeason] }, addItem(mockSeason));
      expect(state.items).toHaveLength(1);
    });
  });

  describe('removeItem', () => {
    it('removes item by uid', () => {
      const state = reducer({ items: [mockSeason, mockSeason2] }, removeItem('1'));
      expect(state.items).toHaveLength(1);
      expect(state.items[0].uid).toBe('2');
    });

    it('does nothing when uid not found', () => {
      const state = reducer({ items: [mockSeason] }, removeItem('999'));
      expect(state.items).toHaveLength(1);
    });
  });

  describe('clearItems', () => {
    it('empties the list', () => {
      const state = reducer({ items: [mockSeason, mockSeason2] }, clearItems());
      expect(state.items).toHaveLength(0);
    });

    it('handles already-empty list', () => {
      const state = reducer({ items: [] }, clearItems());
      expect(state.items).toHaveLength(0);
    });
  });
});
