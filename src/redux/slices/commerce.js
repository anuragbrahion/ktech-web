import { createSlice } from "@reduxjs/toolkit";
import {
  createApiThunkPrivate,
  createExtraReducersForThunk,
} from "../../utils/apiThunk";

const initialState = {
  // Categories
  commerceCategoriesListData: {},
  commerceCategoriesAllDocumentsData: {},
  createCommerceCategoriesData: {},
  updateCommerceCategoriesData: {},
  deleteCommerceCategoriesData: {},

  // Products
  commerceProductsListData: {},
  createCommerceProductsData: {},
  updateCommerceProductsData: {},
  deleteCommerceProductsData: {},
};

/* =========================
   Categories
========================= */

export const commerceCategoriesList = createApiThunkPrivate(
  "commerceCategoriesList",
  "/commerce/categories/list",
  "GET",
);

export const commerceCategoriesAllDocuments = createApiThunkPrivate(
  "commerceCategoriesAllDocuments",
  "/commerce/categories/all-documents",
  "GET",
);

export const createCommerceCategories = createApiThunkPrivate(
  "createCommerceCategories",
  "/commerce/categories/create",
);

export const updateCommerceCategories = createApiThunkPrivate(
  "updateCommerceCategories",
  "/commerce/categories/update",
);

export const deleteCommerceCategories = createApiThunkPrivate(
  "deleteCommerceCategories",
  "/commerce/categories/soft-delete",
  "DELETE",
);

/* =========================
   Products
========================= */

export const commerceProductsList = createApiThunkPrivate(
  "commerceProductsList",
  "/commerce/products/list",
  "GET",
);

export const createCommerceProducts = createApiThunkPrivate(
  "createCommerceProducts",
  "/commerce/products/create",
);

export const updateCommerceProducts = createApiThunkPrivate(
  "updateCommerceProducts",
  "/commerce/products/update",
);

export const deleteCommerceProducts = createApiThunkPrivate(
  "deleteCommerceProducts",
  "/commerce/products/soft-delete",
  "DELETE",
);

/* =========================
   Slice
========================= */

export const commerceSlice = createSlice({
  name: "commerce",
  initialState,
  extraReducers: (builder) => {
    // Categories
    createExtraReducersForThunk(
      builder,
      commerceCategoriesList,
      "commerceCategoriesListData",
    );
    createExtraReducersForThunk(
      builder,
      commerceCategoriesAllDocuments,
      "commerceCategoriesAllDocumentsData",
    );
    createExtraReducersForThunk(
      builder,
      createCommerceCategories,
      "createCommerceCategoriesData",
    );
    createExtraReducersForThunk(
      builder,
      updateCommerceCategories,
      "updateCommerceCategoriesData",
    );
    createExtraReducersForThunk(
      builder,
      deleteCommerceCategories,
      "deleteCommerceCategoriesData",
    );

    // Products
    createExtraReducersForThunk(
      builder,
      commerceProductsList,
      "commerceProductsListData",
    );
    createExtraReducersForThunk(
      builder,
      createCommerceProducts,
      "createCommerceProductsData",
    );
    createExtraReducersForThunk(
      builder,
      updateCommerceProducts,
      "updateCommerceProductsData",
    );
    createExtraReducersForThunk(
      builder,
      deleteCommerceProducts,
      "deleteCommerceProductsData",
    );
  },
});

export default commerceSlice.reducer;
