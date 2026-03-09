import { createSlice } from "@reduxjs/toolkit";
import { createApiThunkPrivate, createApiThunkPublic, createExtraReducersForThunk, createFormDataThunk } from "../../utils/apiThunk";
import { getStoredAuth, sessionStorageRemoveItem } from "../../utils/globalFunction";

const stored = getStoredAuth();


const initialState = {
    loginData: {},
    forgotPasswordData: {},
    token: stored.token || null,
    isAuthenticated: stored.isAuthenticated,
    userRole: stored.role || null,
    persistAuth: stored.persistAuth || false
}

export const login = createApiThunkPublic('login', '/auth/signIn')
export const forgotPassword = createApiThunkPrivate('forgotPassword', '/auth/forgotpassword')
export const resetpassword = createFormDataThunk('resetpassword', '/auth/resetpassword')
export const logoutFromCurrentDevice = createApiThunkPrivate('logoutFromCurrentDevice', '/auth/logout')

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
 
        logout: (state) => {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("persistAuth");
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("role");
            sessionStorage.removeItem("persistAuth");
            sessionStorageRemoveItem();
            state.token = null;
            state.isAuthenticated = false;
            state.userRole = null;
            state.persistAuth = false;
        },
        setCredentials: (state, action) => {
            const { token, role } = action.payload;
            state.token = token;
            state.isAuthenticated = true;
            state.userRole = role;
            localStorage.setItem("token", token);
            if (role) localStorage.setItem("role", role);
        }
    },
    extraReducers: builder => {
        builder
            .addCase(login.fulfilled, (state, action) => {
                state.loginData = action.payload;
                if (action.payload?.data?.token) {
                    const token = action.payload.data.token;
                    const role = action.payload.data.role || "user";
                    const shouldPersist = state.persistAuth;
                    state.token = token;
                    state.isAuthenticated = true;
                    state.userRole = role;
                    localStorage.removeItem("token");
                    localStorage.removeItem("role");
                    sessionStorage.removeItem("token");
                    sessionStorage.removeItem("role");
                    if (shouldPersist) {
                        localStorage.setItem("token", token);
                        localStorage.setItem("role", role);
                        localStorage.setItem("persistAuth", "true");
                    } else {
                        sessionStorage.setItem("token", token);
                        sessionStorage.setItem("role", role);
                        sessionStorage.setItem("persistAuth", "false");
                    }
                }
            })
            .addCase(login.rejected, (state) => {
                state.token = null;
                state.isAuthenticated = false;
                state.userRole = null;
                localStorage.removeItem("token");
                localStorage.removeItem("role");
            })
            .addCase(logoutFromCurrentDevice.fulfilled, (state) => {
                state.token = null;
                state.isAuthenticated = false;
                state.userRole = null;
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                sessionStorageRemoveItem();
            });

        createExtraReducersForThunk(builder, forgotPassword, 'forgotPasswordData');
    }
})

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer