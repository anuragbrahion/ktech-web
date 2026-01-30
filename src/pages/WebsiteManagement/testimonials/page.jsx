import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, X, Edit2, Trash2, Eye, Star, Image as ImageIcon, Upload } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import {
  websiteTestimonialsList,
  enableDisableWebsiteTestimonials,
  deleteWebsiteTestimonials,
  createWebsiteTestimonials,
  updateWebsiteTestimonials
} from '../../../redux/slices/website';
import TableData from '../../../components/Atoms/Table';
import AlertModal from '../../../components/Modal/AlertModal';
import { apiUrl } from '../../../utils/axiosProvider';

const AddEditTestimonialModal = ({ testimonial, onSave, onClose }) => {
   const [formData, setFormData] = useState({
    name: '',
    rating: 5,
    text: '',
    imageUrl: null
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (testimonial) {
      setFormData({
        name: testimonial.name || '',
        rating: testimonial.rating || 5,
        text: testimonial.text || ''
      });
      
      if (testimonial.imageUrl?.url) {
        setImagePreview(testimonial.imageUrl.url);
        setImageUrl(testimonial.imageUrl[0]);
      }
    }
  }, [testimonial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
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
        setImageUrl(response.data.data);
        setImagePreview(response.data.data);
        toast.success('Image uploaded successfully');
      }
    } catch (error) {
      toast.error(error||'Failed to upload image');
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
    
    if (!formData.name || !formData.text || !imageUrl) {
      toast.error('Please fill all required fields');
      return;
    }

    const payload = {
      name: formData.name,
      rating: formData.rating,
      text: formData.text,
      imageUrl: imageUrl[0]
    };

    if (testimonial) {
      payload._id = testimonial._id;
    }

    onSave(payload);
  };

 
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl max-h-[90vh] overflow-hidden overflow-y-auto w-full">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {testimonial ? 'Edit Testimonial' : 'Add Testimonial'}
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
                  Customer Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Enter customer name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating *
                </label>
                <div className="flex items-center space-x-4">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => handleRatingChange(rating)}
                      className={`p-2 rounded-lg transition-all ${formData.rating >= rating ? 'bg-yellow-100 scale-110' : 'bg-gray-100 hover:bg-gray-200'}`}
                    >
                      <Star className={`w-8 h-8 ${formData.rating >= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                    </button>
                  ))}
                  <span className="ml-4 text-lg font-semibold text-gray-700">
                    {formData.rating}.0
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Image *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                  {uploading ? (
                    <div className="py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="text-sm text-gray-600 mt-3">Uploading...</p>
                    </div>
                  ) : imagePreview || imageUrl?.url ? (
                    <div className="relative">
                      <img
                        src={imagePreview || imageUrl[0]?.url}
                        alt="Customer"
                        className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-white shadow-lg"
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
                          <p className="text-gray-500">Click to upload customer image</p>
                          <p className="text-xs text-gray-400">Supported: JPG, PNG, WebP</p>
                        </div>
                      </label>
                    </>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Feedback *
                </label>
                <textarea
                  name="text"
                  value={formData.text}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-h-[120px] resize-none"
                  placeholder="Enter customer feedback"
                  rows="4"
                  required
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
                disabled={uploading || !formData.name || !formData.text || !imageUrl}
              >
                {uploading ? 'Uploading...' : testimonial ? 'Update Testimonial' : 'Create Testimonial'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default function TestimonialManagement() {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [deletingTestimonial, setDeletingTestimonial] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    rating: '',
    status: '',
    startDate: '',
    endDate: ''
  });
  const [loading, setLoading] = useState(false);

  const testimonialsListData = useSelector(state => state.website?.websiteTestimonialsListData);
  const enableDisableData = useSelector(state => state.website?.enableDisableWebsiteTestimonialsData);
  const deleteData = useSelector(state => state.website?.deleteWebsiteTestimonialsData);
  const createData = useSelector(state => state.website?.createWebsiteTestimonialsData);
  const updateData = useSelector(state => state.website?.updateWebsiteTestimonialsData);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (!showModal) {
      fetchTestimonials();
    }
  }, [currentPage, enableDisableData, deleteData, createData, updateData]);

  const fetchTestimonials = () => {
    setLoading(true);
    const params = {
      page: currentPage,
      size: itemsPerPage,
      ...(filters.rating && { rating: filters.rating }),
      ...(filters.status && { status: filters.status }),
      ...(filters.startDate && { startDate: filters.startDate }),
      ...(filters.endDate && { endDate: filters.endDate })
    };
    
    dispatch(websiteTestimonialsList(params)).then((action) => {
      if (action.error) {
        toast.error('Failed to fetch testimonials');
      }
      setLoading(false);
    });
  };

  const handleAddTestimonialClick = () => {
    setEditingTestimonial(null);
    setShowModal(true);
  };

  const handleEditTestimonial = (testimonial) => {
    setEditingTestimonial(testimonial);
    setShowModal(true);
  };

  const handleDeleteClick = (testimonial) => {
    setDeletingTestimonial(testimonial);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingTestimonial) {
      setLoading(true);
      dispatch(deleteWebsiteTestimonials({ _id: deletingTestimonial._id })).then((action) => {
        if (!action.error) {
          toast.success('Testimonial deleted successfully');
          fetchTestimonials();
        } else {
          toast.error(action.payload || 'Failed to delete testimonial');
        }
        setLoading(false);
        setShowDeleteModal(false);
        setDeletingTestimonial(null);
      });
    }
  };

  const handleStatusToggle = (testimonial) => {
    const newStatus = testimonial.status ? false : true;
    if (window.confirm(`Are you sure you want to ${newStatus ? 'activate' : 'deactivate'} this testimonial?`)) {
      setLoading(true);
      const payload = {
        _id: testimonial._id,
        status: testimonial.status ? false : true
      };
      dispatch(enableDisableWebsiteTestimonials(payload)).then((action) => {
        if (!action.error) {
          toast.success(`Testimonial ${newStatus ? 'activated' : 'deactivated'} successfully`);
          fetchTestimonials();
        } else {
          toast.error(action.payload || 'Failed to update status');
        }
        setLoading(false);
      });
    }
  };

  const handleSaveTestimonial = (formData) => {
    setLoading(true);
    if (editingTestimonial) {
      const payload = {
        ...formData,
        _id: editingTestimonial._id
      };
      dispatch(updateWebsiteTestimonials(payload)).then((action) => {
        if (!action.error) {
          toast.success('Testimonial updated successfully');
          setShowModal(false);
          setEditingTestimonial(null);
          fetchTestimonials();
        } else {
          toast.error(action.payload || 'Failed to update testimonial');
        }
        setLoading(false);
      });
    } else {
      dispatch(createWebsiteTestimonials(formData)).then((action) => {
        if (!action.error) {
          toast.success('Testimonial created successfully');
          setShowModal(false);
          fetchTestimonials();
        } else {
          toast.error(action.payload || 'Failed to create testimonial');
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
    fetchTestimonials();
  };

  const resetFilters = () => {
    setFilters({
      rating: '',
      status: '',
      startDate: '',
      endDate: ''
    });
    setCurrentPage(1);
    fetchTestimonials();
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">{rating}.0</span>
      </div>
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case true: return 'bg-green-100 text-green-800';
      case false: return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const testimonials = testimonialsListData?.data?.data?.list || [];
  const totalTestimonials = testimonialsListData?.data?.total || 0;
  const totalPages = Math.ceil(totalTestimonials / itemsPerPage);

  const tableHeadings = ['Name', 'Rating', 'Feedback', 'Status', 'Created At', 'Actions'];
  
  const tableData = testimonials.map(testimonial => [
    <div className="flex items-center">
      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-3 overflow-hidden">
        {testimonial.imageUrl?.url ? (
          <img src={testimonial.imageUrl.url} alt={testimonial.name} className="w-full h-full object-cover" />
        ) : (
          testimonial.name.charAt(0)
        )}
      </div>
      <div className="font-medium text-gray-900">{testimonial.name}</div>
    </div>,
    renderStars(testimonial.rating),
    <div className="max-w-md truncate text-gray-700">
      {testimonial.text}
    </div>,
    <div className="flex items-center">
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(testimonial.status)}`}>
        {testimonial.status ? 'Active' : 'Inactive'}
      </span>
      <div className="ml-3 relative inline-block w-10 align-middle select-none">
        <input
          type="checkbox"
          checked={testimonial.status}
          onChange={() => handleStatusToggle(testimonial)}
          className="sr-only"
          id={`toggle-${testimonial._id}`}
          disabled={loading}
        />
        <label
          htmlFor={`toggle-${testimonial._id}`}
          className={`block overflow-hidden h-6 rounded-full cursor-pointer ${testimonial.status ? 'bg-green-500' : 'bg-gray-300'}`}
        >
          <span className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${testimonial.status ? 'translate-x-4' : 'translate-x-0'}`} />
        </label>
      </div>
    </div>,
    new Date(testimonial.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }),
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleEditTestimonial(testimonial)}
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
        title="Edit"
        disabled={loading}
      >
        <Edit2 className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleDeleteClick(testimonial)}
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
          <h1 className="text-3xl font-bold text-gray-900">Testimonials</h1>
          <p className="text-gray-600 mt-2">Manage customer testimonials and feedback</p>
        </div>

        {/* <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Filter Testimonials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <select
                value={filters.rating}
                onChange={(e) => handleFilterChange('rating', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
                disabled={loading}
              >
                <option value="">No Selected</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
                disabled={loading}
              >
                <option value="">No Selected</option>
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
                placeholder="mm/dd/yyyy"
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
                placeholder="mm/dd/yyyy"
                disabled={loading}
              />
            </div>

            <div className="flex items-end gap-2">
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
          </div>
        </div> */}

        <div className="flex justify-end items-center mb-6">
        
          <button
            onClick={handleAddTestimonialClick}
            className="px-6 py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-all shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-50"
            disabled={loading}
          >
            <span>Add Testimonial</span>
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {loading && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading testimonials...</span>
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
            total={totalTestimonials}
            totalPages={totalPages}
          />
        )}

      {showModal && (
        <AddEditTestimonialModal
          testimonial={editingTestimonial}
          onSave={handleSaveTestimonial}
          onClose={() => {
            setShowModal(false);
            setEditingTestimonial(null);
          }}
        />
      )}

      {showDeleteModal && (
        <AlertModal
          isOpen={showDeleteModal}
          onCancel={() => {
            setShowDeleteModal(false);
            setDeletingTestimonial(null);
          }}
          onConfirm={handleDeleteConfirm}
          title="Delete Testimonial"
          description="Are you sure you want to delete this testimonial? This action cannot be undone."
          cancelLabel="Cancel"
          confirmLabel="Yes, Delete"
          confirmClassNameButton="!bg-red-600 hover:!bg-red-700"
            isVisibleCancelButton ={true}
  isVisibleConfirmButton={true}
        />
      )}
    </div>
  );
}