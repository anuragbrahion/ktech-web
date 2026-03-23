/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Plus, Edit2, Trash2, Building } from "lucide-react";
import { toast } from "react-toastify";
import {
  departmentsList,
  enableDisableDepartments,
  deleteDepartments,
  createDepartments,
  updateDepartments,
} from "../../redux/slices/employee";
import AlertModal from "../../components/Modal/AlertModal";
import Table from "../../components/Atoms/TableData/TableData";
import { formatDateForTable, hasPermission } from "../../utils/globalFunction";
import Loader from "../../components/Loader/Loader";

const DepartmentModal = ({ department, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
  });

  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name || "",
      });
    }
  }, [department]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name) {
      toast.error("Please enter department name");
      return;
    }

    const payload = {
      name: formData.name,
    };

    if (department) {
      payload._id = department._id;
    }

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {department ? "Edit Department" : "Add Department"}
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
                  Department Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Enter department name"
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
                {department ? "Update Department" : "Create Department"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default function DepartmentManagement({ roleData, adminId }) {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [deletingDepartment, setDeletingDepartment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  const departmentsListData = useSelector(
    (state) => state.employee?.departmentsListData,
  );
  const enableDisableData = useSelector(
    (state) => state.employee?.enableDisableDepartmentsData,
  );
  const deleteData = useSelector(
    (state) => state.employee?.deleteDepartmentsData,
  );
  const createData = useSelector(
    (state) => state.employee?.createDepartmentsData,
  );
  const updateData = useSelector(
    (state) => state.employee?.updateDepartmentsData,
  );

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (!showModal) {
      fetchDepartments();
    }
  }, [currentPage, enableDisableData, deleteData, createData, updateData]);

  const fetchDepartments = () => {
    setLoading(true);
    const params = {
      page: currentPage,
      size: itemsPerPage,
      populate: "adminId:name,role",
    };

    dispatch(departmentsList(params)).then((action) => {
      if (action.error) {
        toast.error(action.payload || "Failed to fetch departments");
      }
      setLoading(false);
    });
  };

  const handleAddDepartmentClick = () => {
    setEditingDepartment(null);
    setShowModal(true);
  };

  const handleEditDepartment = (department) => {
    setEditingDepartment(department);
    setShowModal(true);
  };

  const handleDeleteClick = (department) => {
    setDeletingDepartment(department);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingDepartment) {
      setLoading(true);
      dispatch(deleteDepartments({ _id: deletingDepartment._id })).then(
        (action) => {
          if (!action.error) {
            toast.success("Department deleted successfully");
            fetchDepartments();
          } else {
            toast.error(action.payload || "Failed to delete department");
          }
          setLoading(false);
          setShowDeleteModal(false);
          setDeletingDepartment(null);
        },
      );
    }
  };

  const handleStatusToggle = (department) => {
    const newStatus = !department.status;
    if (
      window.confirm(
        `Are you sure you want to ${newStatus ? "activate" : "deactivate"} this department?`,
      )
    ) {
      setLoading(true);
      const payload = {
        _id: department._id,
        status: newStatus,
      };
      dispatch(enableDisableDepartments(payload)).then((action) => {
        if (!action.error) {
          toast.success(
            `Department ${newStatus ? "activated" : "deactivated"} successfully`,
          );
          fetchDepartments();
        } else {
          toast.error(action.payload || "Failed to update status");
        }
        setLoading(false);
      });
    }
  };

  const handleSaveDepartment = (formData) => {
    setLoading(true);
    if (editingDepartment) {
      const payload = {
        ...formData,
        _id: editingDepartment._id,
      };
      dispatch(updateDepartments(payload)).then((action) => {
        if (!action.error) {
          toast.success("Department updated successfully");
          setShowModal(false);
          setEditingDepartment(null);
          fetchDepartments();
        } else {
          toast.error(action.payload || "Failed to update department");
        }
        setLoading(false);
      });
    } else {
      dispatch(createDepartments(formData)).then((action) => {
        if (!action.error) {
          toast.success("Department created successfully");
          setShowModal(false);
          fetchDepartments();
        } else {
          toast.error(action.payload || "Failed to create department");
        }
        setLoading(false);
      });
    }
  };

  const getStatusColor = (status) => {
    return status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const departments = departmentsListData?.data?.data?.list || [];
  const totalDepartments = departmentsListData?.data?.data?.total || 0;
  const totalPages = Math.ceil(totalDepartments / itemsPerPage);

  const tableHeaders = [
    "Department",
    "Branch",
    "Status",
    "Created At",
    "Actions",
  ];

  const tableData = departments.map((department) => [
    <div className="flex items-center">
      <div className="font-medium text-gray-900 capitalize">
        {department.name}
      </div>
    </div>,
    !department?.adminId ? (
      "N/A"
    ) : (
      <div>
        <div className="font-medium text-gray-900 capitalize">
          {department.adminId.name || "Branch"}
        </div>
        <div className="text-sm text-gray-500">
          {department.adminId.role.toLowerCase() === "superadmin"
            ? "Main Branch"
            : "Sub Branch"}
        </div>
      </div>
    ),
    <div className="flex items-center">
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(department.status)}`}
      >
        {department.status ? "Active" : "Inactive"}
      </span>
      <div className="ml-3 relative inline-block w-10 align-middle select-none">
        <input
          type="checkbox"
          checked={department.status}
          onChange={() => handleStatusToggle(department)}
          className="sr-only"
          id={`toggle-department-${department._id}`}
          disabled={
            loading ||
            !hasPermission(roleData, adminId, department?.adminId?._id || null)
          }
        />
        <label
          htmlFor={`toggle-department-${department._id}`}
          className={`block overflow-hidden h-6 rounded-full ${!hasPermission(roleData, adminId, department?.adminId?._id || null) ? "cursor-not-allowed" : "cursor-pointer"} ${department.status ? "bg-green-500" : "bg-gray-300"}`}
        >
          <span
            className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${department.status ? "translate-x-4" : "translate-x-0"}`}
          />
        </label>
      </div>
    </div>,
    formatDateForTable(department.createdAt),
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleEditDepartment(department)}
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition disabled:cursor-not-allowed"
        title="Edit"
        disabled={
          loading ||
          !hasPermission(roleData, adminId, department?.adminId?._id || null)
        }
      >
        <Edit2 className="w-4 h-4" />
      </button>
      {roleData === "superadmin" && (
        <button
          onClick={() => handleDeleteClick(department)}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
          title="Delete"
          disabled={loading}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>,
  ]);

  return (
    <>
      <Loader loading={loading} />
      <div className="mb-8 flex justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Department</h1>
          <p className="text-gray-600 mt-2">
            Manage all departments in the organization
          </p>
        </div>
        <div className="flex justify-end items-center mb-6">
          <button
            onClick={handleAddDepartmentClick}
            className="px-6 py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-all shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-50"
            disabled={loading}
          >
            <span>Add Department</span>
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <Table
        headers={tableHeaders}
        data={tableData}
        currentPage={currentPage}
        size={itemsPerPage}
        handlePageChange={setCurrentPage}
        total={totalDepartments}
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
        <DepartmentModal
          department={editingDepartment}
          onSave={handleSaveDepartment}
          onClose={() => {
            setShowModal(false);
            setEditingDepartment(null);
          }}
        />
      )}

      {showDeleteModal && (
        <AlertModal
          isOpen={showDeleteModal}
          onCancel={() => {
            setShowDeleteModal(false);
            setDeletingDepartment(null);
          }}
          onConfirm={handleDeleteConfirm}
          title="Delete Department"
          description="Are you sure you want to delete this department? This action cannot be undone."
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
