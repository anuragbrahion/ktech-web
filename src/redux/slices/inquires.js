import { createSlice } from "@reduxjs/toolkit";
import {
  createApiThunkPrivate,
  createExtraReducersForThunk,
} from "../../utils/apiThunk";

const initialState = {
  /* =========================
     Inquiries
  ========================= */
  inquiresListData: {},
  inquiresSingleDocumentData: {},
  createInquiresData: {},
  addRemarkData: {},
  moveToAdmissionData: {},
  deleteInquiresData: {},
  followUpInquiresData: {},

  /* =========================
     Visitors
  ========================= */
  visitorsListData: {},
  createVisitorData: {},
  updateVisitorData: {},
  deleteVisitorData: {},
  followUpVisitorData: {},
};

/* =========================
   Inquiries APIs
========================= */

export const inquiriesList = createApiThunkPrivate(
  "inquiriesList",
  "/inquires/list",
  "GET",
);

export const inquiresSingleDocument = createApiThunkPrivate(
  "inquiresSingleDocument",
  "/inquires/single-document",
  "GET",
);

export const createInquires = createApiThunkPrivate(
  "createInquires",
  "/inquires/create",
);

export const addRemark = createApiThunkPrivate(
  "addRemark",
  "/inquires/add-remark",
);

export const moveToAdmission = createApiThunkPrivate(
  "moveToAdmission",
  "/inquires/move-to-admission",
);

export const deleteInquires = createApiThunkPrivate(
  "deleteInquires",
  "/inquires/soft-delete",
  "DELETE",
);

export const followUpInquires = createApiThunkPrivate(
  "followUpInquires",
  "/inquires/follow-up",
  "GET",
);

/* =========================
   Visitors APIs
========================= */

export const visitorsList = createApiThunkPrivate(
  "visitorsList",
  "/inquires/visitors/list",
  "GET",
);

export const createVisitor = createApiThunkPrivate(
  "createVisitor",
  "/inquires/visitors/create",
);

export const updateVisitor = createApiThunkPrivate(
  "updateVisitor",
  "/inquires/visitors/update",
);

export const deleteVisitor = createApiThunkPrivate(
  "deleteVisitor",
  "/inquires/visitors/soft-delete",
  "DELETE",
);

export const followUpVisitor = createApiThunkPrivate(
  "followUpVisitor",
  "/inquires/visitors/follow-up",
  "GET",
);

/* =========================
   Slice
========================= */

export const inquiresSlice = createSlice({
  name: "inquires",
  initialState,
  extraReducers: (builder) => {
    createExtraReducersForThunk(builder, inquiriesList, "inquiresListData");
    createExtraReducersForThunk(
      builder,
      inquiresSingleDocument,
      "inquiresSingleDocumentData",
    );
    createExtraReducersForThunk(builder, createInquires, "createInquiresData");
    createExtraReducersForThunk(builder, addRemark, "addRemarkData");
    createExtraReducersForThunk(
      builder,
      moveToAdmission,
      "moveToAdmissionData",
    );
    createExtraReducersForThunk(builder, deleteInquires, "deleteInquiresData");
    createExtraReducersForThunk(
      builder,
      followUpInquires,
      "followUpInquiresData",
    );
    // Visitors
    createExtraReducersForThunk(builder, visitorsList, "visitorsListData");
    createExtraReducersForThunk(builder, createVisitor, "createVisitorData");
    createExtraReducersForThunk(builder, updateVisitor, "updateVisitorData");
    createExtraReducersForThunk(builder, deleteVisitor, "deleteVisitorData");
    createExtraReducersForThunk(
      builder,
      followUpVisitor,
      "followUpVisitorData",
    );
  },
});

export default inquiresSlice.reducer;
