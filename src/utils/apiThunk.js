import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosImage, axiosPrivate, axiosPublic } from "./axiosProvider";

const createApiThunk = (axiosInstance) => {
    return (name, url, method = "POST") => {
        return createAsyncThunk(name, async (payload, { rejectWithValue }) => {
            try {
                const config = { method, url };
                if (method !== "GET") {
                    config.data = payload;
                } else {
                    config.params = payload;
                }

                const response = await axiosInstance(config);
                return response?.data ? response?.data : response;
            } catch (error) {
                const errorMessage = error?.response?.data?.message || error?.message || "Something went wrong!";
                return rejectWithValue(errorMessage);
            }
        });
    };
};

export const createApiThunkPublic = createApiThunk(axiosPublic);
export const createApiThunkPrivate = createApiThunk(axiosPrivate);
export const createApiThunkPrivateImage = createApiThunk(axiosImage);

export const createExtraReducersForThunk = (builder, thunkAction, sliceName) => {
    builder
        .addCase(thunkAction.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(thunkAction.fulfilled, (state, action) => {
            state.loading = false;
            state[sliceName].data = action.payload || {};
        })
        .addCase(thunkAction.rejected, (state, action) => {
            state.loading = false;
            state[sliceName].error = action?.payload || `Something went wrong while fetching ${sliceName} details.`;
        });
};

export const createFormDataThunk = (name, url, method = "POST") => {
    return createAsyncThunk(name, async (formData, { rejectWithValue }) => {
        try {
            const response = await axiosImage({
                method,
                url,
                data: formData,
            });
            return response.data;
        } catch (error) {
            const errorMessage = error?.response?.data?.message || error?.message || "Something went wrong!";
            return rejectWithValue(errorMessage);
        }
    });
};


// import { createAsyncThunk } from "@reduxjs/toolkit";
// import { axiosImage, axiosPrivate, axiosPublic } from "./axiosProvider";

// // Helper function for creating API thunks
// const createApiThunk = (axiosInstance) => {
//     return (name, url, method = "POST") => {
//         return createAsyncThunk(name, async (payload, { rejectWithValue }) => {
//             try {
//                 // Prepare config depending on method (GET doesn't use data)
//                 const config = { method, url };
//                 if (method !== "GET") {
//                     config.data = payload;
//                 } else {
//                     config.params = payload; // GET uses query params
//                 }

//                 const response = await axiosInstance(config);
//                 return response?.data ? response?.data : response;
//             } catch (error) {
//                 // Improved error handling for network issues and server errors
//                 const errorMessage = error?.response?.data?.message || error?.message || "Something went wrong!";
//                 return rejectWithValue(errorMessage);
//             }
//         });
//     };
// };

// // Creating public and private API thunks
// export const createApiThunkPublic = createApiThunk(axiosPublic);
// export const createApiThunkPrivate = createApiThunk(axiosPrivate);
// export const createApiThunkPrivateImage = createApiThunk(axiosImage);

// // Extra reducers to handle async thunk actions
// export const createExtraReducersForThunk = (builder, thunkAction, sliceName) => {
//     builder
//         .addCase(thunkAction.pending, (state) => {
//             state.loading = true;
//             state.error = null;
//         })
//         .addCase(thunkAction.fulfilled, (state, action) => {
//             state.loading = false;
//             state[sliceName].data = action.payload || {};
//         })
//         .addCase(thunkAction.rejected, (state, action) => {
//             state.loading = false;
//             state[sliceName].error = action?.payload || `Something went wrong while fetching ${sliceName} details.`;
//         });
// };
// export const createFormDataThunk = (name, url, method = "POST") => {
//   return createAsyncThunk(name, async (formData, { rejectWithValue }) => {
//     try {
//       const response = await axiosImage({
//         method,
//         url,
//         data: formData, // pass FormData directly
//       });
//       return response.data;
//     } catch (error) {
//       const errorMessage =
//         error?.response?.data?.message || error?.message || "Something went wrong!";
//       return rejectWithValue(errorMessage);
//     }
//   });
// };