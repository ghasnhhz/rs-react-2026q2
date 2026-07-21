import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Season } from '../../types/season';

interface SelectedItemsState {
  items: Season[];
}

const initialState: SelectedItemsState = {
  items: [],
};

const selectedItemsSlice = createSlice({
  name: 'selectedItems',
  initialState,
  reducers: {
    toggleItem: (state, action: PayloadAction<Season>) => {
      const index = state.items.findIndex((item) => item.uid === action.payload.uid);
      if (index > -1) {
        state.items.splice(index, 1);
      } else {
        state.items.push(action.payload);
      }
    },
    addItem: (state, action: PayloadAction<Season>) => {
      const exists = state.items.find((item) => item.uid === action.payload.uid);
      if (!exists) {
        state.items.push(action.payload);
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.uid !== action.payload);
    },
    clearItems: (state) => {
      state.items = [];
    },
  },
});

export const { toggleItem, addItem, removeItem, clearItems } = selectedItemsSlice.actions;
export default selectedItemsSlice.reducer;