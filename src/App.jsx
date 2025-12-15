import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Error from './components/error/Error';
import { sessionStorageGetItem } from './utils/globalFunction';
// import Layout from './components/Layout/Layout';
import Login from './pages/Login/Login';
import { ToastContainer } from 'react-toastify';
import Layout from './components/Layout/Layout';
function App() {
  return (
    <>
    <ToastContainer />
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
          <Route path="/app/*" element={<PrivateRoute><Layout /></PrivateRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="*" element={<Error />} />
        </Routes>
      </Router>
    </>
  );
}

const PrivateRoute = ({ children }) => {
  const isAuthenticated = sessionStorageGetItem();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  return children;
};

export default App;