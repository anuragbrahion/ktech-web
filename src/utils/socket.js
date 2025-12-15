import { io } from "socket.io-client";
import { socketApiUrl } from "./axiosProvider";

export const socket = io(socketApiUrl, { 
    reconnectionAttempts: 5,  // Retry 5 times on failure
    timeout: 10000,  // 10 seconds timeout
});
