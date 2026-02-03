import { createSlice } from "@reduxjs/toolkit";
import {
  createApiThunkPrivate,
  createExtraReducersForThunk,
} from "../../utils/apiThunk";

const initialState = {
  // Examinations
  examinationsListData: {},
  examinationsSingleDocumentData: {},

  // Roles
  createExaminationRoleData: {},
  updateExaminationRoleData: {},

  // Goals
  createExaminationGoalData: {},
  updateExaminationGoalData: {},

  // Students
  createExaminationStudentData: {},
  updateExaminationStudentData: {},

  // Results
  examinationsResultListData: {},
  examinationsResultViewData: {},
};

/* =========================
   Examinations
========================= */

export const examinationsList = createApiThunkPrivate(
  "examinationsList",
  "/examinations/list",
  "GET",
);

export const examinationsSingleDocument = createApiThunkPrivate(
  "examinationsSingleDocument",
  "/examinations/single-document",
  "GET",
);

/* =========================
   Roles
========================= */

export const createExaminationRole = createApiThunkPrivate(
  "createExaminationRole",
  "/examinations/role/create",
);

export const updateExaminationRole = createApiThunkPrivate(
  "updateExaminationRole",
  "/examinations/role/update",
);

/* =========================
   Goals
========================= */

export const createExaminationGoal = createApiThunkPrivate(
  "createExaminationGoal",
  "/examinations/goal/create",
);

export const updateExaminationGoal = createApiThunkPrivate(
  "updateExaminationGoal",
  "/examinations/goal/update",
);

/* =========================
   Students
========================= */

export const createExaminationStudent = createApiThunkPrivate(
  "createExaminationStudent",
  "/examinations/student/create",
);

export const updateExaminationStudent = createApiThunkPrivate(
  "updateExaminationStudent",
  "/examinations/student/update",
);

/* =========================
   Results
========================= */

export const examinationsResultList = createApiThunkPrivate(
  "examinationsResultList",
  "/examinations/result/list",
  "GET",
);

export const examinationsResultView = createApiThunkPrivate(
  "examinationsResultView",
  "/examinations/result/view",
  "GET",
);

/* =========================
   Slice
========================= */

export const examinationSlice = createSlice({
  name: "examination",
  initialState,
  extraReducers: (builder) => {
    // Examinations
    createExtraReducersForThunk(
      builder,
      examinationsList,
      "examinationsListData",
    );
    createExtraReducersForThunk(
      builder,
      examinationsSingleDocument,
      "examinationsSingleDocumentData",
    );

    // Roles
    createExtraReducersForThunk(
      builder,
      createExaminationRole,
      "createExaminationRoleData",
    );
    createExtraReducersForThunk(
      builder,
      updateExaminationRole,
      "updateExaminationRoleData",
    );

    // Goals
    createExtraReducersForThunk(
      builder,
      createExaminationGoal,
      "createExaminationGoalData",
    );
    createExtraReducersForThunk(
      builder,
      updateExaminationGoal,
      "updateExaminationGoalData",
    );

    // Students
    createExtraReducersForThunk(
      builder,
      createExaminationStudent,
      "createExaminationStudentData",
    );
    createExtraReducersForThunk(
      builder,
      updateExaminationStudent,
      "updateExaminationStudentData",
    );

    // Results
    createExtraReducersForThunk(
      builder,
      examinationsResultList,
      "examinationsResultListData",
    );
    createExtraReducersForThunk(
      builder,
      examinationsResultView,
      "examinationsResultViewData",
    );
  },
});

export default examinationSlice.reducer;
