import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaStar,
  FaChevronRight,
  FaChevronLeft,
  FaBookOpen,
  FaChartLine,
  FaLaptopCode,
  FaPalette,
  FaUserTie,
  FaBuilding,
  FaGraduationCap,
  FaSearch,
  FaFilter,
  FaRegHeart,
  FaHeart,
  FaCheckCircle,
  FaMobileAlt,
  FaCloud,
  FaRobot,
  FaDatabase,
  FaCode,
  FaUserGraduate,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaFacebook,
  FaYoutube,
  FaGithub,
} from "react-icons/fa";
import {
  MdAccessTime,
  MdPeople,
  MdComputer,
  MdBusinessCenter,
  MdWorkspacePremium,
} from "react-icons/md";
import Button from "../../components/Atoms/Button"; 
import axios from "axios";
import { apiUrl } from "../../utils/axiosProvider";

const LandingPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [stats, setStats] = useState({
    students: 0,
    courses: 0,
    instructors: 0,
    companies: 0,
  });

  async function getData() {
    try {
      const token = localStorage.getItem('token');
      setLoading(true);

      const response = await axios.get(`${apiUrl}/website/home`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data && response.data?.data) {
        const data = response.data.data;
        setData(data);
        
        // Update stats from data if available
        // Note: You might need to adjust this based on actual API response
        setStats({
          students: 50000,
          courses: 280,
          instructors: 520,
          companies: 1200,
        });
      }
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  // Animated stats counter
  useEffect(() => {
    if (!data) return;
    
    const targetStats = {
      students: 50000,
      courses: 280,
      instructors: 520,
      companies: 1200,
    };

    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    Object.keys(targetStats).forEach((stat) => {
      let current = 0;
      const increment = targetStats[stat] / steps;
      const timer = setInterval(() => {
        current += increment;
        if (current >= targetStats[stat]) {
          current = targetStats[stat];
          clearInterval(timer);
        }
        setStats((prev) => ({
          ...prev,
          [stat]: Math.floor(current),
        }));
      }, interval);
    });
  }, [data]);

  // Auto rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % (testimonials?.length || 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const categories = [
    {
      id: "all",
      name: "All Courses",
      count: 28,
      icon: <MdComputer />,
      color: "from-blue-600 to-cyan-500",
      bgColor: "bg-gradient-to-r from-blue-50 to-cyan-50",
    },
    {
      id: "programming",
      name: "Programming",
      count: 8,
      icon: <FaLaptopCode />,
      color: "from-purple-600 to-pink-500",
      bgColor: "bg-gradient-to-r from-purple-50 to-pink-50",
    },
    {
      id: "design",
      name: "UI/UX Design",
      count: 6,
      icon: <FaPalette />,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-gradient-to-r from-orange-50 to-red-50",
    },
    {
      id: "business",
      name: "Business",
      count: 5,
      icon: <FaChartLine />,
      color: "from-green-600 to-emerald-500",
      bgColor: "bg-gradient-to-r from-green-50 to-emerald-50",
    },
    {
      id: "data",
      name: "Data Science",
      count: 4,
      icon: <FaDatabase />,
      color: "from-indigo-600 to-blue-500",
      bgColor: "bg-gradient-to-r from-indigo-50 to-blue-50",
    },
    {
      id: "ai",
      name: "AI & ML",
      count: 5,
      icon: <FaRobot />,
      color: "from-red-600 to-orange-500",
      bgColor: "bg-gradient-to-r from-red-50 to-orange-50",
    },
    {
      id: "cloud",
      name: "Cloud & DevOps",
      count: 3,
      icon: <FaCloud />,
      color: "from-cyan-600 to-teal-500",
      bgColor: "bg-gradient-to-r from-cyan-50 to-teal-50",
    },
    {
      id: "mobile",
      name: "Mobile Dev",
      count: 4,
      icon: <FaMobileAlt />,
      color: "from-pink-600 to-rose-500",
      bgColor: "bg-gradient-to-r from-pink-50 to-rose-50",
    },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Software Engineer at Google",
      text: "TechMaster transformed my career. The Full-Stack course gave me exactly the skills needed to land my dream job at Google.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop",
      rating: 5,
      course: "Full-Stack Web Development",
    },
    {
      name: "David Chen",
      role: "Data Scientist at Amazon",
      text: "The Data Science program was incredibly comprehensive. Real-world projects and expert mentorship made all the difference.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      rating: 5,
      course: "Data Science & Analytics",
    },
    {
      name: "Maria Garcia",
      role: "Product Designer at Netflix",
      text: "As a career switcher, the UI/UX Design Masterclass provided the perfect foundation. I went from zero to job-ready in 4 months.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      rating: 5,
      course: "UI/UX Design Masterclass",
    },
  ];

  const courses = [
    {
      id: 1,
      title: "Full-Stack Web Development",
      category: "programming",
      instructor: "Alex Johnson",
      instructorRole: "Ex-Google Engineer",
      rating: 4.9,
      reviews: 1247,
      duration: "12 Weeks",
      hours: "120 Hours",
      students: 5400,
      price: "$1,299",
      originalPrice: "$1,999",
      discount: "35% OFF",
      level: "Intermediate",
      tags: ["React", "Node.js", "MongoDB", "AWS", "TypeScript"],
      description: "Master modern full-stack development with the MERN stack. Build production-ready applications with React, Node.js, and cloud deployment.",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=500&fit=crop",
      badge: "BESTSELLER",
      enrolled: true,
      features: ["Capstone Project", "Career Coaching", "Certificate", "Lifetime Access"],
    },
    // ... other course objects (keep as in original)
  ];

  const filteredCourses = courses.filter((course) => {
    const matchesCategory = activeCategory === "all" || course.category === activeCategory;
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFavorite = (id) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  // Helper function to safely render HTML content
  const renderHTML = (htmlString) => {
    if (!htmlString) return null;
    return <div dangerouslySetInnerHTML={{ __html: htmlString }} />;
  };

  // Helper function to extract text from HTML for display
  const extractTextFromHTML = (htmlString) => {
    if (!htmlString) return "";
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  // CourseCard component
  const CourseCard = ({ course }) => (
    <div
      className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 w-80 flex-shrink-0 mx-3 border border-gray-100"
      onMouseEnter={() => setHoveredCard(course.id)}
      onMouseLeave={() => setHoveredCard(null)}
    >
      <div className="relative h-48 overflow-hidden rounded-t-2xl">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm ${
            course.badge === "BESTSELLER" ? "bg-yellow-500/20 text-yellow-700 border border-yellow-500/30" :
            course.badge === "TRENDING" ? "bg-pink-500/20 text-pink-700 border border-pink-500/30" :
            course.badge === "HOT" ? "bg-red-500/20 text-red-700 border border-red-500/30" :
            course.badge === "NEW" ? "bg-blue-500/20 text-blue-700 border border-blue-500/30" :
            "bg-purple-500/20 text-purple-700 border border-purple-500/30"
          }`}>
            {course.badge}
          </span>
        </div>

        <div className="absolute top-3 right-3">
          <span className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full text-xs font-bold shadow-lg">
            {course.discount}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(course.id);
          }}
          className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all duration-300 hover:scale-110 shadow-md"
        >
          {favorites.has(course.id) ? (
            <FaHeart className="text-red-500" />
          ) : (
            <FaRegHeart className="text-gray-500" />
          )}
        </button>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            course.level === "Beginner" ? "bg-green-100 text-green-800" :
            course.level === "Intermediate" ? "bg-blue-100 text-blue-800" :
            course.level === "Advanced" ? "bg-purple-100 text-purple-800" :
            "bg-red-100 text-red-800"
          }`}>
            {course.level}
          </span>
          <div className="flex items-center">
            <FaStar className="text-yellow-400 text-sm" />
            <span className="ml-1 font-bold text-gray-900">{course.rating}</span>
            <span className="ml-1 text-gray-500 text-sm">({course.reviews})</span>
          </div>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 h-14 hover:text-blue-600 transition-colors">
          {course.title}
        </h3>

        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
            {course.instructor.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{course.instructor}</p>
            <p className="text-xs text-gray-500">{course.instructorRole}</p>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center text-sm text-gray-600 mb-1">
            <FaCheckCircle className="text-green-500 mr-2" />
            <span>{course.features[0]}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <FaCheckCircle className="text-green-500 mr-2" />
            <span>{course.features[1]}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="flex items-center text-gray-600">
            <MdAccessTime className="mr-1 text-gray-400" />
            <span className="text-xs">{course.duration}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <MdPeople className="mr-1 text-gray-400" />
            <span className="text-xs">{course.students.toLocaleString()}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <FaBookOpen className="mr-1 text-gray-400" />
            <span className="text-xs">{course.hours}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {course.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs hover:bg-gray-200 transition-colors">
              {tag}
            </span>
          ))}
          {course.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
              +{course.tags.length - 3}
            </span>
          )}
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <div>
            <span className="text-2xl font-bold text-gray-900">{course.price}</span>
            <span className="ml-2 text-sm text-gray-500 line-through">{course.originalPrice}</span>
          </div>
          <button className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
            course.enrolled
              ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg shadow-md"
              : "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg shadow-md"
          }`}>
            {course.enrolled ? "Continue Learning" : "Enroll Now"}
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Unable to load data</h2>
          <button 
            onClick={getData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {data?.banner?.bannerLogo?.[0]?.url ? (
                <img 
                  src={data.banner.bannerLogo[0].url} 
                  alt="logo"
                  className="w-12 h-12 object-contain"
                />
              ) : (
                <div className="w-12 h-12 flex items-center justify-center">
                  <img 
                    src="/logonew.jpeg" 
                    alt="logo"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <div>
                <h1 className="text-xl font-extrabold scale-y-150">K-Tech</h1>
                <p className="text-xs text-gray-500 font-medium">Future-Proof Your Career</p>
              </div>
            </div>

            <nav className="hidden lg:flex items-center space-x-8">
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors group">
                <span className="group-hover:text-blue-600">Home</span>
                <div className="h-0.5 w-0 group-hover:w-full bg-blue-600 transition-all duration-300"></div>
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors group">
                <span className="group-hover:text-blue-600">Courses</span>
                <div className="h-0.5 w-0 group-hover:w-full bg-blue-600 transition-all duration-300"></div>
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors group">
                <span className="group-hover:text-blue-600">About US</span>
                <div className="h-0.5 w-0 group-hover:w-full bg-blue-600 transition-all duration-300"></div>
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors group">
                <span className="group-hover:text-blue-600">Contact</span>
                <div className="h-0.5 w-0 group-hover:w-full bg-blue-600 transition-all duration-300"></div>
              </a>  
            </nav>

            <div className="flex items-center">
              <Button
                children="Login"
                className="w-full rounded-[3px]"
                onClick={() => router('/login')}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with API data */}
      <section 
        className="relative py-12 overflow-hidden"
        style={{ backgroundColor: data?.banner?.bgColor || '#ffffff' }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="mb-6">
                {renderHTML(data?.banner?.heading)}
              </div>
              
              <div className="mb-10">
                {renderHTML(data?.banner?.subHeading)}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                <Button
                  children="Explore Courses"
                  className="w-full py-2 rounded-[3px]"
                />
                <Button
                  children="Watch Demo"
                  className="w-full py-2 invisible"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto text-center">
                {[
                  {
                    value: `${stats.students.toLocaleString()}+`,
                    label: "Students Trained",
                    icon: <FaUserGraduate />,
                  },
                  {
                    value: `${stats.courses}+`,
                    label: "Industry Courses",
                    icon: <FaBookOpen />,
                  },
                  {
                    value: `${stats.instructors}+`,
                    label: "Expert Mentors",
                    icon: <FaUserTie />,
                  },
                  {
                    value: `${stats.companies}+`,
                    label: "Hiring Partners",
                    icon: <FaBuilding />,
                  },
                ].map((stat, index) => (
                  <div key={index} className="flex flex-col items-center justify-center group">
                    <div className="w-16 h-16 flex items-center justify-center rounded-full mb-4 transition-all duration-300 hover:shadow-blue-950 hover:shadow-2xl">
                      <div className="text-2xl text-blue-600">{stat.icon}</div>
                    </div>
                    <div className="text-xl font-bold text-gray-900 mb-1">{stat.value}</div>
                    <div className="text-gray-600 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative flex justify-center">
              {data?.banner?.bannerLogo?.[0]?.url ? (
                <img
                  src={data.banner.bannerLogo[0].url}
                  alt="Education Banner"
                  className="w-full max-w-lg rounded-2xl shadow-2xl"
                />
              ) : (
                <img
                  src="https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Education Banner"
                  className="w-full rounded-2xl shadow-2xl"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section 
        className="py-10 bg-gray-100"
        style={{ backgroundColor: data?.over50Courses?.bgColor || '#f9fafb' }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {extractTextFromHTML(data?.over50Courses?.heading) || "Browse by Category"}
              </h2>
              <p className="text-sm text-gray-600">
                {extractTextFromHTML(data?.over50Courses?.subHeading) || "Find the perfect course for your career goals"}
              </p>
            </div>

            <button className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center group self-start sm:self-auto">
              View All
              <FaChevronRight className="ml-1 text-xs group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`p-4 rounded-xl text-left transition-all duration-300 hover:-translate-y-0.5 ${
                  activeCategory === category.id
                    ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                    : `${category.bgColor} text-gray-800 hover:shadow-md`
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    activeCategory === category.id ? "bg-white/20" : "bg-white"
                  }`}>
                    <div className="text-lg">{category.icon}</div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold leading-tight">{category.name}</h3>
                    <p className={`text-xs ${
                      activeCategory === category.id ? "text-white/80" : "text-gray-500"
                    }`}>
                      {category.count} Courses
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {extractTextFromHTML(data?.allCoursesHeading) || "Featured Courses"}
              </h2>
              <p className="text-gray-600">
                Hand-picked by industry experts to boost your career
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-3 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 transition-colors flex items-center"
              >
                <FaFilter className="mr-2" />
                Filters
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {filteredCourses.slice(0, 6).map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          <div className="text-center">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-2xl transition-all duration-300 hover:scale-105 shadow-lg">
              View All Courses
              <FaChevronRight className="inline-block ml-2" />
            </button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section 
        className="py-16 bg-gradient-to-br from-gray-50 to-blue-50"
        style={{ backgroundColor: data?.howItWorks?.bgColor || '#f0f9ff' }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {extractTextFromHTML(data?.howItWorks?.heading) || "How TechMaster Works"}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {extractTextFromHTML(data?.howItWorks?.subHeading) || "Your journey from learning to earning, simplified"}
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 -z-10"></div>

            {[
              {
                step: "01",
                title: "Choose Your Path",
                description: "Select from 28+ industry-relevant courses based on your career goals",
                icon: <FaGraduationCap />,
              },
              {
                step: "02",
                title: "Learn by Doing",
                description: "Build real-world projects with expert guidance and hands-on practice",
                icon: <FaCode />,
              },
              {
                step: "03",
                title: "Get Certified",
                description: "Earn industry-recognized certificates that validate your skills",
                icon: <MdWorkspacePremium />,
              },
              {
                step: "04",
                title: "Land Your Dream Job",
                description: "Access our career services and connect with top employers",
                icon: <MdBusinessCenter />,
              },
            ].map((step, index) => (
              <div key={index} className="text-center relative">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <div className="text-white text-3xl">{step.icon}</div>
                </div>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 bg-white text-blue-600 font-bold text-lg w-10 h-10 rounded-full flex items-center justify-center border-4 border-blue-50">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {extractTextFromHTML(data?.testimonial?.heading) || "Success Stories"}
            </h2>
            <p className="text-gray-600">
              {extractTextFromHTML(data?.testimonial?.subHeading) || "Join thousands of professionals who transformed their careers"}
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/3 mb-8 md:mb-0">
                  <img
                    src={testimonials[activeTestimonial].avatar}
                    alt={testimonials[activeTestimonial].name}
                    className="w-48 h-48 rounded-2xl object-cover mx-auto shadow-lg"
                  />
                </div>
                <div className="md:w-2/3 md:pl-12">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-2xl font-medium text-gray-900 mb-6">
                    "{testimonials[activeTestimonial].text}"
                  </blockquote>
                  <div>
                    <p className="font-bold text-gray-900">{testimonials[activeTestimonial].name}</p>
                    <p className="text-gray-600 mb-2">{testimonials[activeTestimonial].role}</p>
                    <p className="text-sm text-blue-600 font-semibold">
                      Completed: {testimonials[activeTestimonial].course}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-8">
                    <div className="flex space-x-2">
                      {testimonials.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveTestimonial(index)}
                          className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            activeTestimonial === index
                              ? "bg-blue-600 w-8"
                              : "bg-gray-300 hover:bg-gray-400"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                        className="p-2 rounded-full bg-white hover:bg-gray-100 shadow-md"
                      >
                        <FaChevronLeft />
                      </button>
                      <button
                        onClick={() => setActiveTestimonial((prev) => (prev + 1) % testimonials.length)}
                        className="p-2 rounded-full bg-white hover:bg-gray-100 shadow-md"
                      >
                        <FaChevronRight />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-black mb-6">
              Start Your Tech Journey Today
            </h2>
            <p className="text-xl text-black/90 mb-10">
              No prior experience needed. Get job-ready in months with our expert-led programs.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                children="Start Free Trial"
                className="w-full py-2 rounded-[3px]"
              />
              <Button
                children="Book Consultation"
                className="w-full bg-white border border-gray-200 hover:bg-gray-100 text-black py-2 rounded-[3px]"
                childrenClassName="text-black"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white pt-16 pb-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 flex items-center justify-center">
                  <img 
                    src="/logonew.jpeg" 
                    alt="logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">K-Tech</h2>
                  <p className="text-gray-400">Future-Proof Your Career</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                We empower professionals worldwide with industry-relevant tech skills through expert-led courses and hands-on projects.
              </p>
              <div className="flex space-x-4">
                {[FaTwitter, FaFacebook, FaInstagram, FaLinkedin, FaYoutube, FaGithub].map((Icon, index) => (
                  <a
                    key={index}
                    href="#"
                    className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Icon className="text-gray-300" />
                  </a>
                ))}
              </div>
            </div>

            {[
              {
                title: "Courses",
                links: ["Programming", "Data Science", "Design", "Business", "Cloud", "AI/ML", "Mobile Dev", "Cybersecurity"],
              },
              {
                title: "Company",
                links: ["About Us", "Careers", "Blog", "Press", "Contact", "Affiliates", "Partners", "Hire Our Grads"],
              },
              {
                title: "Resources",
                links: ["Help Center", "Community", "Events", "Scholarships", "Free Courses", "Tech Blog", "Podcast", "Research"],
              },
            ].map((column, index) => (
              <div key={index}>
                <h3 className="font-bold text-lg mb-6">{column.title}</h3>
                <ul className="space-y-3">
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm mb-4 md:mb-0">
                © {new Date().getFullYear()} K-Tech. All rights reserved.
              </div>
              <div className="flex flex-wrap gap-6">
                <a href="#" className="text-gray-400 hover:text-white text-sm">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm">Cookie Policy</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm">Accessibility</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm">Sitemap</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;