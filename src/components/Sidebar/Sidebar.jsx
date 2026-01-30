import React, { useState, useRef, useEffect } from "react";
import {
  Home,
  Award,
  BookOpen,
  Globe,
  Grid,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  FileText,
  GitBranch,
  MessageSquare,
  Languages,
  Info,
  HelpCircle,
  FileCheck,
  Shield,
  Building2,
  UserCog,
  Target,
  Briefcase,
  Building,
  Users,
  Book,
  CreditCard,
  ClipboardList,
  GraduationCap,
  FileSearch,
  ClipboardCheck,
  ShoppingBag,
  UserCircle,
  Calendar,
  AlertCircle,
  CalendarCheck,
  FileBarChart,
  Wallet,
  ShoppingCart,
  Phone,
  User,
  LogOut,
  Settings,
  Cog,
  Search,
  ChevronDown,
  ChevronUp,
  X,
  Menu,
  Package,
  Activity,
  Share2,
  Tags,
  Layers,
  List,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const allSections = {
  websiteOptions: {
    title: "Website Management",
    icon: Globe,
    items: [
      { id: "homePage", label: "Home Page", icon: Home, path: "/home-page" },
      { id: "blogs", label: "Blogs", icon: FileText, path: "/blogs" },
      { id: "branches", label: "Branches", icon: GitBranch, path: "/branches" },
      {
        id: "testimonials",
        label: "Testimonials",
        icon: MessageSquare,
        path: "/testimonials",
      },
      { id: "language", label: "Language", icon: Languages, path: "/language" },
      { id: "aboutUs", label: "About Us", icon: Info, path: "/web-about" },
      { id: "whyUs", label: "Why Us", icon: HelpCircle, path: "/why-us" },
      {
        id: "terms",
        label: "Terms & Conditions",
        icon: FileCheck,
        path: "/terms-conditions",
      },
      {
        id: "courseFaq",
        label: "Course FAQ",
        icon: BookOpen,
        path: "/course-faq",
      },
      {
        id: "privacyPolicy",
        label: "Privacy Policy",
        icon: Shield,
        path: "/privacy-policy",
      },
      {
        id: "companyDetails",
        label: "Company Details",
        icon: Building2,
        path: "/company-details",
      },
    ],
  },
  courseOptions: {
    title: "Courses",
    icon: BookOpen,
    items: [
      // {
      //   id: "exam",
      //   label: "Exam Grade System",
      //   icon: Award,
      //   path: "/exam-grade-system",
      // },
      // { id: "subjects", label: "Subjects", icon: BookOpen, path: "/subjects" },
      // { id: "languages", label: "Languages", icon: Globe, path: "/languages" },
      // {
      //   id: "categories",
      //   label: "Course Categories",
      //   icon: Grid,
      //   path: "/course-categories",
      // },
      {
        id: "courseList",
        label: "Course",
        icon: Grid,
        path: "/course-list",
      },
       {
        id: "coursePlans",
        label: "Course Plans",
        icon: Grid,
        path: "/course-plans",
      },
      {
        id: "batches",
        label: "Course Batches",
        icon: Grid,
        path: "/course-batches",
      },
    ],
  },
  studentInfo: {
    title: "Student Information",
    icon: Users,
    items: [
      {
        id: "admission",
        label: "Admission",
        icon: UserCircle,
        path: "/admission",
      },
      {
        id: "reAdmission",
        label: "Re-Admission",
        icon: RefreshCw,
        path: "/re-admission",
      },
      { id: "inquiry", label: "Inquiry", icon: FileSearch, path: "/inquiry" },
      {
        id: "studentFeeSummary",
        label: "Student Fee Summary",
        icon: FileBarChart,
        path: "/student-fee-summary",
      },
    ],
  },
  employeeManagement: {
    title: "Employee Management",
    icon: UserCog,
    items: [
      { id: "role", label: "Role", icon: UserCog, path: "/role" },
      { id: "goal", label: "Goal", icon: Target, path: "/goal" },
      {
        id: "designation",
        label: "Designation",
        icon: Briefcase,
        path: "/designation",
      },
      {
        id: "department",
        label: "Department",
        icon: Building,
        path: "/department",
      },
      {
        id: "teacherDirectory",
        label: "Teacher Directory",
        icon: Users,
        path: "/teacher-directory",
      },
      {
        id: "leaveType",
        label: "Leave Type",
        icon: Calendar,
        path: "/leave-type",
      },
      {
        id: "assignTask",
        label: "Assign Task",
        icon: ClipboardCheck,
        path: "/assign-task",
      },
      {
        id: "allAssignTask",
        label: "All Assign Task",
        icon: ClipboardList,
        path: "/all-assign-task",
      },
    ],
  },
  examinations: {
    title: "Examinations",
    icon: Award,
    items: [
      {
        id: "allPastExams",
        label: "All Past Examinations List",
        icon: FileText,
        path: "/all-past-exams",
      },
      {
        id: "studentExams",
        label: "Student Examinations",
        icon: GraduationCap,
        path: "/student-exams",
      },
      {
        id: "roleExams",
        label: "Role Examination",
        icon: UserCog,
        path: "/role-exams",
      },
      {
        id: "goalExams",
        label: "Goal Examination",
        icon: Target,
        path: "/goal-exams",
      },
    ],
  },
  branchManagement: {
    title: "Branch Management",
    icon: GitBranch,
    items: [
      {
        id: "visitorsBook",
        label: "Visitor's Book",
        icon: Book,
        path: "/visitors-book",
      },
      {
        id: "referralAmount",
        label: "Referral Amount",
        icon: CreditCard,
        path: "/referral-amount",
      },
      {
        id: "roleGoalAssign",
        label: "Role/Goal-Assign",
        icon: ClipboardList,
        path: "/role-goal-assign",
      },
      {
        id: "coursePlans",
        label: "Course Plans",
        icon: Layers,
        path: "/course-plans",
      },
      {
        id: "courseBatches",
        label: "Course Batches",
        icon: Calendar,
        path: "/course-batches",
      },
      {
        id: "inquirySource",
        label: "Inquiry Source",
        icon: Share2,
        path: "/inquiry-source",
      },
      {
        id: "inquiryStatus",
        label: "Inquiry Status",
        icon: Activity,
        path: "/inquiry-status",
      },
      {
        id: "productCategory",
        label: "Product Category",
        icon: Package,
        path: "/product-category",
      },
    ],
  },
  requestManagement: {
    title: "All Request",
    icon: ClipboardList,
    items: [ 
      {
        id: "roleExamRequest",
        label: "Role Exam Request",
        icon: Award,
        path: "/role-exam-request",
      },
      {
        id: "goalExamRequest",
        label: "Goal Exam Request",
        icon: Target,
        path: "/goal-exam-request",
      },
      {
        id: "certificateRequestStatus",
        label: "Certificate Request Status",
        icon: FileCheck,
        path: "/certificate-request-status",
      },
      {
        id: "leaveRequest",
        label: "Leave Request",
        icon: Calendar,
        path: "/leave-request",
      },
      {
        id: "complaints",
        label: "Complaints",
        icon: AlertCircle,
        path: "/complaints",
      },
    ],
  },
  attendance: {
    title: "Mark Attendance",
    icon: Calendar,
    items: [
      {
        id: "markTeacherAttendance",
        label: "Mark Teacher Attendance",
        icon: Users,
        path: "/mark-teacher-attendance",
      },
      {
        id: "markStudentAttendance",
        label: "Mark Student Attendance",
        icon: GraduationCap,
        path: "/mark-student-attendance",
      },
    ],
  },
  certificate: {
    title: "Student Certificate",
    icon: FileCheck,
    items: [
      {
        id: "allCertificate",
        label: "All Certificate",
        icon: FileCheck,
        path: "/all-certificate",
      },
    ],
  },
  config: {
    title: "Config Information",
    icon: Settings,
    items: [
      { id: "config", label: "Config", icon: Cog, path: "/config" },
    ],
  },
  financial: {
    title: "Financial Management",
    icon: Wallet,
    items: [
      {
        id: "category",
        label: "Category",
        icon: Grid,
        path: "/financial-category",
      },
      {
        id: "transactions",
        label: "Transactions",
        icon: CreditCard,
        path: "/transactions",
      },
    ],
  },
  ecommerce: {
    title: "Ecommerce",
    icon: ShoppingCart,
    items: [
      {
        id: "ecommerce",
        label: "E-commerce",
        icon: ShoppingCart,
        path: "/ecommerce",
      },
      {
        id: "myOrders",
        label: "My Orders",
        icon: ShoppingBag,
        path: "/my-orders",
      },
      {
        id: "contactUs",
        label: "Contact Us",
        icon: Phone,
        path: "/contact-us",
      },
    ],
  },
  
  userManagement: {
    title: "User Management",
    icon: Users,
    items: [
      { id: "users", label: "Users", icon: Users, path: "/users" },
      { id: "profile", label: "Profile", icon: User, path: "/profile" },
      // { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
      { id: "logout", label: "Logout", icon: LogOut, path: "/logout" },
    ],
  },
};

const Sidebar = ({ isOpen, onToggle, websiteMode, onModeToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedSections, setExpandedSections] = useState(() => {
    const state = {};
    Object.keys(allSections).forEach((key) => {
      state[key] = false;
    });
    return state;
  });
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoveredSection, setHoveredSection] = useState(null);
  const sidebarRef = useRef(null);
  const [tooltip, setTooltip] = useState({
    visible: false,
    label: "",
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const initialState = {};
    Object.keys(allSections).forEach((key) => {
      initialState[key] = false;
    });
    setExpandedSections(initialState);
  }, []);

  const handleModeToggle = () => {
    onModeToggle();
    navigate(websiteMode ? "/dashboard" : "/website-dashboard");
  };

  const toggleSection = (sectionKey) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const NavItem = ({ to, icon: Icon, label, isActive }) => {
    const active = location.pathname === to || isActive;

    return (
      <Link
        to={to}
        className="group flex items-center gap-3 relative py-1 ml-6"
        onMouseEnter={(e) => {
          setTooltip({
            visible: true,
            label,
            x: e.clientX,
            y: e.clientY,
          });
        }}
        onMouseLeave={() =>
          setTooltip({ visible: false, label: "", x: 0, y: 0 })
        }
      >
        <Icon
          className={`w-5 h-5 shrink-0 transition-transform ${
            active ? "scale-110" : ""
          }`}
        />
        {isOpen && (
          <span className="text-sm font-medium truncate">{label}</span>
        )}

        {!isOpen && hoveredItem === label && (
          <div
            className="fixed px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap z-[9999] shadow-lg"
            style={{
              left: sidebarRef.current?.getBoundingClientRect().right + 8,
              top: window.event?.clientY - 16,
            }}
          >
            {label}
          </div>
        )}
      </Link>
    );
  };

  const Section = ({ sectionKey, title, items }) => {
    const isExpanded = expandedSections[sectionKey] || false;
    const hasActiveItem = items.some((item) => location.pathname === item.path);

    return (
      <div
        className={`mt-2 relative ${isOpen ? "px-1" : ""}`}
        onMouseEnter={() => !isOpen && setHoveredSection(sectionKey)}
        onMouseLeave={() => !isOpen && setHoveredSection(null)}
      >
        {isOpen && (
          <button
            onClick={() => toggleSection(sectionKey)}
            className="w-full flex items-center justify-between mb-1 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <span
              className={`text-xs font-semibold uppercase tracking-wide transition-colors ${
                hasActiveItem
                  ? "text-blue-600"
                  : "text-gray-600 group-hover:text-gray-900"
              }`}
            >
              {title}
            </span>
            {isExpanded ? (
              <ChevronUp className="w-3.5 h-3.5 text-gray-500 group-hover:text-gray-700" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-gray-500 group-hover:text-gray-700" />
            )}
          </button>
        )}

        <div className={`space-y-1 ${!isOpen ? "pt-2" : ""}`}>
          {(isOpen ? isExpanded : true) &&
            items.map((item) => (
              <NavItem
                key={item.id}
                to={item.path}
                icon={item.icon}
                label={item.label}
                isActive={location.pathname === item.path}
              />
            ))}
        </div>

        {!isOpen && hoveredSection === sectionKey && (
          <div className="absolute left-full top-0 ml-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
            <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                {title}
              </h3>
            </div>
            <div className="py-2 max-h-80 overflow-y-auto">
              {items.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                    location.pathname === item.path
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700"
                  }`}
                  onClick={() => setHoveredSection(null)}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const searchResults = Object.entries(allSections).flatMap(
    ([key, section]) => {
      const matchingItems = section.items.filter((item) =>
        item.label.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (
        matchingItems.length > 0 ||
        section.title.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return matchingItems.map((item) => ({
          ...item,
          sectionKey: key,
          sectionTitle: section.title,
        }));
      }
      return [];
    }
  );

  const currentOptions = websiteMode
    ? allSections.websiteOptions
    : (allSections.courseOptions || allSections.websiteOptions);

  return (
    <>
      {isOpen && (
        <div
          onClick={onToggle}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300"
        />
      )}

      <aside
        ref={sidebarRef}
        className={`fixed lg:sticky top-0 z-40 h-screen bg-white border-r border-gray-200 shadow-sm
          transition-all duration-300 ease-in-out
          ${
            isOpen
              ? "w-72 translate-x-0"
              : "w-16 -translate-x-full lg:translate-x-0"
          }
          lg:flex lg:flex-col`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          {isOpen ? (
            <Link
              to={websiteMode ? "/website-dashboard" : "/dashboard"}
              className="flex items-center gap-3 hover:opacity-90 transition-opacity"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow">
                <img
                  src="/logonew.jpeg"
                  alt="Logo"
                  className="w-8 h-8 rounded-md object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'%3E%3C/path%3E%3C/svg%3E";
                  }}
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-gray-800 leading-tight">
                  Admin Panel
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  {websiteMode ? "Website Mode" : "Course Mode"}
                </span>
              </div>
            </Link>
          ) : (
            <Link to="/dashboard" className="mx-auto">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow">
                <img
                  src="/logonew.jpeg"
                  alt="Logo"
                  className="w-8 h-8 rounded-md object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'%3E%3C/path%3E%3C/svg%3E";
                  }}
                />
              </div>
            </Link>
          )}

          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:block"
            aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isOpen ? (
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        {isOpen && (
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search menu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {searchTerm && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto">
                  <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                    <h3 className="text-sm font-semibold text-gray-800">
                      Search Results ({searchResults.length})
                    </h3>
                  </div>
                  {searchResults.map((result) => (
                    <Link
                      key={`${result.sectionKey}-${result.id}`}
                      to={result.path}
                      onClick={() => setSearchTerm("")}
                      className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b last:border-b-0 ${
                        location.pathname === result.path ? "bg-blue-50" : ""
                      }`}
                    >
                      <result.icon
                        className={`w-4 h-4 ${
                          location.pathname === result.path
                            ? "text-blue-600"
                            : "text-gray-500"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <div
                          className={`text-sm font-medium truncate ${
                            location.pathname === result.path
                              ? "text-blue-600"
                              : "text-gray-900"
                          }`}
                        >
                          {result.label}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {result.sectionTitle}
                        </div>
                      </div>
                      <ChevronRight className="w-3 h-3 text-gray-400" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div
          className={`p-3 border-b border-gray-200 ${
            isOpen ? "block" : "hidden"
          }`}
        >
          <button
            onClick={handleModeToggle}
            className={`w-full flex items-center justify-center gap-3 text-white py-3 rounded-xl text-sm font-semibold transform hover:scale-[1.02] active:scale-95 shadow-md ${
              websiteMode
                ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            {websiteMode ? "Switch to Course" : "Switch to Website"}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto pb-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
          <div className="px-2 pt-4">
            <NavItem
              to={websiteMode ? "/website-dashboard" : "/dashboard"}
              icon={Home}
              label="Dashboard"
            />

            {isOpen && (
              <div className="mt-6 mb-4">
                <div className="px-3 mb-2">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {websiteMode ? "Website Management" : "Courses"}
                  </h4>
                </div>
                <Section
                  sectionKey={websiteMode ? "websiteOptions" : "courseOptions"}
                  title={websiteMode ? "Website Management" : "Courses"}
                  items={currentOptions.items}
                />
              </div>
            )}

            <div className="mt-2">
              {Object.entries(allSections).map(([key, section]) => {
                if (
                  (websiteMode && key === "websiteOptions") ||
                  (!websiteMode && key === "courseOptions")
                ) {
                  return null;
                }
                return (
                  <Section
                    key={key}
                    sectionKey={key}
                    title={section.title}
                    items={section.items}
                  />
                );
              })}
            </div>
          </div>
        </nav>

        {isOpen && (
          <div className="border-t border-gray-200 p-4 bg-gradient-to-r from-gray-50 to-white">
            <div className="text-center">
              <p className="text-xs text-gray-600 font-medium">Version 1.0.0</p>
              <p className="text-xs text-gray-500 mt-1">© 2025 Institution</p>
            </div>
          </div>
        )}
      </aside>
      {tooltip.visible && !isOpen && (
        <div
          className="fixed px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap shadow-lg z-[9999]"
          style={{
            left: tooltip.x + 12,
            top: tooltip.y - 16,
          }}
        >
          {tooltip.label}
        </div>
      )}
    </>
  );
};

export default Sidebar;

const style = document.createElement("style");
style.textContent = `
  .scrollbar-thin {
    scrollbar-width: thin;
  }
  
  .scrollbar-thin::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  
  .scrollbar-thin::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .scrollbar-thin::-webkit-scrollbar-thumb {
    background-color: rgba(156, 163, 175, 0.5);
    border-radius: 3px;
  }
  
  .scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background-color: rgba(156, 163, 175, 0.8);
  }
  
   @media (max-width: 1024px) {
    aside {
      max-height: 100vh;
      overflow-y: auto;
    }
  }
`;
document.head.appendChild(style);
