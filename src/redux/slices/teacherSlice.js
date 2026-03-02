import { createSlice } from "@reduxjs/toolkit";
import {
  createApiThunkPrivate,
  createExtraReducersForThunk,
} from "../../utils/apiThunk";
const initialState = {
  getIncentiveListData: {},
  getMyAttendanceListData: {},
  getLeavesListData: {},
  getAttendanceListData: {},
  getMyTasksListData: {},
  getAssignedRoleListData: {},
  getAssignedGoalListData: {},
};

export const getIncentiveList = createApiThunkPrivate(
  "getIncentiveList",
  "/employee/teachers/my-incentives",
  "GET",
);

export const getMyAttendanceList = createApiThunkPrivate(
  "getMyAttendanceList",
  "/attendances/teachers/my-attendances",
  "GET",
);

export const getLeavesList = createApiThunkPrivate(
  "getLeavesList",
  "/requests/leaves/list",
  "GET",
);

export const applyLeaveRequest = createApiThunkPrivate(
  "applyLeaveRequest",
  "/requests/leaves/apply",
  "POST",
);

export const getAttendanceList = createApiThunkPrivate(
  "getAttendanceList",
  "/attendances/list",
  "GET",
);

export const getMyTasksList = createApiThunkPrivate(
  "getMyTasksList",
  "/employee/teachers/tasks",
  "GET",
);

export const updateTaskStatus = createApiThunkPrivate(
  "updateTaskStatus",
  "/employee/teachers/update-task",
  "POST",
);

export const getAssignedRoleList = createApiThunkPrivate(
  "getAssignedRoleList",
  "/requests/roles/assigned",
  "GET",
);

export const requestApprovalForRole = createApiThunkPrivate(
  "requestApprovalForRole",
  "/requests/roles/request-approval",
  "POST",
);

export const getAssignedGoalList = createApiThunkPrivate(
  "getAssignedGoalList",
  "/requests/goals/assigned",
  "GET",
);

export const requestApprovalForGoal = createApiThunkPrivate(
  "requestApprovalForGoal",
  "/requests/goals/request-approval",
  "POST",
);

export const teacherSlice = createSlice({
  name: "teacher",
  initialState,
  extraReducers: (builder) => {
    createExtraReducersForThunk(
      builder,
      getIncentiveList,
      "getIncentiveListData",
    );
    createExtraReducersForThunk(
      builder,
      getMyAttendanceList,
      "getMyAttendanceListData",
    );
    createExtraReducersForThunk(builder, getLeavesList, "getLeavesListData");
    createExtraReducersForThunk(
      builder,
      getAttendanceList,
      "getAttendanceListData",
    );
    createExtraReducersForThunk(builder, getMyTasksList, "getMyTasksListData");
    createExtraReducersForThunk(
      builder,
      getAssignedRoleList,
      "getAssignedRoleListData",
    );
    createExtraReducersForThunk(
      builder,
      getAssignedGoalList,
      "getAssignedGoalListData",
    );
  },
});

export const { logout } = teacherSlice.actions;
export default teacherSlice.reducer;
