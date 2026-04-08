import axios from "axios";
import { getAuthFromStorage } from "./globalFunction";

const isLive = false;

export const apiUrl = isLive
  ? "http://147.93.19.238:4001/api/v1"
  : "http://localhost:4001/api/v1";

export const uploadApiUrl = apiUrl;

// ─── Public Axios ─────────────────────────────
const axiosPublic = axios.create({
  baseURL: apiUrl,
  headers: { "Content-Type": "application/json" },
});

// ─── Private Axios ────────────────────────────
const axiosPrivate = axios.create({
  baseURL: apiUrl,
  headers: { "Content-Type": "application/json" },
});

// ✅ FIXED interceptor
axiosPrivate.interceptors.request.use(
  (config) => {
    const token = getAuthFromStorage();
    if (token) {
      config.headers.Authorization = `Bearer ${token.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Image Upload Axios ───────────────────────
const axiosImage = axios.create({
  baseURL: uploadApiUrl,
  headers: { "Content-Type": "multipart/form-data" },
});

// ✅ FIXED interceptor
axiosImage.interceptors.request.use(
  (config) => {
    const token = getAuthFromStorage();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Export ───────────────────────────────────
export { axiosPrivate, axiosPublic, axiosImage };