import { createSlice } from "@reduxjs/toolkit";
import {
  createApiThunkPrivate,
  createApiThunkPublic,
  createExtraReducersForThunk,
} from "../../utils/apiThunk";

const initialState = {
  websiteLanguagesListData: {},
  websiteLanguagesAllDocumentsData: {},
  deleteWebsiteLanguagesData: {},
  enableDisableWebsiteLanguagesData: {},
  createWebsiteLanguagesData: {},
  updateWebsiteLanguagesData: {},

  // Website Category
  websiteCategoryListData: {},
  websiteCategoryAllDocumentsData: {},
  enableDisableWebsiteCategoryData: {},
  deleteWebsiteCategoryData: {},
  createWebsiteCategoryData: {},
  updateWebsiteCategoryData: {},

  // Website Blogs
  websiteBlogsListData: {},
  websiteBlogsAllDocumentsData: {},
  enableDisableWebsiteBlogsData: {},
  deleteWebsiteBlogsData: {},
  createWebsiteBlogsData: {},
  updateWebsiteBlogsData: {},

  // Website Branches
  websiteBranchesListData: {},
  websiteBranchesAllDocumentsData: {},
  enableDisableWebsiteBranchesData: {},
  deleteWebsiteBranchesData: {},
  createWebsiteBranchesData: {},
  updateWebsiteBranchesData: {},
};

export const websiteLanguagesList = createApiThunkPrivate(
  "websiteLanguagesList",
  "/website/languages/list",
  "GET",
);

export const websiteLanguagesAllDocuments = createApiThunkPrivate(
  "websiteLanguagesAllDocuments",
  "/website/languages/all-documents",
  "GET",
);

export const deleteWebsiteLanguages = createApiThunkPrivate(
  "deleteWebsiteLanguages",
  "/website/languages/soft-delete",
  "DELETE",
);

export const enableDisableWebsiteLanguages = createApiThunkPrivate(
  "enableDisableWebsiteLanguages",
  "/website/languages/enable-disable",
);

export const createWebsiteLanguages = createApiThunkPrivate(
  "createWebsiteLanguages",
  "/website/languages/create",
);

export const updateWebsiteLanguages = createApiThunkPrivate(
  "updateWebsiteLanguages",
  "/website/languages/update",
);

export const createHomeManagement = createApiThunkPrivate(
  "createHomeManagement",
  "/website/home",
);
export const getHomeManagement = createApiThunkPublic(
  "getHomeManagement",
  "/website/home",
  "GET",
);

/* =========================
   Website Category
========================= */

export const websiteCategoryList = createApiThunkPrivate(
  "websiteCategoryList",
  "/website/category/list",
  "GET",
);

export const websiteCategoryAllDocuments = createApiThunkPrivate(
  "websiteCategoryAllDocuments",
  "/website/category/all-documents",
  "GET",
);

export const enableDisableWebsiteCategory = createApiThunkPrivate(
  "enableDisableWebsiteCategory",
  "/website/category/enable-disable",
);

export const deleteWebsiteCategory = createApiThunkPrivate(
  "deleteWebsiteCategory",
  "/website/category/soft-delete",
  "DELETE",
);

export const createWebsiteCategory = createApiThunkPrivate(
  "createWebsiteCategory",
  "/website/category/create",
);

export const updateWebsiteCategory = createApiThunkPrivate(
  "updateWebsiteCategory",
  "/website/category/update",
);

/* =========================
   Website Blogs
========================= */

export const websiteBlogsList = createApiThunkPrivate(
  "websiteBlogsList",
  "/website/blogs/list",
  "GET",
);

export const websiteBlogsAllDocuments = createApiThunkPrivate(
  "websiteBlogsAllDocuments",
  "/website/blogs/all-documents",
  "GET",
);

export const enableDisableWebsiteBlogs = createApiThunkPrivate(
  "enableDisableWebsiteBlogs",
  "/website/blogs/enable-disable",
);

export const deleteWebsiteBlogs = createApiThunkPrivate(
  "deleteWebsiteBlogs",
  "/website/blogs/soft-delete",
  "DELETE",
);

export const createWebsiteBlogs = createApiThunkPrivate(
  "createWebsiteBlogs",
  "/website/blogs/create",
);

export const updateWebsiteBlogs = createApiThunkPrivate(
  "updateWebsiteBlogs",
  "/website/blogs/update",
);

/* =========================
   Website Branches
========================= */

export const websiteBranchesList = createApiThunkPrivate(
  "websiteBranchesList",
  "/website/branches/list",
  "GET",
);

export const websiteBranchesAllDocuments = createApiThunkPrivate(
  "websiteBranchesAllDocuments",
  "/website/branches/all-documents",
  "GET",
);

export const enableDisableWebsiteBranches = createApiThunkPrivate(
  "enableDisableWebsiteBranches",
  "/website/branches/enable-disable",
);

export const deleteWebsiteBranches = createApiThunkPrivate(
  "deleteWebsiteBranches",
  "/website/branches/soft-delete",
  "DELETE",
);

export const createWebsiteBranches = createApiThunkPrivate(
  "createWebsiteBranches",
  "/website/branches/create",
);

export const updateWebsiteBranches = createApiThunkPrivate(
  "updateWebsiteBranches",
  "/website/branches/update",
);

export const websiteSlice = createSlice({
  name: "website",
  initialState,
  extraReducers: (builder) => {
    createExtraReducersForThunk(
      builder,
      websiteLanguagesList,
      "websiteLanguagesListData",
    );
    createExtraReducersForThunk(
      builder,
      websiteLanguagesAllDocuments,
      "websiteLanguagesAllDocumentsData",
    );
    createExtraReducersForThunk(
      builder,
      deleteWebsiteLanguages,
      "deleteWebsiteLanguagesData",
    );
    createExtraReducersForThunk(
      builder,
      enableDisableWebsiteLanguages,
      "enableDisableWebsiteLanguagesData",
    );
    createExtraReducersForThunk(
      builder,
      createWebsiteLanguages,
      "createWebsiteLanguagesData",
    );
    createExtraReducersForThunk(
      builder,
      updateWebsiteLanguages,
      "updateWebsiteLanguagesData",
    );
    // Category
    createExtraReducersForThunk(
      builder,
      websiteCategoryList,
      "websiteCategoryListData",
    );
    createExtraReducersForThunk(
      builder,
      websiteCategoryAllDocuments,
      "websiteCategoryAllDocumentsData",
    );
    createExtraReducersForThunk(
      builder,
      enableDisableWebsiteCategory,
      "enableDisableWebsiteCategoryData",
    );
    createExtraReducersForThunk(
      builder,
      deleteWebsiteCategory,
      "deleteWebsiteCategoryData",
    );
    createExtraReducersForThunk(
      builder,
      createWebsiteCategory,
      "createWebsiteCategoryData",
    );
    createExtraReducersForThunk(
      builder,
      updateWebsiteCategory,
      "updateWebsiteCategoryData",
    );

    // Blogs
    createExtraReducersForThunk(
      builder,
      websiteBlogsList,
      "websiteBlogsListData",
    );
    createExtraReducersForThunk(
      builder,
      websiteBlogsAllDocuments,
      "websiteBlogsAllDocumentsData",
    );
    createExtraReducersForThunk(
      builder,
      enableDisableWebsiteBlogs,
      "enableDisableWebsiteBlogsData",
    );
    createExtraReducersForThunk(
      builder,
      deleteWebsiteBlogs,
      "deleteWebsiteBlogsData",
    );
    createExtraReducersForThunk(
      builder,
      createWebsiteBlogs,
      "createWebsiteBlogsData",
    );
    createExtraReducersForThunk(
      builder,
      updateWebsiteBlogs,
      "updateWebsiteBlogsData",
    );

    // Branches
    createExtraReducersForThunk(
      builder,
      websiteBranchesList,
      "websiteBranchesListData",
    );
    createExtraReducersForThunk(
      builder,
      websiteBranchesAllDocuments,
      "websiteBranchesAllDocumentsData",
    );
    createExtraReducersForThunk(
      builder,
      enableDisableWebsiteBranches,
      "enableDisableWebsiteBranchesData",
    );
    createExtraReducersForThunk(
      builder,
      deleteWebsiteBranches,
      "deleteWebsiteBranchesData",
    );
    createExtraReducersForThunk(
      builder,
      createWebsiteBranches,
      "createWebsiteBranchesData",
    );
    createExtraReducersForThunk(
      builder,
      updateWebsiteBranches,
      "updateWebsiteBranchesData",
    );
  },
});

export default websiteSlice.reducer;
