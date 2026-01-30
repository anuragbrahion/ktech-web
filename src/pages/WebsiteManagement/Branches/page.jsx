import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, X, Edit2, Trash2, Eye } from 'lucide-react';
import { toast } from 'react-toastify';
import {
  websiteBranchesList,
  enableDisableWebsiteBranches,
  deleteWebsiteBranches,
  createWebsiteBranches,
  updateWebsiteBranches
} from '../../../redux/slices/website';
import TableData from '../../../components/Atoms/Table';

const AddEditBranchModal = ({ branch, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    state: '',
    city: '',
    country: 'India',
    address: '',
    pincode: ''
  });

  useEffect(() => {
    if (branch) {
      setFormData({
        name: branch.name || '',
        state: branch.state || '',
        city: branch.city || '',
        country: branch.country || 'India',
        address: branch.address || '',
        pincode: branch.pincode || ''
      });
    }
  }, [branch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {branch ? 'Edit Branch' : 'Add New Branch'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Branch Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                  placeholder="Enter branch name"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                    placeholder="Enter city"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                    placeholder="Enter state"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                  placeholder="Enter country"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                  placeholder="Enter address"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pincode *
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                  placeholder="Enter pincode"
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
                className="flex-1 px-6 py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-all"
              >
                {branch ? 'Update Branch' : 'Add Branch'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default function BranchManagement() {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    name: '',
    status: '',
    startDate: '',
    endDate: ''
  });
  const [loading, setLoading] = useState(false);

  const branchesListData = useSelector(state => state.website?.websiteBranchesListData);
  const enableDisableData = useSelector(state => state.website?.enableDisableWebsiteBranchesData);
  const deleteData = useSelector(state => state.website?.deleteWebsiteBranchesData);
  const createData = useSelector(state => state.website?.createWebsiteBranchesData);
  const updateData = useSelector(state => state.website?.updateWebsiteBranchesData);

  useEffect(() => {
    fetchBranches();
  }, []);

  useEffect(() => {
    if (!showModal) {
      fetchBranches();
    }
  }, [currentPage, enableDisableData, deleteData, createData, updateData]);

  const fetchBranches = () => {
    setLoading(true);
    const params = {
      page: currentPage,
      size: itemsPerPage,
      ...(filters.name && { name: filters.name }),
      ...(filters.status && { status: filters.status }),
      ...(filters.startDate && { startDate: filters.startDate }),
      ...(filters.endDate && { endDate: filters.endDate })
    };
    
    dispatch(websiteBranchesList(params)).then((action) => {
      if (action.error) {
        toast.error('Failed to fetch branches');
      }
      setLoading(false);
    });
  };

  const handleAddBranchClick = () => {
    setEditingBranch(null);
    setShowModal(true);
  };

  const handleEditBranch = (branch) => {
    setEditingBranch(branch);
    setShowModal(true);
  };

  const handleDeleteBranch = (id) => {
    if (window.confirm('Are you sure you want to delete this branch?')) {
      setLoading(true);
      dispatch(deleteWebsiteBranches({ id })).then((action) => {
        if (!action.error) {
          toast.success('Branch deleted successfully');
          fetchBranches();
        } else {
          toast.error(action.payload || 'Failed to delete branch');
        }
        setLoading(false);
      });
    }
  };

  const handleStatusToggle = (branch) => {
    const newStatus = branch.status === 'active' ? 'inactive' : 'active';
    if (window.confirm(`Are you sure you want to ${newStatus === 'active' ? 'activate' : 'deactivate'} this branch?`)) {
      setLoading(true);
      const payload = {
        _id: branch._id,
        status: branch.status === 'active' ? false : true
      };
      dispatch(enableDisableWebsiteBranches(payload)).then((action) => {
        if (!action.error) {
          toast.success(`Branch ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
          fetchBranches();
        } else {
          toast.error(action.payload || 'Failed to update status');
        }
        setLoading(false);
      });
    }
  };

  const handleSaveBranch = (formData) => {
    setLoading(true);
    if (editingBranch) {
      const payload = {
        ...formData,
        _id: editingBranch._id
      };
      dispatch(updateWebsiteBranches(payload)).then((action) => {
        if (!action.error) {
          toast.success('Branch updated successfully');
          setShowModal(false);
          setEditingBranch(null);
          fetchBranches();
        } else {
          toast.error(action.payload || 'Failed to update branch');
        }
        setLoading(false);
      });
    } else {
      dispatch(createWebsiteBranches(formData)).then((action) => {
        if (!action.error) {
          toast.success('Branch created successfully');
          setShowModal(false);
          fetchBranches();
        } else {
          toast.error(action.payload || 'Failed to create branch');
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
    fetchBranches();
  };

  const resetFilters = () => {
    setFilters({
      name: '',
      status: '',
      startDate: '',
      endDate: ''
    });
    setCurrentPage(1);
    fetchBranches();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const branches = branchesListData?.data?.data?.list || [];
  const totalBranches = branchesListData?.data?.total || 0;
  const totalPages = Math.ceil(totalBranches / itemsPerPage);

  const tableHeadings = ['Branch Name', 'State', 'City', 'Address', 'Pincode', 'Status', 'Created At', 'Actions'];
  
  const tableData = branches.map(branch => [
    <div className="font-medium text-gray-900">{branch.name}</div>,
    <div className="text-gray-700">{branch.state}</div>,
    <div className="text-gray-700">{branch.city}</div>,
    <div className="text-gray-700 max-w-xs truncate">{branch.address}</div>,
    <div className="text-gray-700">{branch.pincode}</div>,
    <div className="flex items-center">
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(branch.status)}`}>
        {branch.status ? 'Active' : 'Inactive'}
      </span>
      <div className="ml-3 relative inline-block w-10 align-middle select-none">
        <input
          type="checkbox"
          checked={branch.status}
          onChange={() => handleStatusToggle(branch)}
          className="sr-only"
          id={`toggle-${branch._id}`}
          disabled={loading}
        />
        <label
          htmlFor={`toggle-${branch._id}`}
          className={`block overflow-hidden h-6 rounded-full cursor-pointer ${branch.status ? 'bg-green-500' : 'bg-gray-300'}`}
        >
          <span className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${branch.status ? 'translate-x-4' : 'translate-x-0'}`} />
        </label>
      </div>
    </div>,
    new Date(branch.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }),
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleEditBranch(branch)}
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
        title="Edit"
        disabled={loading}
      >
        <Edit2 className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleDeleteBranch(branch._id)}
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
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold ">Branch Management</h1>
          <p className="text-gray-600 mt-2">Manage your branches and their details</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Branch Name
              </label>
              <input
                type="text"
                value={filters.name}
                onChange={(e) => handleFilterChange('name', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                placeholder="Search by name"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white transition-all"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                disabled={loading}
              />
            </div>

            <div className="flex items-end gap-2">
              <button
                onClick={handleFilter}
                className="flex-1 px-6 py-3 bg-sky-600 text-white font-medium rounded-xl hover:bg-sky-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Apply Filters'}
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

        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Branch List</h2>
            <p className="text-gray-600">{totalBranches} branches found</p>
          </div>
          <button
            onClick={handleAddBranchClick}
            className="px-6 py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-all shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-50"
            disabled={loading}
          >
            <span>Add Branch</span>
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {loading && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
              <span className="ml-3 text-gray-600">Loading branches...</span>
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
            total={totalBranches}
            totalPages={totalPages}
          />
        )}
      </div>

      {showModal && (
        <AddEditBranchModal
          branch={editingBranch}
          onSave={handleSaveBranch}
          onClose={() => {
            setShowModal(false);
            setEditingBranch(null);
          }}
        />
      )}
    </div>
  );
}