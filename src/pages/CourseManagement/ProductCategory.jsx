import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Table from '../../components/Atoms/TableData/TableData';
import CategoryModalBranch from '../../components/Atoms/UI/CategoryModalBranch';
import {
  commerceCategoriesAllDocuments,
  createCommerceCategories,
  updateCommerceCategories,
  deleteCommerceCategories
} from '../../redux/slices/commerce';

const ProductCategory = () => {
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [searchTerm, setSearchTerm] = useState('');
   const [loading, setLoading] = useState(false);

  const categories = useSelector(state => state.commerce.commerceCategoriesAllDocumentsData?.data?.data?.list || []);

  useEffect(() => {
    dispatch(commerceCategoriesAllDocuments());
  }, [dispatch]);

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
    setLoading(true);
    if (modalMode === 'add') {
      dispatch(createCommerceCategories({ name: categoryData.name }))
        .then(() => {
          dispatch(commerceCategoriesAllDocuments());
          setShowCategoryModal(false);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      dispatch(updateCommerceCategories({ 
        _id: selectedCategory._id,
        name: categoryData.name 
      }))
        .then(() => {
          dispatch(commerceCategoriesAllDocuments());
          setShowCategoryModal(false);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  };

  const handleDeleteCategory = (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      dispatch(deleteCommerceCategories({ _id: categoryId }))
        .then(() => {
          dispatch(commerceCategoriesAllDocuments());
        });
    }
  };

  const tableHeaders = ['Category Name', 'Status', 'Created At', 'Actions'];

  return (
    <div className="">
      <div className="">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Product Category List</h1>
          <p className="text-black mt-2">Manage product categories and their details</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">   
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
            <button
              onClick={handleAddCategory}
              className="px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 font-medium flex items-center gap-2"
              disabled={loading}
            >
              <span className="text-xl">+</span>
              {loading ? 'Processing...' : 'Add Category'}
            </button>
          </div>

          {categories.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <Table
                  headers={tableHeaders}
                  data={categories}
                  renderRow={(category, index) => (
                    <tr 
                      key={category._id} 
                      className={`hover:bg-sky-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                    >
                      <td className="py-4 px-4">
                        <div className="text-black capitalize">{category.name}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            category.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {category.status?.charAt(0).toUpperCase() + category.status?.slice(1) || 'Inactive'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-black">
                        {category.createdAt ? new Date(category.createdAt).toLocaleDateString('en-GB') : 'N/A'}
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
                            onClick={() => handleDeleteCategory(category._id)}
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
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No results.</h3>
              <button
                onClick={handleAddCategory}
                className="px-6 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600"
              >
                Add Category
              </button>
            </div>
          )}
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
        loading={loading}
      />
    </div>
  );
};

export default ProductCategory;