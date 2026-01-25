import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useSelector((state) => state.auth);
    const location = useLocation();
    
    const token = localStorage.getItem("token");
    const isAuth = isAuthenticated || !!token;
    
    if (!isAuth) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    
    return children;
};

export default ProtectedRoute;