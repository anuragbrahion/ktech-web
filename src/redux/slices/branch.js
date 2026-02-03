import { createSlice } from "@reduxjs/toolkit";
import {
  createApiThunkPrivate,
  createExtraReducersForThunk,
} from "../../utils/apiThunk";

const initialState = {
  /* =========================
     Inquiry Sources
  ========================= */
  inquirySourceListData: {},
  inquirySourceAllDocumentsData: {},
  inquirySourceSingleDocumentData: {},
  enableDisableInquirySourceData: {},
  deleteInquirySourceData: {},
  createInquirySourceData: {},
  updateInquirySourceData: {},

  /* =========================
     Inquiry Status
  ========================= */
  inquiryStatusListData: {},
  inquiryStatusAllDocumentsData: {},
  inquiryStatusSingleDocumentData: {},
  enableDisableInquiryStatusData: {},
  deleteInquiryStatusData: {},
  createInquiryStatusData: {},
  updateInquiryStatusData: {},

  //emp ref amount
  getEmpRefAmountData: {},

};

/* =========================
   Inquiry Source APIs
========================= */

export const inquirySourceList = createApiThunkPrivate(
  "inquirySourceList",
  "/inquires/source/list",
  "GET",
);

export const inquirySourceAllDocuments = createApiThunkPrivate(
  "inquirySourceAllDocuments",
  "/inquires/source/all-documents",
  "GET",
);

export const inquirySourceSingleDocument = createApiThunkPrivate(
  "inquirySourceSingleDocument",
  "/inquires/source/single-document",
  "GET",
);

export const enableDisableInquirySource = createApiThunkPrivate(
  "enableDisableInquirySource",
  "/inquires/source/enable-disable",
);

export const deleteInquirySource = createApiThunkPrivate(
  "deleteInquirySource",
  "/inquires/source/soft-delete",
  "DELETE",
);

export const createInquirySource = createApiThunkPrivate(
  "createInquirySource",
  "/inquires/source/create",
);

export const updateInquirySource = createApiThunkPrivate(
  "updateInquirySource",
  "/inquires/source/update",
);

/* =========================
   Inquiry Status APIs
========================= */

export const inquiryStatusList = createApiThunkPrivate(
  "inquiryStatusList",
  "/inquires/status/list",
  "GET",
);

export const inquiryStatusAllDocuments = createApiThunkPrivate(
  "inquiryStatusAllDocuments",
  "/inquires/status/all-documents",
  "GET",
);

export const inquiryStatusSingleDocument = createApiThunkPrivate(
  "inquiryStatusSingleDocument",
  "/inquires/status/single-document",
  "GET",
);

export const enableDisableInquiryStatus = createApiThunkPrivate(
  "enableDisableInquiryStatus",
  "/inquires/status/enable-disable",
);

export const deleteInquiryStatus = createApiThunkPrivate(
  "deleteInquiryStatus",
  "/inquires/status/soft-delete",
  "DELETE",
);

export const createInquiryStatus = createApiThunkPrivate(
  "createInquiryStatus",
  "/inquires/status/create",
);

export const updateInquiryStatus = createApiThunkPrivate(
  "updateInquiryStatus",
  "/inquires/status/update",
);


export const updateEmpRefAmount = createApiThunkPrivate(
  "updateEmpRefAmount",
  "/employee/referral-amount",
);

export const getEmpRefAmount = createApiThunkPrivate(
  "getEmpRefAmount",
  "/employee/referral-amount",
  "GET"
);
/* =========================
   Slice
========================= */

export const banchSlice = createSlice({
  name: "branch",
  initialState,
  extraReducers: (builder) => {
    /* Inquiry Source */
    createExtraReducersForThunk(
      builder,
      inquirySourceList,
      "inquirySourceListData",
    );
    createExtraReducersForThunk(
      builder,
      inquirySourceAllDocuments,
      "inquirySourceAllDocumentsData",
    );
    createExtraReducersForThunk(
      builder,
      inquirySourceSingleDocument,
      "inquirySourceSingleDocumentData",
    );
    createExtraReducersForThunk(
      builder,
      enableDisableInquirySource,
      "enableDisableInquirySourceData",
    );
    createExtraReducersForThunk(
      builder,
      deleteInquirySource,
      "deleteInquirySourceData",
    );
    createExtraReducersForThunk(
      builder,
      createInquirySource,
      "createInquirySourceData",
    );
    createExtraReducersForThunk(
      builder,
      updateInquirySource,
      "updateInquirySourceData",
    );

    /* Inquiry Status */
    createExtraReducersForThunk(
      builder,
      inquiryStatusList,
      "inquiryStatusListData",
    );
    createExtraReducersForThunk(
      builder,
      inquiryStatusAllDocuments,
      "inquiryStatusAllDocumentsData",
    );
    createExtraReducersForThunk(
      builder,
      inquiryStatusSingleDocument,
      "inquiryStatusSingleDocumentData",
    );
    createExtraReducersForThunk(
      builder,
      enableDisableInquiryStatus,
      "enableDisableInquiryStatusData",
    );
    createExtraReducersForThunk(
      builder,
      deleteInquiryStatus,
      "deleteInquiryStatusData",
    );
    createExtraReducersForThunk(
      builder,
      createInquiryStatus,
      "createInquiryStatusData",
    );
    createExtraReducersForThunk(
      builder,
      updateInquiryStatus,
      "updateInquiryStatusData",
    );

    createExtraReducersForThunk(
      builder,
      getEmpRefAmount,
      "getEmpRefAmountData",
    );
  },
});

export default banchSlice.reducer;
