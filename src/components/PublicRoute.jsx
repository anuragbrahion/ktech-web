import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = ({ children }) => {
    const { isAuthenticated } = useSelector((state) => state.auth);
    const token = localStorage.getItem("token");
    
    if (isAuthenticated || token) {
        return <Navigate to="/dashboard" replace />;
    }
    
    return children;
};

export default PublicRoute;