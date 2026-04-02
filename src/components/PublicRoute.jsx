import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAuthFromStorage } from "../utils/globalFunction";

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const auth = getAuthFromStorage();

  if (isAuthenticated || auth?.token) {
    const role = auth?.role?.toLowerCase();

    switch (role) {
      case "student":
        return <Navigate to="/student-dashboard" replace />;
      case "teacher":
        return <Navigate to="/teacher-dashboard" replace />;
      case "admin":
      case "superadmin":
      case "branch":
        return <Navigate to="/dashboard" replace />;
      default:
        return <Navigate to="/welcome" replace />;
    }
  }

  return children;
};

export default PublicRoute;