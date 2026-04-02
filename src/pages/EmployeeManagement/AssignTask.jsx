/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Search } from "lucide-react";
import { toast } from "react-toastify";
import Table from "../../components/Atoms/TableData/TableData";
import {
  teachersList,
  designationsAllDocuments,
} from "../../redux/slices/employee";
import Loader from "../../components/Loader/Loader";
import { assignEmployeeTeacherTask } from "../../redux/slices/examination";

export default function AssignTask({ adminId }) {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    search: "",
    designation: "",
  });
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
  });
  const [errors, setErrors] = useState({
    title: "",
    description: "",
  });

  const teachersListData = useSelector(
    (state) => state.employee?.teachersListData,
  );

  const designationsData = useSelector(
    (state) => state.employee?.designationsAllDocumentsData,
  );

  // ✅ Fetch Teachers
  const fetchTeachers = () => {
    setLoading(true);

    const params = {
      page: currentPage,
      size: itemsPerPage,
      ...(filters.search && { keyWord: filters.search }),
    };

    const query = { adminId };

    if (filters.designation !== "") {
      query.designation = filters.designation;
    }

    params.query = JSON.stringify(query);

    dispatch(teachersList(params)).then((action) => {
      if (action.error) {
        toast.error(action.payload || "Failed to fetch teachers");
      }
      setLoading(false);
    });
  };

  // ✅ Initial Load
  useEffect(() => {
    fetchTeachers();
    dispatch(designationsAllDocuments());
  }, []);

  // ✅ Pagination change
  useEffect(() => {
    fetchTeachers();
  }, [currentPage]);

  const teachers = teachersListData?.data?.data?.list || [];
  const totalTeachers = teachersListData?.data?.data?.total || 0;
  const totalPages = Math.ceil(totalTeachers / itemsPerPage);

  const designations = designationsData?.data?.data?.list || [];

  const getStatusColor = (status) => {
    return status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const handleAssignTask = (teacher) => {
    setSelectedTeacher(teacher);
    setTaskForm({ title: "", description: "" });
    setIsModalOpen(true);
  };

  const handleSubmitTask = async () => {
    const newErrors = {
      title: "",
      description: "",
    };

    let isValid = true;

    if (!taskForm.title.trim()) {
      newErrors.title = "Title is required";
      isValid = false;
    }

    if (!taskForm.description.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) return;

    const payload = {
      teacherId: selectedTeacher?._id,
      title: taskForm.title,
      description: taskForm.description,
    };

    setLoading(true);

    try {
      const response = await dispatch(
        assignEmployeeTeacherTask(payload),
      ).unwrap();
      if (!response.error) {
        toast.success(response.message || "Task assigned successfully");
        setIsModalOpen(false);
      } else {
        toast.error(response.message || "Failed to assign task");
      }

    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to assign task");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Table Headers
  const tableHeaders = [
    "Name",
    "Phone",
    "Department",
    "Designation",
    "Status",
    "Joining Date",
    "Action",
  ];

  // ✅ Table Data
  const tableData = teachers.map((teacher) => [
    <div className="font-medium text-gray-900">{teacher.name}</div>,
    <div>{teacher.phoneNo}</div>,
    <div>{teacher.department?.name}</div>,
    <div>{teacher.designation?.name}</div>,
    <span
      className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
        teacher.status,
      )}`}
    >
      {teacher.status ? "Active" : "Inactive"}
    </span>,
    <div>{formatDate(teacher.dateOfJoining)}</div>,

    <button
      onClick={() => handleAssignTask(teacher)}
      className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
    >
      Assign Task
    </button>,
  ]);

  return (
    <>
      <Loader loading={loading} />
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Assign Task</h1>
        <p className="text-gray-500 text-sm">
          Manage and assign tasks to teachers
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white border rounded-xl p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              placeholder="Search teacher..."
              className="w-full px-4 py-2 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          {/* Designation */}
          <select
            value={filters.designation}
            onChange={(e) =>
              setFilters({ ...filters, designation: e.target.value })
            }
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Designations</option>
            {designations.map((des) => (
              <option key={des._id} value={des._id}>
                {des.name}
              </option>
            ))}
          </select>

          {/* Apply */}
          <button
            onClick={() => {
              setCurrentPage(1);
              fetchTeachers();
            }}
            className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border p-4">
        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : (
          <Table
            headers={tableHeaders}
            data={tableData}
            currentPage={currentPage}
            size={itemsPerPage}
            handlePageChange={setCurrentPage}
            total={totalTeachers}
            totalPages={totalPages}
            renderRow={(row, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                {row.map((cell, i) => (
                  <td key={i} className="px-4 py-3">
                    {cell}
                  </td>
                ))}
              </tr>
            )}
          />
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Assign Task</h2>

            {/* Title */}
            <div className="mb-4">
              <label className="text-sm text-gray-600">
                Title<em className="text-red-500">*</em>
              </label>
              <input
                type="text"
                value={taskForm.title}
                onChange={(e) => {
                  setTaskForm({ ...taskForm, title: e.target.value });
                  setErrors({ ...errors, title: "" });
                }}
                className={`w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 ${
                  errors.title
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-indigo-500"
                }`}
                placeholder="Enter task title"
              />
              {errors.title && (
                <p className="text-xs text-red-500 mt-1">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="text-sm text-gray-600">
                Description<em className="text-red-500">*</em>
              </label>
              <textarea
                value={taskForm.description}
                onChange={(e) => {
                  setTaskForm({ ...taskForm, description: e.target.value });
                  setErrors({ ...errors, description: "" });
                }}
                rows={4}
                className={`w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 ${
                  errors.description
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-indigo-500"
                }`}
                placeholder="Enter task description"
              />
              {errors.description && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitTask}
                className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
