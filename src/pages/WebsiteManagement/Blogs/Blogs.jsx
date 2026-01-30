import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Edit2, Trash2, Eye, Calendar, ChevronLeft, ChevronRight, Tag } from 'lucide-react';
import { X, Globe, FileText, Check, Image as ImageIcon, Upload } from 'lucide-react';
import { 
  websiteBlogsList,
  enableDisableWebsiteBlogs,
  deleteWebsiteBlogs,
  createWebsiteBlogs,
  updateWebsiteBlogs,
  websiteLanguagesAllDocuments,
  websiteCategoryAllDocuments 
} from '../../../redux/slices/website';
import TableData from '../../../components/Atoms/Table';
import { toast } from 'react-toastify';
import axios from 'axios';
 
const AddEditBlogModal = ({ blog, onSave, onClose, languages, categories }) => {
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    description: '',
    language: [],
    category: [],
    thumbnailImage: null,
    mainImageUrl: null
  });

  const [activeTab, setActiveTab] = useState('basic');
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [mainImageFile, setMainImageFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [mainImagePreview, setMainImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title || '',
        shortDescription: blog.shortDescription || '',
        description: blog.description || '',
        language: blog.language ? blog.language.map(l => l._id || l) : [],
        category: blog.category ? blog.category.map(c => c._id || c) : [],
        thumbnailImage: blog.thumbnailImage || null,
        mainImageUrl: blog.mainImageUrl || null
      });
      
      if (blog.thumbnailImage?.url) {
        setThumbnailPreview(blog.thumbnailImage.url);
      }
      if (blog.mainImageUrl?.url) {
        setMainImagePreview(blog.mainImageUrl.url);
      }
    }
  }, [blog]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (field, values) => {
    setFormData(prev => ({ ...prev, [field]: values }));
  };

  const handleImageUpload = async (file, type) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('https://ktech-backend-ten.vercel.app/api/v1/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success && response.data.data) {
        if (type === 'thumbnail') {
          setFormData(prev => ({
            ...prev,
            thumbnailImage: response.data.data
          }));
          setThumbnailPreview(response.data.data.url);
          toast.success('Thumbnail uploaded successfully');
        } else if (type === 'main') {
          setFormData(prev => ({
            ...prev,
            mainImageUrl: response.data.data
          }));
          setMainImagePreview(response.data.data.url);
          toast.success('Main image uploaded successfully');
        }
      }
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleImageChange = (field, e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === 'thumbnail') {
        setThumbnailFile(file);
        const previewUrl = URL.createObjectURL(file);
        setThumbnailPreview(previewUrl);
        handleImageUpload(file, 'thumbnail');
      } else if (type === 'main') {
        setMainImageFile(file);
        const previewUrl = URL.createObjectURL(file);
        setMainImagePreview(previewUrl);
        handleImageUpload(file, 'main');
      }
    }
  };

  const removeImage = (type) => {
    if (type === 'thumbnail') {
      setThumbnailPreview('');
      setThumbnailFile(null);
      setFormData(prev => ({ ...prev, thumbnailImage: null }));
    } else if (type === 'main') {
      setMainImagePreview('');
      setMainImageFile(null);
      setFormData(prev => ({ ...prev, mainImageUrl: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.shortDescription || !formData.description || 
        formData.language.length === 0 || formData.category.length === 0 || 
        !formData.thumbnailImage || !formData.mainImageUrl) {
      toast.error('Please fill all required fields');
      return;
    }

    const payload = {
      title: formData.title,
      shortDescription: formData.shortDescription,
      description: formData.description,
      language: formData.language,
      category: formData.category,
      thumbnailImage: formData.thumbnailImage,
      mainImageUrl: formData.mainImageUrl
    };

    if (blog) {
      payload._id = blog._id;
    }

    onSave(payload);
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: FileText },
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'media', label: 'Media', icon: ImageIcon }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {blog ? 'Edit Blog' : 'Add New Blog'}
            </h2>
            <p className="text-gray-600 text-sm">Add your blogs here</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="border-b border-gray-200">
          <div className="flex space-x-1 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="flex items-center gap-2">
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[60vh]">
          <div className="p-6 space-y-6">
            {activeTab === 'basic' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter blog title"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Short Description *
                  </label>
                  <textarea
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleChange}
                    placeholder="Enter a short description"
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Languages *
                    </label>
                    <select
                      multiple
                      value={formData.language}
                      onChange={(e) => handleArrayChange('language', Array.from(e.target.selectedOptions, option => option.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="" disabled>Select languages</option>
                      {languages.map((lang) => (
                        <option key={lang._id} value={lang._id}>
                          {lang.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categories *
                    </label>
                    <select
                      multiple
                      value={formData.category}
                      onChange={(e) => handleArrayChange('category', Array.from(e.target.selectedOptions, option => option.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="" disabled>Select categories</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'content' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Write your blog content here..."
                  rows="10"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            )}

            {activeTab === 'media' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thumbnail Image *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    {uploading ? (
                      <div className="py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="text-sm text-gray-600 mt-3">Uploading...</p>
                      </div>
                    ) : thumbnailPreview || formData.thumbnailImage?.url ? (
                      <div className="relative">
                        <img
                          src={thumbnailPreview || formData.thumbnailImage?.url}
                          alt="Thumbnail"
                          className="max-h-48 mx-auto rounded-lg"
                        />
                        <div className="mt-3 flex gap-2 justify-center">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange('thumbnailImage', e, 'thumbnail')}
                            className="hidden"
                            id="thumbnail-upload"
                          />
                          <label htmlFor="thumbnail-upload" className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer">
                            Change
                          </label>
                          <button
                            type="button"
                            onClick={() => removeImage('thumbnail')}
                            className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange('thumbnailImage', e, 'thumbnail')}
                          className="hidden"
                          id="thumbnail-upload"
                        />
                        <label htmlFor="thumbnail-upload" className="cursor-pointer block">
                          <div className="space-y-3">
                            <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                            <p className="text-gray-500">Click to upload thumbnail image</p>
                            <p className="text-xs text-gray-400">Supported: JPG, PNG, WebP</p>
                          </div>
                        </label>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Main Image *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    {uploading ? (
                      <div className="py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="text-sm text-gray-600 mt-3">Uploading...</p>
                      </div>
                    ) : mainImagePreview || formData.mainImageUrl?.url ? (
                      <div className="relative">
                        <img
                          src={mainImagePreview || formData.mainImageUrl?.url}
                          alt="Main Image"
                          className="max-h-48 mx-auto rounded-lg"
                        />
                        <div className="mt-3 flex gap-2 justify-center">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange('mainImageUrl', e, 'main')}
                            className="hidden"
                            id="main-upload"
                          />
                          <label htmlFor="main-upload" className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer">
                            Change
                          </label>
                          <button
                            type="button"
                            onClick={() => removeImage('main')}
                            className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange('mainImageUrl', e, 'main')}
                          className="hidden"
                          id="main-upload"
                        />
                        <label htmlFor="main-upload" className="cursor-pointer block">
                          <div className="space-y-3">
                            <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                            <p className="text-gray-500">Click to upload main image</p>
                            <p className="text-xs text-gray-400">Supported: JPG, PNG, WebP</p>
                          </div>
                        </label>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={uploading || !formData.title || !formData.shortDescription || !formData.description || formData.language.length === 0 || formData.category.length === 0 || !formData.thumbnailImage || !formData.mainImageUrl}
            >
              {uploading ? 'Uploading...' : blog ? 'Update Blog' : 'Add Blog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Blogs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    title: '',
    status: ''
  });
  const [languages, setLanguages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const blogsListData = useSelector(state => state.website?.websiteBlogsListData);
  const languagesData = useSelector(state => state.website?.websiteLanguagesAllDocumentsData);
  const categoriesData = useSelector(state => state.website?.websiteCategoryAllDocumentsData);
  const enableDisableData = useSelector(state => state.website?.enableDisableWebsiteBlogsData);
  const deleteData = useSelector(state => state.website?.deleteWebsiteBlogsData);
  const createData = useSelector(state => state.website?.createWebsiteBlogsData);
  const updateData = useSelector(state => state.website?.updateWebsiteBlogsData);

  useEffect(() => {
    fetchBlogs();
    fetchLanguages();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!showModal) {
      fetchBlogs();
    }
  }, [currentPage, enableDisableData, deleteData, createData, updateData]);

  const fetchBlogs = () => {
    const params = {
      page: currentPage,
      size: itemsPerPage,
      ...(filters.title && { title: filters.title })
    };
    dispatch(websiteBlogsList(params));
  };

  const fetchLanguages = () => {
    dispatch(websiteLanguagesAllDocuments());
  };

  const fetchCategories = () => {
    dispatch(websiteCategoryAllDocuments());
  };

  useEffect(() => {
    if (languagesData?.data?.data?.list) {
      setLanguages(languagesData.data.data?.list);
    }
  }, [languagesData]);

  useEffect(() => {
    if (categoriesData?.data?.data?.list) {
      setCategories(categoriesData.data.data?.list);
    }
  }, [categoriesData]);

  const handleAddBlog = () => {
    setEditingBlog(null);
    setShowModal(true);
  };

  const handleEditBlog = (blog) => {
    setEditingBlog(blog);
    setShowModal(true);
  };

  const handleDeleteBlog = (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      setLoading(true);
      dispatch(deleteWebsiteBlogs({ id })).then((action) => {
        if (!action.error) {
          toast.success('Blog deleted successfully');
          fetchBlogs();
        } else {
          toast.error(action.payload || 'Failed to delete blog');
        }
        setLoading(false);
      });
    }
  };

  const handleStatusToggle = (blog) => {
    const newStatus = blog.status ? 'inactive' : 'active';
    if (window.confirm(`Are you sure you want to ${newStatus ? 'activate' : 'deactivate'} this blog?`)) {
      setLoading(true);
      const payload = {
        _id: blog._id,
        status: blog.status ? false : true
      };
      dispatch(enableDisableWebsiteBlogs(payload)).then((action) => {
        if (!action.error) {
          toast.success(`Blog ${newStatus ? 'activated' : 'deactivated'} successfully`);
          fetchBlogs();
        } else {
          toast.error(action.payload || 'Failed to update status');
        }
        setLoading(false);
      });
    }
  };

  const handleSaveBlog = (formData) => {
    setLoading(true);
    if (editingBlog) {
      dispatch(updateWebsiteBlogs(formData)).then((action) => {
        if (!action.error) {
          toast.success('Blog updated successfully');
          setShowModal(false);
          setEditingBlog(null);
          fetchBlogs();
        } else {
          toast.error(action.payload || 'Failed to update blog');
        }
        setLoading(false);
      });
    } else {
      dispatch(createWebsiteBlogs(formData)).then((action) => {
        if (!action.error) {
          toast.success('Blog created successfully');
          setShowModal(false);
          fetchBlogs();
        } else {
          toast.error(action.payload || 'Failed to create blog');
        }
        setLoading(false);
      });
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleFilter = () => {
    setCurrentPage(1);
    fetchBlogs();
  };

  const resetFilters = () => {
    setFilters({
      title: '',
      status: ''
    });
    setCurrentPage(1);
    fetchBlogs();
  };

  const navigateToCategories = () => {
    navigate('/blogs-categrory');
  };

  const blogs = blogsListData?.data?.data?.list || [];
  const totalBlogs = blogsListData?.data?.total || 0;
  const totalPages = Math.ceil(totalBlogs / itemsPerPage);

  const tableHeadings = ['Title', 'Short Description', 'Status', 'Created At', 'Actions'];
  
  const tableData = blogs.map(blog => [
    <div className="font-medium text-gray-800">{blog.title}</div>,
    <div className="max-w-xs truncate text-gray-600">{blog.shortDescription || 'No description'}</div>,
    <div className="flex items-center">
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
        blog.status
          ? 'bg-green-100 text-green-800'
          : 'bg-red-100 text-red-800'
      }`}>
        {blog.status? 'Active' : 'Inactive'}
      </span>
      <div className="ml-3 relative inline-block w-10 align-middle select-none">
        <input
          type="checkbox"
          checked={blog.status === 'active'}
          onChange={() => handleStatusToggle(blog)}
          className="sr-only"
          id={`toggle-${blog._id}`}
        />
        <label
          htmlFor={`toggle-${blog._id}`}
          className={`block overflow-hidden h-6 rounded-full cursor-pointer ${blog.status ? 'bg-green-500' : 'bg-gray-300'}`}
        >
          <span className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${blog.status ? 'translate-x-4' : 'translate-x-0'}`} />
        </label>
      </div>
    </div>,
    new Date(blog.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }),
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleEditBlog(blog)}
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
        title="Edit"
        disabled={loading}
      >
        <Edit2 className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleDeleteBlog(blog._id)}
        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
        title="Delete"
        disabled={loading}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Blogs</h1>
          <p className="text-gray-600">Manage your blog posts here</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <Filter className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
            </div>
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              disabled={loading}
            >
              Reset Filters
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search by Title
              </label>
              <input
                type="text"
                value={filters.title}
                onChange={(e) => handleFilterChange('title', e.target.value)}
                placeholder="Search by title..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleFilter}
                className="w-full px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Apply Filter'}
              </button>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 flex flex-wrap gap-4">
            <button
              onClick={handleAddBlog}
              className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              disabled={loading}
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Add Blog</span>
            </button>
            <button
              onClick={navigateToCategories}
              className="flex items-center gap-2 px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition disabled:opacity-50"
              disabled={loading}
            >
              <Tag className="w-5 h-5" />
              <span className="font-medium">Manage Categories</span>
            </button>
          </div>
        </div>

        {loading && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading blogs...</span>
            </div>
          </div>
        )}

        {!loading && (
          <TableData
            tableHeadings={tableHeadings}
            data={tableData}
            currentPage={currentPage}
            size={itemsPerPage}
            handlePageChange={setCurrentPage}
            total={totalBlogs}
            totalPages={totalPages}
          />
        )}
      </div>

      {showModal && (
        <AddEditBlogModal
          blog={editingBlog}
          onSave={handleSaveBlog}
          onClose={() => {
            setShowModal(false);
            setEditingBlog(null);
          }}
          languages={languages}
          categories={categories}
        />
      )}
    </div>
  );
};

export default Blogs;