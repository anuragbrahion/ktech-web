import React, { useEffect, useState } from 'react';
import Table from '../../components/Atoms/TableData/TableData';


const CategoryModal = ({ isOpen, onClose, onSave, categoryData, isEditing }) => {
  const [formData, setFormData] = useState({
    categoryName: '',
    type: ''
  });

  useEffect(() => {
    if (categoryData && isEditing) {
      setFormData({
        categoryName: categoryData.category || '',
        type: categoryData.type || ''
      });
    } else {
      setFormData({
        categoryName: '',
        type: ''
      });
    }
  }, [categoryData, isEditing]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.categoryName || !formData.type) {
      alert('Please fill in all required fields');
      return;
    }
    
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Category</h2>
              <h3 className="text-lg font-semibold text-gray-600 mt-1">
                {isEditing ? 'Edit Category' : 'Add Category'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Category Name */}
              <div>
                <label className="block text-gray-700 mb-2">Category Name</label>
                <input
                  type="text"
                  name="categoryName"
                  value={formData.categoryName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter category name"
                  required
                />
              </div>

              {/* Type Selection */}
              <div>
                <label className="block text-gray-700 mb-2">Type</label>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="type"
                        value="INCOME"
                        checked={formData.type === 'INCOME'}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                        required
                      />
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                        <span className="text-gray-700 font-medium">INCOME</span>
                      </div>
                    </label>
                    
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="type"
                        value="EXPENSE"
                        checked={formData.type === 'EXPENSE'}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-red-600 focus:ring-red-500"
                        required
                      />
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                        <span className="text-gray-700 font-medium">EXPENSE</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Type Color Preview */}
              {formData.type && (
                <div className="p-4 rounded-lg border" style={{
                  backgroundColor: formData.type === 'INCOME' ? '#dbeafe' : '#fee2e2',
                  borderColor: formData.type === 'INCOME' ? '#bfdbfe' : '#fecaca'
                }}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      formData.type === 'INCOME' ? 'bg-blue-100' : 'bg-red-100'
                    }`}>
                      <span className={formData.type === 'INCOME' ? 'text-blue-600' : 'text-red-600'}>
                        {formData.type === 'INCOME' ? '💰' : '💸'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Selected Type: {formData.type}</p>
                      <p className="text-sm text-gray-600">
                        {formData.type === 'INCOME' 
                          ? 'Categories for tracking money coming in' 
                          : 'Categories for tracking money going out'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-8">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
              >
                {isEditing ? 'Update Category' : 'Create Category'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const Category = () => {
  const [categories, setCategories] = useState([
    { 
      id: 1, 
      category: 'EDUCATION TRUST EXPENSE', 
      type: 'EXPENSE', 
      status: 'Active',
      createdDate: '15/01/2025'
    },
    { 
      id: 2, 
      category: 'RESHAMMAD EXPENSE', 
      type: 'EXPENSE', 
      status: 'Active',
      createdDate: '14/01/2025'
    },
    { 
      id: 3, 
      category: 'KHATODRA EXPENSE', 
      type: 'EXPENSE', 
      status: 'Active',
      createdDate: '12/01/2025'
    },
    { 
      id: 4, 
      category: 'AMAN EXPENSE', 
      type: 'EXPENSE', 
      status: 'Active',
      createdDate: '10/01/2025'
    },
    { 
      id: 5, 
      category: 'UMARWADA EXPENSE', 
      type: 'EXPENSE', 
      status: 'Active',
      createdDate: '08/01/2025'
    },
    { 
      id: 6, 
      category: 'EDUCATION TRUST INCOME', 
      type: 'INCOME', 
      status: 'Active',
      createdDate: '05/01/2025'
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [filters, setFilters] = useState({
    categoryName: '',
    categoryType: ''
  });

  // Filter handlers
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      categoryName: '',
      categoryType: ''
    });
  };

  // Action handlers
  const handleAddCategory = () => {
    setSelectedCategory(null);
    setIsEditing(false);
    setShowModal(true);
  };

  const handleViewCategory = (category) => {
    setSelectedCategory(category);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSaveCategory = (categoryData) => {
    if (isEditing && selectedCategory) {
      // Update existing category
      setCategories(categories.map(category => 
        category.id === selectedCategory.id 
          ? { 
              ...category, 
              category: categoryData.categoryName,
              type: categoryData.type
            }
          : category
      ));
    } else {
      // Add new category
      const newCategory = {
        id: categories.length + 1,
        category: categoryData.categoryName,
        type: categoryData.type,
        status: 'Active',
        createdDate: new Date().toLocaleDateString('en-GB')
      };
      setCategories([...categories, newCategory]);
    }
    setShowModal(false);
    setSelectedCategory(null);
  };

  // Toggle status
  const toggleStatus = (id) => {
    setCategories(categories.map(category => 
      category.id === id 
        ? { 
            ...category, 
            status: category.status === 'Active' ? 'Inactive' : 'Active'
          }
        : category
    ));
  };

  // Filter categories
  const filteredCategories = categories.filter(category => {
    return (
      (filters.categoryName === '' || category.category.toLowerCase().includes(filters.categoryName.toLowerCase())) &&
      (filters.categoryType === '' || category.type === filters.categoryType)
    );
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Pagination calculations
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCategories = filteredCategories.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const tableHeaders = ['Category', 'Type', 'Status', 'Actions'];

  const getStatusColor = (status) => {
    return status === 'Active' 
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-red-100 text-red-800 border-red-200';
  };

  const getTypeColor = (type) => {
    return type === 'INCOME' 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-red-100 text-red-800';
  };

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Categories</h1>
        <p className="text-gray-600 mt-2">Manage income and expense categories</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        {/* Filter Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <select
              name="categoryName"
              value={filters.categoryName}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">--- no select ---</option>
              {Array.from(new Set(categories.map(c => c.category))).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              name="categoryType"
              value={filters.categoryType}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">--- no select ---</option>
              <option value="INCOME">INCOME</option>
              <option value="EXPENSE">EXPENSE</option>
            </select>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={handleResetFilters}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700 font-medium"
            >
              Filter
            </button>
            <button
              onClick={handleAddCategory}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium flex items-center justify-center gap-2"
            >
              <span>+</span>
              <span>Add Category</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table
            headers={tableHeaders}
            data={currentCategories}
            renderRow={(category, index) => (
              <tr 
                key={category.id} 
                className={`hover:bg-blue-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
              >
                <td className="py-4 px-4">
                  <div className="font-medium text-gray-800">{category.category}</div>
                </td>
                <td className="py-4 px-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(category.type)}`}>
                    {category.type}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getStatusColor(category.status)}`}>
                      {category.status}
                    </span>
                    <button
                      onClick={() => toggleStatus(category.id)}
                      className={`w-10 h-6 rounded-full relative transition-colors duration-300 ${
                        category.status === 'Active' ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                        category.status === 'Active' ? 'left-5' : 'left-1'
                      }`}></span>
                    </button>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleViewCategory(category)}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full"
                      title="View/Edit Category"
                    >
                      <span className="text-xl">👁️</span>
                    </button>
                    <button
                      className="p-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100 rounded-full"
                      title="Edit Category"
                    >
                      <span className="text-xl">✏️</span>
                    </button>
                    <button
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full"
                      title="Delete Category"
                    >
                      <span className="text-xl">🗑️</span>
                    </button>
                  </div>
                </td>
              </tr>
            )}
          />
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No categories found</h3>
            <p className="text-gray-500">
              {Object.values(filters).some(f => f !== '') 
                ? "No categories match your filter criteria" 
                : "No categories available. Click 'Add Category' to create one."}
            </p>
          </div>
        )}

        {/* Pagination */}
        {filteredCategories.length > 0 && (
          <div className="flex flex-col md:flex-row justify-between items-center mt-6 pt-6 border-t border-gray-200">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 ${
                currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700'
              }`}
            >
              Previous
            </button>
            
            <div className="flex items-center space-x-2 my-4 md:my-0">
              {Array.from({ length: Math.min(4, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 4) {
                  pageNum = i + 1;
                } else if (currentPage <= 2) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 1) {
                  pageNum = totalPages - 3 + i;
                } else {
                  pageNum = currentPage - 1 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md ${
                      currentPage === pageNum
                        ? 'bg-blue-500 text-white'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {totalPages > 4 && currentPage < totalPages - 2 && (
                <>
                  <span className="text-gray-500">...</span>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md ${
                      currentPage === totalPages
                        ? 'bg-blue-500 text-white'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>
            
            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 ${
                currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700'
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Category Modal */}
      <CategoryModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedCategory(null);
        }}
        onSave={handleSaveCategory}
        categoryData={selectedCategory}
        isEditing={isEditing}
      />
    </div>
  );
};

export default Category;