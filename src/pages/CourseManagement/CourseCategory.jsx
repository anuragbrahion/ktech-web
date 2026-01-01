import React, { useState } from 'react';
import Table from '../../components/Atoms/TableData/TableData';
import CategoryModal from '../../components/Atoms/UI/CategoryModal';

const CourseCategory = () => {
  const [categories, setCategories] = useState([
    { 
      id: 1, 
      name: 'Long Term Course', 
      status: 'active',
      createdAt: '15/11/2025',
      description: 'Courses with duration more than 6 months',
      totalCourses: 8
    },
    { 
      id: 2, 
      name: 'Mid Term Course', 
      status: 'active',
      createdAt: '12/11/2025',
      description: 'Courses with duration 3-6 months',
      totalCourses: 12
    },
    { 
      id: 3, 
      name: 'Short term', 
      status: 'active',
      createdAt: '10/11/2025',
      description: 'Courses with duration less than 3 months',
      totalCourses: 15
    },
    { 
      id: 4, 
      name: 'Crash Course', 
      status: 'active',
      createdAt: '08/11/2025',
      description: 'Intensive short duration courses',
      totalCourses: 6
    },
    { 
      id: 5, 
      name: 'Diploma Course', 
      status: 'inactive',
      createdAt: '05/11/2025',
      description: 'Diploma level courses',
      totalCourses: 4
    },
    { 
      id: 6, 
      name: 'Certificate Course', 
      status: 'active',
      createdAt: '01/11/2025',
      description: 'Certificate awarding courses',
      totalCourses: 10
    },
    { 
      id: 7, 
      name: 'Weekend Batch', 
      status: 'active',
      createdAt: '28/10/2025',
      description: 'Weekend only courses',
      totalCourses: 7
    },
    { 
      id: 8, 
      name: 'Online Course', 
      status: 'active',
      createdAt: '25/10/2025',
      description: 'Fully online courses',
      totalCourses: 9
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    name: 'all',
    status: 'all'
  });

  const handleAddCategory = () => {
    setModalMode('add');
    setSelectedCategory(null);
    setShowCategoryModal(true);
  };

  const handleEditCategory = (category) => {
    setModalMode('edit');
    setSelectedCategory(category);
    setShowCategoryModal(true);
  };

  const handleSaveCategory = (categoryData) => {
    if (modalMode === 'add') {
      const newCategory = {
        id: categories.length + 1,
        ...categoryData,
        status: 'active',
        createdAt: new Date().toLocaleDateString('en-GB'),
        totalCourses: 0,
        description: categoryData.description || ''
      };
      setCategories([newCategory, ...categories]);
    } else {
      setCategories(categories.map(category => 
        category.id === selectedCategory.id 
          ? { ...category, ...categoryData }
          : category
      ));
    }
    setShowCategoryModal(false);
    setSelectedCategory(null);
  };

  const handleToggleStatus = (categoryId) => {
    setCategories(categories.map(category => 
      category.id === categoryId 
        ? { ...category, status: category.status === 'active' ? 'inactive' : 'active' }
        : category
    ));
  };

  const handleDeleteCategory = (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(category => category.id !== categoryId));
    }
  };

  const filteredCategories = categories.filter(category => {
    const matchesSearch = 
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesName = filters.name === 'all' || true;
    const matchesStatus = filters.status === 'all' || category.status === filters.status;
    
    return matchesSearch && matchesName && matchesStatus;
  });

//   const stats = {
//     total: categories.length,
//     active: categories.filter(c => c.status === 'active').length,
//     inactive: categories.filter(c => c.status === 'inactive').length,
//     totalCourses: categories.reduce((sum, cat) => sum + cat.totalCourses, 0),
//     averageCourses: Math.round(categories.reduce((sum, cat) => sum + cat.totalCourses, 0) / categories.length)
//   };

  const tableHeaders = ['Category Name', 'Status', 'Total Courses', 'Created At', 'Actions'];

  return (
    <div className="">
      <div className="container mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-start md:items-center mb-4 flex-col md:flex-row gap-4">
            <div>
              <h1 className="text-3xl font-bold">Course Categories</h1>
              <p className="text-black mt-2">Manage course categories and their details</p>
            </div>
            <button
              onClick={handleAddCategory}
              className="px-6 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 font-medium flex items-center gap-2"
            >
              <span className="text-xl">+</span>
              Add Category
            </button>
          </div>
        </div>

        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-sky-50 p-6 rounded-lg shadow border border-sky-100">
            <h3 className="text-lg font-semibold text-sky-700">Total Categories</h3>
            <p className="text-3xl font-bold text-black mt-2">{stats.total}</p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg shadow border border-green-100">
            <h3 className="text-lg font-semibold text-green-700">Active Categories</h3>
            <p className="text-3xl font-bold text-black mt-2">{stats.active}</p>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg shadow border border-purple-100">
            <h3 className="text-lg font-semibold text-purple-700">Total Courses</h3>
            <p className="text-3xl font-bold text-black mt-2">{stats.totalCourses}</p>
          </div>
          <div className="bg-yellow-50 p-6 rounded-lg shadow border border-yellow-100">
            <h3 className="text-lg font-semibold text-yellow-700">Avg. Courses/Category</h3>
            <p className="text-3xl font-bold text-black mt-2">{stats.averageCourses}</p>
          </div>
        </div> */}

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <select
                value={filters.name}
                onChange={(e) => setFilters({...filters, name: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
              >
                <option value="all">Select Category Name</option>
                {categories.map((cat, index) => (
                  <option key={index} value={cat.name}>{cat.name}</option>
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
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table
              headers={tableHeaders}
              data={filteredCategories}
              renderRow={(category, index) => (
                <tr 
                  key={category.id} 
                  className={`hover:bg-sky-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                >
                  <td className="py-4 px-4">
                    <div className="font-medium text-black">{category.name}</div>
                    {category.description && (
                      <div className="text-sm text-gray-500 mt-1 truncate max-w-xs">
                        {category.description}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <span className={`w-3 h-3 rounded-full mr-2 ${
                        category.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                      }`}></span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        category.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {category.status.charAt(0).toUpperCase() + category.status.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-sm font-bold mr-2">
                        {category.totalCourses}
                      </span>
                      <span className="text-black">courses</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-black">{category.createdAt}</td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="text-sky-500 hover:text-sky-700 text-lg"
                        title="Edit Category"
                      >
                        👁️
                      </button>
                      <button
                        onClick={() => handleToggleStatus(category.id)}
                        className={`text-lg ${
                          category.status === 'active' 
                            ? 'text-yellow-500 hover:text-yellow-700' 
                            : 'text-green-500 hover:text-green-700'
                        }`}
                        title={category.status === 'active' ? 'Deactivate' : 'Activate'}
                      >
                        {category.status === 'active' ? '⏸️' : '▶️'}
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-red-500 hover:text-red-700 text-lg"
                        title="Delete Category"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            />
          </div>

          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📁</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No categories found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || filters.status !== 'all' 
                  ? "No categories match your search criteria" 
                  : "No categories available. Add your first category!"}
              </p>
              <button
                onClick={handleAddCategory}
                className="px-6 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600"
              >
                Add First Category
              </button>
            </div>
          )}
        </div>

      </div>

      <CategoryModal
        isOpen={showCategoryModal}
        onClose={() => {
          setShowCategoryModal(false);
          setSelectedCategory(null);
        }}
        categoryData={selectedCategory}
        mode={modalMode}
        onSubmit={handleSaveCategory}
      />
    </div>
  );
};

export default CourseCategory;