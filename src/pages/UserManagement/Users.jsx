import React, { useState } from 'react';
import { Calendar, Eye, Edit2, Trash2 } from 'lucide-react';
import Table from '../../components/Atoms/TableData/TableData';

const Users = () => {
  // Dummy user data
  const [users, setUsers] = useState([
    {
      id: 1,
      userName: "irfan gulammuslufa palel",
      referralCode: "95c80dac8irla",
      role: "Teacher",
      phoneNo: "9879867620",
      status: "Active",
      createdAt: "05/12/2025",
      email: "irfan@example.com",
      address: "123 Main Street",
      salary: "50000",
      password: "********",
      dob: "01/15/1990",
      doj: "01/01/2023"
    },
    {
      id: 2,
      userName: "Husen",
      referralCode: "40:721t08a4c5",
      role: "Teacher",
      phoneNo: "9638902418",
      status: "Active",
      createdAt: "04/12/2025",
      email: "husen@example.com",
      address: "456 Oak Avenue",
      salary: "55000",
      password: "********",
      dob: "03/22/1988",
      doj: "02/15/2023"
    },
    {
      id: 3,
      userName: "Hasim Mohsin Shakhi",
      referralCode: "8066acc10646",
      role: "Teacher",
      phoneNo: "9328329381",
      status: "Inactive",
      createdAt: "03/12/2025",
      email: "hasim@example.com",
      address: "789 Pine Road",
      salary: "60000",
      password: "********",
      dob: "07/10/1985",
      doj: "03/01/2023"
    },
    {
      id: 4,
      userName: "rahul",
      referralCode: "949a84cf1d04",
      role: "Student",
      phoneNo: "9898379375",
      status: "Active",
      createdAt: "30/11/2025",
      email: "rahul@example.com",
      address: "321 Elm Street",
      salary: "N/A",
      password: "********",
      dob: "11/05/2000",
      doj: "08/15/2023"
    },
    {
      id: 5,
      userName: "Tanzila",
      referralCode: "86d26cb901ba",
      role: "Student",
      phoneNo: "9899989698",
      status: "Active",
      createdAt: "24/11/2025",
      email: "tanzila@example.com",
      address: "654 Maple Lane",
      salary: "N/A",
      password: "********",
      dob: "09/18/2001",
      doj: "09/01/2023"
    },
    {
      id: 6,
      userName: "Husen",
      referralCode: "09ebc584b22e",
      role: "Student",
      phoneNo: "9638902418",
      status: "Inactive",
      createdAt: "24/11/2025",
      email: "husen2@example.com",
      address: "987 Cedar Blvd",
      salary: "N/A",
      password: "********",
      dob: "04/30/2002",
      doj: "10/15/2023"
    }
  ]);

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [filters, setFilters] = useState({
    userName: '',
    referralCode: '',
    role: '',
    phoneNo: '',
    status: 'all'
  });

  // Form state
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    phoneNo: '',
    address: '',
    salary: '',
    role: '',
    password: '',
    dob: '',
    doj: ''
  });

  // Attendance form state
  const [attendanceForm, setAttendanceForm] = useState({
    name: '',
    status: '',
    date: ''
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter users
  const filteredUsers = users.filter(user => {
    return (
      (filters.userName === '' || user.userName.toLowerCase().includes(filters.userName.toLowerCase())) &&
      (filters.referralCode === '' || user.referralCode.toLowerCase().includes(filters.referralCode.toLowerCase())) &&
      (filters.role === '' || user.role === filters.role) &&
      (filters.phoneNo === '' || user.phoneNo.includes(filters.phoneNo)) &&
      (filters.status === 'all' || user.status === filters.status)
    );
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Open Add User Modal
  const handleAddUser = () => {
    setShowAddUserModal(true);
    setIsEditMode(false);
    setUserForm({
      name: '',
      email: '',
      phoneNo: '',
      address: '',
      salary: '',
      role: '',
      password: '',
      dob: '',
      doj: ''
    });
  };

  // Open Edit User Modal
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsEditMode(true);
    setShowAddUserModal(true);
    setUserForm({
      name: user.userName,
      email: user.email,
      phoneNo: user.phoneNo,
      address: user.address,
      salary: user.salary,
      role: user.role,
      password: user.password,
      dob: user.dob,
      doj: user.doj
    });
  };

  // Open Attendance Modal
  const handleViewAttendance = (user) => {
    setSelectedUser(user);
    setAttendanceForm({
      name: user.userName,
      status: '',
      date: ''
    });
    setShowAttendanceModal(true);
  };

  // Handle User Form Submit
  const handleUserSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      // Update existing user
      const updatedUsers = users.map(user => 
        user.id === selectedUser.id 
          ? { 
              ...user, 
              userName: userForm.name,
              email: userForm.email,
              phoneNo: userForm.phoneNo,
              address: userForm.address,
              salary: userForm.salary,
              role: userForm.role,
              password: userForm.password,
              dob: userForm.dob,
              doj: userForm.doj
            }
          : user
      );
      setUsers(updatedUsers);
    } else {
       const newUser = {
        id: users.length + 1,
        userName: userForm.name,
        referralCode: Math.random().toString(36).substr(2, 12),
        role: userForm.role,
        phoneNo: userForm.phoneNo,
        status: "Active",
        createdAt: new Date().toLocaleDateString('en-GB'),
        email: userForm.email,
        address: userForm.address,
        salary: userForm.salary,
        password: userForm.password,
        dob: userForm.dob,
        doj: userForm.doj
      };
      setUsers([...users, newUser]);
    }
    setShowAddUserModal(false);
  };

  // Handle Attendance Submit
  const handleAttendanceSubmit = (e) => {
    e.preventDefault();
    console.log('Attendance submitted:', attendanceForm);
    // Here you would typically save attendance data
    setShowAttendanceModal(false);
  };

  // Handle Delete User
  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
    }
  };

  // Handle Filter Change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Handle Status Filter Change
  const handleStatusFilter = (status) => {
    setFilters(prev => ({
      ...prev,
      status
    }));
    setCurrentPage(1);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleColor = (role) => {
    switch(role) {
      case 'Teacher':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Student':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const tableHeaders = ['S.No', 'User Name', 'Referral Code', 'Role', 'Phone No.', 'Status', 'Created At', 'Actions'];

  return (
    <div className="container mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
        <p className="text-gray-600 mt-2">Manage your users and their details</p>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="mb-6">
          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={() => handleStatusFilter('all')}
              className={`px-4 py-2 rounded-md font-medium ${
                filters.status === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Users
            </button>
            <button
              onClick={() => handleStatusFilter('Active')}
              className={`px-4 py-2 rounded-md font-medium ${
                filters.status === 'Active' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => handleStatusFilter('Inactive')}
              className={`px-4 py-2 rounded-md font-medium ${
                filters.status === 'Inactive' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Inactive
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User Name</label>
              <select 
                name="userName"
                value={filters.userName}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">--- no select ---</option>
                {[...new Set(users.map(u => u.userName))].map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Referral Code</label>
              <select 
                name="referralCode"
                value={filters.referralCode}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">--- no select ---</option>
                {[...new Set(users.map(u => u.referralCode))].map(code => (
                  <option key={code} value={code}>{code}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select 
                name="role"
                value={filters.role}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">--- no select ---</option>
                <option value="Teacher">Teacher</option>
                <option value="Student">Student</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone No.</label>
              <select 
                name="phoneNo"
                value={filters.phoneNo}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">--- no select ---</option>
                {[...new Set(users.map(u => u.phoneNo))].map(phone => (
                  <option key={phone} value={phone}>{phone}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex justify-end">
          <button 
            onClick={handleAddUser}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
          >
            <span className="mr-2">+</span> Add New User
          </button>
        </div>
        </div>

        {/* Table using Table component */}
        <div className="overflow-x-auto">
          <Table
            headers={tableHeaders}
            data={currentUsers}
            renderRow={(user, index) => (
              <tr 
                key={user.id} 
                className={`hover:bg-blue-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
              >
                <td className="py-4 px-4 text-center">
                  <div className="font-medium text-gray-800">{startIndex + index + 1}</div>
                </td>
                <td className="py-4 px-4">
                  <div className="font-medium text-gray-800">{user.userName}</div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-gray-700 font-mono text-sm">{user.referralCode}</div>
                </td>
                <td className="py-4 px-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                </td>
                <td className="py-4 px-4 text-gray-700">{user.phoneNo}</td>
                <td className="py-4 px-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getStatusColor(user.status)}`}>
                    {user.status}
                  </span>
                </td>
                <td className="py-4 px-4 text-gray-700">{user.createdAt}</td>
                <td className="py-4 px-4">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEditUser(user)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    <button 
                      onClick={() => handleViewAttendance(user)}
                      className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                      title="View Attendance"
                    >
                      <Calendar size={18} />
                    </button>
                    <button 
                      onClick={() => handleEditUser(user)}
                      className="text-yellow-600 hover:text-yellow-900 p-1 rounded hover:bg-yellow-50"
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            )}
          />
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">👤</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No users found</h3>
            <p className="text-gray-500">
              {filters.status !== 'all' 
                ? `No ${filters.status.toLowerCase()} users available` 
                : "No users found matching your criteria."}
            </p>
          </div>
        )}

        {/* Pagination */}
        {filteredUsers.length > 0 && (
          <div className="flex flex-col md:flex-row justify-between items-center mt-6 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-600 mb-4 md:mb-0">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 ${
                  currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700'
                }`}
              >
                Previous
              </button>
              
              <div className="flex items-center space-x-2">
                {Array.from({ length: Math.min(4, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 4) {
                    pageNum = i + 1;
                  } else if (currentPage <= 2) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 1) {
                    pageNum = totalPages - 3 + i;
                  } else {
                    pageNum = currentPage - 1 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-8 h-8 flex items-center justify-center rounded-md ${
                        currentPage === pageNum
                          ? 'bg-blue-500 text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                {totalPages > 4 && currentPage < totalPages - 2 && (
                  <>
                    <span className="text-gray-500">...</span>
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      className={`w-8 h-8 flex items-center justify-center rounded-md ${
                        currentPage === totalPages
                          ? 'bg-blue-500 text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>
              
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 ${
                  currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals remain the same */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  {isEditMode ? 'Edit User' : 'Add User'}
                </h2>
                <button 
                  onClick={() => setShowAddUserModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleUserSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={userForm.name}
                      onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={userForm.email}
                      onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone No.</label>
                    <input
                      type="tel"
                      value={userForm.phoneNo}
                      onChange={(e) => setUserForm({...userForm, phoneNo: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      value={userForm.address}
                      onChange={(e) => setUserForm({...userForm, address: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                    <input
                      type="text"
                      value={userForm.salary}
                      onChange={(e) => setUserForm({...userForm, salary: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                      value={userForm.role}
                      onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select...</option>
                      <option value="Teacher">Teacher</option>
                      <option value="Student">Student</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                      type="password"
                      value={userForm.password}
                      onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">D.O.B.</label>
                    <input
                      type="text"
                      value={userForm.dob}
                      onChange={(e) => setUserForm({...userForm, dob: e.target.value})}
                      placeholder="mm/dd/yyyy"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">D.O.J.</label>
                    <input
                      type="text"
                      value={userForm.doj}
                      onChange={(e) => setUserForm({...userForm, doj: e.target.value})}
                      placeholder="mm/dd/yyyy"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddUserModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {isEditMode ? 'Update User' : 'Add User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showAttendanceModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4"># Attendance Details</h2>
              
              <form onSubmit={handleAttendanceSubmit}>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={attendanceForm.name}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="absolute right-3 top-2">
                        <input type="checkbox" className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={attendanceForm.status}
                      onChange={(e) => setAttendanceForm({...attendanceForm, status: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select...</option>
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                      <option value="Late">Late</option>
                      <option value="Half Day">Half Day</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="text"
                      value={attendanceForm.date}
                      onChange={(e) => setAttendanceForm({...attendanceForm, date: e.target.value})}
                      placeholder="mm/dd/yyyy"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAttendanceModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;