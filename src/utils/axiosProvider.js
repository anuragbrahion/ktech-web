import axios from "axios";

const isLive = true;

export const apiUrl = isLive
    ? "http://147.93.19.238:4001/api/v1"
    : "http://192.168.29.106:8004/api/v1";

const axiosPublic = axios.create({
    baseURL: apiUrl,
    headers: { "Content-Type": "application/json" },
});

const axiosPrivate = axios.create({
    baseURL: apiUrl,
    headers: { "Content-Type": "application/json" },
});

axiosPrivate.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

const axiosImage = axios.create({
    baseURL: apiUrl,
    headers: { "Content-Type": "multipart/form-data" },
});

axiosImage.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export { axiosPrivate, axiosPublic, axiosImage };



// import axios from "axios";
// import { removeCookie, sessionStorageGetItem } from "./globalFunction";

// const isLive = true;

// export const apiUrl = isLive
//     ? "https://ktech-backend-ten.vercel.app/api/v1"
//     : "http://192.168.29.106:8004/api/v1";

// export const socketApiUrl = isLive
//     ? "https://p2.serveradmiin.info/socket"
//     : "http://localhost:5300/socket";

// // --------------------------------------------
// // Common Error Handler (shared across instances)
// // --------------------------------------------
// const handleError = (error) => {
//     if (!error.response) {
//         return Promise.reject({ message: "Network error. Please try again." });
//     }

//     const { status, data } = error.response;

//     switch (status) {
//         case 401:
//             if (data?.code === "TOKEN_EXPIRED") {
//                 removeCookie();
//                 window.location.href = "/welcome";
//                 return Promise.reject({ message: "Token expired" });
//             }
//             return Promise.reject({ message: data?.message || "Unauthorized" });
//         case 403:
//             return Promise.reject({ message: data?.message || "Access denied" });

//         case 1401:
//             return Promise.reject({ message: "Resource not found" });

//         case 500:
//             return Promise.reject({ message: "Internal server error. Please try again later." });

//         default:
//             return Promise.reject(data || { message: "Something went wrong" });
//     }
// };

// // --------------------------------------------
// // Axios Instances
// // --------------------------------------------
// const axiosPublic = axios.create({
//     baseURL: apiUrl,
//     headers: { "Content-Type": "application/json" },
// });

// axiosPublic.interceptors.response.use((res) => res, handleError);

// const axiosPrivate = axios.create({
//     baseURL: apiUrl,
//     headers: { "Content-Type": "application/json" },
// });

// axiosPrivate.interceptors.request.use(
//     (config) => {
//         const userData = localStorageGetItem();
//         if (userData?.token) {
//             config.headers.Authorization = `Bearer ${userData.token}`;
//         }
//         return config;
//     },
//     (error) => Promise.reject(error)
// );

// axiosPrivate.interceptors.response.use((res) => res, handleError);

// const axiosImage = axios.create({
//     baseURL: apiUrl,
//     headers: { "Content-Type": "multipart/form-data" },
// });

// axiosImage.interceptors.request.use(
//     (config) => {
//         const userData = sessionStorageGetItem();
//         if (userData?.token) {
//             config.headers.Authorization = `Bearer ${userData.token}`;
//         }
//         return config;
//     },
//     (error) => Promise.reject(error)
// );

// axiosImage.interceptors.response.use((res) => res, handleError);

// // --------------------------------------------
// // File Upload Helpers
// // --------------------------------------------
// export const uploadImageDirect = async (apiPath, formData, config = {}) => {
//     try {
//         const response = await axiosImage.post(apiPath, formData, config);
//         return response.data;
//     } catch (error) {
//         throw error?.response?.data || { message: error.message || "Image upload failed." };
//     }
// };

// export const uploadVideoDirect = async (apiPath, formData, config = {}) => {
//     try {
//         const response = await axiosImage.post(apiPath, formData, config);
//         return response.data;
//     } catch (error) {
//         throw error?.response?.data || { message: error.message || "Video upload failed." };
//     }
// };

// // --------------------------------------------
// export { axiosPrivate, axiosPublic, axiosImage };
