import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import WebsiteDashboard from "./pages/WebsiteDashboard/WebsiteDashboard";
import HomePage from "./pages/WebsiteManagement/HomePage/HomePage";
import Blogs from "./pages/WebsiteManagement/Blogs/Blogs";
import BranchManagement from "./pages/WebsiteManagement/Branches/page";
import TestimonialManagement from "./pages/WebsiteManagement/testimonials/page";
import LanguageManagement from "./pages/WebsiteManagement/LanguagesManagement/LanguagesManagement";
import AboutUsEditor from "./pages/WebsiteManagement/WebAbout/page";
import WhyUs from "./pages/WebsiteManagement/WhyUs/page";
import TermsAnDCon from "./pages/WebsiteManagement/TermsConditions/page";
import PrivacyPolicy from "./pages/WebsiteManagement/PrivacyPolicy/page";
import CourseFAQEditor from "./pages/WebsiteManagement/CourseFaq/page";
import ConfigDetailsForm from "./pages/WebsiteManagement/CompanyDetails/page";

// Generic pages for other sections
const ExamGradeSystem = () => <GenericPage title="Exam Grade System" />;
const Subjects = () => <GenericPage title="Subjects" />;
const Languages = () => <GenericPage title="Languages" />;
const CourseCategories = () => <GenericPage title="Course Categories" />;
const CourseAwardCategories = () => (
  <GenericPage title="Course Award Categories" />
);
const Pages = () => <GenericPage title="Pages" />;
const MediaLibrary = () => <GenericPage title="Media Library" />;
const UserManagement = () => <GenericPage title="User Management" />;
const WebsiteSettings = () => <GenericPage title="Website Settings" />;

const GenericPage = ({ title }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
      {title}
    </h2>
    <p className="text-gray-600">
      This is the {title.toLowerCase()} page. Content will be implemented here.
    </p>
  </div>
);

// Main Layout Component
const MainLayout = ({
  children,
  onModeToggle,
  websiteMode,
  onLogout,
  onSidebarToggle,
  isSidebarOpen,
}) => {
  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={onSidebarToggle}
        websiteMode={websiteMode}
        onModeToggle={onModeToggle}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          isSidebarOpen={isSidebarOpen}
          onSidebarToggle={onSidebarToggle}
          websiteMode={websiteMode}
          onLogout={onLogout}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const [isLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [websiteMode, setWebsiteMode] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setWebsiteMode(false);
    localStorage.removeItem("isLoggedIn");
  };

  const toggleWebsiteMode = () => {
    setWebsiteMode(!websiteMode);
  };

  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Navigate to="/dashboard" replace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/blogs"
          element={
            <ProtectedRoute>
              <MainLayout
                websiteMode={websiteMode}
                onLogout={handleLogout}
                onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                isSidebarOpen={isSidebarOpen}
                onModeToggle={toggleWebsiteMode}
              >
                <Blogs />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/branches"
          element={
            <ProtectedRoute>
              <MainLayout
                websiteMode={websiteMode}
                onLogout={handleLogout}
                onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                isSidebarOpen={isSidebarOpen}
                onModeToggle={toggleWebsiteMode}
              >
                <BranchManagement />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/testimonials"
          element={
            <ProtectedRoute>
              <MainLayout
                websiteMode={websiteMode}
                onLogout={handleLogout}
                onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                isSidebarOpen={isSidebarOpen}
                onModeToggle={toggleWebsiteMode}
              >
                <TestimonialManagement />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/language"
          element={
            <ProtectedRoute>
              <MainLayout
                websiteMode={websiteMode}
                onLogout={handleLogout}
                onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                isSidebarOpen={isSidebarOpen}
                onModeToggle={toggleWebsiteMode}
              >
                <LanguageManagement />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/web-about"
          element={
            <ProtectedRoute>
              <MainLayout
                websiteMode={websiteMode}
                onLogout={handleLogout}
                onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                isSidebarOpen={isSidebarOpen}
                onModeToggle={toggleWebsiteMode}
              >
                <AboutUsEditor />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/why-us"
          element={
            <ProtectedRoute>
              <MainLayout
                websiteMode={websiteMode}
                onLogout={handleLogout}
                onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                isSidebarOpen={isSidebarOpen}
                onModeToggle={toggleWebsiteMode}
              >
                <WhyUs />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/terms-conditions"
          element={
            <ProtectedRoute>
              <MainLayout
                websiteMode={websiteMode}
                onLogout={handleLogout}
                onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                isSidebarOpen={isSidebarOpen}
                onModeToggle={toggleWebsiteMode}
              >
                <TermsAnDCon />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/course-faq"
          element={
            <ProtectedRoute>
              <MainLayout
                websiteMode={websiteMode}
                onLogout={handleLogout}
                onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                isSidebarOpen={isSidebarOpen}
                onModeToggle={toggleWebsiteMode}
              >
                <CourseFAQEditor />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/company-details"
          element={
            <ProtectedRoute>
              <MainLayout
                websiteMode={websiteMode}
                onLogout={handleLogout}
                onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                isSidebarOpen={isSidebarOpen}
                onModeToggle={toggleWebsiteMode}
              >
                <ConfigDetailsForm />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/privacy-policy"
          element={
            <ProtectedRoute>
              <MainLayout
                websiteMode={websiteMode}
                onLogout={handleLogout}
                onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                isSidebarOpen={isSidebarOpen}
                onModeToggle={toggleWebsiteMode}
              >
                <PrivacyPolicy />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout
                websiteMode={websiteMode}
                onModeToggle={toggleWebsiteMode}
                onLogout={handleLogout}
                onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                isSidebarOpen={isSidebarOpen}
              >
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Course Management Routes */}
        <Route
          path="/exam-grade-system"
          element={
            <ProtectedRoute>
              <MainLayout
                websiteMode={websiteMode}
                onModeToggle={toggleWebsiteMode}
                onLogout={handleLogout}
                onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                isSidebarOpen={isSidebarOpen}
              >
                <ExamGradeSystem />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/subjects"
          element={
            <ProtectedRoute>
              <MainLayout
                websiteMode={websiteMode}
                onModeToggle={toggleWebsiteMode}
                onLogout={handleLogout}
                onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                isSidebarOpen={isSidebarOpen}
              >
                <Subjects />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/languages"
          element={
            <ProtectedRoute>
              <MainLayout
                websiteMode={websiteMode}
                onModeToggle={toggleWebsiteMode}
                onLogout={handleLogout}
                onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                isSidebarOpen={isSidebarOpen}
              >
                <Languages />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/course-categories"
          element={
            <ProtectedRoute>
              <MainLayout
                websiteMode={websiteMode}
                onModeToggle={toggleWebsiteMode}
                onLogout={handleLogout}
                onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                isSidebarOpen={isSidebarOpen}
              >
                <CourseCategories />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/course-award-categories"
          element={
            <ProtectedRoute>
              <MainLayout
                websiteMode={websiteMode}
                onModeToggle={toggleWebsiteMode}
                onLogout={handleLogout}
                onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                isSidebarOpen={isSidebarOpen}
              >
                <CourseAwardCategories />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Website Management Routes */}
        <Route
          path="/website-dashboard"
          element={
            <ProtectedRoute>
              <MainLayout
                websiteMode={websiteMode}
                onModeToggle={toggleWebsiteMode}
                onLogout={handleLogout}
                onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                isSidebarOpen={isSidebarOpen}
              >
                <WebsiteDashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/home-page"
          element={
            <ProtectedRoute>
              <MainLayout
                websiteMode={websiteMode}
                onModeToggle={toggleWebsiteMode}
                onLogout={handleLogout}
                onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                isSidebarOpen={isSidebarOpen}
              >
                <HomePage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/pages"
          element={
            <ProtectedRoute>
              <MainLayout
                websiteMode={websiteMode}
                onModeToggle={toggleWebsiteMode}
                onLogout={handleLogout}
                onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                isSidebarOpen={isSidebarOpen}
              >
                <Pages />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/media-library"
          element={
            <ProtectedRoute>
              <MainLayout
                websiteMode={websiteMode}
                onModeToggle={toggleWebsiteMode}
                onLogout={handleLogout}
                onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                isSidebarOpen={isSidebarOpen}
              >
                <MediaLibrary />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/user-management"
          element={
            <ProtectedRoute>
              <MainLayout
                websiteMode={websiteMode}
                onModeToggle={toggleWebsiteMode}
                onLogout={handleLogout}
                onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                isSidebarOpen={isSidebarOpen}
              >
                <UserManagement />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/website-settings"
          element={
            <ProtectedRoute>
              <MainLayout
                websiteMode={websiteMode}
                onModeToggle={toggleWebsiteMode}
                onLogout={handleLogout}
                onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                isSidebarOpen={isSidebarOpen}
              >
                <WebsiteSettings />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;

// import './App.css';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Error from './components/error/Error';
// import { sessionStorageGetItem } from './utils/globalFunction';
// // import Layout from './components/Layout/Layout';
// import Login from './pages/Login/Login';
// import { ToastContainer } from 'react-toastify';
// import Layout from './components/Layout/Layout';
// function App() {
//   return (
//     <>
//     <ToastContainer />
//       <Router>
//         <Routes>
//           <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
//           <Route path="/app/*" element={<PrivateRoute><Layout /></PrivateRoute>} />
//           <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
//           <Route path="*" element={<Error />} />
//         </Routes>
//       </Router>
//     </>
//   );
// }

// const PrivateRoute = ({ children }) => {
//   const isAuthenticated = sessionStorageGetItem();
//   return isAuthenticated ? children : <Navigate to="/login" replace />;
// };

// const PublicRoute = ({ children }) => {
//   return children;
// };

// export default App;
