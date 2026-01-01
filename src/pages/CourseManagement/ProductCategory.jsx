import React, { useState } from 'react';
import Table from '../../components/Atoms/TableData/TableData';
import CategoryModalBranch from '../../components/Atoms/UI/CategoryModalBranch';

const ProductCategory = () => {
  const [categories, setCategories] = useState([
    { 
      id: 1, 
      name: 'Electronics', 
      status: 'active',
      createdAt: '15/11/2025',
      description: 'Electronic devices and accessories',
      productCount: 25
    },
    { 
      id: 2, 
      name: 'Books', 
      status: 'active',
      createdAt: '12/11/2025',
      description: 'Educational and reference books',
      productCount: 18
    },
    { 
      id: 3, 
      name: 'Stationery', 
      status: 'active',
      createdAt: '10/11/2025',
      description: 'Writing materials and office supplies',
      productCount: 42
    },
    { 
      id: 4, 
      name: 'Uniforms', 
      status: 'active',
      createdAt: '08/11/2025',
      description: 'School and college uniforms',
      productCount: 15
    },
    { 
      id: 5, 
      name: 'Lab Equipment', 
      status: 'inactive',
      createdAt: '05/11/2025',
      description: 'Scientific and laboratory equipment',
      productCount: 8
    },
    { 
      id: 6, 
      name: 'Sports Gear', 
      status: 'active',
      createdAt: '01/11/2025',
      description: 'Sports equipment and accessories',
      productCount: 12
    },
    { 
      id: 7, 
      name: 'Art Supplies', 
      status: 'active',
      createdAt: '28/10/2025',
      description: 'Art and craft materials',
      productCount: 20
    },
    { 
      id: 8, 
      name: 'Software', 
      status: 'active',
      createdAt: '25/10/2025',
      description: 'Educational software and licenses',
      productCount: 10
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(categories[0]?.id.toString() || 'all');

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
        description: categoryData.description || '',
        productCount: 0
      };
      setCategories([newCategory, ...categories]);
      
      // Select the newly added category by default
      setCategoryFilter(newCategory.id.toString());
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
      const updatedCategories = categories.filter(category => category.id !== categoryId);
      setCategories(updatedCategories);
      
      // If the deleted category was selected, select the first available category
      if (categoryFilter === categoryId.toString()) {
        if (updatedCategories.length > 0) {
          setCategoryFilter(updatedCategories[0].id.toString());
        } else {
          setCategoryFilter('all');
        }
      }
    }
  };

  const filteredCategories = categories.filter(category => {
    const matchesSearch = 
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = 
      categoryFilter === 'all' || category.id.toString() === categoryFilter;
    
    return matchesSearch && matchesFilter;
  });

  const tableHeaders = ['Category Name', 'Status', 'Products', 'Created At', 'Description', 'Actions'];

  return (
    <div className="">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Product Category List</h1>
          <p className="text-black mt-2">Manage product categories and their details</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 md:w-64">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
              >
                <option value="all">--- no select ---</option>
                {categories.map((category, index) => (
                  <option key={category.id} value={category.id.toString()}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
              />
            </div>
            
            <div className="md:w-32">
              <button className="w-full px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600">
                Filter
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-gray-600">
              {categoryFilter === 'all' ? 'Showing all categories' : 
                `Showing: ${categories.find(c => c.id.toString() === categoryFilter)?.name}`}
            </div>
            <button
              onClick={handleAddCategory}
              className="px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 font-medium flex items-center gap-2"
            >
              <span className="text-xl">+</span>
              Add Category
            </button>
          </div>

          {filteredCategories.length > 0 ? (
            <>
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
                        <div className="font-medium text-black text-lg">{category.name}</div>
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
                          <span className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-800 rounded-full text-lg font-bold">
                            {category.productCount}
                          </span>
                          <span className="ml-2 text-sm text-gray-500">products</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-black">{category.createdAt}</td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-600 max-w-xs truncate">
                          {category.description}
                        </div>
                      </td>
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

              <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50">
                  Previous
                </button>
                <div className="text-sm text-gray-600">
                  Page 1 of {Math.ceil(filteredCategories.length / 10)}
                </div>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50">
                  Next
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No results.</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || categoryFilter !== 'all' 
                  ? "No categories match your search criteria" 
                  : "No product categories available. Add your first category!"}
              </p>
              <button
                onClick={handleAddCategory}
                className="px-6 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600"
              >
                Add Category
              </button>
            </div>
          )}
        </div>

        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-sky-700 mb-4">Category Management Tips</h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <span className="w-2 h-2 bg-sky-500 rounded-full mt-2 mr-3"></span>
              <span className="text-black">Product categories help organize your inventory efficiently.</span>
            </div>
            <div className="flex items-start">
              <span className="w-2 h-2 bg-sky-500 rounded-full mt-2 mr-3"></span>
              <span className="text-black">Only active categories will be visible when adding new products.</span>
            </div>
            <div className="flex items-start">
              <span className="w-2 h-2 bg-sky-500 rounded-full mt-2 mr-3"></span>
              <span className="text-black">You can filter products by selecting a specific category.</span>
            </div>
            <div className="flex items-start">
              <span className="w-2 h-2 bg-sky-500 rounded-full mt-2 mr-3"></span>
              <span className="text-black">The product count shows how many items belong to each category.</span>
            </div>
          </div>
        </div>
      </div>

      <CategoryModalBranch
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

export default ProductCategory;