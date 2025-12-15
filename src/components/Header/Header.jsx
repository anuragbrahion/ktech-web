import { Menu } from "lucide-react";
import React, {useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { viewProfile } from "../../redux/slices/AuthSlice";

const DashboardHeader = ({ isOpen, setIsOpen }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const location = useLocation();
  const dispatch=useDispatch()
  useEffect(()=>{
     dispatch(viewProfile())
  },[])
  const selector=useSelector((state)=>state.auth)
  const viewProfileData=selector?.viewProfileData?.data?.data
  const getPageTitle = () => {
    switch (location.pathname) {
      case "/app/dashboard":
        return "Dashboard Overview";
      case "/app/users":
        return "User Management";
      case "/app/cms":
        return "Content Management";
      case "/app/rbac":
        return "Role-Based Access Control";
      case "/app/notifications":
        return "Notifications";
      case "/app/support":
        return "Help & Support";
      case "/app/learning":
        return "Learning Content";
      case "/app/subscription":
        return "Subscription & Plans";
      case "/app/reports":
        return "Reports & Analytics";
      case "/app/child-activity":
        return "Child Activity";
      case "/app/language":
        return "Language & Voice";
      case "/app/setting":
        return "App Setting"
      case "/app/categories":                                                                                                                                                                                    
        return "Content Categories"
       case "/app/admin":
        return "Admin Management"
        
      default:
        return "";
    }
  };

  return (
    <header className="bg-white sticky top-0 z-30 shadow-sm">
      <div className="px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18 md:h-20 gap-2 sm:gap-3 md:gap-4">
          {/* Left side - Menu + Page title */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            {/* Mobile menu button */}
            <button
              className="lg:hidden flex-shrink-0 text-white bg-purple-700 hover:bg-purple-800 p-1.5 sm:p-2 rounded-md transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Page title */}
            <h1 className="font-bold text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-900 truncate">
              {getPageTitle()}
            </h1>
          </div>

          {/* Right side - Search + Icons + Profile */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-shrink-0">
            {/* Search bar - Only on larger screens */}
            {/* Notification icon */}
            <button
              className="p-1 sm:p-1.5 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 relative transition-colors flex-shrink-0"
              aria-label="Notifications"
            >
              <span className="absolute w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full top-1 right-1 sm:top-1.5 sm:right-1.5 bg-[#EA8F95]"></span>
              <svg
                className="h-5 w-5 sm:h-6 sm:w-6"
                fill="#5041BC"
                viewBox="0 0 24 24"
                stroke="#5041BC"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={0}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>

            {/* User profile */}
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-1.5 sm:gap-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all"
                aria-label="User profile"
              >
                {/* Avatar */}
                <div className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-medium text-xs sm:text-sm">
                    {/* <FaUser className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> */}
                    <img src={viewProfileData?.profilePictureUrl || <FaUser/>} className="w-13 h-13 rounded-full"/>
                  </span>
                </div>

                {/* Name - Hidden on mobile */}
                <span className="hidden sm:hidden md:block font-medium text-gray-700 text-xs lg:text-sm whitespace-nowrap">
                 {viewProfileData?.firstName} {viewProfileData?.lastName}
                </span>

                {/* Dropdown arrow */}
                <svg
                  className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* Profile Dropdown - Optional */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200">
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Profile
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Settings
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;