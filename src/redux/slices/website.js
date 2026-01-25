import { createSlice } from "@reduxjs/toolkit";
import { createApiThunkPrivate, createApiThunkPublic, createExtraReducersForThunk } from "../../utils/apiThunk";

const initialState = {
  websiteLanguagesListData: {},
  websiteLanguagesAllDocumentsData: {},
  deleteWebsiteLanguagesData: {},
  enableDisableWebsiteLanguagesData: {},
  createWebsiteLanguagesData: {},
  updateWebsiteLanguagesData: {}
};

export const websiteLanguagesList = createApiThunkPrivate(
  "websiteLanguagesList",
  "/website/languages/list",
  "GET"
);

export const websiteLanguagesAllDocuments = createApiThunkPrivate(
  "websiteLanguagesAllDocuments",
  "/website/languages/all-documents",
  "GET"
);

export const deleteWebsiteLanguages = createApiThunkPrivate(
  "deleteWebsiteLanguages",
  "/website/languages/soft-delete",
  "DELETE"
);

export const enableDisableWebsiteLanguages = createApiThunkPrivate(
  "enableDisableWebsiteLanguages",
  "/website/languages/enable-disable"
);

export const createWebsiteLanguages = createApiThunkPrivate(
  "createWebsiteLanguages",
  "/website/languages/create"
);

export const updateWebsiteLanguages = createApiThunkPrivate(
  "updateWebsiteLanguages",
  "/website/languages/update"
);

export const createHomeManagement = createApiThunkPrivate(
  "createHomeManagement",
  "/website/home",
);
export const getHomeManagement = createApiThunkPublic(
  "getHomeManagement",
  "/website/home","GET"
);

export const websiteSlice = createSlice({
  name: "website",
  initialState,
  extraReducers: builder => {
    createExtraReducersForThunk(
      builder,
      websiteLanguagesList,
      "websiteLanguagesListData"
    );
    createExtraReducersForThunk(
      builder,
      websiteLanguagesAllDocuments,
      "websiteLanguagesAllDocumentsData"
    );
    createExtraReducersForThunk(
      builder,
      deleteWebsiteLanguages,
      "deleteWebsiteLanguagesData"
    );
    createExtraReducersForThunk(
      builder,
      enableDisableWebsiteLanguages,
      "enableDisableWebsiteLanguagesData"
    );
    createExtraReducersForThunk(
      builder,
      createWebsiteLanguages,
      "createWebsiteLanguagesData"
    );
    createExtraReducersForThunk(
      builder,
      updateWebsiteLanguages,
      "updateWebsiteLanguagesData"
    );
  }
});

export default websiteSlice.reducer;
