import { createSlice } from "@reduxjs/toolkit";
import {
  createApiThunkPrivate,
  createExtraReducersForThunk,
} from "../../utils/apiThunk";
const initialState = {
  getStudentOverviewData: {},
};

export const getStudentOverview = createApiThunkPrivate(
  "getStudentOverview",
  "/students/overview",
  "GET",
);

export const studentSlice = createSlice({
  name: "teacher",
  initialState,
  extraReducers: (builder) => {
    createExtraReducersForThunk(
      builder,
      getStudentOverview,
      "getStudentOverviewData",
    );
  },
});

export const { logout } = studentSlice.actions;
export default studentSlice.reducer;
