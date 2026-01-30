import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, Edit2, Trash2, Eye, Image as ImageIcon, Upload, X } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios'; 
import Table from '../../components/Atoms/TableData/TableData';
import AlertModal from '../../components/Modal/AlertModal';
import { updateCourses, coursesList,
  enableDisableCourses,
  deleteCourses,
  createCourses, } from '../../redux/slices/course';
import { websiteCategoryAllDocuments, websiteLanguagesAllDocuments } from '../../redux/slices/website';
import { apiUrl } from '../../utils/axiosProvider';
const CourseModal = ({ course, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    courseName: '',
    description: '',
    template: '',
    actualPrice: '',
    sellingPrice: '',
    duration: '',
    totalLectures: '',
    language: [],
    category: []
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const languagesData = useSelector(state => state.website?.websiteLanguagesAllDocumentsData);
  const categoriesData = useSelector(state => state.website?.websiteCategoryAllDocumentsData);

  useEffect(() => {
    if (course) {
      setFormData({
        courseName: course.courseName || '',
        description: course.description || '',
        template: course.template || '',
        actualPrice: course.actualPrice || '',
        sellingPrice: course.sellingPrice || '',
        duration: course.duration || '',
        totalLectures: course.totalLectures || '',
        language: course.language || [],
        category: course.category || []
      });
      
      if (course.mainImageUrl?.url) {
        setImagePreview(course.mainImageUrl.url);
        setImageUrl(course.mainImageUrl);
      }
    }
  }, [course]);

  useEffect(() => {
    fetchLanguagesAndCategories();
  }, []);

  const fetchLanguagesAndCategories = () => {
    setLoading(true);
    Promise.all([
      dispatch(websiteLanguagesAllDocuments()),
      dispatch(websiteCategoryAllDocuments())
    ]).then(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    if (languagesData?.data?.data) {
      setLanguages(languagesData.data.data?.list);
    }
  }, [languagesData]);

  useEffect(() => {
    if (categoriesData?.data?.data) {
      setCategories(categoriesData.data.data?.list);
    }
  }, [categoriesData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMultiSelect = (field, value) => {
    setFormData(prev => {
      const currentValues = prev[field];
      const isSelected = currentValues.includes(value);
      
      if (isSelected) {
        return {
          ...prev,
          [field]: currentValues.filter(item => item !== value)
        };
      } else {
        return {
          ...prev,
          [field]: [...currentValues, value]
        };
      }
    });
  };

  const handleImageUpload = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('files', file);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${apiUrl}/files/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data && response.data.data) {
        setImageUrl(response.data.data[0]);
        setImagePreview(response.data.data[0].url);
        toast.success('Image uploaded successfully');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      handleImageUpload(file);
    }
  };

  const removeImage = () => {
    setImagePreview('');
    setImageFile(null);
    setImageUrl(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.courseName || !formData.description || !imageUrl) {
      toast.error('Please fill all required fields');
      return;
    }

    const payload = {
      courseName: formData.courseName,
      description: formData.description,
      template: formData.template,
      mainImageUrl: imageUrl,
      language: formData.language,
      category: formData.category,
      actualPrice: Number(formData.actualPrice),
      sellingPrice: Number(formData.sellingPrice),
      duration: Number(formData.duration),
      totalLectures: Number(formData.totalLectures)
    };

    if (course) {
      payload._id = course._id;
    }

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl max-h-[90vh] overflow-y-auto w-full">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {course ? 'Edit Course' : 'Add Course'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Name *
                </label>
                <input
                  type="text"
                  name="courseName"
                  value={formData.courseName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Enter course name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-h-[120px] resize-none"
                  placeholder="Enter course description"
                  rows="4"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Image *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                  {uploading ? (
                    <div className="py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="text-sm text-gray-600 mt-3">Uploading...</p>
                    </div>
                  ) : imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Course"
                        className="w-48 h-32 mx-auto object-cover rounded-lg border-4 border-white shadow-lg"
                      />
                      <div className="mt-4 flex gap-2 justify-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          id="image-upload"
                        />
                        <label htmlFor="image-upload" className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer">
                          Change
                        </label>
                        <button
                          type="button"
                          onClick={removeImage}
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
                        onChange={handleImageChange}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer block">
                        <div className="space-y-3">
                          <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                          <p className="text-gray-500">Click to upload course image</p>
                          <p className="text-xs text-gray-400">Supported: JPG, PNG, WebP</p>
                        </div>
                      </label>
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Languages
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto p-2 border border-gray-300 rounded-xl">
                    {loading ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mx-auto"></div>
                      </div>
                    ) : (
                      languages.map((lang) => (
                        <label key={lang._id} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.language.includes(lang._id)}
                            onChange={() => handleMultiSelect('language', lang._id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-gray-700">{lang.name}</span>
                        </label>
                      ))
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categories
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto p-2 border border-gray-300 rounded-xl">
                    {loading ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mx-auto"></div>
                      </div>
                    ) : (
                      categories.map((cat) => (
                        <label key={cat._id} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.category.includes(cat._id)}
                            onChange={() => handleMultiSelect('category', cat._id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-gray-700">{cat.name}</span>
                        </label>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Actual Price (₹) *
                  </label>
                  <input
                    type="number"
                    name="actualPrice"
                    value={formData.actualPrice}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter actual price"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    name="sellingPrice"
                    value={formData.sellingPrice}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter selling price"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (hours) *
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter course duration"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Lectures *
                  </label>
                  <input
                    type="number"
                    name="totalLectures"
                    value={formData.totalLectures}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter total lectures"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template
                </label>
                <input
                  type="text"
                  name="template"
                  value={formData.template}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Enter template identifier"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={uploading || loading || !formData.courseName || !formData.description || !imageUrl}
              >
                {uploading ? 'Uploading...' : course ? 'Update Course' : 'Create Course'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default function CourseManagement() {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [deletingCourse, setDeletingCourse] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: '',
    startDate: '',
    endDate: ''
  });
  const [loading, setLoading] = useState(false);

  const coursesListData = useSelector(state => state.course?.coursesListData);
  const enableDisableData = useSelector(state => state.course?.enableDisableCoursesData);
  const deleteData = useSelector(state => state.course?.deleteCoursesData);
  const createData = useSelector(state => state.course?.createCoursesData);
  const updateData = useSelector(state => state.course?.updateCoursesData);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (!showModal) {
      fetchCourses();
    }
  }, [currentPage, enableDisableData, deleteData, createData, updateData]);

  const fetchCourses = () => {
    setLoading(true);
    const params = {
      page: currentPage,
      size: itemsPerPage,
      ...(filters.search && { search: filters.search }),
      ...(filters.category && { category: filters.category }),
      ...(filters.status && { status: filters.status }),
      ...(filters.startDate && { startDate: filters.startDate }),
      ...(filters.endDate && { endDate: filters.endDate })
    };
    
    dispatch(coursesList(params)).then((action) => {
      if (action.error) {
        toast.error(action.payload || 'Failed to fetch courses');
      }
      setLoading(false);
    });
  };

  const handleAddCourseClick = () => {
    setEditingCourse(null);
    setShowModal(true);
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setShowModal(true);
  };

  const handleDeleteClick = (course) => {
    setDeletingCourse(course);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingCourse) {
      setLoading(true);
      dispatch(deleteCourses({ _id: deletingCourse._id })).then((action) => {
        if (!action.error) {
          toast.success('Course deleted successfully');
          fetchCourses();
        } else {
          toast.error(action.payload || 'Failed to delete course');
        }
        setLoading(false);
        setShowDeleteModal(false);
        setDeletingCourse(null);
      });
    }
  };

  const handleStatusToggle = (course) => {
    const newStatus = !course.status;
    if (window.confirm(`Are you sure you want to ${newStatus ? 'activate' : 'deactivate'} this course?`)) {
      setLoading(true);
      const payload = {
        _id: course._id,
        status: newStatus
      };
      dispatch(enableDisableCourses(payload)).then((action) => {
        if (!action.error) {
          toast.success(`Course ${newStatus ? 'activated' : 'deactivated'} successfully`);
          fetchCourses();
        } else {
          toast.error(action.payload || 'Failed to update status');
        }
        setLoading(false);
      });
    }
  };

  const handleSaveCourse = (formData) => {
    setLoading(true);
    if (editingCourse) {
      const payload = {
        ...formData,
        _id: editingCourse._id
      };
      dispatch(updateCourses(payload)).then((action) => {
        if (!action.error) {
          toast.success('Course updated successfully');
          setShowModal(false);
          setEditingCourse(null);
          fetchCourses();
        } else {
          toast.error(action.payload || 'Failed to update course');
        }
        setLoading(false);
      });
    } else {
      dispatch(createCourses(formData)).then((action) => {
        if (!action.error) {
          toast.success('Course created successfully');
          setShowModal(false);
          fetchCourses();
        } else {
          toast.error(action.payload || 'Failed to create course');
        }
        setLoading(false);
      });
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleFilter = () => {
    setCurrentPage(1);
    fetchCourses();
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      category: '',
      status: '',
      startDate: '',
      endDate: ''
    });
    setCurrentPage(1);
    fetchCourses();
  };

  const getStatusColor = (status) => {
    return status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const courses = coursesListData?.data?.data?.list || [];
  const totalCourses = coursesListData?.data?.total || 0;
  const totalPages = Math.ceil(totalCourses / itemsPerPage);

  const tableHeaders = ['Course Name', 'Categories', 'Status', 'Created At', 'Actions'];
  
  const tableData = courses.map(course => [
    <div className="flex items-center">
      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold mr-3 overflow-hidden">
        {course.mainImageUrl?.url ? (
          <img src={course.mainImageUrl.url} alt={course.courseName} className="w-full h-full object-cover" />
        ) : (
          course.courseName?.charAt(0)
        )}
      </div>
      <div>
        <div className="font-medium text-gray-900">{course.courseName}</div>
        <div className="text-sm text-gray-500 mt-1 truncate max-w-xs">
          {course.description}
        </div>
      </div>
    </div>,
    <div className="flex flex-wrap gap-1">
      {course.category?.map((catId, index) => (
        <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
          Category {index + 1}
        </span>
      ))}
    </div>,
    <div className="flex items-center">
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
        {course.status ? 'Active' : 'Inactive'}
      </span>
      <div className="ml-3 relative inline-block w-10 align-middle select-none">
        <input
          type="checkbox"
          checked={course.status}
          onChange={() => handleStatusToggle(course)}
          className="sr-only"
          id={`toggle-${course._id}`}
          disabled={loading}
        />
        <label
          htmlFor={`toggle-${course._id}`}
          className={`block overflow-hidden h-6 rounded-full cursor-pointer ${course.status ? 'bg-green-500' : 'bg-gray-300'}`}
        >
          <span className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${course.status ? 'translate-x-4' : 'translate-x-0'}`} />
        </label>
      </div>
    </div>,
    new Date(course.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }),
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleEditCourse(course)}
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
        title="Edit"
        disabled={loading}
      >
        <Edit2 className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleDeleteClick(course)}
        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
        title="Delete"
        disabled={loading}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  ]);

  return (
    <div className="">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
        <p className="text-gray-600 mt-2">Manage all courses and their details</p>
      </div>

      {/* <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Filter Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Search courses..."
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <input
              type="text"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Category ID"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
              disabled={loading}
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              disabled={loading}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleFilter}
            className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Filter'}
          </button>
          <button
            onClick={resetFilters}
            className="px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50"
            disabled={loading}
          >
            Reset
          </button>
        </div>
      </div> */}

      <div className="flex justify-end items-center mb-6">
        <button
          onClick={handleAddCourseClick}
          className="px-6 py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-all shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-50"
          disabled={loading}
        >
          <span>Add Course</span>
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {loading && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading courses...</span>
          </div>
        </div>
      )}

      {!loading && (
        <Table
          headers={tableHeaders}
          data={tableData}
          currentPage={currentPage}
          size={itemsPerPage}
          handlePageChange={setCurrentPage}
          total={totalCourses}
          totalPages={totalPages}
          renderRow={(row, index) => (
            <tr 
              key={index} 
              className={`hover:bg-blue-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
            >
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="py-4 px-4">
                  {cell}
                </td>
              ))}
            </tr>
          )}
        />
      )}

      {showModal && (
        <CourseModal
          course={editingCourse}
          onSave={handleSaveCourse}
          onClose={() => {
            setShowModal(false);
            setEditingCourse(null);
          }}
        />
      )}

      {showDeleteModal && (
        <AlertModal
          isOpen={showDeleteModal}
          onCancel={() => {
            setShowDeleteModal(false);
            setDeletingCourse(null);
          }}
          onConfirm={handleDeleteConfirm}
          title="Delete Course"
          description="Are you sure you want to delete this course? This action cannot be undone."
          cancelLabel="Cancel"
          confirmLabel="Yes, Delete"
          confirmClassNameButton="!bg-red-600 hover:!bg-red-700"
          isVisibleCancelButton={true}
          isVisibleConfirmButton={true}
        />
      )}
    </div>
  );
}