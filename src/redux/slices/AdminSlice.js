import { createSlice } from "@reduxjs/toolkit";
import { createApiThunkPrivate, createExtraReducersForThunk } from "../../utils/apiThunk";
const initialState = {
    getAdminRoleListData: {},
    createAdminRoleData: {},
    permissionsRoleData: {},
    updateAdminRoleData: {},
    editAdminRoleData: {},
    adminManagementListData:{},
    enableDisableAdminData:{},
    getAssignedRolesListData:{},
    createAdminManagementData:{},
    updateAdminManagementData:{},
    updatePasswordData:{},
    contentCategoriesData:{},
    deleteContentCategoriesData:{},
    settingsGlobalData:{},
    updateContentCategoriesData:{},
    createContentCategoriesData:{},
    enableDisableContentCategoriesData:{}
}
export const getAdminRoleList = createApiThunkPrivate('getAdminRoleList', '/admin/roles/list', 'GET')
export const createAdminRole = createApiThunkPrivate('createAdminRole', '/admin/roles/create')
export const permissionsRole = createApiThunkPrivate('permissionsRole', '/admin/roles/permissions', 'GET')
export const updateAdminRole = createApiThunkPrivate('updateAdminRole', '/admin/roles/update')
export const editAdminRole = createApiThunkPrivate('editAdminRole', '/admin/roles/single-document', 'GET')
//////////////////Admin Management/////////////////////
export const adminManagementList = createApiThunkPrivate('adminManagementList', '/admin/list', 'GET')
export const enableDisableAdmin = createApiThunkPrivate('enableDisableAdmin', '/admin/enable-disable')
export const getAssignedRolesList = createApiThunkPrivate('getAssignedRolesList', '/admin/roles/all-documents','GET')
export const createAdminManagement = createApiThunkPrivate('createAdminManagement', '/admin/create')
export const updateAdminManagement = createApiThunkPrivate('updateAdminManagement', '/admin/update')
export const updatePassword = createApiThunkPrivate('updatePassword', '/admin/update-password')
//////////////Content Categories////////////////////////////
export const contentCategories=createApiThunkPrivate('contentCategories','/categories/admin/list','GET')
export const deleteContentCategories=createApiThunkPrivate('deleteContentCategories','/categories/admin/soft-delete','DELETE')
export const settingsGlobal=createApiThunkPrivate('settingsGlobal','/global/settings','GET')
export const createContentCategories=createApiThunkPrivate('createContentCategories','/categories/admin/create')
export const updateContentCategories=createApiThunkPrivate('updateContentCategories','/categories/admin/update')
export const enableDisableContentCategories=createApiThunkPrivate('enableDisableContentCategories','/categories/admin/enable-disable')
export const adminSlice = createSlice({
    name: 'admin',
    initialState,
    extraReducers: builder => {
        createExtraReducersForThunk(builder, getAdminRoleList, 'getAdminRoleListData')
        createExtraReducersForThunk(builder, permissionsRole, 'permissionsRoleData')
        createExtraReducersForThunk(builder, createAdminRole, 'createAdminRoleData')
        createExtraReducersForThunk(builder, updateAdminRole, 'updateAdminRoleData')
        createExtraReducersForThunk(builder, editAdminRole, 'editAdminRoleData')
        //////////////////Admin Management/////////////////////
        createExtraReducersForThunk(builder, adminManagementList, 'adminManagementListData')
        createExtraReducersForThunk(builder, enableDisableAdmin, 'enableDisableAdminData')
        createExtraReducersForThunk(builder, getAssignedRolesList, 'getAssignedRolesListData')
        createExtraReducersForThunk(builder, createAdminManagement, 'createAdminManagementData')
        createExtraReducersForThunk(builder, updateAdminManagement, 'updateAdminManagementData')
        createExtraReducersForThunk(builder, updatePassword, 'updatePasswordData')
        ////////////Content Categories////////////////////
        createExtraReducersForThunk(builder,contentCategories,'contentCategoriesData')
        createExtraReducersForThunk(builder,deleteContentCategories,'deleteContentCategoriesData')
        createExtraReducersForThunk(builder,settingsGlobal,'settingsGlobalData')
        createExtraReducersForThunk(builder,createContentCategories,'createContentCategoriesData')
        createExtraReducersForThunk(builder,updateContentCategories,'updateContentCategoriesData')
        createExtraReducersForThunk(builder,enableDisableContentCategories,'enableDisableContentCategoriesData')
    }
})

export const { logout } = adminSlice.actions;
export default adminSlice.reducer