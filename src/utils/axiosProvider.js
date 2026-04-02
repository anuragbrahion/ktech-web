import axios from "axios";
import { getAuthFromStorage } from "./globalFunction";

const isLive = true;

export const apiUrl = isLive
    ? "http://147.93.19.238:4001/api/v1"
    : "http://localhost:4001/api/v1";

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
        const token = getAuthFromStorage()
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
        const token = getAuthFromStorage()
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export { axiosPrivate, axiosPublic, axiosImage };