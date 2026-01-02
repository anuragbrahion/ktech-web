import React from "react";
import { Menu, User, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Header = ({ isSidebarOpen, onSidebarToggle, websiteMode, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    const pathMap = {
      "/dashboard": "Dashboard",
      "/website-dashboard": "Website Dashboard",
      "/home-page": "Home Page Editor",
      "/exam-grade-system": "Exam Grade System",
      "/subjects": "Subjects",
      "/languages": "Languages",
      "/course-categories": "Course Categories",
      "/course-award-categories": "Course Award Categories",
      "/pages": "Pages Management",
      "/media-library": "Media Library",
      "/user-management": "User Management",
      "/website-settings": "Website Settings",
    };

    return (
      pathMap[path] ||
      (websiteMode ? "Website Management" : "Course Management")
    );
  };

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
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
              <div
                className={`w-2 h-8 rounded-full bg-gradient-to-b ${
                  websiteMode
                    ? "from-emerald-500 to-teal-600"
                    : "from-blue-500 to-purple-600"
                }`}
              ></div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                  {getPageTitle()}
                </h1>
                <p className="text-sm text-gray-500 hidden sm:block">
                  {websiteMode
                    ? "Website Administration Panel"
                    : "Course Management Panel"}
                </p>
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