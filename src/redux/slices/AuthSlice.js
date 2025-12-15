import { createSlice } from "@reduxjs/toolkit";
import {createApiThunkPrivate, createApiThunkPublic, createExtraReducersForThunk, createFormDataThunk } from "../../utils/apiThunk";
import { sessionStorageRemoveItem } from "../../utils/globalFunction";
const initialState = {
    loginData: {},
    logoutFromCurrentDeviceData:{},
    changePasswordData:{},
    updateProfileData:{},
    countryCodeListData:{},
    viewProfileData:{}
}
export const login = createApiThunkPublic('login', '/auth/admin/login')
export const logoutFromCurrentDevice = createApiThunkPrivate('logoutFromCurrentDevice', '/auth/admin/logout')
export const changePassword = createApiThunkPrivate('changePassword', '/auth/admin/change-password')
export const updateProfile = createFormDataThunk('updateProfile', '/auth/admin/update-profile')
export const countryCodeList = createApiThunkPrivate('countryCodeList', '/global/settings/countries','GET')
export const viewProfile = createApiThunkPrivate('viewProfile', '/auth/admin/view-profile','GET')
export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: () => {
            sessionStorageRemoveItem()
            window.location.href = "/login"
        }
    },
    extraReducers: builder => {
        createExtraReducersForThunk(builder, login, 'loginData')
        createExtraReducersForThunk(builder, logoutFromCurrentDevice, 'logoutFromCurrentDeviceData')
        createExtraReducersForThunk(builder, changePassword, 'changePasswordData')
        createExtraReducersForThunk(builder, updateProfile, 'updateProfileData')
        createExtraReducersForThunk(builder, countryCodeList, 'countryCodeListData')
        createExtraReducersForThunk(builder, viewProfile, 'viewProfileData')
    }
})

export const { logout } = authSlice.actions;
export default authSlice.reducer