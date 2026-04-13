import { createSlice } from "@reduxjs/toolkit";
import { createApiThunkPrivate } from "../../utils/apiThunk";

// API Thunks
export const getRoleExamsList = createApiThunkPrivate(
  "getRoleExamsList",
  "/examinations/list",
  "GET"
);

export const createRoleExam = createApiThunkPrivate(
  "createRoleExam",
  "/examinations/role/create",
  "POST"
);

export const updateRoleExam = createApiThunkPrivate(
  "updateRoleExam",
  "/examinations/role/update",
  "PUT"
);

const examSlice = createSlice({
  name: "exam",
  initialState: {
    getRoleExamsListData: {},
    createRoleExamData: {},
    updateRoleExamData: {},
    loading: false,
    error: null,
  },
  reducers: {
    clearExamData: (state) => {
      state.getRoleExamsListData = {};
      state.createRoleExamData = {};
      state.updateRoleExamData = {};
    },
  },
  extraReducers: (builder) => {
    // Get Role Exams List
    builder.addCase(getRoleExamsList.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getRoleExamsList.fulfilled, (state, action) => {
      state.loading = false;
      state.getRoleExamsListData = action.payload;
    });
    builder.addCase(getRoleExamsList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // Create Role Exam
    builder.addCase(createRoleExam.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createRoleExam.fulfilled, (state, action) => {
      state.loading = false;
      state.createRoleExamData = action.payload;
    });
    builder.addCase(createRoleExam.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // Update Role Exam
    builder.addCase(updateRoleExam.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateRoleExam.fulfilled, (state, action) => {
      state.loading = false;
      state.updateRoleExamData = action.payload;
    });
    builder.addCase(updateRoleExam.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export const { clearExamData } = examSlice.actions;
export default examSlice.reducer;