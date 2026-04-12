import { createSlice } from "@reduxjs/toolkit";
import {
  createApiThunkPrivate,
  createExtraReducersForThunk,
} from "../../utils/apiThunk";
const initialState = {
  getStudentOverviewData: {},
  getStudentCoursesListData: {},
  getStudentExamsListData: {},
  getStudentExamsQueData:{},
  getMyDashboardData : {}
};

export const getStudentOverview = createApiThunkPrivate(
  "getStudentOverview",
  "/students/overview",
  "GET",
);

export const getStudentCoursesList = createApiThunkPrivate(
  "getStudentCoursesList",
  "/students/my-courses",
  "GET",
);

export const getStudentExamsList = createApiThunkPrivate(
  "getStudentExamsList",
  "/examinations/student/my-exams",
  "GET",
);

export const getStudentExamsQue = createApiThunkPrivate(
  "getStudentExamsQue",
  "/examinations/student/",
  "GET",
);

export const studentExamsListDetails = createApiThunkPrivate(
  "studentExamsListDetails",
  "/examinations/student",
  "GET",
);

export const studentExamsSubmit = createApiThunkPrivate(
  "studentExamsSubmit",
  "/examinations/submit",
  "GET",
);

export const getMyDashboard = createApiThunkPrivate(
  "getMyDashboard",
  "/users/my-dashboard",
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
    createExtraReducersForThunk(
      builder,
      getStudentCoursesList,
      "getStudentCoursesListData",
    );
    createExtraReducersForThunk(
      builder,
      getStudentExamsList,
      "getStudentExamsListData",
    );
    createExtraReducersForThunk(
      builder,
      getStudentExamsQue,
      "getStudentExamsQueData",
    );

    createExtraReducersForThunk(
      builder,
      getMyDashboard,
      "getMyDashboardData",
    );
  },
});

export const { logout } = studentSlice.actions;
export default studentSlice.reducer;
