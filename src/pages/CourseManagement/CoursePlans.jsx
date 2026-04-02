/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Plus, Edit2, Trash2, IndianRupeeIcon, Filter } from "lucide-react";
import { toast } from "react-toastify";
import {
  coursePlansList,
  enableDisableCoursePlans,
  deleteCoursePlans,
  createCoursePlans,
  updateCoursePlans,
  coursesAllDocuments,
} from "../../redux/slices/course";
import Table from "../../components/Atoms/TableData/TableData";
import AlertModal from "../../components/Modal/AlertModal";
import { formatDateForTable, hasPermission } from "../../utils/globalFunction";
import Loader from "../../components/Loader/Loader";

const CoursePlanModal = ({ plan, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    course: [],
  });

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const coursesData = useSelector(
    (state) => state.course?.coursesAllDocumentsData,
  );

  useEffect(() => {
    if (plan) {
      setFormData({
        name: plan.name || "",
        amount: plan.amount || "",
        course: plan.course.map((item) => item._id) || [],
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiSelect = (value) => {
    setFormData((prev) => {
      const currentValues = prev.course;
      const isSelected = currentValues.includes(value);

      if (isSelected) {
        return {
          ...prev,
          course: currentValues.filter((item) => item !== value),
        };
      } else {
        return {
          ...prev,
          course: [...currentValues, value],
        };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.amount || formData.course.length === 0) {
      toast.error("Please fill all required fields");
      return;
    }

    const payload = {
      name: formData.name,
      amount: Number(formData.amount),
      course: formData.course,
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
              {plan ? "Edit Course Plan" : "Add Course Plan"}
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
                    <IndianRupeeIcon className="w-5 h-5 text-gray-400" />
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
                      <label
                        key={course._id}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.course.includes(course._id)}
                          onChange={() => handleMultiSelect(course._id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">
                          {course.courseName}
                        </span>
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
                disabled={
                  loading ||
                  !formData.name ||
                  !formData.amount ||
                  formData.course.length === 0
                }
              >
                {plan ? "Update Plan" : "Create Plan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default function CoursePlansManagement({ roleData, adminId }) {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [deletingPlan, setDeletingPlan] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    search: "",
  });
  const [loading, setLoading] = useState(false);
  const plansListData = useSelector(
    (state) => state.course?.coursePlansListData,
  );
  const enableDisableData = useSelector(
    (state) => state.course?.enableDisableCoursePlansData,
  );
  const deleteData = useSelector(
    (state) => state.course?.deleteCoursePlansData,
  );
  const createData = useSelector(
    (state) => state.course?.createCoursePlansData,
  );
  const updateData = useSelector(
    (state) => state.course?.updateCoursePlansData,
  );

  useEffect(() => {
    fetchPlans(filters);
  }, []);

  useEffect(() => {
    if (!showModal) {
      fetchPlans(filters);
    }
  }, [currentPage, enableDisableData, deleteData, createData, updateData]);

  const fetchPlans = () => {
    setLoading(true);
    dispatch(
      coursePlansList({
        page: currentPage,
        size: itemsPerPage,
        populate: "course:courseName|adminId:name,role",
        ...(filters.search && {
          keyWord: filters.search,
          searchFields: "name",
        }),
        query: JSON.stringify({ adminId }),
      }),
    ).then((action) => {
      if (action.error) {
        toast.error(action.payload || "Failed to fetch plans");
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
          toast.success("Plan deleted successfully");
          fetchPlans(filters);
        } else {
          toast.error(action.payload || "Failed to delete plan");
        }
        setLoading(false);
        setShowDeleteModal(false);
        setDeletingPlan(null);
      });
    }
  };

  const handleStatusToggle = (plan) => {
    const newStatus = !plan.status;
    if (
      window.confirm(
        `Are you sure you want to ${newStatus ? "activate" : "deactivate"} this plan?`,
      )
    ) {
      setLoading(true);
      const payload = {
        _id: plan._id,
        status: newStatus,
      };
      dispatch(enableDisableCoursePlans(payload)).then((action) => {
        if (!action.error) {
          toast.success(
            `Plan ${newStatus ? "activated" : "deactivated"} successfully`,
          );
          fetchPlans(filters);
        } else {
          toast.error(action.payload || "Failed to update status");
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
        _id: editingPlan._id,
      };
      dispatch(updateCoursePlans(payload)).then((action) => {
        if (!action.error) {
          toast.success("Plan updated successfully");
          setShowModal(false);
          setEditingPlan(null);
          fetchPlans(filters);
        } else {
          toast.error(action.payload || "Failed to update plan");
        }
        setLoading(false);
      });
    } else {
      dispatch(createCoursePlans(formData)).then((action) => {
        if (!action.error) {
          toast.success("Plan created successfully");
          setShowModal(false);
          fetchPlans(filters);
        } else {
          toast.error(action.payload || "Failed to create plan");
        }
        setLoading(false);
      });
    }
  };

  const plans = plansListData?.data?.data?.list || [];
  const totalPlans = plansListData?.data?.data?.total || 0;
  const totalPages = Math.ceil(totalPlans / itemsPerPage);
  const tableHeaders = [
    // "Branch",
    "Plan",
    "Courses",
    "Status",
    "Created At",
    "Actions",
  ];
  const tableData = plans.map((plan) => [
    // !plan?.adminId ? (
    //   <span className="text-gray-400 italic">N/A</span>
    // ) : (
    //   <div className="flex flex-col">
    //     <span className="font-semibold text-gray-800 capitalize">
    //       {plan.adminId.name || "Branch"}
    //     </span>
    //     <span
    //       className={`text-xs font-medium mt-1 px-2 py-0.5 rounded-full w-fit ${
    //         plan.adminId.role.toLowerCase() === "superadmin"
    //           ? "bg-green-100 text-green-700"
    //           : "bg-yellow-100 text-yellow-700"
    //       }`}
    //     >
    //       {plan.adminId.role.toLowerCase() === "superadmin"
    //         ? "Main Branch"
    //         : "Sub Branch"}
    //     </span>
    //   </div>
    // ),

    <div className="flex flex-col">
      <span className="font-semibold text-gray-900 capitalize">
        {plan.name}
      </span>
      <span className="text-lg font-bold text-green-600 mt-1">
        ₹{plan.amount}
      </span>
    </div>,

    <div className="flex flex-wrap gap-1 max-w-xs">
      {plan.course?.length ? (
        plan.course.map((data, index) => (
          <span
            key={index}
            className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 rounded-full capitalize"
          >
            {data.courseName ?? "N/A"}
          </span>
        ))
      ) : (
        <span className="text-gray-400 text-xs">No Courses</span>
      )}
    </div>,

    <div className="flex items-center gap-3">
      <span
        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
          plan.status
            ? "bg-green-100 text-green-700"
            : "bg-gray-200 text-gray-600"
        }`}
      >
        {plan.status ? "Active" : "Inactive"}
      </span>

      <label className="relative inline-flex items-center">
        <input
          type="checkbox"
          checked={plan.status}
          onChange={() => handleStatusToggle(plan)}
          className="sr-only peer"
          id={`toggle-plan-${plan._id}`}
          disabled={
            loading ||
            !hasPermission(roleData, adminId, plan?.adminId?._id || null)
          }
        />

        <div
          className={`w-11 h-6 rounded-full transition-all ${
            plan.status ? "bg-green-500" : "bg-gray-300"
          } ${
            hasPermission(roleData, adminId, plan?.adminId?._id || null)
              ? "cursor-pointer"
              : "cursor-not-allowed opacity-60"
          }`}
        ></div>

        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-5"></div>
      </label>
    </div>,

    <span className="text-sm text-gray-600">
      {formatDateForTable(plan.createdAt)}
    </span>,

    <div className="flex items-center gap-2">
      <button
        onClick={() => handleEditPlan(plan)}
        className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={
          loading ||
          !hasPermission(roleData, adminId, plan?.adminId?._id || null)
        }
      >
        <Edit2 className="w-4 h-4" />
      </button>

      {roleData === "superadmin" && (
        <button
          onClick={() => handleDeleteClick(plan)}
          className="p-2 rounded-lg text-red-600 hover:bg-red-50 hover:scale-105 transition disabled:opacity-50"
          disabled={loading}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>,
  ]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleFilter = () => {
    setCurrentPage(1);
    fetchPlans(filters);
  };

  const resetFilters = () => {
    setFilters({
      search: "",
    });
    setCurrentPage(1);
    fetchPlans({
      search: "",
    });
  };

  return (
    <>
      <Loader loading={loading} />

      <div className="mb-8 flex justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Course Plans Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage pricing plans for all courses
          </p>
        </div>
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
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Filter className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            placeholder="Search name..."
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex justify-end gap-2">
            <button
              onClick={handleFilter}
              disabled={loading}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "..." : "Apply"}
            </button>
            <button
              onClick={resetFilters}
              disabled={loading}
              className="px-4 py-2 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100 transition"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

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
            className={`hover:bg-blue-50 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
          >
            {row.map((cell, cellIndex) => (
              <td key={cellIndex} className="py-4 px-4">
                {cell}
              </td>
            ))}
          </tr>
        )}
      />

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
    </>
  );
}
