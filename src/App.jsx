/* eslint-disable no-unused-vars */
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Header from "./components/Header/Header";
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
import RoleManagement from "./pages/EmployeeManagement/RoleManagement";
import GoalManagement from "./pages/EmployeeManagement/GoalManagement";
import Designation from "./pages/EmployeeManagement/Designation";
import Department from "./pages/EmployeeManagement/Department";
import TeacherDirectory from "./pages/EmployeeManagement/TeacherDirectory";
import BranchManagementNew from "./pages/BranchManagement/BranchManagement";
import VisitorsBook from "./pages/BranchManagement/VisitorsBook";
import ReferralAmount from "./pages/BranchManagement/ReferralAmount";
import RoleGoalAssign from "./pages/BranchManagement/RoleGoalAssign";
import CourseList from "./pages/CourseManagement/CourseList";
import CoursePlans from "./pages/CourseManagement/CoursePlans";
import CourseBatches from "./pages/CourseManagement/CourseBatches";
import InquirySource from "./pages/CourseManagement/InquirySource";
import InquiryStatus from "./pages/CourseManagement/InquiryStatus";
import ProductCategory from "./pages/CourseManagement/ProductCategory";
import Admission from "./pages/StudentManagement/Admission";
import ReAdmission from "./pages/StudentManagement/ReAdmission";
import Inquiry from "./pages/StudentManagement/Inquiry";
import StudentFeeSummary from "./pages/StudentManagement/StudentFeeSummary";
import RoleExamRequest from "./pages/RequestManagement/RoleExamRequest";
import GoalExamRequest from "./pages/RequestManagement/GoalExamRequest";
import CertificateRequestStatus from "./pages/RequestManagement/CertificateRequestStatus";
import LeaveRequest from "./pages/RequestManagement/LeaveRequest";
import Complaints from "./pages/RequestManagement/Complaints";
import MarkTeacherAttendance from "./pages/AttendanceManagement/MarkTeacherAttendance";
import MarkStudentAttendance from "./pages/AttendanceManagement/MarkStudentAttendance";
import AllCertificate from "./pages/CertificateManagement/AllCertificate";
import Config from "./pages/ConfigManagement/Config";
import Category from "./pages/FinancialManagement/Category";
import Transactions from "./pages/FinancialManagement/Transactions";
import Ecommerce from "./pages/EcommerceManagement/Ecommerce";
import MyOrders from "./pages/EcommerceManagement/MyOrders";
import ContactUs from "./pages/EcommerceManagement/ContactUs";
import Users from "./pages/UserManagement/Users";
import Profile from "./pages/UserManagement/Profile";
import Settings from "./pages/UserManagement/Settings";
import Logout from "./pages/UserManagement/Logout";
import LeaveType from "./pages/EmployeeManagement/LeaveType";
import AssignTask from "./pages/EmployeeManagement/AssignTask";
import AllAssignTask from "./pages/EmployeeManagement/AllAssignTask";
import CourseCategory from "./pages/CourseManagement/CourseCategory";
import AllPastExaminationsList from "./pages/ExaminationsManagement/AllPastExaminationsList";
import StudentExaminations from "./pages/ExaminationsManagement/StudentExaminations";
import RoleExamination from "./pages/ExaminationsManagement/RoleExamination";
import GoalExamination from "./pages/ExaminationsManagement/GoalExamination";
import LandingPage from "./pages/LandingPage/LandingPage";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import BlogCategoryManagement from "./pages/WebsiteManagement/Blogs/BlogCategoryManagement";
import Sidebar from "./components/Sidebar/Sidebar";
import TeacherDashboard from "./pages/Dashboard/TeacherDashboard";
import HallTickets from "./pages/ExaminationsManagement/HallTickets";
import TeacherIncentive from "./pages/Teachers/TeacherIncentive";
import TeacherAttendance from "./pages/Teachers/TeacherAttendance";
import TeacherLeaveRequest from "./pages/Teachers/TeacherLeaveRequest";
import StudentAttendanceList from "./pages/Teachers/StudentAttendanceList";
import MyTasks from "./pages/Teachers/MyTasks";
import RoleAssign from "./pages/Teachers/RoleAssign";
import GoalAssign from "./pages/Teachers/GoalAssign";
import PastExams from "./pages/Teachers/PastExams";
import StudentDashboard from "./pages/Students/Dashboard";
import StudentMyAttendance from "./pages/Students/AttendanceList";
import StudentLeaveRequest from "./pages/Students/LeaveRequest";
import StudentPastExams from "./pages/Students/PastExams";
import StudentMyCourses from "./pages/Students/MyCourses";
import StudentMyExams from "./pages/Students/MyExams";
import StudentReferralAmount from "./pages/Students/ReferralAmount";
import ExamPage from "./pages/Students/ExamPage";
import ExamResults from "./components/ExamResults";
import RuleAndRegulation from "./pages/EmployeeManagement/RuleAndRegulation";
import EmployeeRulesAndRegulations from "./pages/EmployeeManagement/EmployeeRulesAndRegulations";
import BlogList from "./components/BlogList";
import BlogDetail from "./components/BlogDetail";

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

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
};

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [websiteMode, setWebsiteMode] = React.useState(false);
  const toggleWebsiteMode = () => setWebsiteMode(!websiteMode);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const getUserData = () => {
    const userData = sessionStorage.getItem("data");
    return userData ? JSON.parse(userData) : null;
  };

  const role = getUserData();
  const roleData = role?.role?.toLowerCase();

  const renderMainLayout = (Component) => (
    <MainLayout
      websiteMode={websiteMode}
      onModeToggle={toggleWebsiteMode}
      onLogout={() => {}}
      onSidebarToggle={toggleSidebar}
      isSidebarOpen={isSidebarOpen}
    >
      <Component />
    </MainLayout>
  );

  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Navigate to="/welcome" replace />} />

        <Route
          path="/welcome"
          element={
            <PublicRoute>
              <LandingPage />
            </PublicRoute>
          }
        />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />

        <Route
          path="/reset-password"
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />

        <Route
          path="/teacher-dashboard"
          element={
            <ProtectedRoute>
              {renderMainLayout(TeacherDashboard)}
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/incentive"
          element={
            <ProtectedRoute>
              {renderMainLayout(TeacherIncentive)}
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/attendance"
          element={
            <ProtectedRoute>
              {renderMainLayout(TeacherAttendance)}
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/leave-request"
          element={
            <ProtectedRoute>
              {renderMainLayout(TeacherLeaveRequest)}
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/student-attendance"
          element={
            <ProtectedRoute>
              {renderMainLayout(StudentAttendanceList)}
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/role-assign"
          element={
            <ProtectedRoute>{renderMainLayout(RoleAssign)}</ProtectedRoute>
          }
        />

        <Route
          path="/teacher/goal-assign"
          element={
            <ProtectedRoute>{renderMainLayout(GoalAssign)}</ProtectedRoute>
          }
        />

        <Route
          path="/teacher/my-tasks"
          element={<ProtectedRoute>{renderMainLayout(MyTasks)}</ProtectedRoute>}
        />

        <Route
          path="/teacher/past-exams"
          element={
            <ProtectedRoute>{renderMainLayout(PastExams)}</ProtectedRoute>
          }
        />

        <Route
          path="/teacher/rules-and-regulations"
          element={
            <ProtectedRoute>
              {renderMainLayout(() => (
                <EmployeeRulesAndRegulations roleData={roleData} />
              ))}
            </ProtectedRoute>
          }
        />

        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute>
              {renderMainLayout(StudentDashboard)}
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/referral-amount"
          element={
            <ProtectedRoute>
              {renderMainLayout(StudentReferralAmount)}
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/attendance"
          element={
            <ProtectedRoute>
              {renderMainLayout(StudentMyAttendance)}
            </ProtectedRoute>
          }
        />

        <Route
          path="/exam-results"
          element={
            <ProtectedRoute>
              <ExamResults />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/leave-request"
          element={
            <ProtectedRoute>
              {renderMainLayout(StudentLeaveRequest)}
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/my-courses"
          element={
            <ProtectedRoute>
              {renderMainLayout(StudentMyCourses)}
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/my-exams"
          element={
            <ProtectedRoute>{renderMainLayout(StudentMyExams)}</ProtectedRoute>
          }
        />

        <Route
          path="/student/my-exams/:examId"
          element={
            <ProtectedRoute>{renderMainLayout(StudentMyExams)}</ProtectedRoute>
          }
        />

        <Route
          path="/student/past-exams"
          element={
            <ProtectedRoute>
              {renderMainLayout(StudentPastExams)}
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/rules-and-regulations"
          element={
            <ProtectedRoute>
              {renderMainLayout(() => (
                <EmployeeRulesAndRegulations roleData={roleData} />
              ))}
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>{renderMainLayout(Dashboard)}</ProtectedRoute>
          }
        />

        {/* Blog Routes - Keep only these */}
        <Route
          path="/blogs"
          element={
            <ProtectedRoute>{renderMainLayout(BlogList)}</ProtectedRoute>
          }
        />

        <Route
          path="/blog/:id"
          element={
            <PublicRoute>
              <BlogDetail />
            </PublicRoute>
          }
        />

        <Route
          path="/category"
          element={
            <ProtectedRoute>
              {renderMainLayout(() => (
                <BlogCategoryManagement roleData={roleData} adminId={role.id} />
              ))}
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-blogs"
          element={
            <ProtectedRoute>
              {renderMainLayout(() => (
                <Blogs roleData={roleData} adminId={role.id} />
              ))}
            </ProtectedRoute>
          }
        />

        <Route
          path="/branches"
          element={
            <ProtectedRoute>
              {renderMainLayout(() => (
                <BranchManagement roleData={roleData} />
              ))}
            </ProtectedRoute>
          }
        />
        <Route
          path="/testimonials"
          element={
            <ProtectedRoute>
              {renderMainLayout(() => (
                <TestimonialManagement roleData={roleData} />
              ))}
            </ProtectedRoute>
          }
        />

        <Route
          path="/language"
          element={
            <ProtectedRoute>
              {renderMainLayout(() => (
                <LanguageManagement roleData={roleData} adminId={role.id} />
              ))}
            </ProtectedRoute>
          }
        />

        <Route
          path="/web-about"
          element={
            <ProtectedRoute>{renderMainLayout(AboutUsEditor)}</ProtectedRoute>
          }
        />

        <Route
          path="/why-us"
          element={<ProtectedRoute>{renderMainLayout(WhyUs)}</ProtectedRoute>}
        />

        <Route
          path="/terms-conditions"
          element={
            <ProtectedRoute>{renderMainLayout(TermsAnDCon)}</ProtectedRoute>
          }
        />

        <Route
          path="/course-faq"
          element={
            <ProtectedRoute>{renderMainLayout(CourseFAQEditor)}</ProtectedRoute>
          }
        />

        <Route
          path="/company-details"
          element={
            <ProtectedRoute>
              {renderMainLayout(ConfigDetailsForm)}
            </ProtectedRoute>
          }
        />

        <Route
          path="/privacy-policy"
          element={
            <ProtectedRoute>{renderMainLayout(PrivacyPolicy)}</ProtectedRoute>
          }
        />

        <Route
          path="/home-page"
          element={
            <ProtectedRoute>{renderMainLayout(HomePage)}</ProtectedRoute>
          }
        />

        <Route
          path="/website-dashboard"
          element={
            <ProtectedRoute>
              {renderMainLayout(WebsiteDashboard)}
            </ProtectedRoute>
          }
        />

        <Route
          path="/role"
          element={
            <ProtectedRoute>
              {renderMainLayout(() => (
                <RoleManagement roleData={roleData} />
              ))}
            </ProtectedRoute>
          }
        />

        <Route
          path="/goal"
          element={
            <ProtectedRoute>
              {renderMainLayout(() => (
                <GoalManagement roleData={roleData} />
              ))}
            </ProtectedRoute>
          }
        />

        <Route
          path="/designation"
          element={
            <ProtectedRoute>
              {renderMainLayout(() => (
                <Designation roleData={roleData} adminId={role.id} />
              ))}
            </ProtectedRoute>
          }
        />

        <Route
          path="/department"
          element={
            <ProtectedRoute>
              {renderMainLayout(() => (
                <Department roleData={roleData} adminId={role.id} />
              ))}
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher-directory"
          element={
            <ProtectedRoute>
              {renderMainLayout(() => (
                <TeacherDirectory roleData={roleData} adminId={role.id} />
              ))}
            </ProtectedRoute>
          }
        />

        <Route
          path="/leave-type"
          element={
            <ProtectedRoute>
              {renderMainLayout(() => (
                <LeaveType roleData={roleData} adminId={role.id} />
              ))}
            </ProtectedRoute>
          }
        />

        <Route
          path="/assign-task"
          element={
            <ProtectedRoute>
              {renderMainLayout(() => (
                <AssignTask roleData={roleData} adminId={role.id} />
              ))}
            </ProtectedRoute>
          }
        />

        <Route
          path="/all-assign-task"
          element={
            <ProtectedRoute>
              {renderMainLayout(() => (
                <AllAssignTask roleData={roleData} />
              ))}
            </ProtectedRoute>
          }
        />

        <Route
          path="/rules-and-regulations"
          element={
            <ProtectedRoute>
              {renderMainLayout(() => (
                <RuleAndRegulation roleData={roleData} />
              ))}
            </ProtectedRoute>
          }
        />

        <Route
          path="/branch-management"
          element={
            <ProtectedRoute>
              {renderMainLayout(BranchManagementNew)}
            </ProtectedRoute>
          }
        />

        <Route
          path="/visitors-book"
          element={
            <ProtectedRoute>
              {renderMainLayout(() => (
                <VisitorsBook roleData={roleData} adminId={role.id} />
              ))}
            </ProtectedRoute>
          }
        />

        <Route
          path="/referral-amount"
          element={
            <ProtectedRoute>
              {renderMainLayout(() => (
                <ReferralAmount roleData={roleData} />
              ))}
            </ProtectedRoute>
          }
        />

        <Route
          path="/role-goal-assign"
          element={
            <ProtectedRoute>
              {renderMainLayout(() => (
                <RoleGoalAssign roleData={roleData} />
              ))}
            </ProtectedRoute>
          }
        />

        <Route
          path="/course-list"
          element={
            <ProtectedRoute>
              {renderMainLayout(() => (
                <CourseList roleData={roleData} adminId={role.id} />
              ))}
            </ProtectedRoute>
          }
        />

        <Route
          path="/course-categories"
          element={
            <ProtectedRoute>{renderMainLayout(CourseCategory)}</ProtectedRoute>
          }
        />

        <Route
          path="/course-plans"
          element={
            <ProtectedRoute>
              {renderMainLayout(() => (
                <CoursePlans roleData={roleData} adminId={role.id} />
              ))}
            </ProtectedRoute>
          }
        />

        <Route
          path="/course-batches"
          element={
            <ProtectedRoute>
              {renderMainLayout(() => (
                <CourseBatches roleData={roleData} adminId={role.id} />
              ))}
            </ProtectedRoute>
          }
        />

        <Route
          path="/inquiry-source"
          element={
            <ProtectedRoute>
              {renderMainLayout(() => (
                <InquirySource roleData={roleData} adminId={role.id} />
              ))}
            </ProtectedRoute>
          }
        />

        <Route
          path="/inquiry-status"
          element={
            <ProtectedRoute>
              {renderMainLayout(() => (
                <InquiryStatus roleData={roleData} adminId={role.id} />
              ))}
            </ProtectedRoute>
          }
        />

        <Route
          path="/product-category"
          element={
            <ProtectedRoute>
              {renderMainLayout(() => (
                <ProductCategory roleData={roleData} />
              ))}
            </ProtectedRoute>
          }
        />

        <Route
          path="/admission"
          element={
            <ProtectedRoute>{renderMainLayout(Admission)}</ProtectedRoute>
          }
        />

        <Route
          path="/re-admission"
          element={
            <ProtectedRoute>{renderMainLayout(ReAdmission)}</ProtectedRoute>
          }
        />

        <Route
          path="/inquiry"
          element={
            <ProtectedRoute>
              {renderMainLayout(() => (
                <Inquiry adminId={role.id} />
              ))}
            </ProtectedRoute>
          }
        />

        <Route
          path="/student-fee-summary"
          element={
            <ProtectedRoute>
              {renderMainLayout(StudentFeeSummary)}
            </ProtectedRoute>
          }
        />

        <Route
          path="/role-exam-request"
          element={
            <ProtectedRoute>
              {renderMainLayout(() => (
                <RoleExamRequest roleData={roleData} adminId={role.id} />
              ))}
            </ProtectedRoute>
          }
        />

        <Route
          path="/goal-exam-request"
          element={
            <ProtectedRoute>
              {renderMainLayout(() => (
                <GoalExamRequest roleData={roleData} adminId={role.id} />
              ))}
            </ProtectedRoute>
          }
        />

        <Route
          path="/certificate-request-status"
          element={
            <ProtectedRoute>
              {renderMainLayout(CertificateRequestStatus)}
            </ProtectedRoute>
          }
        />

        <Route
          path="/leave-request"
          element={
            <ProtectedRoute>{renderMainLayout(LeaveRequest)}</ProtectedRoute>
          }
        />

        <Route
          path="/complaints"
          element={
            <ProtectedRoute>{renderMainLayout(Complaints)}</ProtectedRoute>
          }
        />

        <Route
          path="/mark-teacher-attendance"
          element={
            <ProtectedRoute>
              {renderMainLayout(() => (
                <MarkTeacherAttendance roleData={roleData} adminId={role.id} />
              ))}
            </ProtectedRoute>
          }
        />

        <Route
          path="/mark-student-attendance"
          element={
            <ProtectedRoute>
              {renderMainLayout(() => (
                <MarkStudentAttendance roleData={roleData} adminId={role.id} />
              ))}
            </ProtectedRoute>
          }
        />

        <Route
          path="/all-certificate"
          element={
            <ProtectedRoute>{renderMainLayout(AllCertificate)}</ProtectedRoute>
          }
        />

        <Route
          path="/config"
          element={<ProtectedRoute>{renderMainLayout(Config)}</ProtectedRoute>}
        />

        <Route
          path="/financial-category"
          element={
            <ProtectedRoute>{renderMainLayout(Category)}</ProtectedRoute>
          }
        />

        <Route
          path="/transactions"
          element={
            <ProtectedRoute>{renderMainLayout(Transactions)}</ProtectedRoute>
          }
        />

        <Route
          path="/ecommerce"
          element={
            <ProtectedRoute>
              {renderMainLayout(() => (
                <Ecommerce roleData={roleData} />
              ))}
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-orders"
          element={
            <ProtectedRoute>{renderMainLayout(MyOrders)}</ProtectedRoute>
          }
        />

        <Route
          path="/contact-us"
          element={
            <ProtectedRoute>{renderMainLayout(ContactUs)}</ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute>
              {renderMainLayout(() => (
                <Users roleData={roleData} adminId={role.id} />
              ))}
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={<ProtectedRoute>{renderMainLayout(Profile)}</ProtectedRoute>}
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>{renderMainLayout(Settings)}</ProtectedRoute>
          }
        />

        <Route
          path="/logout"
          element={<ProtectedRoute>{renderMainLayout(Logout)}</ProtectedRoute>}
        />

        <Route
          path="/all-past-exams"
          element={
            <ProtectedRoute>
              {renderMainLayout(AllPastExaminationsList)}
            </ProtectedRoute>
          }
        />

        <Route
          path="/student-exams"
          element={
            <ProtectedRoute>
              {renderMainLayout(StudentExaminations)}
            </ProtectedRoute>
          }
        />

        <Route
          path="/role-exams"
          element={
            <ProtectedRoute>{renderMainLayout(RoleExamination)}</ProtectedRoute>
          }
        />

        <Route
          path="/goal-exams"
          element={
            <ProtectedRoute>{renderMainLayout(GoalExamination)}</ProtectedRoute>
          }
        />
        <Route
          path="/hall-tickets"
          element={
            <ProtectedRoute>{renderMainLayout(HallTickets)}</ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/welcome" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
