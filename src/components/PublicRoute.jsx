import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  const userData = JSON.parse(sessionStorage.getItem('data') || '{}');
 
  const token = userData?.token;

  if (isAuthenticated || token) {
    const role = userData?.role?.toLowerCase();
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
