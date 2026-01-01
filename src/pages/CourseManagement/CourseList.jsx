import React, { useState } from 'react';
import UpdateCourseModal from '../../components/Atoms/UI/UpdateCourseModal';
import AddCourseModal from '../../components/Atoms/UI/AddCourseModal';
import Table from '../../components/Atoms/TableData/TableData';

const CourseList = () => {
  const [courses, setCourses] = useState([
    { 
      id: 1, 
      name: 'Digital Marketing', 
      category: 'Short term', 
      status: 'active',
      createdAt: '07/11/2025',
      description: 'Learn digital marketing strategies including SEO, SEM, social media marketing, and content marketing.',
      actualPrice: '12000',
      sellingPrice: '8999',
      duration: '3',
      totalLectures: '36',
      language: 'English',
      template: 'Marketing Template'
    },
    { 
      id: 2, 
      name: 'UI/UX Design', 
      category: 'Short term', 
      status: 'active',
      createdAt: '07/11/2025',
      description: 'Master user interface and user experience design principles for web and mobile applications.',
      actualPrice: '15000',
      sellingPrice: '11999',
      duration: '4',
      totalLectures: '48',
      language: 'English',
      template: 'Design Template'
    },
    { 
      id: 3, 
      name: 'Hindi/Gujarati Typing / Internet', 
      category: 'Short term', 
      status: 'active',
      createdAt: '07/11/2025',
      description: 'Learn Hindi and Gujarati typing skills along with basic internet usage.',
      actualPrice: '8000',
      sellingPrice: '5999',
      duration: '2',
      totalLectures: '24',
      language: 'Hindi, Gujarati',
      template: 'Basic Template'
    },
    { 
      id: 4, 
      name: 'Computer Hardware', 
      category: 'Short term', 
      status: 'inactive',
      createdAt: '07/11/2025',
      description: 'Comprehensive course on computer hardware components, assembly, and troubleshooting.',
      actualPrice: '10000',
      sellingPrice: '7499',
      duration: '3',
      totalLectures: '30',
      language: 'English',
      template: 'Technical Template'
    },
    { 
      id: 5, 
      name: 'C++', 
      category: 'Short term', 
      status: 'active',
      createdAt: '07/11/2025',
      description: 'Learn C++ programming language from basics to advanced concepts.',
      actualPrice: '14000',
      sellingPrice: '9999',
      duration: '4',
      totalLectures: '40',
      language: 'English',
      template: 'Programming Template'
    },
    { 
      id: 6, 
      name: 'C Language', 
      category: 'Short term', 
      status: 'active',
      createdAt: '07/11/2025',
      description: 'Foundation course in C programming language for beginners.',
      actualPrice: '12000',
      sellingPrice: '7999',
      duration: '3',
      totalLectures: '32',
      language: 'English',
      template: 'Programming Template'
    },
    { 
      id: 7, 
      name: 'Python', 
      category: 'Short term', 
      status: 'active',
      createdAt: '07/11/2025',
      description: 'Python programming for data science, web development, and automation.',
      actualPrice: '16000',
      sellingPrice: '11999',
      duration: '4',
      totalLectures: '44',
      language: 'English',
      template: 'Programming Template'
    },
    { 
      id: 8, 
      name: 'JavaScript', 
      category: 'Short term', 
      status: 'active',
      createdAt: '07/11/2025',
      description: 'Modern JavaScript for web development including ES6+ features and frameworks.',
      actualPrice: '18000',
      sellingPrice: '13999',
      duration: '5',
      totalLectures: '50',
      language: 'English',
      template: 'Web Development Template'
    },
  ]);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    startDate: '',
    endDate: ''
  });

  const handleAddCourse = (courseData) => {
    const newCourse = {
      id: courses.length + 1,
      ...courseData,
      createdAt: new Date().toLocaleDateString('en-GB'),
      status: 'active'
    };
    setCourses([newCourse, ...courses]);
    setShowAddModal(false);
  };

  const handleUpdateCourse = (updatedData) => {
    setCourses(courses.map(course => 
      course.id === selectedCourse.id 
        ? { ...course, ...updatedData }
        : course
    ));
    setShowUpdateModal(false);
    setSelectedCourse(null);
  };

  const handleToggleStatus = (courseId) => {
    setCourses(courses.map(course => 
      course.id === courseId 
        ? { ...course, status: course.status === 'active' ? 'inactive' : 'active' }
        : course
    ));
  };

  const handleDeleteCourse = (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      setCourses(courses.filter(course => course.id !== courseId));
    }
  };

  const handleViewDetails = (course) => {
    setSelectedCourse(course);
    setShowUpdateModal(true);
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      filters.category === 'all' || course.category.toLowerCase().includes(filters.category.toLowerCase());
    
    const matchesStatus = 
      filters.status === 'all' || course.status === filters.status;
    
    const matchesDate = () => {
      if (!filters.startDate && !filters.endDate) return true;
      
      const courseDate = new Date(course.createdAt.split('/').reverse().join('-'));
      const startDate = filters.startDate ? new Date(filters.startDate) : null;
      const endDate = filters.endDate ? new Date(filters.endDate) : null;
      
      if (startDate && endDate) {
        return courseDate >= startDate && courseDate <= endDate;
      }
      if (startDate) return courseDate >= startDate;
      if (endDate) return courseDate <= endDate;
      
      return true;
    };
    
    return matchesSearch && matchesCategory && matchesStatus && matchesDate();
  });

  const categories = ['Short term', 'Long term', 'Crash course', 'Diploma', 'Certificate'];
  const tableHeaders = ['Course Name', 'Categories', 'Status', 'Created At', 'Actions'];

  return (
    <div className="">
      <div className="container mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-start md:items-center mb-4 flex-col md:flex-row gap-4">
            <div>
              <h1 className="text-3xl font-bold">Course Management</h1>
              <p className="text-black mt-2">Manage all courses and their details</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 font-medium flex items-center gap-2"
            >
              <span className="text-xl">+</span>
              Add Course
            </button>
          </div>
        </div>

        {/* <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <div className="bg-sky-50 p-6 rounded-lg shadow border border-sky-100">
            <h3 className="text-lg font-semibold text-sky-700">Total Courses</h3>
            <p className="text-3xl font-bold text-black mt-2">{stats.total}</p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg shadow border border-green-100">
            <h3 className="text-lg font-semibold text-green-700">Active Courses</h3>
            <p className="text-3xl font-bold text-black mt-2">{stats.active}</p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg shadow border border-red-100">
            <h3 className="text-lg font-semibold text-red-700">Inactive Courses</h3>
            <p className="text-3xl font-bold text-black mt-2">{stats.inactive}</p>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg shadow border border-purple-100">
            <h3 className="text-lg font-semibold text-purple-700">Short Term</h3>
            <p className="text-3xl font-bold text-black mt-2">{stats.shortTerm}</p>
          </div>
          <div className="bg-yellow-50 p-6 rounded-lg shadow border border-yellow-100">
            <h3 className="text-lg font-semibold text-yellow-700">Total Revenue</h3>
            <p className="text-3xl font-bold text-black mt-2">₹{stats.totalRevenue}</p>
          </div>
          <div className="bg-blue-50 p-6 rounded-lg shadow border border-blue-100">
            <h3 className="text-lg font-semibold text-blue-700">Avg. Price</h3>
            <p className="text-3xl font-bold text-black mt-2">₹{stats.averagePrice}</p>
          </div>
        </div> */}

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div>
              <select
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
              >
                <option value="all">Select Category</option>
                {categories.map((cat, index) => (
                  <option key={index} value={cat.toLowerCase()}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
              >
                <option value="all">Select Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            
            <div>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                placeholder="Start Date"
              />
            </div>
            
            <div>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                placeholder="End Date"
              />
            </div>
            
            <div>
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table
              headers={tableHeaders}
              data={filteredCourses}
              renderRow={(course, index) => (
                <tr 
                  key={course.id} 
                  className={`hover:bg-sky-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                >
                  <td className="py-4 px-4">
                    <div className="font-medium text-black">{course.name}</div>
                    <div className="text-sm text-gray-500 mt-1 truncate max-w-xs">
                      {course.description}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                      {course.category}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <span className={`w-3 h-3 rounded-full mr-2 ${
                        course.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                      }`}></span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        course.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-black">{course.createdAt}</td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewDetails(course)}
                        className="text-sky-500 hover:text-sky-700 text-lg"
                        title="View/Edit Course"
                      >
                        👁️
                      </button>
                      <button
                        onClick={() => handleToggleStatus(course.id)}
                        className={`text-lg ${
                          course.status === 'active' 
                            ? 'text-yellow-500 hover:text-yellow-700' 
                            : 'text-green-500 hover:text-green-700'
                        }`}
                        title={course.status === 'active' ? 'Deactivate Course' : 'Activate Course'}
                      >
                        {course.status === 'active' ? '⏸️' : '▶️'}
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(course.id)}
                        className="text-red-500 hover:text-red-700 text-lg"
                        title="Delete Course"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            />
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No courses found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || filters.category !== 'all' || filters.status !== 'all' 
                  ? "No courses match your search criteria" 
                  : "No courses available. Add your first course!"}
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600"
              >
                Add First Course
              </button>
            </div>
          )}
        </div>
      </div>

      <AddCourseModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddCourse}
        categories={categories}
      />

      <UpdateCourseModal
        isOpen={showUpdateModal}
        onClose={() => {
          setShowUpdateModal(false);
          setSelectedCourse(null);
        }}
        courseData={selectedCourse}
        onSubmit={handleUpdateCourse}
        categories={categories}
      />
    </div>
  );
};

export default CourseList;