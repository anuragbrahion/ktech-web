import { createSlice } from "@reduxjs/toolkit";
import {
  createApiThunkPrivate,
  createApiThunkPublic,
  createExtraReducersForThunk,
  createFormDataThunk,
} from "../../utils/apiThunk";
import { getAuthFromStorage, sessionStorageRemoveItem, setAuthWithExpiry } from "../../utils/globalFunction";

const storedAuth = getAuthFromStorage();
const initialState = {
  loginData: {},
  forgotPasswordData: {},
  token: storedAuth?.token || null,
  isAuthenticated: !!storedAuth?.token,
  userRole: storedAuth?.role || null
};

export const login = createApiThunkPublic("login", "/auth/signIn");
export const forgotPassword = createApiThunkPrivate(
  "forgotPassword",
  "/auth/forgotpassword",
);
export const resetpassword = createFormDataThunk(
  "resetpassword",
  "/auth/resetpassword",
);
export const logoutFromCurrentDevice = createApiThunkPrivate(
  "logoutFromCurrentDevice",
  "/auth/logout",
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("auth");
      sessionStorageRemoveItem();
      state.token = null;
      state.isAuthenticated = false;
      state.userRole = null;
       window.location.href = "/login";
    },
    setCredentials: (state, action) => {
      const { token, role } = action.payload;
      state.token = token;
      state.isAuthenticated = true;
      state.userRole = role;
      localStorage.setItem("token", token);
      if (role) localStorage.setItem("role", role);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.loginData = action.payload;
        if (action.payload?.data?.token) {
          const token = action.payload.data.token;
          const role = action.payload.data.role || "user";
          state.token = token;
          state.isAuthenticated = true;
          state.userRole = role;
          setAuthWithExpiry(token, role);
        }
      })
      .addCase(login.rejected, (state) => {
        state.token = null;
        state.isAuthenticated = false;
        state.userRole = null;
        localStorage.removeItem("auth");
      })
      .addCase(logoutFromCurrentDevice.fulfilled, (state) => {
        state.token = null;
        state.isAuthenticated = false;
        state.userRole = null;
        localStorage.removeItem("auth");
        sessionStorageRemoveItem();
      });

    createExtraReducersForThunk(builder, forgotPassword, "forgotPasswordData");
  },
});

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;