/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Edit2, CheckCircle, XCircle, Trash2, Plus } from "lucide-react";
import Table from "../../components/Atoms/TableData/TableData";
import {
  usersList,
  createUsers,
  updateUsers,
  enableDisableUsers,
  departmentsAllDocuments,
  designationsAllDocuments,
} from "../../redux/slices/employee";

const Users = ({ roleData, adminId }) => {
  const dispatch = useDispatch();
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    name: "",
    role: "",
    status: "all",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const usersData = useSelector(
    (state) =>
      state.employee.usersListData?.data?.data || { list: [], total: 0 },
  );

  const { designationsAllDocumentsData, departmentsAllDocumentsData } =
    useSelector((state) => state.employee);
  const fetchUsers = () => {
    const payload = {
      page: currentPage,
      size: itemsPerPage,
    };

    const query = {};

    if (roleData === "admin") {
      query.adminId = adminId;
    }

    if (filters.name !== "") query.name = filters.name;
    if (filters.role !== "") query.role = filters.role;
    if (filters.status !== "all") {
      query.status = filters.status === "active";
    }

    payload.query = JSON.stringify(query);

    dispatch(usersList(payload));
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, roleData, adminId, filters]);

  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    phoneNo: "",
    address: "",
    salary: "",
    role: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    dateOfJoining: "",
    amount: "0",
    department: "",
    designation: "",
  });

  const totalPages = Math.ceil(usersData?.total / itemsPerPage) || 1;
  const currentUsers = usersData?.list || [];

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleAddUser = () => {
    setShowAddUserModal(true);
    setIsEditMode(false);
    setUserForm({
      name: "",
      email: "",
      phoneNo: "",
      address: "",
      salary: "",
      role: "Teacher",
      password: "",
      confirmPassword: "",
      dateOfBirth: "",
      dateOfJoining: "",
      amount: "0",
      department: "",
      designation: "",
    });
    dispatch(departmentsAllDocuments({ select: "name" }));
    dispatch(designationsAllDocuments({ select: "name" }));
  };

  const handleEditUser = (user) => {
    console.log("user", user);
    setSelectedUser(user);
    setIsEditMode(true);
    setShowAddUserModal(true);
    setUserForm({
      name: user.name || "",
      email: user.email || "",
      phoneNo: user.phoneNo?.toString() || "",
      address: user.address || "",
      salary: user.salary?.toString() || "0",
      role: user.role || "",
      password: "",
      confirmPassword: "",
      dateOfBirth: user.dateOfBirth
        ? new Date(user.dateOfBirth).toISOString().split("T")[0]
        : "",
      dateOfJoining: user.dateOfJoining
        ? new Date(user.dateOfJoining).toISOString().split("T")[0]
        : "",
      amount: user.amount?.toString() || "0",
      department: user?.department?._id || "",
      designation: user?.designation?._id || "",
    });
    dispatch(departmentsAllDocuments());
    dispatch(designationsAllDocuments());
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name: userForm.name,
      email: userForm.email,
      phoneNo: parseInt(userForm.phoneNo),
      address: userForm.address,
      role: userForm.role,
      dateOfBirth: userForm.dateOfBirth
        ? new Date(userForm.dateOfBirth).toISOString()
        : null,
      dateOfJoining: userForm.dateOfJoining
        ? new Date(userForm.dateOfJoining).toISOString()
        : null,
      amount: parseFloat(userForm.amount),
      salary: parseFloat(userForm.salary),
    };

    if (!isEditMode) {
      payload.password = userForm.password;
      payload.confirmPassword = userForm.confirmPassword;
    }

    if (userForm.role === "Teacher") {
      payload.department = userForm.department;
      payload.designation = userForm.designation;
    }

    try {
      if (isEditMode && selectedUser) {
        payload._id = selectedUser._id;
        await dispatch(updateUsers(payload)).unwrap();
      } else {
        await dispatch(createUsers(payload)).unwrap();
      }

      fetchUsers();
      setShowAddUserModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error saving user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (user) => {
    const newStatus = !user.status;
    const actionText = newStatus ? "enable" : "disable";
    if (window.confirm(`Are you sure you want to ${actionText} this user?`)) {
      try {
        const payload = {
          _id: user._id,
          status: newStatus,
        };

        await dispatch(enableDisableUsers(payload)).unwrap();
        fetchUsers();
      } catch (error) {
        console.error("Error toggling user status:", error);
      }
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCurrentPage(1);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case true:
        return "bg-green-100 text-green-800 border-green-200";
      case false:
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "Teacher":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Admin":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  const formatCurrency = (amount) => {
    if (!amount) return "₹0";
    return `₹${parseFloat(amount).toLocaleString("en-IN")}`;
  };

  const tableHeaders = [
    "Name",
    "Email",
    "Phone No.",
    "Role",
    "Status",
    "DOJ",
    "Salary",
    "Actions",
  ];

  return (
    <>
      <div className="mb-8 flex justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-600 mt-2">
            Manage all users and their details
          </p>
        </div>

        <div className="flex justify-end items-center mb-6">
          <button
            onClick={handleAddUser}
            className="px-6 py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-all shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-50"
            disabled={loading}
          >
            <span>Add User</span>
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {/* Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          {/* Status Tabs */}
          <div className="flex gap-2 bg-gray-100 p-1 rounded-lg w-fit">
            {["all", "active", "inactive"].map((status) => (
              <button
                key={status}
                onClick={() => setFilters({ ...filters, status })}
                className={`px-4 py-1.5 text-sm rounded-md font-medium transition ${
                  filters.status === status
                    ? status === "active"
                      ? "bg-green-500 text-white"
                      : status === "inactive"
                        ? "bg-red-500 text-white"
                        : "bg-blue-500 text-white"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <input
              type="text"
              name="name"
              value={filters.name}
              onChange={handleFilterChange}
              placeholder="Search user..."
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />

            {roleData === "superadmin" && (
              <select
                name="role"
                value={filters.role}
                onChange={handleFilterChange}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="Teacher">Teacher</option>
              </select>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <Table
            headers={tableHeaders}
            data={currentUsers}
            renderRow={(user) => (
              <tr
                key={user._id}
                className="border-b last:border-none hover:bg-gray-50 transition"
              >
                

                <td className="px-4 py-3 font-medium text-gray-800 capitalize">
                  {user.name || "N/A"}
                </td>

                <td className="px-4 py-3 text-gray-600">
                  {user.email || "N/A"}
                </td>

                <td className="px-4 py-3 text-gray-600">
                  {user.phoneNo || "N/A"}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${getRoleColor(user.role)}`}
                  >
                    {user.role || "N/A"}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${getStatusColor(user.status)}`}
                  >
                    {user.status ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="px-4 py-3 text-gray-600">
                  {formatDate(user.dateOfJoining)}
                </td>

                <td className="px-4 py-3 font-medium text-gray-800">
                  {formatCurrency(user.salary)}
                </td>

                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                    >
                      <Edit2 size={16} />
                    </button>

                    <button
                      onClick={() => handleToggleStatus(user)}
                      className={`p-2 rounded-lg transition ${
                        user.status
                          ? "text-yellow-600 hover:bg-yellow-50"
                          : "text-green-600 hover:bg-green-50"
                      }`}
                    >
                      {user.status ? (
                        <XCircle size={16} />
                      ) : (
                        <CheckCircle size={16} />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            )}
          />
        </div>

        {/* Empty State */}
        {currentUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-3xl mb-2">👤</div>
            <p className="text-gray-500 text-sm">
              {filters.status !== "all"
                ? `No ${filters.status} users`
                : "No users found"}
            </p>
          </div>
        )}

        {/* Pagination */}
        {usersData.total > 0 && (
          <div className="flex flex-col md:flex-row justify-between items-center mt-6 pt-4 border-t gap-4">
            <p className="text-sm text-gray-500">
              {(currentPage - 1) * itemsPerPage + 1} -{" "}
              {Math.min(currentPage * itemsPerPage, usersData.total)} of{" "}
              {usersData.total}
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded-md text-sm disabled:opacity-40"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`w-8 h-8 text-sm rounded-md ${
                    currentPage === i + 1
                      ? "bg-blue-500 text-white"
                      : "border text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded-md text-sm disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {showAddUserModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  {isEditMode ? "Edit User" : "Add User"}
                </h2>
                <button
                  onClick={() => {
                    setShowAddUserModal(false);
                    setSelectedUser(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleUserSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={userForm.name}
                      onChange={(e) =>
                        setUserForm({ ...userForm, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={userForm.email}
                      onChange={(e) =>
                        setUserForm({ ...userForm, email: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={userForm.phoneNo}
                      onChange={(e) =>
                        setUserForm({ ...userForm, phoneNo: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address *
                    </label>
                    <input
                      type="text"
                      value={userForm.address}
                      onChange={(e) =>
                        setUserForm({ ...userForm, address: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role *
                    </label>
                    <select
                      value={userForm.role}
                      onChange={(e) =>
                        setUserForm({ ...userForm, role: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      disabled={loading || roleData !== "superadmin"}
                    >
                      <option value="">Select Role</option>
                      <option value="Admin">Admin</option>
                      <option value="Teacher">Teacher</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Salary (₹) *
                    </label>
                    <input
                      type="number"
                      value={userForm.salary}
                      onChange={(e) =>
                        setUserForm({ ...userForm, salary: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      disabled={loading}
                    />
                  </div>

                  {!isEditMode && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Password *
                        </label>
                        <input
                          type="password"
                          value={userForm.password}
                          onChange={(e) =>
                            setUserForm({
                              ...userForm,
                              password: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                          disabled={loading}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Confirm Password *
                        </label>
                        <input
                          type="password"
                          value={userForm.confirmPassword}
                          onChange={(e) =>
                            setUserForm({
                              ...userForm,
                              confirmPassword: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                          disabled={loading}
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={userForm.dateOfBirth}
                      onChange={(e) =>
                        setUserForm({
                          ...userForm,
                          dateOfBirth: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Joining
                    </label>
                    <input
                      type="date"
                      value={userForm.dateOfJoining}
                      onChange={(e) =>
                        setUserForm({
                          ...userForm,
                          dateOfJoining: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount
                    </label>
                    <input
                      type="number"
                      value={userForm.amount}
                      onChange={(e) =>
                        setUserForm({ ...userForm, amount: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={loading}
                    />
                  </div>

                  {userForm.role === "Teacher" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Department ID
                        </label>
                        <select
                          value={userForm.department}
                          onChange={(e) =>
                            setUserForm({
                              ...userForm,
                              department: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={loading}
                        >
                          <option value="">Select Department</option>
                          {departmentsAllDocumentsData?.data?.data?.list.map(
                            (department) => (
                              <option
                                key={department._id}
                                value={department._id}
                              >
                                {department.name}
                              </option>
                            ),
                          )}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Designation ID
                        </label>
                        <select
                          value={userForm.designation}
                          onChange={(e) =>
                            setUserForm({
                              ...userForm,
                              designation: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={loading}
                        >
                          <option value="">Select Designation</option>
                          {designationsAllDocumentsData?.data?.data?.list.map(
                            (designation) => (
                              <option
                                key={designation._id}
                                value={designation._id}
                              >
                                {designation.name}
                              </option>
                            ),
                          )}
                        </select>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddUserModal(false);
                      setSelectedUser(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                  >
                    {loading
                      ? "Processing..."
                      : isEditMode
                        ? "Update User"
                        : "Add User"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Users;
