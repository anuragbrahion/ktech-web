import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, Edit2, Trash2, Search, Filter, Tag } from 'lucide-react';
import { toast } from 'react-toastify';
import {
  inquiryStatusList,
  enableDisableInquiryStatus,
  deleteInquiryStatus,
  createInquiryStatus,
  updateInquiryStatus
} from '../../redux/slices/branch';
import Table from '../../components/Atoms/TableData/TableData';
import AlertModal from '../../components/Modal/AlertModal';

const StatusModal = ({ status, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: ''
  });

  useEffect(() => {
    if (status) {
      setFormData({
        name: status.name || ''
      });
    }
  }, [status]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast.error('Please enter status name');
      return;
    }

    const payload = {
      name: formData.name
    };

    if (status) {
      payload._id = status._id;
    }

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {status ? 'Edit Status' : 'Add Status'}
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
                  Status Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Enter status name"
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
                disabled={!formData.name}
              >
                {status ? 'Update Status' : 'Create Status'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default function InquiryStatusManagement() {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingStatus, setEditingStatus] = useState(null);
  const [deletingStatus, setDeletingStatus] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    search: '',
    status: ''
  });
  const [loading, setLoading] = useState(false);

  const statusListData = useSelector(state => state.branch?.inquiryStatusListData);
  const enableDisableData = useSelector(state => state.branch?.enableDisableInquiryStatusData);
  const deleteData = useSelector(state => state.branch?.deleteInquiryStatusData);
  const createData = useSelector(state => state.branch?.createInquiryStatusData);
  const updateData = useSelector(state => state.branch?.updateInquiryStatusData);

  useEffect(() => {
    fetchStatuses();
  }, []);

  useEffect(() => {
    if (!showModal) {
      fetchStatuses();
    }
  }, [currentPage, enableDisableData, deleteData, createData, updateData]);

  const fetchStatuses = () => {
    setLoading(true);
    const params = {
      page: currentPage,
      size: itemsPerPage,
      ...(filters.search && { search: filters.search }),
      ...(filters.status && { status: filters.status })
    };
    
    dispatch(inquiryStatusList(params)).then((action) => {
      if (action.error) {
        toast.error(action.payload || 'Failed to fetch statuses');
      }
      setLoading(false);
    });
  };

  const handleAddStatusClick = () => {
    setEditingStatus(null);
    setShowModal(true);
  };

  const handleEditStatus = (status) => {
    setEditingStatus(status);
    setShowModal(true);
  };

  const handleDeleteClick = (status) => {
    setDeletingStatus(status);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingStatus) {
      setLoading(true);
      dispatch(deleteInquiryStatus({ _id: deletingStatus._id })).then((action) => {
        if (!action.error) {
          toast.success('Status deleted successfully');
          fetchStatuses();
        } else {
          toast.error(action.payload || 'Failed to delete status');
        }
        setLoading(false);
        setShowDeleteModal(false);
        setDeletingStatus(null);
      });
    }
  };

  const handleStatusToggle = (status) => {
    const newStatus = !status.status;
    if (window.confirm(`Are you sure you want to ${newStatus ? 'activate' : 'deactivate'} this status?`)) {
      setLoading(true);
      const payload = {
        _id: status._id,
        status: newStatus
      };
      dispatch(enableDisableInquiryStatus(payload)).then((action) => {
        if (!action.error) {
          toast.success(`Status ${newStatus ? 'activated' : 'deactivated'} successfully`);
          fetchStatuses();
        } else {
          toast.error(action.payload || 'Failed to update status');
        }
        setLoading(false);
      });
    }
  };

  const handleSaveStatus = (formData) => {
    setLoading(true);
    if (editingStatus) {
      const payload = {
        ...formData,
        _id: editingStatus._id
      };
      dispatch(updateInquiryStatus(payload)).then((action) => {
        if (!action.error) {
          toast.success('Status updated successfully');
          setShowModal(false);
          setEditingStatus(null);
          fetchStatuses();
        } else {
          toast.error(action.payload || 'Failed to update status');
        }
        setLoading(false);
      });
    } else {
      dispatch(createInquiryStatus(formData)).then((action) => {
        if (!action.error) {
          toast.success('Status created successfully');
          setShowModal(false);
          fetchStatuses();
        } else {
          toast.error(action.payload || 'Failed to create status');
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
    fetchStatuses();
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      status: ''
    });
    setCurrentPage(1);
    fetchStatuses();
  };

  const getStatusColor = (status) => {
    const statusLower = status.name.toLowerCase();
    
    if (statusLower.includes('active') || statusLower.includes('active')) return 'bg-green-100 text-green-800 border-green-200';
    if (statusLower.includes('inactive') || statusLower.includes('deative')) return 'bg-gray-100 text-gray-800 border-gray-200';
    if (statusLower.includes('pending')) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (statusLower.includes('cancel')) return 'bg-red-100 text-red-800 border-red-200';
    if (statusLower.includes('convert')) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (statusLower.includes('follow')) return 'bg-purple-100 text-purple-800 border-purple-200';
    if (statusLower.includes('enroll')) return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    if (statusLower.includes('not') || statusLower.includes('interested')) return 'bg-pink-100 text-pink-800 border-pink-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusText = (status) => {
    return status.status ? 'Active' : 'Inactive';
  };

  const statuses = statusListData?.data?.data?.list || [];
  const totalStatuses = statusListData?.data?.total || 0;
  const totalPages = Math.ceil(totalStatuses / itemsPerPage);

  const tableHeaders = ['Status Name', 'System Status', 'Created At', 'Actions'];
  
  const tableData = statuses.map(status => [
    <div className="font-medium text-gray-900 text-lg">{status.name}</div>,
    <div className="flex items-center">
      <span className={`px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(status)}`}>
        {getStatusText(status)}
      </span>
      <div className="ml-3 relative inline-block w-10 align-middle select-none">
        <input
          type="checkbox"
          checked={status.status}
          onChange={() => handleStatusToggle(status)}
          className="sr-only"
          id={`toggle-status-${status._id}`}
          disabled={loading}
        />
        <label
          htmlFor={`toggle-status-${status._id}`}
          className={`block overflow-hidden h-6 rounded-full cursor-pointer ${status.status ? 'bg-green-500' : 'bg-gray-300'}`}
        >
          <span className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${status.status ? 'translate-x-4' : 'translate-x-0'}`} />
        </label>
      </div>
    </div>,
    new Date(status.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }),
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleEditStatus(status)}
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
        title="Edit"
        disabled={loading}
      >
        <Edit2 className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleDeleteClick(status)}
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
        <h1 className="text-3xl font-bold text-gray-900">Status Management</h1>
        <p className="text-gray-600 mt-2">Manage inquiry statuses and their configurations</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Filter Statuses</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Search statuses..."
                disabled={loading}
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              System Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
              disabled={loading}
            >
              <option value="">--- no select ---</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          <div className="flex items-end gap-2">
            <button
              onClick={handleFilter}
              className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
              disabled={loading}
            >
              <div className="flex items-center justify-center gap-2">
                <Filter className="w-4 h-4" />
                {loading ? 'Loading...' : 'Filter'}
              </div>
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
      </div>

      <div className="flex justify-end items-center mb-6">
        <button
          onClick={handleAddStatusClick}
          className="px-6 py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-all shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-50"
          disabled={loading}
        >
          <span>Add Status</span>
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {loading && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading statuses...</span>
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
          total={totalStatuses}
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

      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mt-8">
        <h3 className="text-lg font-semibold text-blue-700 mb-4 flex items-center gap-2">
          <Tag className="w-5 h-5" />
          Status Color Guide
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
            <span className="text-black text-sm">Active</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
            <span className="text-black text-sm">Pending</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
            <span className="text-black text-sm">Cancelled</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-gray-500 mr-2"></span>
            <span className="text-black text-sm">Inactive</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
            <span className="text-black text-sm">Converted</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-purple-500 mr-2"></span>
            <span className="text-black text-sm">Follow-up</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></span>
            <span className="text-black text-sm">Enrolled</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-pink-500 mr-2"></span>
            <span className="text-black text-sm">Not Interested</span>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          Status colors are determined automatically based on status name keywords.
        </p>
      </div>

      {showModal && (
        <StatusModal
          status={editingStatus}
          onSave={handleSaveStatus}
          onClose={() => {
            setShowModal(false);
            setEditingStatus(null);
          }}
        />
      )}

      {showDeleteModal && (
        <AlertModal
          isOpen={showDeleteModal}
          onCancel={() => {
            setShowDeleteModal(false);
            setDeletingStatus(null);
          }}
          onConfirm={handleDeleteConfirm}
          title="Delete Status"
          description="Are you sure you want to delete this status? This action cannot be undone."
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