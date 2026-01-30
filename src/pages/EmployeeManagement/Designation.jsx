import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, Edit2, Trash2, DollarSign } from 'lucide-react';
import { toast } from 'react-toastify';
import {
  designationsList,
  enableDisableDesignations,
  deleteDesignations,
  createDesignations,
  updateDesignations
} from '../../redux/slices/employee';
import AlertModal from '../../components/Modal/AlertModal';
import Table from '../../components/Atoms/TableData/TableData';

const DesignationModal = ({ designation, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    salary: ''
  });

  useEffect(() => {
    if (designation) {
      setFormData({
        name: designation.name || '',
        salary: designation.salary || ''
      });
    }
  }, [designation]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.salary) {
      toast.error('Please fill all required fields');
      return;
    }

    const payload = {
      name: formData.name,
      salary: Number(formData.salary)
    };

    if (designation) {
      payload._id = designation._id;
    }

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {designation ? 'Edit Designation' : 'Add Designation'}
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
                  Designation Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Enter designation name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salary (₹) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pl-12"
                    placeholder="Enter salary"
                    required
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <DollarSign className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
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
                disabled={!formData.name || !formData.salary}
              >
                {designation ? 'Update Designation' : 'Create Designation'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default function DesignationManagement() {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingDesignation, setEditingDesignation] = useState(null);
  const [deletingDesignation, setDeletingDesignation] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  const designationsListData = useSelector(state => state.employee?.designationsListData);
  const enableDisableData = useSelector(state => state.employee?.enableDisableDesignationsData);
  const deleteData = useSelector(state => state.employee?.deleteDesignationsData);
  const createData = useSelector(state => state.employee?.createDesignationsData);
  const updateData = useSelector(state => state.employee?.updateDesignationsData);

  useEffect(() => {
    fetchDesignations();
  }, []);

  useEffect(() => {
    if (!showModal) {
      fetchDesignations();
    }
  }, [currentPage, enableDisableData, deleteData, createData, updateData]);

  const fetchDesignations = () => {
    setLoading(true);
    const params = {
      page: currentPage,
      size: itemsPerPage
    };
    
    dispatch(designationsList(params)).then((action) => {
      if (action.error) {
        toast.error(action.payload || 'Failed to fetch designations');
      }
      setLoading(false);
    });
  };

  const handleAddDesignationClick = () => {
    setEditingDesignation(null);
    setShowModal(true);
  };

  const handleEditDesignation = (designation) => {
    setEditingDesignation(designation);
    setShowModal(true);
  };

  const handleDeleteClick = (designation) => {
    setDeletingDesignation(designation);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingDesignation) {
      setLoading(true);
      dispatch(deleteDesignations({ _id: deletingDesignation._id })).then((action) => {
        if (!action.error) {
          toast.success('Designation deleted successfully');
          fetchDesignations();
        } else {
          toast.error(action.payload || 'Failed to delete designation');
        }
        setLoading(false);
        setShowDeleteModal(false);
        setDeletingDesignation(null);
      });
    }
  };

  const handleStatusToggle = (designation) => {
    const newStatus = !designation.status;
    if (window.confirm(`Are you sure you want to ${newStatus ? 'activate' : 'deactivate'} this designation?`)) {
      setLoading(true);
      const payload = {
        _id: designation._id,
        status: newStatus
      };
      dispatch(enableDisableDesignations(payload)).then((action) => {
        if (!action.error) {
          toast.success(`Designation ${newStatus ? 'activated' : 'deactivated'} successfully`);
          fetchDesignations();
        } else {
          toast.error(action.payload || 'Failed to update status');
        }
        setLoading(false);
      });
    }
  };

  const handleSaveDesignation = (formData) => {
    setLoading(true);
    if (editingDesignation) {
      const payload = {
        ...formData,
        _id: editingDesignation._id
      };
      dispatch(updateDesignations(payload)).then((action) => {
        if (!action.error) {
          toast.success('Designation updated successfully');
          setShowModal(false);
          setEditingDesignation(null);
          fetchDesignations();
        } else {
          toast.error(action.payload || 'Failed to update designation');
        }
        setLoading(false);
      });
    } else {
      dispatch(createDesignations(formData)).then((action) => {
        if (!action.error) {
          toast.success('Designation created successfully');
          setShowModal(false);
          fetchDesignations();
        } else {
          toast.error(action.payload || 'Failed to create designation');
        }
        setLoading(false);
      });
    }
  };

  const getStatusColor = (status) => {
    return status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const designations = designationsListData?.data?.data?.list || [];
  const totalDesignations = designationsListData?.data?.total || 0;
  const totalPages = Math.ceil(totalDesignations / itemsPerPage);

  const tableHeaders = ['Designation', 'Salary', 'Status', 'Created At', 'Actions'];
  
  const tableData = designations.map(designation => [
    <div className="font-medium text-gray-900">{designation.name}</div>,
    <div className="font-bold text-green-600">₹{designation.salary}</div>,
    <div className="flex items-center">
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(designation.status)}`}>
        {designation.status ? 'Active' : 'Inactive'}
      </span>
      <div className="ml-3 relative inline-block w-10 align-middle select-none">
        <input
          type="checkbox"
          checked={designation.status}
          onChange={() => handleStatusToggle(designation)}
          className="sr-only"
          id={`toggle-designation-${designation._id}`}
          disabled={loading}
        />
        <label
          htmlFor={`toggle-designation-${designation._id}`}
          className={`block overflow-hidden h-6 rounded-full cursor-pointer ${designation.status ? 'bg-green-500' : 'bg-gray-300'}`}
        >
          <span className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${designation.status ? 'translate-x-4' : 'translate-x-0'}`} />
        </label>
      </div>
    </div>,
    new Date(designation.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }),
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleEditDesignation(designation)}
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
        title="Edit"
        disabled={loading}
      >
        <Edit2 className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleDeleteClick(designation)}
        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
        title="Delete"
        disabled={loading}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  ]);

  const activeDesignations = designations.filter(des => des.status).length;
  const totalSalary = designations.reduce((total, des) => total + (Number(des.salary) || 0), 0);

  return (
    <div className="">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Designation</h1>
        <p className="text-gray-600 mt-2">Manage designations and their salaries</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700">Total Designations</h3>
          <p className="text-3xl font-bold text-black mt-2">{designations.length}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700">Active</h3>
          <p className="text-3xl font-bold text-black mt-2">{activeDesignations}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700">Total Salary</h3>
          <p className="text-3xl font-bold text-black mt-2">₹{totalSalary}</p>
        </div>
      </div>

      <div className="flex justify-end items-center mb-6">
        <button
          onClick={handleAddDesignationClick}
          className="px-6 py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-all shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-50"
          disabled={loading}
        >
          <span>Add Designation</span>
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {loading && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading designations...</span>
          </div>
        </div>
      )}

      {!loading && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <Table
            headers={tableHeaders}
            data={tableData}
            currentPage={currentPage}
            size={itemsPerPage}
            handlePageChange={setCurrentPage}
            total={totalDesignations}
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
        </div>
      )}

      {showModal && (
        <DesignationModal
          designation={editingDesignation}
          onSave={handleSaveDesignation}
          onClose={() => {
            setShowModal(false);
            setEditingDesignation(null);
          }}
        />
      )}

      {showDeleteModal && (
        <AlertModal
          isOpen={showDeleteModal}
          onCancel={() => {
            setShowDeleteModal(false);
            setDeletingDesignation(null);
          }}
          onConfirm={handleDeleteConfirm}
          title="Delete Designation"
          description="Are you sure you want to delete this designation? This action cannot be undone."
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