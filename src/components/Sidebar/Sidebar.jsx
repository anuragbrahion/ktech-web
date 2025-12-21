import React from "react";
import {
  Home,
  Award,
  BookOpen,
  Globe,
  Grid,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Layout,
  FileText,
  Image,
  Users,
  Settings,
  GitBranch,
  MessageSquare,
  Languages,
  Info,
  HelpCircle,
  FileCheck,
  Shield,
  Building2,
  
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Sidebar = ({ isOpen, onToggle, websiteMode, onModeToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const courseOptions = [
    { id: "exam", label: "Exam Grade System", icon: Award, path: "/exam-grade-system" },
    { id: "subjects", label: "Subjects", icon: BookOpen, path: "/subjects" },
    { id: "languages", label: "Languages", icon: Globe, path: "/languages" },
    { id: "categories", label: "Course Categories", icon: Grid, path: "/course-categories" },
    { id: "awards", label: "Course Award Categories", icon: Grid, path: "/course-award-categories" },
  ];

const websiteOptions = [
  { id: "homePage", label: "Home Page", icon: Home, path: "/home-page" },
  { id: "blogs", label: "Blogs", icon: FileText, path: "/blogs" },
  { id: "branches", label: "Branches", icon: GitBranch, path: "/branches" },
  { id: "testimonials", label: "Testimonials", icon: MessageSquare, path: "/testimonials" },
  { id: "language", label: "Language", icon: Languages, path: "/language" },
  { id: "aboutUs", label: "About Us", icon: Info, path: "/web-about" },
  { id: "whyUs", label: "Why Us", icon: HelpCircle, path: "/why-us" },
  { id: "terms", label: "Terms & Conditions", icon: FileCheck, path: "/terms-conditions" },
  { id: "courseFaq", label: "Course FAQ", icon: BookOpen, path: "/course-faq" },
  { id: "privacyPolicy", label: "Privacy Policy", icon: Shield, path: "/privacy-policy" },
  { id: "companyDetails", label: "Company Details", icon: Building2, path: "/company-details" },
];
  const currentOptions = websiteMode ? websiteOptions : courseOptions;

  const handleModeToggle = () => {
    onModeToggle();
    navigate(websiteMode ? "/dashboard" : "/website-dashboard");
  };

  const NavItem = ({ to, icon: Icon, label }) => {
    const active = location.pathname === to;
    return (
      <Link
        to={to}
        className={`group flex items-center ${
          isOpen ? "justify-start px-4" : "justify-center"
        } py-3 rounded-xl transition-all ${
          active
            ? "bg-blue-600 text-white"
            : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        <Icon className="w-5 h-5 shrink-0" />
        {isOpen && <span className="ml-3 text-sm font-medium truncate">{label}</span>}
      </Link>
    );
  };

  return (
    <>
      {isOpen && (
        <div
          onClick={onToggle}
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:relative z-30 h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 overflow-hidden
        ${isOpen ? "w-72" : "w-16"}`}
      >
        <div className="h-16 flex items-center justify-between px-3 border-b border-gray-200">
          {isOpen ? (
            <Link to="/dashboard" className="flex items-center gap-2">
              <img src="/logonew.jpeg" className="w-9 h-9 rounded-lg object-cover" />
            </Link>
          ) : (
            <img src="/logonew.jpeg" className="w-9 h-9 rounded-lg mx-auto" />
          )}

          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg hover:bg-gray-100"
          >
            {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>

        <div className={`px-3 py-4 ${isOpen ? "block" : "hidden"}`}>
          <button
            onClick={handleModeToggle}
            className={`w-full flex items-center justify-center gap-2 text-white py-2.5 rounded-xl text-sm font-medium transition
            ${
              websiteMode
                ? "bg-gradient-to-r from-emerald-500 to-teal-600"
                : "bg-gradient-to-r from-blue-600 to-purple-600"
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            {websiteMode ? "Switch to Course" : "Switch to Website"}
          </button>
        </div>

        <nav className="flex-1 px-2 space-y-1 overflow-y-auto">
          <NavItem to="/dashboard" icon={Home} label="Dashboard" />

          {isOpen && (
            <p className="mt-6 mb-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {websiteMode ? "Website Management" : "Courses"}
            </p>
          )}

          {currentOptions.map((item) => (
            <NavItem
              key={item.id}
              to={item.path}
              icon={item.icon}
              label={item.label}
            />
          ))}
        </nav>

        <div className={`border-t border-gray-200 p-3 text-xs text-gray-500 ${isOpen ? "block" : "hidden"}`}>
          <p>Version 1.0.0</p>
          <p>© 2024 Institution</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;


// import React, { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import sidebarData from "./Sidebar.json";
// import * as Icons from "react-icons/fa";
// import * as Icons2 from "react-icons/md";
// import { FiLogOut } from "react-icons/fi";
// import { IoClose, IoChevronDown, IoChevronForward } from "react-icons/io5";

// const Sidebar = ({ isOpen, setIsOpen }) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [openMenus, setOpenMenus] = useState({});

//   const handleClick = (path) => {
//     navigate(path);
//     setIsOpen(false);
//   };

//   const toggleMenu = (label) => {
//     setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
//   };

//   const getIcon = (item, isActive) => {
//     if (!item) return null;
//     const iconName =
//       isActive && item.iconActive
//         ? item.iconActive
//         : item.iconInActive || item.icon;
//     if (!iconName) return null;

//     const isImage =
//       iconName.startsWith("/") ||
//       /^https?:\/\/.*\.(png|jpg|jpeg|svg|gif|webp)$/i.test(iconName);

//     if (isImage) {
//       return (
//         <img
//           src={iconName}
//           alt="icon"
//           className="w-5 h-5 object-contain"
//           onError={(e) => (e.target.style.display = "none")}
//         />
//       );
//     }

//     const Icon = Icons[iconName] || Icons2[iconName] || Icons["FaRegCircle"];
//     return <Icon className="w-5 h-5" />;
//   };

//   return (
//     <>
//       <div
//         className={`border bg-[#7038C4] fixed top-0 left-0 h-full w-full sm:w-80 md:w-72 lg:w-64 xl:w-72 flex flex-col justify-between transition-transform duration-300 z-40 ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 px-4"
//           }`}
//       >
//         {/* Header */}
//         <div>
//           <div className="flex flex-col mb-6 sm:mb-8">
//             <div className="flex items-center justify-between lg:justify-center pt-4 sm:pt-5 lg:pt-6">
//               <img
//                 src={sidebarData.SidebarHeader.logo}
//                 alt="logo"
//                 className="w-36 h-16 sm:w-40 sm:h-18 md:w-44 md:h-19 lg:w-48 lg:h-20 object-contain"
//               />
//               <IoClose
//                 size={28}
//                 color="#ffffff"
//                 className="lg:hidden cursor-pointer hover:opacity-80 transition-opacity"
//                 onClick={() => setIsOpen(false)}
//               />
//             </div>

//             <div className="mt-3 sm:mt-4 flex w-full justify-center">
//               <div className="w-28 sm:w-32 md:w-36 lg:w-40 xl:w-48">
//                 <img src="/border.png" alt="border" className="w-full" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Scrollable Menu */}
//         <div className="flex-1 overflow-y-auto no-scrollbar hide-scrollbar">
//           <nav className="flex flex-col w-full space-y-2 sm:space-y-3 pb-4">
//             {sidebarData.MENU.map((item, index) => {
//               const active = location.pathname.startsWith(item.location);
//               const hasChildren = item.children && item.children.length > 0;
//               const isOpenMenu = openMenus[item.label];

//               return (
//                 <div key={index}>
//                   <div
//                     onClick={() =>
//                       hasChildren ? toggleMenu(item.label) : handleClick(item.location)
//                     }
//                     className={`flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg cursor-pointer transition-all ${active
//                         ? "bg-white text-purple-700 font-semibold"
//                         : "text-white/80 bg-[#E2DEF90A] hover:text-white hover:bg-[#E2DEF915]"
//                       }`}
//                   >
//                     <div className="flex items-center gap-2 sm:gap-3">
//                       {getIcon(item, active)}
//                       <span className="text-sm sm:text-base whitespace-nowrap overflow-hidden text-ellipsis">
//                         {item.label}
//                       </span>
//                     </div>

//                     {hasChildren &&
//                       (isOpenMenu ? (
//                         <IoChevronDown size={16} />
//                       ) : (
//                         <IoChevronForward size={16} />
//                       ))}
//                   </div>

//                   {hasChildren && isOpenMenu && (
//                     <div className="ml-10 mt-1 flex flex-col space-y-1">
//                       {item.children.map((child, i) => {
//                         const childActive = location.pathname === child.location;
//                         return (
//                           <div
//                             key={i}
//                             onClick={() => handleClick(child.location)}
//                             className={`px-3 py-2 text-sm rounded-md cursor-pointer transition-all ${childActive
//                                 ? "bg-white text-purple-700 font-medium"
//                                 : "text-white/70 hover:text-white hover:bg-[#E2DEF915]"
//                               }`}
//                           >
//                             {child.label}
//                           </div>
//                         );
//                       })}
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </nav>
//         </div>

//         {/* Logout */}
//         <div className="pb-4 sm:pb-6">
//           <div
//             onClick={() => setIsOpen(true)}
//             className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg cursor-pointer transition-all text-white/80 bg-[#E2DEF90A] hover:text-white hover:bg-[#E2DEF915]"
//           >
//             <FiLogOut className="w-5 h-5" />
//             <span className="text-sm sm:text-base">Logout</span>
//           </div>
//         </div>
//       </div>


//       {/* Overlay */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black/50 z-30 lg:hidden"
//           onClick={() => setIsOpen(false)}
//         />
//       )}
//     </>
//   );
// };

// export default Sidebar;
