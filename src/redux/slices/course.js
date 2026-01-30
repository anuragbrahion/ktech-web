import { createSlice } from "@reduxjs/toolkit";
import {
  createApiThunkPrivate,
  createExtraReducersForThunk,
} from "../../utils/apiThunk";

const initialState = {
  // Courses
  coursesListData: {},
  coursesAllDocumentsData: {},
  coursesSingleDocumentData: {},
  enableDisableCoursesData: {},
  deleteCoursesData: {},
  createCoursesData: {},
  updateCoursesData: {},

  // Course Plans
  coursePlansListData: {},
  coursePlansAllDocumentsData: {},
  coursePlansSingleDocumentData: {},
  enableDisableCoursePlansData: {},
  deleteCoursePlansData: {},
  createCoursePlansData: {},
  updateCoursePlansData: {},

  // Course Batches
  courseBatchesListData: {},
  courseBatchesAllDocumentsData: {},
  courseBatchesSingleDocumentData: {},
  enableDisableCourseBatchesData: {},
  deleteCourseBatchesData: {},
  createCourseBatchesData: {},
  updateCourseBatchesData: {},
};

/* =========================
   Courses
========================= */

export const coursesList = createApiThunkPrivate(
  "coursesList",
  "/courses/list",
  "GET",
);

export const coursesAllDocuments = createApiThunkPrivate(
  "coursesAllDocuments",
  "/courses/all-documents",
  "GET",
);

export const coursesSingleDocument = createApiThunkPrivate(
  "coursesSingleDocument",
  "/courses/single-document",
  "GET",
);

export const enableDisableCourses = createApiThunkPrivate(
  "enableDisableCourses",
  "/courses/enable-disable",
);

export const deleteCourses = createApiThunkPrivate(
  "deleteCourses",
  "/courses/soft-delete",
  "DELETE",
);

export const createCourses = createApiThunkPrivate(
  "createCourses",
  "/courses/create",
);

export const updateCourses = createApiThunkPrivate(
  "updateCourses",
  "/courses/update",
);

/* =========================
   Course Plans
========================= */

export const coursePlansList = createApiThunkPrivate(
  "coursePlansList",
  "/courses/plans/list",
  "GET",
);

export const coursePlansAllDocuments = createApiThunkPrivate(
  "coursePlansAllDocuments",
  "/courses/plans/all-documents",
  "GET",
);

export const coursePlansSingleDocument = createApiThunkPrivate(
  "coursePlansSingleDocument",
  "/courses/plans/single-document",
  "GET",
);

export const enableDisableCoursePlans = createApiThunkPrivate(
  "enableDisableCoursePlans",
  "/courses/plans/enable-disable",
);

export const deleteCoursePlans = createApiThunkPrivate(
  "deleteCoursePlans",
  "/courses/plans/soft-delete",
  "DELETE",
);

export const createCoursePlans = createApiThunkPrivate(
  "createCoursePlans",
  "/courses/plans/create",
);

export const updateCoursePlans = createApiThunkPrivate(
  "updateCoursePlans",
  "/courses/plans/update",
);

/* =========================
   Course Batches
========================= */

export const courseBatchesList = createApiThunkPrivate(
  "courseBatchesList",
  "/courses/batches/list",
  "GET",
);

export const courseBatchesAllDocuments = createApiThunkPrivate(
  "courseBatchesAllDocuments",
  "/courses/batches/all-documents",
  "GET",
);

export const courseBatchesSingleDocument = createApiThunkPrivate(
  "courseBatchesSingleDocument",
  "/courses/batches/single-document",
  "GET",
);

export const enableDisableCourseBatches = createApiThunkPrivate(
  "enableDisableCourseBatches",
  "/courses/batches/enable-disable",
);

export const deleteCourseBatches = createApiThunkPrivate(
  "deleteCourseBatches",
  "/courses/batches/soft-delete",
  "DELETE",
);

export const createCourseBatches = createApiThunkPrivate(
  "createCourseBatches",
  "/courses/batches/create",
);

export const updateCourseBatches = createApiThunkPrivate(
  "updateCourseBatches",
  "/courses/batches/update",
);

/* =========================
   Slice
========================= */

export const courseSlice = createSlice({
  name: "course",
  initialState,
  extraReducers: (builder) => {
    // Courses
    createExtraReducersForThunk(builder, coursesList, "coursesListData");
    createExtraReducersForThunk(
      builder,
      coursesAllDocuments,
      "coursesAllDocumentsData",
    );
    createExtraReducersForThunk(
      builder,
      coursesSingleDocument,
      "coursesSingleDocumentData",
    );
    createExtraReducersForThunk(
      builder,
      enableDisableCourses,
      "enableDisableCoursesData",
    );
    createExtraReducersForThunk(builder, deleteCourses, "deleteCoursesData");
    createExtraReducersForThunk(builder, createCourses, "createCoursesData");
    createExtraReducersForThunk(builder, updateCourses, "updateCoursesData");

    // Course Plans
    createExtraReducersForThunk(
      builder,
      coursePlansList,
      "coursePlansListData",
    );
    createExtraReducersForThunk(
      builder,
      coursePlansAllDocuments,
      "coursePlansAllDocumentsData",
    );
    createExtraReducersForThunk(
      builder,
      coursePlansSingleDocument,
      "coursePlansSingleDocumentData",
    );
    createExtraReducersForThunk(
      builder,
      enableDisableCoursePlans,
      "enableDisableCoursePlansData",
    );
    createExtraReducersForThunk(
      builder,
      deleteCoursePlans,
      "deleteCoursePlansData",
    );
    createExtraReducersForThunk(
      builder,
      createCoursePlans,
      "createCoursePlansData",
    );
    createExtraReducersForThunk(
      builder,
      updateCoursePlans,
      "updateCoursePlansData",
    );

    // Course Batches
    createExtraReducersForThunk(
      builder,
      courseBatchesList,
      "courseBatchesListData",
    );
    createExtraReducersForThunk(
      builder,
      courseBatchesAllDocuments,
      "courseBatchesAllDocumentsData",
    );
    createExtraReducersForThunk(
      builder,
      courseBatchesSingleDocument,
      "courseBatchesSingleDocumentData",
    );
    createExtraReducersForThunk(
      builder,
      enableDisableCourseBatches,
      "enableDisableCourseBatchesData",
    );
    createExtraReducersForThunk(
      builder,
      deleteCourseBatches,
      "deleteCourseBatchesData",
    );
    createExtraReducersForThunk(
      builder,
      createCourseBatches,
      "createCourseBatchesData",
    );
    createExtraReducersForThunk(
      builder,
      updateCourseBatches,
      "updateCourseBatchesData",
    );
  },
});

export default courseSlice.reducer;
