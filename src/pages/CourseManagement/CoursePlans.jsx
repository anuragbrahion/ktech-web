import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, Edit2, Trash2, DollarSign } from 'lucide-react';
import { toast } from 'react-toastify';
import { coursePlansList,
  enableDisableCoursePlans,
  deleteCoursePlans,
  createCoursePlans,
  updateCoursePlans,
  coursesAllDocuments } from '../../redux/slices/course';
import Table from '../../components/Atoms/TableData/TableData';
import AlertModal from '../../components/Modal/AlertModal';

const CoursePlanModal = ({ plan, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    course: []
  });

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const coursesData = useSelector(state => state.course?.coursesAllDocumentsData);

  useEffect(() => {
    if (plan) {
      setFormData({
        name: plan.name || '',
        amount: plan.amount || '',
        course: plan.course || []
      });
    }
  }, [plan]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = () => {
    setLoading(true);
    dispatch(coursesAllDocuments()).then(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    if (coursesData?.data?.data) {
      setCourses(coursesData.data.data);
    }
  }, [coursesData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMultiSelect = (value) => {
    setFormData(prev => {
      const currentValues = prev.course;
      const isSelected = currentValues.includes(value);
      
      if (isSelected) {
        return {
          ...prev,
          course: currentValues.filter(item => item !== value)
        };
      } else {
        return {
          ...prev,
          course: [...currentValues, value]
        };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.amount || formData.course.length === 0) {
      toast.error('Please fill all required fields');
      return;
    }

    const payload = {
      name: formData.name,
      amount: Number(formData.amount),
      course: formData.course
    };

    if (plan) {
      payload._id = plan._id;
    }
    onSave(payload);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {plan ? 'Edit Course Plan' : 'Add Course Plan'}
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
                  Plan Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Enter plan name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (₹) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pl-12"
                    placeholder="Enter amount"
                    required
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <DollarSign className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Courses *
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto p-2 border border-gray-300 rounded-xl">
                  {loading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mx-auto"></div>
                    </div>
                  ) : courses.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      No courses available
                    </div>
                  ) : (
                    courses?.list.map((course) => (
                      <label key={course._id} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.course.includes(course._id)}
                          onChange={() => handleMultiSelect(course._id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">{course.courseName}</span>
                      </label>
                    ))
                  )}
                </div>
                {formData.course.length > 0 && (
                  <div className="mt-2 text-sm text-gray-500">
                    Selected: {formData.course.length} course(s)
                  </div>
                )}
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
                disabled={loading || !formData.name || !formData.amount || formData.course.length === 0}
              >
                {plan ? 'Update Plan' : 'Create Plan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default function CoursePlansManagement() {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [deletingPlan, setDeletingPlan] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    search: '',
    minAmount: '',
    maxAmount: '',
    course: '',
    status: '',
    startDate: '',
    endDate: ''
  });
  const [loading, setLoading] = useState(false);

  const plansListData = useSelector(state => state.course?.coursePlansListData);
  const enableDisableData = useSelector(state => state.course?.enableDisableCoursePlansData);
  const deleteData = useSelector(state => state.course?.deleteCoursePlansData);
  const createData = useSelector(state => state.course?.createCoursePlansData);
  const updateData = useSelector(state => state.course?.updateCoursePlansData);

  useEffect(() => {
    fetchPlans();
  }, []);

  useEffect(() => {
    if (!showModal) {
      fetchPlans();
    }
  }, [currentPage, enableDisableData, deleteData, createData, updateData]);

  const fetchPlans = () => {
    setLoading(true);
    const params = {
      page: currentPage,
      size: itemsPerPage,
      ...(filters.search && { search: filters.search }),
      ...(filters.minAmount && { minAmount: filters.minAmount }),
      ...(filters.maxAmount && { maxAmount: filters.maxAmount }),
      ...(filters.course && { course: filters.course }),
      ...(filters.status && { status: filters.status }),
      ...(filters.startDate && { startDate: filters.startDate }),
      ...(filters.endDate && { endDate: filters.endDate })
    };
    
    dispatch(coursePlansList(params)).then((action) => {
      if (action.error) {
        toast.error(action.payload || 'Failed to fetch plans');
      }
      setLoading(false);
    });
  };

  const handleAddPlanClick = () => {
    setEditingPlan(null);
    setShowModal(true);
  };

  const handleEditPlan = (plan) => {
    setEditingPlan(plan);
    setShowModal(true);
  };

  const handleDeleteClick = (plan) => {
    setDeletingPlan(plan);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingPlan) {
      setLoading(true);
      dispatch(deleteCoursePlans({ _id: deletingPlan._id })).then((action) => {
        if (!action.error) {
          toast.success('Plan deleted successfully');
          fetchPlans();
        } else {
          toast.error(action.payload || 'Failed to delete plan');
        }
        setLoading(false);
        setShowDeleteModal(false);
        setDeletingPlan(null);
      });
    }
  };

  const handleStatusToggle = (plan) => {
    const newStatus = !plan.status;
    if (window.confirm(`Are you sure you want to ${newStatus ? 'activate' : 'deactivate'} this plan?`)) {
      setLoading(true);
      const payload = {
        _id: plan._id,
        status: newStatus
      };
      dispatch(enableDisableCoursePlans(payload)).then((action) => {
        if (!action.error) {
          toast.success(`Plan ${newStatus ? 'activated' : 'deactivated'} successfully`);
          fetchPlans();
        } else {
          toast.error(action.payload || 'Failed to update status');
        }
        setLoading(false);
      });
    }
  };

  const handleSavePlan = (formData) => {
    setLoading(true);
    if (editingPlan) {
      const payload = {
        ...formData,
        _id: editingPlan._id
      };
      dispatch(updateCoursePlans(payload)).then((action) => {
        if (!action.error) {
          toast.success('Plan updated successfully');
          setShowModal(false);
          setEditingPlan(null);
          fetchPlans();
        } else {
          toast.error(action.payload || 'Failed to update plan');
        }
        setLoading(false);
      });
    } else {
      dispatch(createCoursePlans(formData)).then((action) => {
        if (!action.error) {
          toast.success('Plan created successfully');
          setShowModal(false);
          fetchPlans();
        } else {
          toast.error(action.payload || 'Failed to create plan');
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
    fetchPlans();
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      minAmount: '',
      maxAmount: '',
      course: '',
      status: '',
      startDate: '',
      endDate: ''
    });
    setCurrentPage(1);
    fetchPlans();
  };

  const getStatusColor = (status) => {
    return status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getCourseNames = (courseIds, allCourses = []) => {
    if (!courseIds || courseIds.length === 0) return 'No courses';
    
    const courseNames = courseIds.map(courseId => {
      const course = allCourses?.list.find(c => c._id === courseId);
      return course ? course.courseName : 'Unknown Course';
    });
    
    return courseNames.slice(0, 2).join(', ') + (courseNames.length > 2 ? ` +${courseNames.length - 2} more` : '');
  };

  const plans = plansListData?.data?.data?.list || [];
  const totalPlans = plansListData?.data?.total || 0;
  const totalPages = Math.ceil(totalPlans / itemsPerPage);
  const tableHeaders = ['Plan Name', 'Amount', 'Courses', 'Status', 'Created At', 'Actions'];
  const courses = useSelector(state => state.course?.coursesAllDocumentsData?.data?.data) || [];
  const tableData = plans.map(plan => [
    <div className="font-medium text-gray-900">{plan.name}</div>,
    <div className="font-bold text-green-600 text-lg">
      ₹{plan.amount}
    </div>,
    <div className="max-w-xs">
      {getCourseNames(plan.course, courses)}
    </div>,
    <div className="flex items-center">
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(plan.status)}`}>
        {plan.status ? 'Active' : 'Inactive'}
      </span>
      <div className="ml-3 relative inline-block w-10 align-middle select-none">
        <input
          type="checkbox"
          checked={plan.status}
          onChange={() => handleStatusToggle(plan)}
          className="sr-only"
          id={`toggle-plan-${plan._id}`}
          disabled={loading}
        />
        <label
          htmlFor={`toggle-plan-${plan._id}`}
          className={`block overflow-hidden h-6 rounded-full cursor-pointer ${plan.status ? 'bg-green-500' : 'bg-gray-300'}`}
        >
          <span className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${plan.status ? 'translate-x-4' : 'translate-x-0'}`} />
        </label>
      </div>
    </div>,
    new Date(plan.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }),
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleEditPlan(plan)}
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
        title="Edit"
        disabled={loading}
      >
        <Edit2 className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleDeleteClick(plan)}
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
        <h1 className="text-3xl font-bold text-gray-900">Course Plans Management</h1>
        <p className="text-gray-600 mt-2">Manage pricing plans for all courses</p>
      </div>

      {/* <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Filter Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Search plan names..."
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Amount
              </label>
              <input
                type="number"
                value={filters.minAmount}
                onChange={(e) => handleFilterChange('minAmount', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Min"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Amount
              </label>
              <input
                type="number"
                value={filters.maxAmount}
                onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Max"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course ID
            </label>
            <input
              type="text"
              value={filters.course}
              onChange={(e) => handleFilterChange('course', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Course ID"
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
          onClick={handleAddPlanClick}
          className="px-6 py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-all shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-50"
          disabled={loading}
        >
          <span>Add Plan</span>
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {loading && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading plans...</span>
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
          total={totalPlans}
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
        <CoursePlanModal
          plan={editingPlan}
          onSave={handleSavePlan}
          onClose={() => {
            setShowModal(false);
            setEditingPlan(null);
          }}
        />
      )}

      {showDeleteModal && (
        <AlertModal
          isOpen={showDeleteModal}
          onCancel={() => {
            setShowDeleteModal(false);
            setDeletingPlan(null);
          }}
          onConfirm={handleDeleteConfirm}
          title="Delete Course Plan"
          description="Are you sure you want to delete this plan? This action cannot be undone."
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