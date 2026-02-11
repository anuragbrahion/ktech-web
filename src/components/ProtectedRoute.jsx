import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const userData = JSON.parse(sessionStorage.getItem('data') || '{}');

  if (!isAuthenticated && !userData.token) {
    return <Navigate to="/welcome" replace />;
  }

  if (requiredRole && userData.role !== requiredRole) {
     switch(userData.role.toLowerCase()) {
      case 'student':
        return <Navigate to="/student-dashboard" replace />;
      case 'teacher':
        return <Navigate to="/teacher-dashboard" replace />;
      default:
        return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute; 