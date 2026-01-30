import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, Edit2, Trash2, Target, Building, Briefcase, Users, DollarSign, Calendar } from 'lucide-react';
import { toast } from 'react-toastify';
import {
  goalsList,
  enableDisableGoals,
  deleteGoals,
  createGoals,
  updateGoals,
  departmentsAllDocuments,
  designationsAllDocuments,
  rolesAllDocuments, 
} from '../../redux/slices/employee';
import AlertModal from '../../components/Modal/AlertModal';
import Table from '../../components/Atoms/TableData/TableData';

const GoalModal = ({ goal, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    department: '',
    role: [],
    salary: '',
    duration: ''
  });

  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const departmentsData = useSelector(state => state.employee?.departmentsAllDocumentsData);
  const designationsData = useSelector(state => state.employee?.designationsAllDocumentsData);
  const rolesData = useSelector(state => state.employee?.rolesAllDocumentsData);

  useEffect(() => {
    if (goal) {
      setFormData({
        name: goal.name || '',
        designation: goal.designation || '',
        department: goal.department || '',
        role: goal.role || [],
        salary: goal.salary || '',
        duration: goal.duration || ''
      });
    }
  }, [goal]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      dispatch(departmentsAllDocuments()),
      dispatch(designationsAllDocuments()),
      dispatch(rolesAllDocuments())
    ]).then(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    if (departmentsData?.data?.data) {
      setDepartments(departmentsData.data.data?.list);
    }
  }, [departmentsData]);

  useEffect(() => {
    if (designationsData?.data?.data) {
      setDesignations(designationsData.data.data?.list);
    }
  }, [designationsData]);

  useEffect(() => {
    if (rolesData?.data?.data) {
      setRoles(rolesData.data.data?.list);
    }
  }, [rolesData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMultiSelect = (value) => {
    setFormData(prev => {
      const currentValues = prev.role;
      const isSelected = currentValues.includes(value);
      
      if (isSelected) {
        return {
          ...prev,
          role: currentValues.filter(item => item !== value)
        };
      } else {
        return {
          ...prev,
          role: [...currentValues, value]
        };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.designation || !formData.department || formData.role.length === 0 || !formData.salary || !formData.duration) {
      toast.error('Please fill all required fields');
      return;
    }

    const payload = {
      name: formData.name,
      designation: formData.designation,
      department: formData.department,
      role: formData.role,
      salary: Number(formData.salary),
      duration: formData.duration
    };

    if (goal) {
      payload._id = goal._id;
    }

    onSave(payload);
  };

  const getDepartmentName = (deptId) => {
    const dept = departments.find(d => d._id === deptId);
    return dept ? dept.name : 'Unknown Department';
  };

  const getDesignationName = (desId) => {
    const des = designations.find(d => d._id === desId);
    return des ? des.name : 'Unknown Designation';
  };

  const getRoleNames = (roleIds) => {
    const roleNames = roleIds.map(roleId => {
      const role = roles.find(r => r._id === roleId);
      return role ? role.name : 'Unknown Role';
    });
    return roleNames.join(', ');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {goal ? 'Edit Goal' : 'Add Goal'}
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
                  Goal Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Enter goal name"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department *
                  </label>
                  {loading ? (
                    <div className="px-4 py-3 border border-gray-300 rounded-xl bg-gray-50">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mx-auto"></div>
                    </div>
                  ) : (
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept._id} value={dept._id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  )}
                  {formData.department && (
                    <div className="mt-2 text-sm text-gray-500">
                      Selected: {getDepartmentName(formData.department)}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Designation *
                  </label>
                  {loading ? (
                    <div className="px-4 py-3 border border-gray-300 rounded-xl bg-gray-50">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mx-auto"></div>
                    </div>
                  ) : (
                    <select
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                    >
                      <option value="">Select Designation</option>
                      {designations.map((des) => (
                        <option key={des._id} value={des._id}>
                          {des.name}
                        </option>
                      ))}
                    </select>
                  )}
                  {formData.designation && (
                    <div className="mt-2 text-sm text-gray-500">
                      Selected: {getDesignationName(formData.designation)}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Roles *
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto p-2 border border-gray-300 rounded-xl">
                  {loading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mx-auto"></div>
                    </div>
                  ) : roles.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      No roles available
                    </div>
                  ) : (
                    roles.map((role) => (
                      <label key={role._id} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.role.includes(role._id)}
                          onChange={() => handleMultiSelect(role._id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">{role.name}</span>
                      </label>
                    ))
                  )}
                </div>
                {formData.role.length > 0 && (
                  <div className="mt-2 text-sm text-gray-500">
                    Selected: {formData.role.length} role(s) - {getRoleNames(formData.role)}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (Months) *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pl-12"
                      placeholder="e.g., 6 Months"
                      required
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <Calendar className="w-5 h-5 text-gray-400" />
                    </div>
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
                disabled={loading || !formData.name || !formData.designation || !formData.department || formData.role.length === 0 || !formData.salary || !formData.duration}
              >
                {goal ? 'Update Goal' : 'Create Goal'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default function GoalManagement() {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [deletingGoal, setDeletingGoal] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  const goalsListData = useSelector(state => state.employee?.goalsListData);
  const enableDisableData = useSelector(state => state.employee?.enableDisableGoalsData);
  const deleteData = useSelector(state => state.employee?.deleteGoalsData);
  const createData = useSelector(state => state.employee?.createGoalsData);
  const updateData = useSelector(state => state.employee?.updateGoalsData);

  const departmentsData = useSelector(state => state.employee?.departmentsAllDocumentsData);
  const designationsData = useSelector(state => state.employee?.designationsAllDocumentsData);
  const rolesData = useSelector(state => state.employee?.rolesAllDocumentsData);

  useEffect(() => {
    fetchGoals();
  }, []);

  useEffect(() => {
    if (!showModal) {
      fetchGoals();
    }
  }, [currentPage, enableDisableData, deleteData, createData, updateData]);

  const fetchGoals = () => {
    setLoading(true);
    const params = {
      page: currentPage,
      size: itemsPerPage
    };
    
    dispatch(goalsList(params)).then((action) => {
      if (action.error) {
        toast.error(action.payload || 'Failed to fetch goals');
      }
      setLoading(false);
    });
  };

  const handleAddGoalClick = () => {
    setEditingGoal(null);
    setShowModal(true);
  };

  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setShowModal(true);
  };

  const handleDeleteClick = (goal) => {
    setDeletingGoal(goal);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingGoal) {
      setLoading(true);
      dispatch(deleteGoals({ _id: deletingGoal._id })).then((action) => {
        if (!action.error) {
          toast.success('Goal deleted successfully');
          fetchGoals();
        } else {
          toast.error(action.payload || 'Failed to delete goal');
        }
        setLoading(false);
        setShowDeleteModal(false);
        setDeletingGoal(null);
      });
    }
  };

  const handleStatusToggle = (goal) => {
    const newStatus = !goal.status;
    if (window.confirm(`Are you sure you want to ${newStatus ? 'activate' : 'deactivate'} this goal?`)) {
      setLoading(true);
      const payload = {
        _id: goal._id,
        status: newStatus
      };
      dispatch(enableDisableGoals(payload)).then((action) => {
        if (!action.error) {
          toast.success(`Goal ${newStatus ? 'activated' : 'deactivated'} successfully`);
          fetchGoals();
        } else {
          toast.error(action.payload || 'Failed to update status');
        }
        setLoading(false);
      });
    }
  };

  const handleSaveGoal = (formData) => {
    setLoading(true);
    if (editingGoal) {
      const payload = {
        ...formData,
        _id: editingGoal._id
      };
      dispatch(updateGoals(payload)).then((action) => {
        if (!action.error) {
          toast.success('Goal updated successfully');
          setShowModal(false);
          setEditingGoal(null);
          fetchGoals();
        } else {
          toast.error(action.payload || 'Failed to update goal');
        }
        setLoading(false);
      });
    } else {
      dispatch(createGoals(formData)).then((action) => {
        if (!action.error) {
          toast.success('Goal created successfully');
          setShowModal(false);
          fetchGoals();
        } else {
          toast.error(action.payload || 'Failed to create goal');
        }
        setLoading(false);
      });
    }
  };

  const getStatusColor = (status) => {
    return status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getDepartmentName = (deptId) => {
    const departments = departmentsData?.data?.data?.list || [];
    const dept = departments.find(d => d._id === deptId);
    return dept ? dept.name : 'Unknown Department';
  };

  const getDesignationName = (desId) => {
    const designations = designationsData?.data?.data?.list || [];
    const des = designations.find(d => d._id === desId);
    return des ? des.name : 'Unknown Designation';
  };

  const getRoleNames = (roleIds) => {
    const roles = rolesData?.data?.data || [];
    const roleNames = roleIds.map(roleId => {
      const role = roles.find(r => r._id === roleId);
      return role ? role.name : 'Unknown Role';
    });
    
    if (roleNames.length === 0) return 'No roles assigned';
    if (roleNames.length <= 3) return roleNames.join(', ');
    return roleNames.slice(0, 3).join(', ') + ` +${roleNames.length - 3} more`;
  };

  const goals = goalsListData?.data?.data?.list || [];
  const totalGoals = goalsListData?.data?.total || 0;
  const totalPages = Math.ceil(totalGoals / itemsPerPage);

  const tableHeaders = ['Goal Name', 'Designation', 'Department', 'Roles', 'Salary', 'Duration', 'Status', 'Actions'];
  
  const tableData = goals.map(goal => [
    <div className="flex items-center">
      <Target className="w-4 h-4 text-gray-400 mr-2" />
      <div className="font-medium text-gray-900">{goal.name}</div>
    </div>,
    <div className="flex items-center">
      <Briefcase className="w-4 h-4 text-gray-400 mr-2" />
      <span className="text-gray-700">{getDesignationName(goal.designation)}</span>
    </div>,
    <div className="flex items-center">
      <Building className="w-4 h-4 text-gray-400 mr-2" />
      <span className="text-gray-700">{getDepartmentName(goal.department)}</span>
    </div>,
    <div className="max-w-xs">
      <div className="flex flex-wrap gap-1">
        {goal.role && goal.role.length > 0 && goal.role.slice(0, 2).map((roleId, idx) => {
          const roles = rolesData?.data?.data?.list || [];
          const role = roles.find(r => r._id === roleId);
          return (
            <span key={idx} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
              {role ? role.name : 'Unknown'}
            </span>
          );
        })}
        {goal.role && goal.role.length > 2 && (
          <span className="text-gray-500 text-xs">
            +{goal.role.length - 2} more
          </span>
        )}
      </div>
    </div>,
    <div className="flex items-center">
      <DollarSign className="w-4 h-4 text-green-500 mr-2" />
      <span className="font-bold text-green-600">₹{goal.salary}</span>
    </div>,
    <div className="flex items-center">
      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
      <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
        {goal.duration} Months
      </span>
    </div>,
    <div className="flex items-center">
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
        {goal.status ? 'Active' : 'Inactive'}
      </span>
      <div className="ml-3 relative inline-block w-10 align-middle select-none">
        <input
          type="checkbox"
          checked={goal.status}
          onChange={() => handleStatusToggle(goal)}
          className="sr-only"
          id={`toggle-goal-${goal._id}`}
          disabled={loading}
        />
        <label
          htmlFor={`toggle-goal-${goal._id}`}
          className={`block overflow-hidden h-6 rounded-full cursor-pointer ${goal.status ? 'bg-green-500' : 'bg-gray-300'}`}
        >
          <span className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${goal.status ? 'translate-x-4' : 'translate-x-0'}`} />
        </label>
      </div>
    </div>,
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleEditGoal(goal)}
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
        title="Edit"
        disabled={loading}
      >
        <Edit2 className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleDeleteClick(goal)}
        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
        title="Delete"
        disabled={loading}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  ]);

  const activeGoals = goals.filter(goal => goal.status).length;
  const totalSalary = goals.reduce((total, goal) => total + (Number(goal.salary) || 0), 0);
  const uniqueDesignations = new Set(goals.map(goal => goal.designation)).size;
  const totalDuration = goals.reduce((total, goal) => {
    const months = parseInt(goal.duration) || 0;
    return total + months;
  }, 0);
  const avgDuration = goals.length > 0 ? Math.round(totalDuration / goals.length) : 0;

  return (
    <div className="">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Goal Management</h1>
        <p className="text-gray-600 mt-2">Manage goals, designations, and roles for your team</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700">Total Goals</h3>
          <p className="text-3xl font-bold text-black mt-2">{goals.length}</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700">Total Salary</h3>
          <p className="text-3xl font-bold text-black mt-2">₹{totalSalary}</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700">Unique Designations</h3>
          <p className="text-3xl font-bold text-black mt-2">{uniqueDesignations}</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700">Avg Duration</h3>
          <p className="text-3xl font-bold text-black mt-2">{avgDuration} Months</p>
        </div>
      </div>

      <div className="flex justify-end items-center mb-6">
        <button
          onClick={handleAddGoalClick}
          className="px-6 py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-all shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-50"
          disabled={loading}
        >
          <span>Add Goal</span>
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {loading && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading goals...</span>
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
            total={totalGoals}
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
        <GoalModal
          goal={editingGoal}
          onSave={handleSaveGoal}
          onClose={() => {
            setShowModal(false);
            setEditingGoal(null);
          }}
        />
      )}

      {showDeleteModal && (
        <AlertModal
          isOpen={showDeleteModal}
          onCancel={() => {
            setShowDeleteModal(false);
            setDeletingGoal(null);
          }}
          onConfirm={handleDeleteConfirm}
          title="Delete Goal"
          description="Are you sure you want to delete this goal? This action cannot be undone."
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