import React from "react";
import { Menu, User, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Header = ({ onSidebarToggle, websiteMode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    const pathMap = {
      "/dashboard": "Dashboard",
      "/student-dashboard": "Dashboard",
      "/website-dashboard": "Website Dashboard",
      "/home-page": "Website Management > Home Page",
      "/blogs": "Website Management > Blogs",
      "/category": "Website Management >  Category",
      "/branches": "Website Management > Branches",
      "/testimonials": "Website Management > Testimonials",
      "/web-about": "Website Management > About Us",
      "/why-us": "Website Management > Why Us",
      "/terms-conditions": "Website Management > Terms & Conditions",
      "/course-faq": "Website Management > Course FAQ",
      "/privacy-policy": "Website Management > Privacy Policy",
      "/company-details": "Website Management > Company Details",

      "/designation": "Employee Management > Designation",
      "/department": "Employee Management > Department",
      "/leave-type": "Employee Management > Leave Type",
      "/role": "Employee Management > Role",

      "/referral-amount": "Branch Management > Referral Amount",
      "/inquiry-status": "Branch Management > Inquiry Status",
      "/inquiry-source": "Branch Management > Inquiry Source",
      "/visitors-book": "Branch Management > Visitors Book",

      "/inquiry": "Student Management > Inquiry",

      "/course-list":"Course Management > Courses",
      "/course-plans":"Course Management > Plans",
      "/course-batches":"Course Management > Batches",

      "/exam-grade-system": "Exam Grade System",
      "/subjects": "Subjects",
      "/languages": "Languages",
      "/course-categories": "Course Categories",
      "/course-award-categories": "Course Award Categories",
      "/pages": "Pages Management",
      "/media-library": "Media Library",
      "/user-management": "User Management",
      "/website-settings": "Website Settings",
      "/teacher/incentive": "My Incentives",
      "/teacher/attendance": "My Attendance Report",
      "/teacher/leave-request": "My Leave Request",
      "/teacher/student-attendance": "Student Attendance Report",
      "/teacher/my-tasks": "My Tasks",
      "/teacher/role-assign": "Role Assign",
      "/teacher/goal-assign": "Goal Assign",
      "/teacher/past-exams": "Exam Result",
      "/student/attendance": "My Attendance Report",
      "/student/leave-request": "My Leave Request",
      "/student/past-exams": "Exam Result",
      "/student/my-courses": "My Courses",
      "/student/referral-amount": "Referral Amount",
      "/language": "Website Management > Languages",
    };

    return (
      pathMap[path] ||
      (websiteMode ? "Website Management" : "Course Management")
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    sessionStorage.removeItem("data");
    navigate("/welcome");
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30 h-16">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onSidebarToggle}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>

            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-800">
                  {getPageTitle()}
                </h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all duration-300 shadow-sm hover:shadow"
              title="Profile"
            >
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              <span className="font-medium text-sm sm:text-base hidden sm:inline">
                Profile
              </span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 shadow-md hover:shadow-lg"
              title="Logout"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-medium text-sm sm:text-base hidden sm:inline">
                Log out
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
