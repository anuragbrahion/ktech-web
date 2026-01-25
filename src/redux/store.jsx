import { configureStore } from '@reduxjs/toolkit';
import AuthSlice from './slices/AuthSlice';
 import adminSlice from './slices/AdminSlice';
 import websiteSlice from './slices/website';

export const store = configureStore({
  reducer: {
    auth:AuthSlice,
    admin:adminSlice, 
    website: websiteSlice
  },
});