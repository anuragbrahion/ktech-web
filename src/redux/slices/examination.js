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

  // Request Roles
  requestRolesListData: {},
  requestRolesUpdateStatusData: {},
  requestRolesAssignedData: {},

  // Request Leaves
  requestLeavesListData: {},
  requestLeavesUpdateStatusData: {},
  requestLeavesApplyData: {},

  // Request Goals
  requestGoalsListData: {},
  requestGoalsUpdateStatusData: {},
  requestGoalsAssignedData: {},

  assignEmployeeTeacherTaskData:{},
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
   Request Roles
========================= */

export const requestRolesList = createApiThunkPrivate(
  "requestRolesList",
  "/requests/roles/list",
  "GET",
);

export const requestRolesUpdateStatus = createApiThunkPrivate(
  "requestRolesUpdateStatus",
  "/requests/roles/update-status",
);

export const requestRolesAssigned = createApiThunkPrivate(
  "requestRolesAssigned",
  "/requests/roles/assigned",
  "GET",
);

export const assignEmployeeTeacherTask = createApiThunkPrivate(
  "assignEmployeeTeacherTask",
  "/employee/teachers/assign-task",
  "POST",
);


/* =========================
   Request Leaves
========================= */

export const requestLeavesList = createApiThunkPrivate(
  "requestLeavesList",
  "/requests/leaves/list",
  "GET",
);

export const requestLeavesUpdateStatus = createApiThunkPrivate(
  "requestLeavesUpdateStatus",
  "/requests/leaves/update-status",
);

export const requestLeavesApply = createApiThunkPrivate(
  "requestLeavesApply",
  "/requests/leaves/apply",
);

/* =========================
   Request Goals
========================= */

export const requestGoalsList = createApiThunkPrivate(
  "requestGoalsList",
  "/requests/goals/list",
  "GET",
);

export const requestGoalsUpdateStatus = createApiThunkPrivate(
  "requestGoalsUpdateStatus",
  "/requests/goals/update-status",
);

export const requestGoalsAssigned = createApiThunkPrivate(
  "requestGoalsAssigned",
  "/requests/goals/assigned",
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

    // Request Roles
    createExtraReducersForThunk(
      builder,
      requestRolesList,
      "requestRolesListData",
    );
    createExtraReducersForThunk(
      builder,
      requestRolesUpdateStatus,
      "requestRolesUpdateStatusData",
    );
    createExtraReducersForThunk(
      builder,
      requestRolesAssigned,
      "requestRolesAssignedData",
    );

    // Request Leaves
    createExtraReducersForThunk(
      builder,
      requestLeavesList,
      "requestLeavesListData",
    );
    createExtraReducersForThunk(
      builder,
      requestLeavesUpdateStatus,
      "requestLeavesUpdateStatusData",
    );
    createExtraReducersForThunk(
      builder,
      requestLeavesApply,
      "requestLeavesApplyData",
    );

    // Request Goals
    createExtraReducersForThunk(
      builder,
      requestGoalsList,
      "requestGoalsListData",
    );
    createExtraReducersForThunk(
      builder,
      requestGoalsUpdateStatus,
      "requestGoalsUpdateStatusData",
    );
    createExtraReducersForThunk(
      builder,
      requestGoalsAssigned,
      "requestGoalsAssignedData",
    );

     createExtraReducersForThunk(
      builder,
      assignEmployeeTeacherTask,
      "assignEmployeeTeacherTaskData",
    );
  },
});

export default examinationSlice.reducer;
