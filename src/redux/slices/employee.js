import { createSlice } from "@reduxjs/toolkit";
import {
  createApiThunkPrivate,
  createExtraReducersForThunk,
} from "../../utils/apiThunk";

const initialState = {
  /* =========================
     Departments
  ========================= */
  departmentsListData: {},
  departmentsAllDocumentsData: {},
  departmentsSingleDocumentData: {},
  enableDisableDepartmentsData: {},
  deleteDepartmentsData: {},
  createDepartmentsData: {},
  updateDepartmentsData: {},

  /* =========================
     Designations
  ========================= */
  designationsListData: {},
  designationsAllDocumentsData: {},
  designationsSingleDocumentData: {},
  enableDisableDesignationsData: {},
  deleteDesignationsData: {},
  createDesignationsData: {},
  updateDesignationsData: {},

  /* =========================
     Roles
  ========================= */
  rolesListData: {},
  rolesAllDocumentsData: {},
  rolesSingleDocumentData: {},
  enableDisableRolesData: {},
  deleteRolesData: {},
  createRolesData: {},
  updateRolesData: {},

  /* =========================
     Goals
  ========================= */
  goalsListData: {},
  goalsAllDocumentsData: {},
  goalsSingleDocumentData: {},
  enableDisableGoalsData: {},
  deleteGoalsData: {},
  createGoalsData: {},
  updateGoalsData: {},

  /* =========================
     Leave Types
  ========================= */
  leaveTypesListData: {},
  leaveTypesAllDocumentsData: {},
  leaveTypesSingleDocumentData: {},
  enableDisableLeaveTypesData: {},
  deleteLeaveTypesData: {},
  createLeaveTypesData: {},
  updateLeaveTypesData: {},
};

/* =========================
   Departments APIs
========================= */

export const departmentsList = createApiThunkPrivate(
  "departmentsList",
  "/employee/departments/list",
  "GET",
);

export const departmentsAllDocuments = createApiThunkPrivate(
  "departmentsAllDocuments",
  "/employee/departments/all-documents",
  "GET",
);

export const departmentsSingleDocument = createApiThunkPrivate(
  "departmentsSingleDocument",
  "/employee/departments/single-document",
  "GET",
);

export const enableDisableDepartments = createApiThunkPrivate(
  "enableDisableDepartments",
  "/employee/departments/enable-disable",
);

export const deleteDepartments = createApiThunkPrivate(
  "deleteDepartments",
  "/employee/departments/soft-delete",
  "DELETE",
);

export const createDepartments = createApiThunkPrivate(
  "createDepartments",
  "/employee/departments/create",
);

export const updateDepartments = createApiThunkPrivate(
  "updateDepartments",
  "/employee/departments/update",
);

/* =========================
   Designations APIs
========================= */

export const designationsList = createApiThunkPrivate(
  "designationsList",
  "/employee/designations/list",
  "GET",
);

export const designationsAllDocuments = createApiThunkPrivate(
  "designationsAllDocuments",
  "/employee/designations/all-documents",
  "GET",
);

export const designationsSingleDocument = createApiThunkPrivate(
  "designationsSingleDocument",
  "/employee/designations/single-document",
  "GET",
);

export const enableDisableDesignations = createApiThunkPrivate(
  "enableDisableDesignations",
  "/employee/designations/enable-disable",
);

export const deleteDesignations = createApiThunkPrivate(
  "deleteDesignations",
  "/employee/designations/soft-delete",
  "DELETE",
);

export const createDesignations = createApiThunkPrivate(
  "createDesignations",
  "/employee/designations/create",
);

export const updateDesignations = createApiThunkPrivate(
  "updateDesignations",
  "/employee/designations/update",
);

/* =========================
   Roles APIs
========================= */

export const rolesList = createApiThunkPrivate(
  "rolesList",
  "/employee/roles/list",
  "GET",
);

export const rolesAllDocuments = createApiThunkPrivate(
  "rolesAllDocuments",
  "/employee/roles/all-documents",
  "GET",
);

export const rolesSingleDocument = createApiThunkPrivate(
  "rolesSingleDocument",
  "/employee/roles/single-document",
  "GET",
);

export const enableDisableRoles = createApiThunkPrivate(
  "enableDisableRoles",
  "/employee/roles/enable-disable",
);

export const deleteRoles = createApiThunkPrivate(
  "deleteRoles",
  "/employee/roles/soft-delete",
  "DELETE",
);

export const createRoles = createApiThunkPrivate(
  "createRoles",
  "/employee/roles/create",
);

export const updateRoles = createApiThunkPrivate(
  "updateRoles",
  "/employee/roles/update",
);

/* =========================
   Goals APIs
========================= */

export const goalsList = createApiThunkPrivate(
  "goalsList",
  "/employee/goals/list",
  "GET",
);

export const goalsAllDocuments = createApiThunkPrivate(
  "goalsAllDocuments",
  "/employee/goals/all-documents",
  "GET",
);

export const goalsSingleDocument = createApiThunkPrivate(
  "goalsSingleDocument",
  "/employee/goals/single-document",
  "GET",
);

export const enableDisableGoals = createApiThunkPrivate(
  "enableDisableGoals",
  "/employee/goals/enable-disable",
);

export const deleteGoals = createApiThunkPrivate(
  "deleteGoals",
  "/employee/goals/soft-delete",
  "DELETE",
);

export const createGoals = createApiThunkPrivate(
  "createGoals",
  "/employee/goals/create",
);

export const updateGoals = createApiThunkPrivate(
  "updateGoals",
  "/employee/goals/update",
);

/* =========================
   Leave Types APIs
========================= */

export const leaveTypesList = createApiThunkPrivate(
  "leaveTypesList",
  "/employee/leave-types/list",
  "GET",
);

export const leaveTypesAllDocuments = createApiThunkPrivate(
  "leaveTypesAllDocuments",
  "/employee/leave-types/all-documents",
  "GET",
);

export const leaveTypesSingleDocument = createApiThunkPrivate(
  "leaveTypesSingleDocument",
  "/employee/leave-types/single-document",
  "GET",
);

export const enableDisableLeaveTypes = createApiThunkPrivate(
  "enableDisableLeaveTypes",
  "/employee/leave-types/enable-disable",
);

export const deleteLeaveTypes = createApiThunkPrivate(
  "deleteLeaveTypes",
  "/employee/leave-types/soft-delete",
  "DELETE",
);

export const createLeaveTypes = createApiThunkPrivate(
  "createLeaveTypes",
  "/employee/leave-types/create",
);

export const updateLeaveTypes = createApiThunkPrivate(
  "updateLeaveTypes",
  "/employee/leave-types/update",
);

/* =========================
   Slice
========================= */

export const employeeSlice = createSlice({
  name: "employee",
  initialState,
  extraReducers: (builder) => {
    // Departments
    createExtraReducersForThunk(builder, departmentsList, "departmentsListData");
    createExtraReducersForThunk(
      builder,
      departmentsAllDocuments,
      "departmentsAllDocumentsData",
    );
    createExtraReducersForThunk(
      builder,
      departmentsSingleDocument,
      "departmentsSingleDocumentData",
    );
    createExtraReducersForThunk(
      builder,
      enableDisableDepartments,
      "enableDisableDepartmentsData",
    );
    createExtraReducersForThunk(
      builder,
      deleteDepartments,
      "deleteDepartmentsData",
    );
    createExtraReducersForThunk(
      builder,
      createDepartments,
      "createDepartmentsData",
    );
    createExtraReducersForThunk(
      builder,
      updateDepartments,
      "updateDepartmentsData",
    );

    // Designations
    createExtraReducersForThunk(builder, designationsList, "designationsListData");
    createExtraReducersForThunk(
      builder,
      designationsAllDocuments,
      "designationsAllDocumentsData",
    );
    createExtraReducersForThunk(
      builder,
      designationsSingleDocument,
      "designationsSingleDocumentData",
    );
    createExtraReducersForThunk(
      builder,
      enableDisableDesignations,
      "enableDisableDesignationsData",
    );
    createExtraReducersForThunk(
      builder,
      deleteDesignations,
      "deleteDesignationsData",
    );
    createExtraReducersForThunk(
      builder,
      createDesignations,
      "createDesignationsData",
    );
    createExtraReducersForThunk(
      builder,
      updateDesignations,
      "updateDesignationsData",
    );

    // Roles
    createExtraReducersForThunk(builder, rolesList, "rolesListData");
    createExtraReducersForThunk(
      builder,
      rolesAllDocuments,
      "rolesAllDocumentsData",
    );
    createExtraReducersForThunk(
      builder,
      rolesSingleDocument,
      "rolesSingleDocumentData",
    );
    createExtraReducersForThunk(
      builder,
      enableDisableRoles,
      "enableDisableRolesData",
    );
    createExtraReducersForThunk(builder, deleteRoles, "deleteRolesData");
    createExtraReducersForThunk(builder, createRoles, "createRolesData");
    createExtraReducersForThunk(builder, updateRoles, "updateRolesData");

    // Goals
    createExtraReducersForThunk(builder, goalsList, "goalsListData");
    createExtraReducersForThunk(
      builder,
      goalsAllDocuments,
      "goalsAllDocumentsData",
    );
    createExtraReducersForThunk(
      builder,
      goalsSingleDocument,
      "goalsSingleDocumentData",
    );
    createExtraReducersForThunk(
      builder,
      enableDisableGoals,
      "enableDisableGoalsData",
    );
    createExtraReducersForThunk(builder, deleteGoals, "deleteGoalsData");
    createExtraReducersForThunk(builder, createGoals, "createGoalsData");
    createExtraReducersForThunk(builder, updateGoals, "updateGoalsData");

    // Leave Types
    createExtraReducersForThunk(
      builder,
      leaveTypesList,
      "leaveTypesListData",
    );
    createExtraReducersForThunk(
      builder,
      leaveTypesAllDocuments,
      "leaveTypesAllDocumentsData",
    );
    createExtraReducersForThunk(
      builder,
      leaveTypesSingleDocument,
      "leaveTypesSingleDocumentData",
    );
    createExtraReducersForThunk(
      builder,
      enableDisableLeaveTypes,
      "enableDisableLeaveTypesData",
    );
    createExtraReducersForThunk(
      builder,
      deleteLeaveTypes,
      "deleteLeaveTypesData",
    );
    createExtraReducersForThunk(
      builder,
      createLeaveTypes,
      "createLeaveTypesData",
    );
    createExtraReducersForThunk(
      builder,
      updateLeaveTypes,
      "updateLeaveTypesData",
    );
  },
});

export default employeeSlice.reducer;
