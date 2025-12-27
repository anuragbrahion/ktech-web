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

// Import existing Course Management components
// import ExamGradeSystem from "./pages/ExamGradeSystem";
// import Subjects from "./pages/Subjects";
// import Languages from "./pages/Languages";
// import CourseCategories from "./pages/CourseCategories";
// import CourseAwardCategories from "./pages/CourseAwardCategories";

// Import new Employee Management components
import RoleManagement from "./pages/EmployeeManagement/RoleManagement";
import GoalManagement from "./pages/EmployeeManagement/GoalManagement";
import Designation from "./pages/EmployeeManagement/Designation";
import Department from "./pages/EmployeeManagement/Department";
import TeacherDirectory from "./pages/EmployeeManagement/TeacherDirectory";

// Import new Branch Management components
import BranchManagementNew from "./pages/BranchManagement/BranchManagement";
import VisitorsBook from "./pages/BranchManagement/VisitorsBook";
import ReferralAmount from "./pages/BranchManagement/ReferralAmount";
import RoleGoalAssign from "./pages/BranchManagement/RoleGoalAssign";

// Import new Course Management components
import CourseList from "./pages/CourseManagement/CourseList";
import CoursePlans from "./pages/CourseManagement/CoursePlans";
import CourseBatches from "./pages/CourseManagement/CourseBatches";
import InquirySource from "./pages/CourseManagement/InquirySource";
import InquiryStatus from "./pages/CourseManagement/InquiryStatus";
import ProductCategory from "./pages/CourseManagement/ProductCategory";

// Import new Student Management components
import Admission from "./pages/StudentManagement/Admission";
import ReAdmission from "./pages/StudentManagement/ReAdmission";
import Inquiry from "./pages/StudentManagement/Inquiry";
import StudentFeeSummary from "./pages/StudentManagement/StudentFeeSummary";

// Import new Request Management components
import AllRequest from "./pages/RequestManagement/AllRequest";
import RoleExamRequest from "./pages/RequestManagement/RoleExamRequest";
import GoalExamRequest from "./pages/RequestManagement/GoalExamRequest";
import CertificateRequestStatus from "./pages/RequestManagement/CertificateRequestStatus";
import LeaveRequest from "./pages/RequestManagement/LeaveRequest";
import Complaints from "./pages/RequestManagement/Complaints";

// Import new Attendance Management components
import MarkTeacherAttendance from "./pages/AttendanceManagement/MarkTeacherAttendance";
import MarkStudentAttendance from "./pages/AttendanceManagement/MarkStudentAttendance";

// Import new Certificate Management components
import StudentCertificate from "./pages/CertificateManagement/StudentCertificate";
import AllCertificate from "./pages/CertificateManagement/AllCertificate";

// Import new Config Management components
import ConfigInformation from "./pages/ConfigManagement/ConfigInformation";
import Config from "./pages/ConfigManagement/Config";

// Import new Financial Management components
import FinancialManagement from "./pages/FinancialManagement/FinancialManagement";
import Category from "./pages/FinancialManagement/Category";
import Transactions from "./pages/FinancialManagement/Transactions";

// Import new E-commerce Management components
import Ecommerce from "./pages/EcommerceManagement/Ecommerce";
import MyOrders from "./pages/EcommerceManagement/MyOrders";
import ContactUs from "./pages/EcommerceManagement/ContactUs";

// Import new User Management components
import Users from "./pages/UserManagement/Users";
import Profile from "./pages/UserManagement/Profile";
import Settings from "./pages/UserManagement/Settings";
import Logout from "./pages/UserManagement/Logout";
import LeaveType from "./pages/EmployeeManagement/LeaveType";
import AssignTask from "./pages/EmployeeManagement/AssignTask";
import AllAssignTask from "./pages/EmployeeManagement/AllAssignTask";

// Import new Examination Management components
// import Examinations from "./pages/ExaminationManagement/Examinations";
// import AllPastExaminationsList from "./pages/ExaminationManagement/AllPastExaminationsList";
// import StudentExaminations from "./pages/ExaminationManagement/StudentExaminations";
// import RoleExamination from "./pages/ExaminationManagement/RoleExamination";
// import GoalExamination from "./pages/ExaminationManagement/GoalExamination";

// Generic components for other routes
const Pages = () => <div>Pages</div>;
const MediaLibrary = () => <div>Media Library</div>;
const UserManagement = () => <div>User Management</div>;
const WebsiteSettings = () => <div>Website Settings</div>;

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
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => 
    localStorage.getItem("isLoggedIn") === "true"
  );
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

  const toggleWebsiteMode = () => setWebsiteMode(!websiteMode);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Helper function to render protected routes
  const renderProtectedRoute = (Component) => (
    <ProtectedRoute>
      <MainLayout
        websiteMode={websiteMode}
        onModeToggle={toggleWebsiteMode}
        onLogout={handleLogout}
        onSidebarToggle={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
      >
        <Component />
      </MainLayout>
    </ProtectedRoute>
  );

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

        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Dashboard */}
        <Route path="/dashboard" element={renderProtectedRoute(Dashboard)} />
        
        {/* Existing Website Management Routes */}
        <Route path="/blogs" element={renderProtectedRoute(Blogs)} />
        <Route path="/branches" element={renderProtectedRoute(BranchManagement)} />
        <Route path="/testimonials" element={renderProtectedRoute(TestimonialManagement)} />
        <Route path="/language" element={renderProtectedRoute(LanguageManagement)} />
        <Route path="/web-about" element={renderProtectedRoute(AboutUsEditor)} />
        <Route path="/why-us" element={renderProtectedRoute(WhyUs)} />
        <Route path="/terms-conditions" element={renderProtectedRoute(TermsAnDCon)} />
        <Route path="/course-faq" element={renderProtectedRoute(CourseFAQEditor)} />
        <Route path="/company-details" element={renderProtectedRoute(ConfigDetailsForm)} />
        <Route path="/privacy-policy" element={renderProtectedRoute(PrivacyPolicy)} />
        <Route path="/home-page" element={renderProtectedRoute(HomePage)} />
        
        {/* Existing Course Management Routes */}
        {/* <Route path="/exam-grade-system" element={renderProtectedRoute(ExamGradeSystem)} />
        <Route path="/subjects" element={renderProtectedRoute(Subjects)} />
        <Route path="/languages" element={renderProtectedRoute(Languages)} />
        <Route path="/course-categories" element={renderProtectedRoute(CourseCategories)} />
        <Route path="/course-award-categories" element={renderProtectedRoute(CourseAwardCategories)} /> */}
        <Route path="/website-dashboard" element={renderProtectedRoute(WebsiteDashboard)} />
        <Route path="/pages" element={renderProtectedRoute(Pages)} />
        <Route path="/media-library" element={renderProtectedRoute(MediaLibrary)} />
        <Route path="/user-management" element={renderProtectedRoute(UserManagement)} />
        <Route path="/website-settings" element={renderProtectedRoute(WebsiteSettings)} />
        
        {/* New Employee Management Routes */}
        <Route path="/role" element={renderProtectedRoute(RoleManagement)} />
        <Route path="/goal" element={renderProtectedRoute(GoalManagement)} />
        <Route path="/designation" element={renderProtectedRoute(Designation)} />
        <Route path="/department" element={renderProtectedRoute(Department)} />
        <Route path="/teacher-directory" element={renderProtectedRoute(TeacherDirectory)} />
        <Route path="/leave-type" element={renderProtectedRoute(LeaveType)} />
        <Route path="/assign-task" element={renderProtectedRoute(AssignTask)} />
        <Route path="/all-assign-task" element={renderProtectedRoute(AllAssignTask)} />

        
        {/* New Branch Management Routes */}
        <Route path="/branch-management" element={renderProtectedRoute(BranchManagementNew)} />
        <Route path="/visitors-book" element={renderProtectedRoute(VisitorsBook)} />
        <Route path="/referral-amount" element={renderProtectedRoute(ReferralAmount)} />
        <Route path="/role-goal-assign" element={renderProtectedRoute(RoleGoalAssign)} />
        
        {/* New Course Management Routes */}
        <Route path="/course-list" element={renderProtectedRoute(CourseList)} />
        <Route path="/course-plans" element={renderProtectedRoute(CoursePlans)} />
        <Route path="/course-batches" element={renderProtectedRoute(CourseBatches)} />
        <Route path="/inquiry-source" element={renderProtectedRoute(InquirySource)} />
        <Route path="/inquiry-status" element={renderProtectedRoute(InquiryStatus)} />
        <Route path="/product-category" element={renderProtectedRoute(ProductCategory)} />
        
        {/* New Student Information Routes */}
        <Route path="/admission" element={renderProtectedRoute(Admission)} />
        <Route path="/re-admission" element={renderProtectedRoute(ReAdmission)} />
        <Route path="/inquiry" element={renderProtectedRoute(Inquiry)} />
        <Route path="/student-fee-summary" element={renderProtectedRoute(StudentFeeSummary)} />
        
        {/* New Request Management Routes */}
        <Route path="/all-request" element={renderProtectedRoute(AllRequest)} />
        <Route path="/role-exam-request" element={renderProtectedRoute(RoleExamRequest)} />
        <Route path="/goal-exam-request" element={renderProtectedRoute(GoalExamRequest)} />
        <Route path="/certificate-request-status" element={renderProtectedRoute(CertificateRequestStatus)} />
        <Route path="/leave-request" element={renderProtectedRoute(LeaveRequest)} />
        <Route path="/complaints" element={renderProtectedRoute(Complaints)} />
        
        {/* New Attendance Routes */}
        <Route path="/mark-teacher-attendance" element={renderProtectedRoute(MarkTeacherAttendance)} />
        <Route path="/mark-student-attendance" element={renderProtectedRoute(MarkStudentAttendance)} />
        
        {/* New Certificate Routes */}
        <Route path="/student-certificate" element={renderProtectedRoute(StudentCertificate)} />
        <Route path="/all-certificate" element={renderProtectedRoute(AllCertificate)} />
        
        {/* New Configuration Routes */}
        <Route path="/config-information" element={renderProtectedRoute(ConfigInformation)} />
        <Route path="/config" element={renderProtectedRoute(Config)} />
        
        {/* New Financial Management Routes */}
        <Route path="/financial-management" element={renderProtectedRoute(FinancialManagement)} />
        <Route path="/financial-category" element={renderProtectedRoute(Category)} />
        <Route path="/transactions" element={renderProtectedRoute(Transactions)} />
        
        {/* New E-commerce Routes */}
        <Route path="/ecommerce" element={renderProtectedRoute(Ecommerce)} />
        <Route path="/my-orders" element={renderProtectedRoute(MyOrders)} />
        <Route path="/contact-us" element={renderProtectedRoute(ContactUs)} />
        
        {/* New User Management Routes */}
        <Route path="/users" element={renderProtectedRoute(Users)} />
        <Route path="/profile" element={renderProtectedRoute(Profile)} />
        <Route path="/settings" element={renderProtectedRoute(Settings)} />
        <Route path="/logout" element={renderProtectedRoute(Logout)} />
        
        {/* New Examination Routes */}
        {/* <Route path="/examinations" element={renderProtectedRoute(Examinations)} />
        <Route path="/all-past-exams" element={renderProtectedRoute(AllPastExaminationsList)} />
        <Route path="/student-exams" element={renderProtectedRoute(StudentExaminations)} />
        <Route path="/role-exams" element={renderProtectedRoute(RoleExamination)} />
        <Route path="/goal-exams" element={renderProtectedRoute(GoalExamination)} /> */}

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;