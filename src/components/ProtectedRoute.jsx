import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getAuthFromStorage } from "../utils/globalFunction";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const auth = getAuthFromStorage();

  if (!auth) {
    return <Navigate to="/welcome" replace />;
  }

  const userRole = auth.role?.toLowerCase();
  const currentPath = location.pathname;

  if (userRole === "student") {
    const isValidStudentRoute =
      currentPath.startsWith("/student/") ||
      currentPath === "/student-dashboard" ||
      currentPath.includes("/exam-results") ||
      currentPath.includes("/profile");
    if (isValidStudentRoute) {
      return children;
    }

    return <Navigate to="/student-dashboard" replace />;
  }

  if (userRole === "teacher") {
    const isValidTeacherRoute =
      currentPath.startsWith("/teacher/") ||
      currentPath === "/teacher-dashboard" ||
      currentPath.includes("/profile");
    if (isValidTeacherRoute) {
      return children;
    }

    return <Navigate to="/teacher-dashboard" replace />;
  }

  if (
    userRole === "admin" ||
    userRole === "superadmin" ||
    userRole === "branch"
  ) {
    return children;
  }

  return children;
};

export default ProtectedRoute;
