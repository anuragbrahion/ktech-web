import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Edit2, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import Table from '../../components/Atoms/TableData/TableData'; 
import { usersList, createUsers, updateUsers, enableDisableUsers } from '../../redux/slices/employee';

const Users = () => {
  const dispatch = useDispatch();
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    name: '',
    role: '',
    status: 'all'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const usersData = useSelector(state => state.employee.usersListData?.data?.data || { list: [], total: 0 });

  useEffect(() => {
    dispatch(usersList({ page: currentPage, size: itemsPerPage }));
  }, [dispatch, currentPage]);

  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    phoneNo: '',
    address: '',
    salary: '',
    role: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    dateOfJoining: '',
    amount: '0',
    department: '',
    designation: ''
  });

  const filteredUsers = usersData?.list?.filter(user => {
    const statusMatch = filters.status === 'all' || 
      (filters.status === 'active' && user.status === true) || 
      (filters.status === 'inactive' && user.status === false);
    
    return (
      (filters.name === '' || (user.name && user.name.toLowerCase().includes(filters.name.toLowerCase()))) &&
      (filters.role === '' || user.role === filters.role) &&
      statusMatch
    );
  }) || [];

  const totalPages = Math.ceil(usersData?.total / itemsPerPage) || 1;
  const currentUsers = filteredUsers;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

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
      confirmPassword: '',
      dateOfBirth: '',
      dateOfJoining: '',
      amount: '0',
      department: '',
      designation: ''
    });
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsEditMode(true);
    setShowAddUserModal(true);
    setUserForm({
      name: user.name || '',
      email: user.email || '',
      phoneNo: user.phoneNo?.toString() || '',
      address: user.address || '',
      salary: user.salary?.toString() || '0',
      role: user.role || '',
      password: '',
      confirmPassword: '',
      dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
      dateOfJoining: user.dateOfJoining ? new Date(user.dateOfJoining).toISOString().split('T')[0] : '',
      amount: user.amount?.toString() || '0',
      department: user.department || '',
      designation: user.designation || ''
    });
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
      dateOfBirth: userForm.dateOfBirth ? new Date(userForm.dateOfBirth).toISOString() : null,
      dateOfJoining: userForm.dateOfJoining ? new Date(userForm.dateOfJoining).toISOString() : null,
      amount: parseFloat(userForm.amount),
      salary: parseFloat(userForm.salary)
    };

    if (!isEditMode) {
      payload.password = userForm.password;
      payload.confirmPassword = userForm.confirmPassword;
    }

    if (userForm.role === 'Teacher') {
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

      dispatch(usersList({ page: currentPage, size: itemsPerPage }));
      setShowAddUserModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error saving user:', error);
    } finally {
      setLoading(false);
    }
  };

 const handleToggleStatus = async (user) => {
  const newStatus = !user.status;  
  const actionText = newStatus ? 'enable' : 'disable';
  if (window.confirm(`Are you sure you want to ${actionText} this user?`)) {
    try {
      const payload = {
        _id: user._id,
        status: newStatus
      };
      
      await dispatch(enableDisableUsers(payload)).unwrap();
      dispatch(usersList({ page: currentPage, size: itemsPerPage }));
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  }
};

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case true:
        return 'bg-green-100 text-green-800 border-green-200';
      case false:
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleColor = (role) => {
    switch(role) {
      case 'Teacher':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Admin':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  const formatCurrency = (amount) => {
    if (!amount) return '₹0';
    return `₹${parseFloat(amount).toLocaleString('en-IN')}`;
  };

  const tableHeaders = ['S.No', 'User Name', 'Email', 'Phone No.', 'Role', 'Status', 'DOJ', 'Salary', 'Actions'];

  return (
    <div className="">
      <div className="mb-8">
        <h1 className="text-3xl text-gray-800">User Management</h1>
        <p className="text-gray-600 mt-2">Manage your users and their details</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="mb-6">
          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={() => setFilters({...filters, status: 'all'})}
              className={`px-4 py-2 rounded-md font-medium ${filters.status === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              All Users
            </button>
            <button
              onClick={() => setFilters({...filters, status: 'active'})}
              className={`px-4 py-2 rounded-md font-medium ${filters.status === 'active' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Active
            </button>
            <button
              onClick={() => setFilters({...filters, status: 'inactive'})}
              className={`px-4 py-2 rounded-md font-medium ${filters.status === 'inactive' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Inactive
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User Name</label>
              <input
                type="text"
                name="name"
                value={filters.name}
                onChange={handleFilterChange}
                placeholder="Search by name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
                <option value="Admin">Admin</option>
                <option value="Teacher">Teacher</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button 
                onClick={handleAddUser}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
                disabled={loading}
              >
                <span className="mr-2">+</span> {loading ? 'Processing...' : 'Add New User'}
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table
            headers={tableHeaders}
            data={currentUsers}
            renderRow={(user, index) => (
              <tr 
                key={user._id} 
                className={`hover:bg-blue-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
              >
                <td className="py-4 px-4 text-center">
                  <div className="font-medium text-gray-800">{(currentPage - 1) * itemsPerPage + index + 1}</div>
                </td>
                <td className="py-4 px-4">
                  <div className="capitalize text-gray-800">{user.name || 'N/A'}</div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-gray-700">{user.email || 'N/A'}</div>
                </td>
                <td className="py-4 px-4 text-gray-700">{user.phoneNo || 'N/A'}</td>
                <td className="py-4 px-4">
                  <span className={`px-3 py-1 rounded-full text-sm border ${getRoleColor(user.role)}`}>
                    {user.role || 'N/A'}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(user.status)}`}>
                    {user.status === true ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-4 px-4 text-gray-700">{formatDate(user.dateOfJoining)}</td>
                <td className="py-4 px-4 text-gray-700">{formatCurrency(user.salary)}</td>
                <td className="py-4 px-4">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEditUser(user)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                      title="Edit User"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleToggleStatus(user)}
                      className={`p-1 rounded hover:bg-gray-50 ${user.status === true ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}`}
                      title={user.status === true ? 'Deactivate User' : 'Activate User'}
                    >
                      {user.status === true ? <XCircle size={18} /> : <CheckCircle size={18} />}
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
                ? `No ${filters.status} users available` 
                : "No users found matching your criteria."}
            </p>
          </div>
        )}

        {usersData.total > 0 && (
          <div className="flex flex-col md:flex-row justify-between items-center mt-6 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-600 mb-4 md:mb-0">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, usersData.total)} of {usersData.total} users
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700'}`}
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
                      className={`w-8 h-8 flex items-center justify-center rounded-md ${currentPage === pageNum ? 'bg-blue-500 text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
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
                      className={`w-8 h-8 flex items-center justify-center rounded-md ${currentPage === totalPages ? 'bg-blue-500 text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>
              
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700'}`}
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
                  {isEditMode ? 'Edit User' : 'Add User'}
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      value={userForm.name}
                      onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      disabled={loading}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      value={userForm.email}
                      onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      disabled={loading}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      value={userForm.phoneNo}
                      onChange={(e) => setUserForm({...userForm, phoneNo: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      disabled={loading}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                    <input
                      type="text"
                      value={userForm.address}
                      onChange={(e) => setUserForm({...userForm, address: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      disabled={loading}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                    <select
                      value={userForm.role}
                      onChange={(e) => setUserForm({...userForm, role: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      disabled={loading}
                    >
                      <option value="">Select Role</option>
                      <option value="Admin">Admin</option>
                      <option value="Teacher">Teacher</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Salary (₹) *</label>
                    <input
                      type="number"
                      value={userForm.salary}
                      onChange={(e) => setUserForm({...userForm, salary: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      disabled={loading}
                    />
                  </div>
                  
                  {!isEditMode && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                        <input
                          type="password"
                          value={userForm.password}
                          onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                          disabled={loading}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
                        <input
                          type="password"
                          value={userForm.confirmPassword}
                          onChange={(e) => setUserForm({...userForm, confirmPassword: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                          disabled={loading}
                        />
                      </div>
                    </>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      value={userForm.dateOfBirth}
                      onChange={(e) => setUserForm({...userForm, dateOfBirth: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={loading}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Joining</label>
                    <input
                      type="date"
                      value={userForm.dateOfJoining}
                      onChange={(e) => setUserForm({...userForm, dateOfJoining: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={loading}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                    <input
                      type="number"
                      value={userForm.amount}
                      onChange={(e) => setUserForm({...userForm, amount: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={loading}
                    />
                  </div>
                  
                  {userForm.role === 'Teacher' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Department ID</label>
                        <input
                          type="text"
                          value={userForm.department}
                          onChange={(e) => setUserForm({...userForm, department: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={loading}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Designation ID</label>
                        <input
                          type="text"
                          value={userForm.designation}
                          onChange={(e) => setUserForm({...userForm, designation: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={loading}
                        />
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
                    {loading ? 'Processing...' : isEditMode ? 'Update User' : 'Add User'}
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