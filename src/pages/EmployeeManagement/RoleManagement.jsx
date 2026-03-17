/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Plus, Edit2, Trash2, Calendar, Book } from "lucide-react";
import { toast } from "react-toastify";
import {
  rolesList,
  deleteRoles,
  createRoles,
  updateRoles,
} from "../../redux/slices/employee";
import AlertModal from "../../components/Modal/AlertModal";
import Table from "../../components/Atoms/TableData/TableData";
import { coursesAllDocuments } from "../../redux/slices/course";
import { formatDateForTable } from "../../utils/globalFunction";
import Loader from "../../components/Loader/Loader";

const RoleModal = ({ role, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    course: "",
    days: "",
  });

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const coursesData = useSelector(
    (state) => state.course?.coursesAllDocumentsData,
  );

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name || "",
        course: role.course || "",
        days: role.days || "",
      });
    }
  }, [role]);

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
      setCourses(coursesData.data.data?.list);
    }
  }, [coursesData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.course || !formData.days) {
      toast.error("Please fill all required fields");
      return;
    }

    const payload = {
      name: formData.name,
      course: formData.course,
      days: Number(formData.days),
    };

    if (role) {
      payload._id = role._id;
    }

    onSave(payload);
  };

  const getCourseName = (courseId) => {
    const course = courses.find((c) => c._id === courseId);
    return course ? course.courseName : "Unknown Course";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {role ? "Edit Role" : "Add Role"}
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
                  Role Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Enter role name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course *
                </label>
                {loading ? (
                  <div className="px-4 py-3 border border-gray-300 rounded-xl bg-gray-50">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mx-auto"></div>
                  </div>
                ) : (
                  <select
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  >
                    <option value="">Select Course</option>
                    {courses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.courseName}
                      </option>
                    ))}
                  </select>
                )}
                {formData.course && (
                  <div className="mt-2 text-sm text-gray-500">
                    Selected: {getCourseName(formData.course)}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (Days) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="days"
                    value={formData.days}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pl-12"
                    placeholder="Enter duration in days"
                    required
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Calendar className="w-5 h-5 text-gray-400" />
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
                disabled={!formData.name || !formData.course || !formData.days}
              >
                {role ? "Update Role" : "Create Role"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default function RoleManagement({ roleData }) {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [deletingRole, setDeletingRole] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  const rolesListData = useSelector((state) => state.employee?.rolesListData);
  const enableDisableData = useSelector(
    (state) => state.employee?.enableDisableRolesData,
  );
  const deleteData = useSelector((state) => state.employee?.deleteRolesData);
  const createData = useSelector((state) => state.employee?.createRolesData);
  const updateData = useSelector((state) => state.employee?.updateRolesData);

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    if (!showModal) {
      fetchRoles();
    }
  }, [currentPage, enableDisableData, deleteData, createData, updateData]);

  const fetchRoles = () => {
    setLoading(true);
    const params = {
      page: currentPage,
      size: itemsPerPage,
      populate: "adminId:name,role|course:courseName",
    };

    dispatch(rolesList(params)).then((action) => {
      if (action.error) {
        toast.error(action.payload || "Failed to fetch roles");
      }
      setLoading(false);
    });
  };

  const handleAddRoleClick = () => {
    setEditingRole(null);
    setShowModal(true);
  };

  const handleDeleteClick = (role) => {
    setDeletingRole(role);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingRole) {
      setLoading(true);
      dispatch(deleteRoles({ _id: deletingRole._id })).then((action) => {
        if (!action.error) {
          toast.success("Role deleted successfully");
          fetchRoles();
        } else {
          toast.error(action.payload || "Failed to delete role");
        }
        setLoading(false);
        setShowDeleteModal(false);
        setDeletingRole(null);
      });
    }
  };

  const handleSaveRole = (formData) => {
    setLoading(true);
    if (editingRole) {
      const payload = {
        ...formData,
        _id: editingRole._id,
      };
      dispatch(updateRoles(payload)).then((action) => {
        if (!action.error) {
          toast.success("Role updated successfully");
          setShowModal(false);
          setEditingRole(null);
          fetchRoles();
        } else {
          toast.error(action.payload || "Failed to update role");
        }
        setLoading(false);
      });
    } else {
      dispatch(createRoles(formData)).then((action) => {
        if (!action.error) {
          toast.success("Role created successfully");
          setShowModal(false);
          fetchRoles();
        } else {
          toast.error(action.payload || "Failed to create role");
        }
        setLoading(false);
      });
    }
  };

  const roles = rolesListData?.data?.data?.list || [];
  const totalRoles = rolesListData?.data?.data?.total || 0;
  const totalPages = Math.ceil(totalRoles / itemsPerPage);

  const tableHeaders = [
    "Role",
    "Course",
    "Duration",
    "Branch",
    "Created At",
    ...(roleData === "superadmin" ? ["Actions"] : []),
  ];

  const tableData = roles.map((role) => [
    <div className="font-medium text-gray-900 capitalize">{role.name}</div>,
    <div className="flex items-center">
      <Book className="w-4 h-4 text-gray-400 mr-2" />
      <span className="text-gray-700">{role.course.courseName}</span>
    </div>,
    <div className="flex items-center">
      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
      <span className="font-bold text-gray-900">{role.days} Days</span>
    </div>,
    !role?.adminId ? (
      "N/A"
    ) : (
      <div>
        <div className="font-medium text-gray-900 capitalize">
          {role.adminId.name || "Branch"}
        </div>
        <div className="text-sm text-gray-500">
          {role.adminId.role.toLowerCase() === "superadmin"
            ? "Main Branch"
            : "Sub Branch"}
        </div>
      </div>
    ),

    formatDateForTable(role.createdAt),
    ...(roleData === "superadmin"
      ? [
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDeleteClick(role)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              title="Delete"
              disabled={loading}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>,
        ]
      : []),
  ]);

  return (
    <>
      <Loader loading={loading} />
      <div className="mb-8 flex justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Role Management</h1>
          <p className="text-gray-600 mt-2">
            Manage roles and their configurations
          </p>
        </div>

        <div className="flex justify-end items-center mb-6">
          <button
            onClick={handleAddRoleClick}
            className="px-6 py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-all shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-50"
            disabled={loading}
          >
            <span>Add Role</span>
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
        total={totalRoles}
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
        <RoleModal
          role={editingRole}
          onSave={handleSaveRole}
          onClose={() => {
            setShowModal(false);
            setEditingRole(null);
          }}
        />
      )}

      {showDeleteModal && (
        <AlertModal
          isOpen={showDeleteModal}
          onCancel={() => {
            setShowDeleteModal(false);
            setDeletingRole(null);
          }}
          onConfirm={handleDeleteConfirm}
          title="Delete Role"
          description="Are you sure you want to delete this role? This action cannot be undone."
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
