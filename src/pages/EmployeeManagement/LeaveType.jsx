import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, Edit2, Trash2, Calendar } from 'lucide-react';
import { toast } from 'react-toastify';
import {
  leaveTypesList,
  enableDisableLeaveTypes,
  deleteLeaveTypes,
  createLeaveTypes,
  updateLeaveTypes
} from '../../redux/slices/employee';
import AlertModal from '../../components/Modal/AlertModal';
import Table from '../../components/Atoms/TableData/TableData';

const LeaveTypeModal = ({ leaveType, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: ''
  });

  useEffect(() => {
    if (leaveType) {
      setFormData({
        name: leaveType.name || ''
      });
    }
  }, [leaveType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast.error('Please enter leave type name');
      return;
    }

    const payload = {
      name: formData.name
    };

    if (leaveType) {
      payload._id = leaveType._id;
    }

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {leaveType ? 'Edit Leave Type' : 'Add Leave Type'}
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
                  Leave Type Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Enter leave type name"
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
                {leaveType ? 'Update Type' : 'Create Type'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default function LeaveTypeManagement() {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingLeaveType, setEditingLeaveType] = useState(null);
  const [deletingLeaveType, setDeletingLeaveType] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  const leaveTypesListData = useSelector(state => state.employee?.leaveTypesListData);
  const enableDisableData = useSelector(state => state.employee?.enableDisableLeaveTypesData);
  const deleteData = useSelector(state => state.employee?.deleteLeaveTypesData);
  const createData = useSelector(state => state.employee?.createLeaveTypesData);
  const updateData = useSelector(state => state.employee?.updateLeaveTypesData);

  useEffect(() => {
    fetchLeaveTypes();
  }, []);

  useEffect(() => {
    if (!showModal) {
      fetchLeaveTypes();
    }
  }, [currentPage, enableDisableData, deleteData, createData, updateData]);

  const fetchLeaveTypes = () => {
    setLoading(true);
    const params = {
      page: currentPage,
      size: itemsPerPage
    };
    
    dispatch(leaveTypesList(params)).then((action) => {
      if (action.error) {
        toast.error(action.payload || 'Failed to fetch leave types');
      }
      setLoading(false);
    });
  };

  const handleAddLeaveTypeClick = () => {
    setEditingLeaveType(null);
    setShowModal(true);
  };

  const handleEditLeaveType = (leaveType) => {
    setEditingLeaveType(leaveType);
    setShowModal(true);
  };

  const handleDeleteClick = (leaveType) => {
    setDeletingLeaveType(leaveType);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingLeaveType) {
      setLoading(true);
      dispatch(deleteLeaveTypes({ _id: deletingLeaveType._id })).then((action) => {
        if (!action.error) {
          toast.success('Leave type deleted successfully');
          fetchLeaveTypes();
        } else {
          toast.error(action.payload || 'Failed to delete leave type');
        }
        setLoading(false);
        setShowDeleteModal(false);
        setDeletingLeaveType(null);
      });
    }
  };

  const handleStatusToggle = (leaveType) => {
    const newStatus = !leaveType.status;
    if (window.confirm(`Are you sure you want to ${newStatus ? 'activate' : 'deactivate'} this leave type?`)) {
      setLoading(true);
      const payload = {
        _id: leaveType._id,
        status: newStatus
      };
      dispatch(enableDisableLeaveTypes(payload)).then((action) => {
        if (!action.error) {
          toast.success(`Leave type ${newStatus ? 'activated' : 'deactivated'} successfully`);
          fetchLeaveTypes();
        } else {
          toast.error(action.payload || 'Failed to update status');
        }
        setLoading(false);
      });
    }
  };

  const handleSaveLeaveType = (formData) => {
    setLoading(true);
    if (editingLeaveType) {
      const payload = {
        ...formData,
        _id: editingLeaveType._id
      };
      dispatch(updateLeaveTypes(payload)).then((action) => {
        if (!action.error) {
          toast.success('Leave type updated successfully');
          setShowModal(false);
          setEditingLeaveType(null);
          fetchLeaveTypes();
        } else {
          toast.error(action.payload || 'Failed to update leave type');
        }
        setLoading(false);
      });
    } else {
      dispatch(createLeaveTypes(formData)).then((action) => {
        if (!action.error) {
          toast.success('Leave type created successfully');
          setShowModal(false);
          fetchLeaveTypes();
        } else {
          toast.error(action.payload || 'Failed to create leave type');
        }
        setLoading(false);
      });
    }
  };

  const getStatusColor = (status) => {
    return status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const leaveTypes = leaveTypesListData?.data?.data?.list || [];
  const totalLeaveTypes = leaveTypesListData?.data?.total || 0;
  const totalPages = Math.ceil(totalLeaveTypes / itemsPerPage);

  const tableHeaders = ['Leave Type', 'Status', 'Created At', 'Actions'];
  
  const tableData = leaveTypes.map(leaveType => [
    <div className="flex items-center">
      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
      <div className="font-medium text-gray-900">{leaveType.name}</div>
    </div>,
    <div className="flex items-center">
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(leaveType.status)}`}>
        {leaveType.status ? 'Active' : 'Inactive'}
      </span>
      <div className="ml-3 relative inline-block w-10 align-middle select-none">
        <input
          type="checkbox"
          checked={leaveType.status}
          onChange={() => handleStatusToggle(leaveType)}
          className="sr-only"
          id={`toggle-leave-type-${leaveType._id}`}
          disabled={loading}
        />
        <label
          htmlFor={`toggle-leave-type-${leaveType._id}`}
          className={`block overflow-hidden h-6 rounded-full cursor-pointer ${leaveType.status ? 'bg-green-500' : 'bg-gray-300'}`}
        >
          <span className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${leaveType.status ? 'translate-x-4' : 'translate-x-0'}`} />
        </label>
      </div>
    </div>,
    new Date(leaveType.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }),
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleEditLeaveType(leaveType)}
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
        title="Edit"
        disabled={loading}
      >
        <Edit2 className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleDeleteClick(leaveType)}
        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
        title="Delete"
        disabled={loading}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  ]);

  const activeLeaveTypes = leaveTypes.filter(lt => lt.status).length;
  const inactiveLeaveTypes = leaveTypes.filter(lt => !lt.status).length;

  return (
    <div className="">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Leave Type</h1>
        <p className="text-gray-600 mt-2">Manage leave types and their status</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700">Total Types</h3>
          <p className="text-3xl font-bold text-black mt-2">{leaveTypes.length}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700">Active</h3>
          <p className="text-3xl font-bold text-black mt-2">{activeLeaveTypes}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700">Inactive</h3>
          <p className="text-3xl font-bold text-black mt-2">{inactiveLeaveTypes}</p>
        </div>
      </div>

      <div className="flex justify-end items-center mb-6">
        <button
          onClick={handleAddLeaveTypeClick}
          className="px-6 py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-all shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-50"
          disabled={loading}
        >
          <span>Add Type</span>
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {loading && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading leave types...</span>
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
            total={totalLeaveTypes}
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
        <LeaveTypeModal
          leaveType={editingLeaveType}
          onSave={handleSaveLeaveType}
          onClose={() => {
            setShowModal(false);
            setEditingLeaveType(null);
          }}
        />
      )}

      {showDeleteModal && (
        <AlertModal
          isOpen={showDeleteModal}
          onCancel={() => {
            setShowDeleteModal(false);
            setDeletingLeaveType(null);
          }}
          onConfirm={handleDeleteConfirm}
          title="Delete Leave Type"
          description="Are you sure you want to delete this leave type? This action cannot be undone."
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