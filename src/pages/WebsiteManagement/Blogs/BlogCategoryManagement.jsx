// pages/BlogCategoryManagement.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Eye, ChevronLeft } from 'lucide-react';
import { websiteCategoryList,
  enableDisableWebsiteCategory,
  deleteWebsiteCategory,
  createWebsiteCategory,
  updateWebsiteCategory,
  websiteCategoryAllDocuments } from '../../../redux/slices/website';
import TableData from '../../../components/Atoms/Table';
 
const AddEditCategoryModal = ({ category, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: ''
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
      });
    }
  }, [category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {category ? 'Edit Category' : 'Add Category'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter category name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div> 
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {category ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const BlogCategoryManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [categoriesData, setCategoriesData] = useState([]);
  const [, setAllCategories] = useState([]);

  const categoryListData = useSelector(state => state.website?.websiteCategoryListData);
  const allDocumentsData = useSelector(state => state.website?.websiteCategoryAllDocumentsData);

  useEffect(() => {
    fetchCategories();
    fetchAllDocuments();
  }, [dispatch]);

  const fetchCategories = () => {
    dispatch(websiteCategoryList({ page: currentPage, size: itemsPerPage }));
  };

  const fetchAllDocuments = () => {
    dispatch(websiteCategoryAllDocuments());
  };

  useEffect(() => {
    if (categoryListData?.data?.data?.list) {
      setCategoriesData(categoryListData.data.data?.list);
    }
  }, [categoryListData]);

  useEffect(() => {
    if (allDocumentsData?.data?.data) {
      setAllCategories(allDocumentsData.data.data);
    }
  }, [allDocumentsData]);

  const handleAddCategory = () => {
    setEditingCategory(null);
    setShowModal(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setShowModal(true);
  };

  const handleDeleteCategory = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      dispatch(deleteWebsiteCategory({ id })).then((action) => {
        if (!action.error) {
          fetchCategories();
          fetchAllDocuments();
        }
      });
    }
  };

  const handleStatusToggle = (category) => {
    const payload = {
      _id: category._id,
      status: !category.status
    };
    dispatch(enableDisableWebsiteCategory(payload)).then((action) => {
      if (!action.error) {
        fetchCategories();
        fetchAllDocuments();
      }
    });
  };

  const handleSaveCategory = (categoryData) => {
    if (editingCategory) {
      dispatch(updateWebsiteCategory({
        id: editingCategory._id,
        ...categoryData
      })).then((action) => {
        if (!action.error) {
          fetchCategories();
          fetchAllDocuments();
          setShowModal(false);
        }
      });
    } else {
      dispatch(createWebsiteCategory(categoryData)).then((action) => {
        if (!action.error) {
          fetchCategories();
          fetchAllDocuments();
          setShowModal(false);
        }
      });
    }
  };

  const tableHeadings = ['Name', 'Status', 'Created At', 'Actions'];
  
  const tableData = categoriesData.map(category => [
    category.name,
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
      category.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }`}>
      {category.status ? 'Active' : 'Inactive'}
    </span>,
    new Date(category.createdAt).toLocaleDateString(),
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleEditCategory(category)}
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
        title="Edit"
      >
        <Edit2 className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleStatusToggle(category)}
        className={`p-2 rounded-lg transition ${
          category.status ? 'text-yellow-600 hover:bg-yellow-50' : 'text-green-600 hover:bg-green-50'
        }`}
        title={category.status ? 'Deactivate' : 'Activate'}
      >
        <Eye className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleDeleteCategory(category._id)}
        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
        title="Delete"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Blog Categories</h1>
              <p className="text-gray-600">Manage your blog categories</p>
            </div>
            <button
              onClick={handleAddCategory}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Plus className="w-4 h-4" />
              Add Category
            </button>
          </div>
        </div>

        <TableData
          tableHeadings={tableHeadings}
          data={tableData}
          currentPage={currentPage}
          size={itemsPerPage}
          handlePageChange={setCurrentPage}
          total={categoryListData?.data?.total || 0}
        />
      </div>

      {showModal && (
        <AddEditCategoryModal
          category={editingCategory}
          onSave={handleSaveCategory}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default BlogCategoryManagement;