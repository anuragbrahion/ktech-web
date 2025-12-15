import { createSlice } from "@reduxjs/toolkit";
import {
  createApiThunkPrivate,
  createExtraReducersForThunk,
} from "../../utils/apiThunk";

const initialState = {
  getMissingAllCombListData: {},
  showMissingAllCombBarData: {},
  removeMissAllCombDeleteData: {},

};

export const getMissingAllCombList = createApiThunkPrivate(
  "getMissingAllCombList",
  "/getMissingAllCombList"
);

export const showMissingAllCombBar = createApiThunkPrivate(
  "showMissingAllCombBar",
  "/showMissingAllCombBar"
);

export const removeMissAllCombMultipleDelete = createApiThunkPrivate(
  "removeMissAllCombMultipleDelete",
  "/removeMissAllCombMultipleDelete"
);

export const findPassPhraseSlice = createSlice({
  name: "findPassPhrase",
  initialState,

  extraReducers: (builder) => {
    createExtraReducersForThunk(builder, getMissingAllCombList, "getMissingAllCombListData");
    createExtraReducersForThunk(builder, showMissingAllCombBar, "showMissingAllCombBarData");
    createExtraReducersForThunk(builder, removeMissAllCombMultipleDelete, "removeMissAllCombDeleteData");
  },
});

export default findPassPhraseSlice.reducer;
