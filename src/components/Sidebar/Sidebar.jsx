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
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Sidebar = ({ isOpen, onToggle, websiteMode, onModeToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedSections, setExpandedSections] = useState({});
  const sectionRefs = useRef({});

  const allSections = {
    courseOptions: {
      title: "Courses",
      items: [
        { id: "exam", label: "Exam Grade System", icon: Award, path: "/exam-grade-system" },
        { id: "subjects", label: "Subjects", icon: BookOpen, path: "/subjects" },
        { id: "languages", label: "Languages", icon: Globe, path: "/languages" },
        { id: "categories", label: "Course Categories", icon: Grid, path: "/course-categories" },
        { id: "awards", label: "Course Award Categories", icon: Grid, path: "/course-award-categories" },
      ],
    },
    websiteOptions: {
      title: "Website Management",
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
    employeeManagement: {
      title: "Employee Management",
      items: [
        { id: "role", label: "Role", icon: UserCog, path: "/role" },
        { id: "goal", label: "Goal", icon: Target, path: "/goal" },
        { id: "designation", label: "Designation", icon: Briefcase, path: "/designation" },
        { id: "department", label: "Department", icon: Building, path: "/department" },
        { id: "teacherDirectory", label: "Teacher Directory", icon: Users, path: "/teacher-directory" },
        { id: "leaveType", label: "Leave Type", icon: Building, path: "/leave-type" },
        { id: "assignTask", label: "Assign Task", icon: Building, path: "/assign-task" },
        { id: "allAssignTask", label: "All Assign Task", icon: Building, path: "/all-assign-task" },

      ],
    },
    branchManagement: {
      title: "Branch Management",
      items: [
        { id: "branchManagement", label: "Branch Management", icon: GitBranch, path: "/branch-management" },
        { id: "visitorsBook", label: "Visitor's Book", icon: Book, path: "/visitors-book" },
        { id: "referralAmount", label: "Referral Amount", icon: CreditCard, path: "/referral-amount" },
        { id: "roleGoalAssign", label: "Role/Goal-Assign", icon: ClipboardList, path: "/role-goal-assign" },
      ],
    },
    courseManagement: {
      title: "Course Management",
      items: [
        { id: "courseList", label: "Course List", icon: ClipboardList, path: "/course-list" },
        { id: "coursePlans", label: "Course Plans", icon: BookOpen, path: "/course-plans" },
        { id: "courseCategories", label: "Course Categories", icon: Grid, path: "/course-categories" },
        { id: "courseBatches", label: "Course Batches", icon: GraduationCap, path: "/course-batches" },
        { id: "inquirySource", label: "Inquiry Source", icon: FileSearch, path: "/inquiry-source" },
        { id: "inquiryStatus", label: "Inquiry Status", icon: ClipboardCheck, path: "/inquiry-status" },
        { id: "productCategory", label: "Product Category", icon: ShoppingBag, path: "/product-category" },
      ],
    },
    studentInfo: {
      title: "Student Information",
      items: [
        { id: "admission", label: "Admission", icon: UserCircle, path: "/admission" },
        { id: "reAdmission", label: "Re-Admission", icon: RefreshCw, path: "/re-admission" },
        { id: "inquiry", label: "Inquiry", icon: FileSearch, path: "/inquiry" },
        { id: "studentFeeSummary", label: "Student Fee Summary", icon: FileBarChart, path: "/student-fee-summary" },
      ],
    },
    requestManagement: {
      title: "Request Management",
      items: [
        { id: "allRequest", label: "All Request", icon: ClipboardList, path: "/all-request" },
        { id: "roleExamRequest", label: "Role Exam Request", icon: Award, path: "/role-exam-request" },
        { id: "goalExamRequest", label: "Goal Exam Request", icon: Target, path: "/goal-exam-request" },
        { id: "certificateRequestStatus", label: "Certificate Request Status", icon: FileCheck, path: "/certificate-request-status" },
        { id: "leaveRequest", label: "Leave Request", icon: Calendar, path: "/leave-request" },
        { id: "complaints", label: "Complaints", icon: AlertCircle, path: "/complaints" },
      ],
    },
    attendance: {
      title: "Attendance",
      items: [
        { id: "markAttendance", label: "Mark Attendance", icon: CalendarCheck, path: "/mark-attendance" },
        { id: "markTeacherAttendance", label: "Mark Teacher Attendance", icon: Users, path: "/mark-teacher-attendance" },
        { id: "markStudentAttendance", label: "Mark Student Attendance", icon: GraduationCap, path: "/mark-student-attendance" },
        { id: "listTeacherAttendance", label: "List Teacher Attendance", icon: Users, path: "/list-teacher-attendance" },
        { id: "listStudentAttendance", label: "List Student Attendance", icon: GraduationCap, path: "/list-student-attendance" },
      ],
    },
    certificate: {
      title: "Certificate",
      items: [
        { id: "studentCertificate", label: "Student Certificate", icon: FileCheck, path: "/student-certificate" },
        { id: "allCertificate", label: "All Certificate", icon: FileCheck, path: "/all-certificate" },
      ],
    },
    config: {
      title: "Configuration",
      items: [
        { id: "configInformation", label: "Config Information", icon: Info, path: "/config-information" },
        { id: "config", label: "Config", icon: Cog, path: "/config" },
      ],
    },
    financial: {
      title: "Financial Management",
      items: [
        { id: "financialManagement", label: "Financial Management", icon: Wallet, path: "/financial-management" },
        { id: "category", label: "Category", icon: Grid, path: "/financial-category" },
        { id: "transactions", label: "Transactions", icon: CreditCard, path: "/transactions" },
      ],
    },
    ecommerce: {
      title: "E-commerce",
      items: [
        { id: "ecommerce", label: "E-commerce", icon: ShoppingCart, path: "/ecommerce" },
        { id: "myOrders", label: "My Orders", icon: ShoppingBag, path: "/my-orders" },
        { id: "contactUs", label: "Contact Us", icon: Phone, path: "/contact-us" },
      ],
    },
    examinations: {
      title: "Examinations",
      items: [
        { id: "examinations", label: "Examinations", icon: Award, path: "/examinations" },
        { id: "allPastExams", label: "All Past Examinations List", icon: FileText, path: "/all-past-exams" },
        { id: "studentExams", label: "Student Examinations", icon: GraduationCap, path: "/student-exams" },
        { id: "roleExams", label: "Role Examination", icon: UserCog, path: "/role-exams" },
        { id: "goalExams", label: "Goal Examination", icon: Target, path: "/goal-exams" },
      ],
    },
    userManagement: {
      title: "User Management",
      items: [
        { id: "users", label: "Users", icon: Users, path: "/users" },
        { id: "profile", label: "Profile", icon: User, path: "/profile" },
        { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
        { id: "logout", label: "Logout", icon: LogOut, path: "/logout" },
      ],
    },
  };

  useEffect(() => {
    if (isOpen) {
      Object.keys(allSections).forEach((key) => {
        setExpandedSections(prev => ({ ...prev, [key]: true }));
      });
    }
  }, [isOpen]);

  const handleModeToggle = () => {
    onModeToggle();
    navigate(websiteMode ? "/dashboard" : "/website-dashboard");
  };

  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const scrollToSection = (sectionKey) => {
    if (sectionRefs.current[sectionKey]) {
      sectionRefs.current[sectionKey].scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
      setExpandedSections(prev => ({ ...prev, [sectionKey]: true }));
    }
  };

  const NavItem = ({ to, icon: Icon, label, isChild = false }) => {
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
        } ${isChild ? "ml-2" : ""}`}
      >
        <Icon className="w-5 h-5 shrink-0" />
        {isOpen && <span className="ml-3 text-sm font-medium truncate">{label}</span>}
      </Link>
    );
  };

  const Section = ({ sectionKey, title, items }) => {
    if (!isOpen) return null;

    const filteredItems = searchTerm 
      ? items.filter(item => 
          item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : items;

    if (searchTerm && filteredItems.length === 0) return null;

    const isExpanded = expandedSections[sectionKey] || false;

    return (
      <div 
        ref={el => sectionRefs.current[sectionKey] = el}
        className="mt-2"
      >
        <button
          onClick={() => toggleSection(sectionKey)}
          className="w-full flex items-center justify-between mb-1 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
            {title}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </button>
        
        {isExpanded && (
          <div className="space-y-1">
            {filteredItems.map((item) => (
              <NavItem
                key={item.id}
                to={item.path}
                icon={item.icon}
                label={item.label}
                isChild={true}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const searchResults = Object.entries(allSections).flatMap(([key, section]) => {
    const matchingItems = section.items.filter(item =>
      item.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (matchingItems.length > 0 || section.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return matchingItems.map(item => ({
        ...item,
        sectionKey: key,
        sectionTitle: section.title
      }));
    }
    return [];
  });

  const currentOptions = websiteMode ? allSections.websiteOptions : allSections.courseOptions;

  return (
    <>
      {isOpen && (
        <div
          onClick={onToggle}
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:relative z-30 h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 overflow-y-auto
        ${isOpen ? "w-72" : "w-16"}`}
      >
        <div className="h-16 flex items-center justify-between px-3 border-b border-gray-200 sticky top-0 bg-white z-10">
          {isOpen ? (
            <Link to="/dashboard" className="flex items-center gap-2">
              <img src="/logonew.jpeg" className="w-9 h-9 rounded-lg object-cover" />
              <span className="font-semibold text-gray-800">Admin Panel</span>
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

        {isOpen && (
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search menu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              {searchTerm && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                  {searchResults.slice(0, 5).map((result) => (
                    <button
                      key={`${result.sectionKey}-${result.id}`}
                      onClick={() => {
                        scrollToSection(result.sectionKey);
                        setSearchTerm("");
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                    >
                      <result.icon className="w-4 h-4 text-gray-500" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{result.label}</div>
                        <div className="text-xs text-gray-500">{result.sectionTitle}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

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

        <nav className="flex-1 px-2 overflow-y-auto pb-4">
          <NavItem to="/dashboard" icon={Home} label="Dashboard" />

          {isOpen && (
            <div className="mt-4 mb-2">
              <Section
                sectionKey={websiteMode ? "websiteOptions" : "courseOptions"}
                title={websiteMode ? "Website Management" : "Courses"}
                items={currentOptions.items}
              />
            </div>
          )}

          {Object.entries(allSections).map(([key, section]) => {
            if ((websiteMode && key === "websiteOptions") || (!websiteMode && key === "courseOptions")) {
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