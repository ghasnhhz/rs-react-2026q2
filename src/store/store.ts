import { configureStore } from '@reduxjs/toolkit';
import selectedItemsReducer from './slices/selectedItemsSlice';
import { seasonsApi } from './api/seasonsApi';

export const store = configureStore({
  reducer: {
    selectedItems: selectedItemsReducer,
    [seasonsApi.reducerPath]: seasonsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(seasonsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
