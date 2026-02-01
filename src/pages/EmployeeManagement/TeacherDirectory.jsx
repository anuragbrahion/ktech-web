/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Edit2,
  Eye,
  Search,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Building,
  Briefcase,
  Lock,
  EyeOff,
  EyeIcon,
} from "lucide-react";
import { toast } from "react-toastify";
import Table from "../../components/Atoms/TableData/TableData";
import {
  teachersList,
  enableDisableTeachers,
  updateTeachers,
  departmentsAllDocuments,
  designationsAllDocuments,
  updateTeachersPassword,
} from "../../redux/slices/employee";

const TeacherModal = ({ teacher, onSave, onClose, mode = "edit" }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNo: "",
    address: "",
    department: "",
    designation: "",
    dateOfBirth: "",
    dateOfJoining: "",
  });

  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const departmentsData = useSelector(
    (state) => state.employee?.departmentsAllDocumentsData,
  );
  const designationsData = useSelector(
    (state) => state.employee?.designationsAllDocumentsData,
  );

  useEffect(() => {
    if (teacher) {
      setFormData({
        name: teacher.name || "",
        email: teacher.email || "",
        phoneNo: teacher.phoneNo || "",
        address: teacher.address || "",
        department: teacher.department?._id || "",
        designation: teacher.designation?._id || "",
        dateOfBirth: teacher.dateOfBirth
          ? teacher.dateOfBirth.split("T")[0]
          : "",
        dateOfJoining: teacher.dateOfJoining
          ? teacher.dateOfJoining.split("T")[0]
          : "",
      });
    }
  }, [teacher]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      dispatch(departmentsAllDocuments()),
      dispatch(designationsAllDocuments()),
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.phoneNo ||
      !formData.department ||
      !formData.designation
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    const payload = {
      _id: teacher._id,
      name: formData.name,
      email: formData.email,
      phoneNo: Number(formData.phoneNo),
      address: formData.address,
      department: formData.department,
      designation: formData.designation,
      dateOfBirth: formData.dateOfBirth
        ? `${formData.dateOfBirth}T00:00:00.000Z`
        : null,
      dateOfJoining: formData.dateOfJoining
        ? `${formData.dateOfJoining}T00:00:00.000Z`
        : null,
    };

    onSave(payload);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === "view" ? "Teacher Details" : "Update Teacher"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {mode === "view" ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium text-gray-900">{formData.name}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">
                      {formData.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">
                      {formData.phoneNo}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Building className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Department</p>
                    <p className="font-medium text-gray-900">
                      {formData.department?.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Briefcase className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Designation</p>
                    <p className="font-medium text-gray-900">
                      {formData.designation?.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Date of Birth</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(formData.dateOfBirth)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Date of Joining</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(formData.dateOfJoining)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium text-gray-900">
                    {formData.address}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter email address"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phoneNo"
                    value={formData.phoneNo}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter phone number"
                    required
                  />
                </div>

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
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Joining
                  </label>
                  <input
                    type="date"
                    name="dateOfJoining"
                    value={formData.dateOfJoining}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-h-[100px]"
                  placeholder="Enter full address"
                />
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
                    !formData.email ||
                    !formData.phoneNo ||
                    !formData.department ||
                    !formData.designation
                  }
                >
                  Update Teacher
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const PasswordUpdateModal = ({ teacher, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.password || !formData.confirmPassword) {
      toast.error("Please fill all password fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    const payload = {
      _id: teacher._id,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    };

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Update Password
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
                  New Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter new password"
                    required
                    minLength="8"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Password must be at least 8 characters long
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Confirm new password"
                    required
                    minLength="8"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
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
                disabled={
                  loading ||
                  !formData.password ||
                  !formData.confirmPassword ||
                  formData.password !== formData.confirmPassword
                }
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default function TeacherDirectory() {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [modalMode, setModalMode] = useState("view"); // 'view' or 'edit'
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    search: "",
    department: "",
  });
  const [loading, setLoading] = useState(false);

  const teachersListData = useSelector(
    (state) => state.employee?.teachersListData,
  );
  const enableDisableData = useSelector(
    (state) => state.employee?.enableDisableTeachersData,
  );
  const updateData = useSelector((state) => state.employee?.updateTeachersData);
  const departmentsData = useSelector(
    (state) => state.employee?.departmentsAllDocumentsData,
  );

  useEffect(() => {
    fetchTeachers();
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (!showModal) {
      fetchTeachers();
    }
  }, [currentPage, enableDisableData, updateData]);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordTeacher, setPasswordTeacher] = useState(null);

  const handleUpdatePassword = (teacher) => {
    setPasswordTeacher(teacher);
    setShowPasswordModal(true);
  };

  const handleSavePassword = (formData) => {
    setLoading(true);
    dispatch(updateTeachersPassword(formData)).then((action) => {
      if (!action.error) {
        toast.success("Password updated successfully");
        setShowPasswordModal(false);
        setPasswordTeacher(null);
      } else {
        toast.error(action.payload || "Failed to update password");
      }
      setLoading(false);
    });
  };

  const fetchTeachers = () => {
    setLoading(true);
    const params = {
      page: currentPage,
      size: itemsPerPage,
      ...(filters.search && { search: filters.search }),
      ...(filters.department && { department: filters.department }),
    };

    dispatch(teachersList(params)).then((action) => {
      if (action.error) {
        toast.error(action.payload || "Failed to fetch teachers");
      }
      setLoading(false);
    });
  };

  const fetchDepartments = () => {
    dispatch(departmentsAllDocuments());
  };

  const handleViewTeacher = (teacher) => {
    setSelectedTeacher(teacher);
    setModalMode("view");
    setShowModal(true);
  };

  const handleEditTeacher = (teacher) => {
    setSelectedTeacher(teacher);
    setModalMode("edit");
    setShowModal(true);
  };

  const handleStatusToggle = (teacher) => {
    const newStatus = !teacher.status;
    if (
      window.confirm(
        `Are you sure you want to ${newStatus ? "activate" : "deactivate"} this teacher?`,
      )
    ) {
      setLoading(true);
      const payload = {
        _id: teacher._id,
        status: newStatus,
      };
      dispatch(enableDisableTeachers(payload)).then((action) => {
        if (!action.error) {
          toast.success(
            `Teacher ${newStatus ? "activated" : "deactivated"} successfully`,
          );
          fetchTeachers();
        } else {
          toast.error(action.payload || "Failed to update status");
        }
        setLoading(false);
      });
    }
  };

  const handleSaveTeacher = (formData) => {
    setLoading(true);
    dispatch(updateTeachers(formData)).then((action) => {
      if (!action.error) {
        toast.success("Teacher updated successfully");
        setShowModal(false);
        setSelectedTeacher(null);
        fetchTeachers();
      } else {
        toast.error(action.payload || "Failed to update teacher");
      }
      setLoading(false);
    });
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleFilter = () => {
    setCurrentPage(1);
    fetchTeachers();
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      department: "",
    });
    setCurrentPage(1);
    fetchTeachers();
  };

  const getStatusColor = (status) => {
    return status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const teachers = teachersListData?.data?.data?.list || [];
  const totalTeachers = teachersListData?.data?.data?.total || 0;
  const totalPages = Math.ceil(totalTeachers / itemsPerPage);

  const departments = departmentsData?.data?.data?.list || [];

  const tableHeaders = [
    "Staff Name",
    "Phone No.",
    "Department",
    "Designation",
    "Status",
    "Date Of Joining",
    "Actions",
  ];

  const tableData = teachers.map((teacher) => [
    <div className="font-medium text-gray-900">{teacher.name}</div>,
    <div className="text-gray-700">{teacher.phoneNo}</div>,
    <div className="text-gray-700">{teacher.department?.name}</div>,
    <div className="text-gray-700">{teacher.designation?.name}</div>,
    <div className="flex items-center">
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(teacher.status)}`}
      >
        {teacher.status ? "Active" : "Inactive"}
      </span>
      <div className="ml-3 relative inline-block w-10 align-middle select-none">
        <input
          type="checkbox"
          checked={teacher.status}
          onChange={() => handleStatusToggle(teacher)}
          className="sr-only"
          id={`toggle-teacher-${teacher._id}`}
          disabled={loading}
        />
        <label
          htmlFor={`toggle-teacher-${teacher._id}`}
          className={`block overflow-hidden h-6 rounded-full cursor-pointer ${teacher.status ? "bg-green-500" : "bg-gray-300"}`}
        >
          <span
            className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${teacher.status ? "translate-x-4" : "translate-x-0"}`}
          />
        </label>
      </div>
    </div>,
    <div className="text-gray-700">{formatDate(teacher.dateOfJoining)}</div>,
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleViewTeacher(teacher)}
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
        title="View Details"
        disabled={loading}
      >
        <Eye className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleEditTeacher(teacher)}
        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
        title="Edit"
        disabled={loading}
      >
        <Edit2 className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleUpdatePassword(teacher)}
        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition"
        title="Update Password"
        disabled={loading}
      >
        <Lock className="w-4 h-4" />
      </button>
    </div>,
  ]);

  return (
    <div className="">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Teacher Directory List
        </h1>
        <p className="text-gray-600 mt-2">Manage all teaching staff members</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Filter Teachers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Search by name, phone, or designation..."
                disabled={loading}
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>
            <select
              value={filters.department}
              onChange={(e) => handleFilterChange("department", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
              disabled={loading}
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end gap-2">
            <button
              onClick={handleFilter}
              className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Loading..." : "Filter"}
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
      {loading && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading teachers...</span>
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
            total={totalTeachers}
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
        </div>
      )}

      {showModal && (
        <TeacherModal
          teacher={selectedTeacher}
          onSave={handleSaveTeacher}
          onClose={() => {
            setShowModal(false);
            setSelectedTeacher(null);
          }}
          mode={modalMode}
        />
      )}
      {showPasswordModal && (
        <PasswordUpdateModal
          teacher={passwordTeacher}
          onSave={handleSavePassword}
          onClose={() => {
            setShowPasswordModal(false);
            setPasswordTeacher(null);
          }}
        />
      )}
    </div>
  );
}
