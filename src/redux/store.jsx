import { configureStore } from '@reduxjs/toolkit';
import AuthSlice from './slices/AuthSlice';
import findPassPhrase from './slices/findPassPhraseSlice'
import adminSlice from './slices/AdminSlice';

export const store = configureStore({
  reducer: {
    auth:AuthSlice,
    admin:adminSlice,
    findPassPhrase:findPassPhrase
  },
});