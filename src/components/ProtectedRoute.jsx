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



// import React, { useEffect, useState } from 'react';
// import { Navigate } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import { useSessionTimeout } from '../utils/sessionTimeout';
// import LogoutPrompt from './LogoutPrompt';
// import { logout } from '../redux/slices/AuthSlice';

// const ProtectedRoute = ({ children, requiredRole }) => {
//   const dispatch = useDispatch();
//   const { isAuthenticated, token, persistAuth, userRole } = useSelector((state) => state.auth);
//   const [showPrompt, setShowPrompt] = useState(false);
//   const [isChecking, setIsChecking] = useState(true);
  
//   useSessionTimeout();

//    const getUserData = () => {
//     try {
//        const sessionData = sessionStorage.getItem('data');
//       if (sessionData) {
//         return JSON.parse(sessionData);
//       }
//        const localData = localStorage.getItem('data');
//       if (localData) {
//         return JSON.parse(localData);
//       }
//     } catch (error) {
//       console.error('Error parsing user data:', error);
//     }
//     return null;
//   };

//   const userData = getUserData();

//   useEffect(() => {
//     const validateSession = () => {
//        const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
//       const storedPersist = localStorage.getItem('persistAuth') === 'true';
//       const reduxToken = token; 
//       if (!storedToken && !reduxToken) {
//         return false;
//       } 
//       if (!storedPersist && !persistAuth) {
//         const sessionData = sessionStorage.getItem('data');
//         if (!sessionData) {
//           return false;
//         }
//       }

//       return true;
//     };

//     const checkAuth = async () => {
//        if (isAuthenticated && !validateSession()) {
//         setShowPrompt(true);
//       }
//       setIsChecking(false);
//     };

//     checkAuth();
//   }, [isAuthenticated, token, persistAuth]);

//    useEffect(() => {
//     const handleBeforeUnload = () => {
//       const shouldPersist = localStorage.getItem('persistAuth') === 'true';
//       if (!shouldPersist) {
//         sessionStorage.removeItem('token');
//         sessionStorage.removeItem('data');
//         sessionStorage.removeItem('role');
//         sessionStorage.removeItem('persistAuth');
//       }
//     };

//     window.addEventListener('beforeunload', handleBeforeUnload);

//     return () => {
//       window.removeEventListener('beforeunload', handleBeforeUnload);
//     };
//   }, []);

//    useEffect(() => {
//     const handleVisibilityChange = () => {
//       if (document.hidden) {
//          return;
//       }
//       const shouldPersist = localStorage.getItem('persistAuth') === 'true';
//       const sessionToken = sessionStorage.getItem('token');
//       const localToken = localStorage.getItem('token');
//       if (!shouldPersist && !sessionToken && localToken) {
//         return;
//       }

//       if (!shouldPersist && !sessionToken && !localToken) {
//          dispatch(logout());
//       }
//     };

//     document.addEventListener('visibilitychange', handleVisibilityChange);

//     return () => {
//       document.removeEventListener('visibilitychange', handleVisibilityChange);
//     };
//   }, [dispatch]);

//    if (isChecking) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }
 
//   const isUserAuthenticated = isAuthenticated && (token || userData?.token);
 
//   if (!isUserAuthenticated) {
//     return <Navigate to="/welcome" replace />;
//   }
 
//   const currentUserRole = userRole || userData?.role || '';

//    if (requiredRole) {
//     const normalizedRequired = requiredRole.toLowerCase();
//     const normalizedCurrent = currentUserRole.toLowerCase();

//      if (normalizedCurrent !== normalizedRequired) {
//       switch (normalizedCurrent) {
//         case 'student':
//           return <Navigate to="/student-dashboard" replace />;
//         case 'teacher':
//           return <Navigate to="/teacher-dashboard" replace />;
//         case 'admin':
//         case 'superadmin':
//         case 'branch':
//           return <Navigate to="/dashboard" replace />;
//         default:
//           return <Navigate to="/dashboard" replace />;
//       }
//     }
//   }

//    const handleStayLoggedIn = () => {
//     setShowPrompt(false);
//      const shouldPersist = localStorage.getItem('persistAuth') === 'true';
//     if (!shouldPersist && userData) {
//       sessionStorage.setItem('data', JSON.stringify(userData));
//       sessionStorage.setItem('token', token || userData.token);
//       sessionStorage.setItem('role', userData.role);
//     }
//   };

//   const handleLogout = () => {
//     setShowPrompt(false);
//     dispatch(logout());
//   };

//   return (
//     <>
//       {children}
//       <LogoutPrompt 
//         isOpen={showPrompt} 
//         onStayLoggedIn={handleStayLoggedIn}
//         onLogout={handleLogout}
//       />
//     </>
//   );
// };

// export default ProtectedRoute;