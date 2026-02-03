import { configureStore } from '@reduxjs/toolkit';
import AuthSlice from './slices/AuthSlice';
 import adminSlice from './slices/AdminSlice';
 import websiteSlice from './slices/website';
 import courseSlice from './slices/course';
 import branchSlice from './slices/branch';
 import employeeSlice from './slices/employee';
 import inquiresSlice  from './slices/inquires';
 import commerceSlice from './slices/commerce';
 import examinationSlice from './slices/examination';

export const store = configureStore({
  reducer: {
    auth:AuthSlice,
    admin:adminSlice, 
    website: websiteSlice,
    course:courseSlice,
    branch:branchSlice,
    employee:employeeSlice,
    inquires:inquiresSlice,
    commerce:commerceSlice,
    examination:examinationSlice
  },
});