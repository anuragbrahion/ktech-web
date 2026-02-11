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
  Package,
  Activity,
  Share2,
  Tags,
  Layers,
  List,
  DollarSign,
  BarChart,
  CheckCircle,
  Eye,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
// Remove problematic import and use alternative
import { FaTasks } from "react-icons/fa";

const getUserData = () => {
  const userData = sessionStorage.getItem("data");
  return userData ? JSON.parse(userData) : null;
};

const adminSections = {
  websiteOptions: {
    title: "Website Management",
    icon: Globe,
    items: [
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
    ],
  },
  courseOptions: {
    title: "Courses",
    icon: BookOpen,
    items: [
      { id: "courseList", label: "Course", icon: Grid, path: "/course-list" },
      { id: "coursePlans", label: "Course Plans", icon: Grid, path: "/course-plans" },
      { id: "batches", label: "Course Batches", icon: Grid, path: "/course-batches" },
    ],
  },
  studentInfo: {
    title: "Student Information",
    icon: Users,
    items: [
      { id: "admission", label: "Admission", icon: UserCircle, path: "/admission" },
      { id: "reAdmission", label: "Re-Admission", icon: RefreshCw, path: "/re-admission" },
      { id: "inquiry", label: "Inquiry", icon: FileSearch, path: "/inquiry" },
      { id: "studentFeeSummary", label: "Student Fee Summary", icon: FileBarChart, path: "/student-fee-summary" },
    ],
  },
  employeeManagement: {
    title: "Employee Management",
    icon: UserCog,
    items: [
      { id: "role", label: "Role", icon: UserCog, path: "/role" },
      { id: "goal", label: "Goal", icon: Target, path: "/goal" },
      { id: "designation", label: "Designation", icon: Briefcase, path: "/designation" },
      { id: "department", label: "Department", icon: Building, path: "/department" },
      { id: "teacherDirectory", label: "Teacher Directory", icon: Users, path: "/teacher-directory" },
      { id: "leaveType", label: "Leave Type", icon: Calendar, path: "/leave-type" },
      { id: "assignTask", label: "Assign Task", icon: ClipboardCheck, path: "/assign-task" },
      { id: "allAssignTask", label: "All Assign Task", icon: ClipboardList, path: "/all-assign-task" },
    ],
  },
  examinations: {
    title: "Examinations",
    icon: Award,
    items: [
      { id: "allPastExams", label: "All Past Examinations List", icon: FileText, path: "/all-past-exams" },
      { id: "studentExams", label: "Student Examinations", icon: GraduationCap, path: "/student-exams" },
      { id: "roleExams", label: "Role Examination", icon: UserCog, path: "/role-exams" },
      { id: "goalExams", label: "Goal Examination", icon: Target, path: "/goal-exams" },
    ],
  },
  branchManagement: {
    title: "Branch Management",
    icon: GitBranch,
    items: [
      { id: "visitorsBook", label: "Visitor's Book", icon: Book, path: "/visitors-book" },
      { id: "referralAmount", label: "Referral Amount", icon: CreditCard, path: "/referral-amount" },
      { id: "roleGoalAssign", label: "Role/Goal-Assign", icon: ClipboardList, path: "/role-goal-assign" },
      { id: "coursePlans", label: "Course Plans", icon: Layers, path: "/course-plans" },
      { id: "courseBatches", label: "Course Batches", icon: Calendar, path: "/course-batches" },
      { id: "inquirySource", label: "Inquiry Source", icon: Share2, path: "/inquiry-source" },
      { id: "inquiryStatus", label: "Inquiry Status", icon: Activity, path: "/inquiry-status" }
    ],
  },
  requestManagement: {
    title: "All Request",
    icon: ClipboardList,
    items: [
      { id: "roleExamRequest", label: "Role Exam Request", icon: Award, path: "/role-exam-request" },
      { id: "goalExamRequest", label: "Goal Exam Request", icon: Target, path: "/goal-exam-request" },
      { id: "certificateRequestStatus", label: "Certificate Request Status", icon: FileCheck, path: "/certificate-request-status" },
      { id: "leaveRequest", label: "Leave Request", icon: Calendar, path: "/leave-request" },
      { id: "complaints", label: "Complaints", icon: AlertCircle, path: "/complaints" },
    ],
  },
  attendance: {
    title: "Mark Attendance",
    icon: Calendar,
    items: [
      { id: "markTeacherAttendance", label: "Mark Teacher Attendance", icon: Users, path: "/mark-teacher-attendance" },
      { id: "markStudentAttendance", label: "Mark Student Attendance", icon: GraduationCap, path: "/mark-student-attendance" },
    ],
  },
  certificate: {
    title: "Student Certificate",
    icon: FileCheck,
    items: [
      { id: "allCertificate", label: "All Certificate", icon: FileCheck, path: "/all-certificate" },
    ],
  },
  financial: {
    title: "Financial Management",
    icon: Wallet,
    items: [
      { id: "category", label: "Category", icon: Grid, path: "/financial-category" },
      { id: "transactions", label: "Transactions", icon: CreditCard, path: "/transactions" },
    ],
  },
  ecommerce: {
    title: "Ecommerce",
    icon: ShoppingCart,
    items: [
      { id: "productCategory", label: "Product Category", icon: Package, path: "/product-category" },
      { id: "ecommerce", label: "E-commerce", icon: ShoppingCart, path: "/ecommerce" },
      { id: "myOrders", label: "My Orders", icon: ShoppingBag, path: "/my-orders" },
      { id: "contactUs", label: "Contact Us", icon: Phone, path: "/contact-us" },
    ],
  },
};

// OPTION 1: Use a Lucide icon instead
import { Clipboard } from "lucide-react";

const teacherSections = {
  profileManagement: {
    title: "Profile Management",
    icon: UserCog,
    items: [
      { id: "teacherDashboard", label: "Dashboard", icon: Home, path: "/teacher-dashboard" },
      { id: "myIncentive", label: "My Incentive", icon: DollarSign, path: "/teacher/incentive" },
      { id: "myAttendance", label: "My Attendance Report", icon: CalendarCheck, path: "/teacher/attendance" },
      { id: "leaveRequest", label: "Leave Request", icon: Calendar, path: "/teacher/leave-request" },
    ]
  },
  studentInfo: {
    title: "Student Information",
    icon: Users,
    items: [
      { id: "studentAttendance", label: "Student Attendance List", icon: Eye, path: "/teacher/student-attendance" },
    ]
  },
  assignments: {
    title: "Assign",
    // OPTION 1: Use Clipboard icon from lucide-react
    icon: Clipboard,
    items: [
      { id: "roleAssign", label: "Role Assign", icon: UserCog, path: "/teacher/role-assign" },
      { id: "goalAssign", label: "Goal Assign", icon: Target, path: "/teacher/goal-assign" },
      { id: "myTask", label: "My Task", icon: ClipboardCheck, path: "/teacher/my-tasks" },
    ]
  },
  examinations: {
    title: "Examinations",
    icon: Award,
    items: [
      { id: "allPastExams", label: "All Past Examinations List", icon: FileText, path: "/teacher/past-exams" },
    ]
  },
};

const studentSections = {
  profileManagement: {
    title: "Profile Management",
    icon: UserCog,
    items: [
      { id: "studentDashboard", label: "Dashboard", icon: Home, path: "/student-dashboard" },
      { id: "referralAmount", label: "Referral Amount", icon: DollarSign, path: "/student/referral-amount" },
      { id: "myAttendance", label: "My Attendance Report", icon: CalendarCheck, path: "/student/attendance" },
      { id: "leaveRequest", label: "Leave Request", icon: Calendar, path: "/student/leave-request" },
    ]
  },
  coursesInfo: {
    title: "Courses Information",
    icon: BookOpen,
    items: [
      { id: "myCourses", label: "My Courses", icon: Book, path: "/student/my-courses" },
      { id: "myExams", label: "My Exams", icon: Award, path: "/student/my-exams" },
    ]
  },
  examinations: {
    title: "Examinations",
    icon: Award,
    items: [
      { id: "allPastExams", label: "All Past Examinations List", icon: FileText, path: "/student/past-exams" },
    ]
  },
};

const getRoleSpecificSections = (role) => {
  const userRole = role.toLowerCase();
  if (userRole === 'teacher') return teacherSections;
  if (userRole === 'student') return studentSections;
  return adminSections;
};

const Sidebar = ({ isOpen, onToggle, websiteMode, onModeToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(getUserData());
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedSections, setExpandedSections] = useState({});
  const [hoveredSection, setHoveredSection] = useState(null);
  const sidebarRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const data = getUserData();
    setUserData(data);
  }, [location]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024 && !isOpen) {
        onToggle();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen, onToggle]);

  const role = userData?.role?.toLowerCase() || 'student';
  const sections = getRoleSpecificSections(role);

  useEffect(() => {
    const initialState = {};
    Object.keys(sections).forEach((key) => {
      initialState[key] = false;
    });
    setExpandedSections(initialState);
  }, [sections]);

  const isAdminRole = ['admin', 'superadmin', 'branch'].includes(role);

  const handleModeToggle = () => {
    if (!isAdminRole) return;
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
    // Check if Icon is a valid component
    if (!Icon) {
      console.error(`Icon is undefined for label: ${label}`);
      Icon = HelpCircle; // Fallback icon
    }
    
    const active = location.pathname === to || isActive;

    return (
      <Link
        to={to}
        className={`flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all duration-200 ${
          active 
            ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 font-semibold border-l-3 border-blue-500 shadow-sm' 
            : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
        } ${isOpen ? 'ml-2' : 'justify-center'}`}
      >
        <Icon className={`w-5 h-5 ${active ? 'text-blue-600' : 'text-gray-500'}`} />
        {isOpen && (
          <span className="text-sm font-medium truncate">{label}</span>
        )}
      </Link>
    );
  };

  const Section = ({ sectionKey, title, items, icon: SectionIcon }) => {
    const isExpanded = expandedSections[sectionKey] || false;
    const hasActiveItem = items.some((item) => location.pathname === item.path);

    return (
      <div
        className="relative group"
        onMouseEnter={() => !isOpen && setHoveredSection(sectionKey)}
        onMouseLeave={() => !isOpen && setHoveredSection(null)}
      >
        {isOpen && title && (
          <button
            onClick={() => toggleSection(sectionKey)}
            className="w-full flex items-center justify-between mb-1 px-2 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200 group/section"
          >
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-md ${hasActiveItem ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                {SectionIcon && <SectionIcon className="w-3.5 h-3.5" />}
              </div>
              <span className={`text-xs font-semibold uppercase tracking-wide ${hasActiveItem ? "text-blue-600" : "text-gray-600"}`}>
                {title}
              </span>
            </div>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-gray-500 group-hover/section:text-gray-700" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500 group-hover/section:text-gray-700" />
            )}
          </button>
        )}

        <div className="space-y-0.5">
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
            <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-blue-100 border-b">
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
                  {item.icon && <item.icon className="w-4 h-4" />}
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const searchResults = isAdminRole ? Object.entries(sections).flatMap(
    ([key, section]) => {
      const matchingItems = section.items.filter((item) =>
        item.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (matchingItems.length > 0 || section.title.toLowerCase().includes(searchTerm.toLowerCase())) {
        return matchingItems.map((item) => ({
          ...item,
          sectionKey: key,
          sectionTitle: section.title,
        }));
      }
      return [];
    }
  ) : [];

  const getDashboardPath = () => {
    switch(role) {
      case 'student': return "/student-dashboard";
      case 'teacher': return "/teacher-dashboard";
      default: return websiteMode ? "/website-dashboard" : "/dashboard";
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <>
      {isOpen && isMobile && (
        <div
          onClick={onToggle}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300"
        />
      )}

      <aside
        ref={sidebarRef}
        className={`fixed lg:sticky top-0 z-40 h-screen bg-white border-r border-gray-200 flex flex-col
          transition-all duration-300 ease-in-out
          ${isOpen ? "w-72" : "w-16"}
          ${isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"}`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          {isOpen ? (
            <Link
              to={getDashboardPath()}
              className="flex items-center gap-3 hover:opacity-90 transition-opacity"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow">
                <img
                  src="/logonew.jpeg"
                  alt="Logo"
                  className="w-8 h-8 rounded-md object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'%3E%3C/path%3E%3C/svg%3E";
                  }}
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-gray-800 leading-tight text-sm">
                  {role.charAt(0).toUpperCase() + role.slice(1)} Panel
                </span>
                <span className="text-xs text-gray-500 font-medium truncate max-w-[140px]">
                  {userData?.name || 'User'}
                  {isAdminRole && ` • ${websiteMode ? "Website" : "Course"}`}
                </span>
              </div>
            </Link>
          ) : (
            <Link to={getDashboardPath()} className="mx-auto">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow">
                <img
                  src="/logonew.jpeg"
                  alt="Logo"
                  className="w-8 h-8 rounded-md object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'%3E%3C/path%3E%3C/svg%3E";
                  }}
                />
              </div>
            </Link>
          )}

          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isOpen ? (
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        {isOpen && isAdminRole && (
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
                  <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-blue-100 border-b">
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
                      {result.icon && <result.icon className={`w-4 h-4 ${location.pathname === result.path ? "text-blue-600" : "text-gray-500"}`} />}
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

        {isOpen && isAdminRole && (
          <div className="p-3 border-b border-gray-200">
            <button
              onClick={handleModeToggle}
              className={`w-full flex items-center justify-center gap-3 text-white py-3 rounded-xl text-sm font-semibold transition-all hover:shadow-lg ${
                websiteMode
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                  : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              }`}
            >
              <RefreshCw className="w-4 h-4" />
              {websiteMode ? "Switch to Course" : "Switch to Website"}
            </button>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto py-4 px-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <Link
            to={getDashboardPath()}
            className={`flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all ${
              location.pathname === getDashboardPath() 
                ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 font-semibold border-l-3 border-blue-500' 
                : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
            } ${isOpen ? 'ml-2' : 'justify-center'}`}
          >
            <Home className="w-5 h-5" />
            {isOpen && <span className="text-sm font-medium">Dashboard</span>}
          </Link>

          <div className="">
            {Object.entries(sections).map(([key, section]) => (
              <Section
                key={key}
                sectionKey={key}
                title={section.title}
                items={section.items}
                icon={section.icon}
              />
            ))}
          </div>
        </nav>

        <div className="mt-auto border-t border-gray-200 pt-2 pb-2 px-3 bg-gradient-to-t from-gray-50 to-white">
          <div className="space-y-1">
            <Link
              to="/profile"
              className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <User className="w-5 h-5" />
              {isOpen && <span className="text-sm font-medium">Profile</span>}
            </Link>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              {isOpen && <span className="text-sm font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;