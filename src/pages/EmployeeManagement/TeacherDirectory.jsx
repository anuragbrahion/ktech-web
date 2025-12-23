// pages/User.jsx
import React, { useState } from 'react';
import Table from '../../components/Atoms/TableData/TableData';
import UserModal from '../../components/Atoms/UI/UserModal';
import UserViewModal from '../../components/Atoms/UI/UserViewModal';

const TeacherDirectory = () => {
  const [users, setUsers] = useState([
    { 
      id: 1, 
      name: 'Irfan gulammuslufa palel', 
      phone: '9879867620', 
      department: 'Teachers Team', 
      designation: 'Computer Teacher', 
      status: 'Active',
      doj: '2025-12-05',
      email: 'irfan10.patel@gmail.com',
      address: 'aikta apartment flat 306 parsi street saiyyyvedp!',
      dob: '1965-12-28',
      password: '********'
    },
    { 
      id: 2, 
      name: 'Husen', 
      phone: '9638902418', 
      department: 'Teachers Team', 
      designation: 'Under Training', 
      status: 'Active',
      doj: '2025-09-25'
    },
    { 
      id: 3, 
      name: 'Hasim Mohsin Shaikh', 
      phone: '9328329381', 
      department: 'Teachers Team', 
      designation: 'Under Training', 
      status: 'Active',
      doj: '2025-03-05'
    },
    { 
      id: 4, 
      name: 'rahul', 
      phone: '9898379375', 
      department: '', 
      designation: '', 
      status: 'Active',
      doj: '2025-11-30'
    },
    { 
      id: 5, 
      name: 'Tanzila', 
      phone: '9898989898', 
      department: '', 
      designation: '', 
      status: 'Active',
      doj: '2025-11-24'
    },
    { 
      id: 6, 
      name: 'Husen', 
      phone: '9638902418', 
      department: '', 
      designation: '', 
      status: 'Active',
      doj: '2025-11-24'
    },
    { 
      id: 7, 
      name: 'Shaista Nasir Shaikh', 
      phone: '8799211218', 
      department: 'Teachers Team', 
      designation: 'Under Training', 
      status: 'Active',
      doj: '2025-05-26'
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');

  const departments = [...new Set(users.map(u => u.department).filter(Boolean))];

  const handleAddUser = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleViewUser = (user) => {
    setViewingUser(user);
    setIsViewModalOpen(true);
  };

  const handleDeleteUser = (id) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const handleSubmitUser = (userData) => {
    if (editingUser) {
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...userData, id: editingUser.id }
          : user
      ));
    } else {
      const newUser = {
        id: users.length + 1,
        ...userData,
        status: 'Active'
      };
      setUsers([...users, newUser]);
    }
  };

  const toggleStatus = (id) => {
    setUsers(users.map(user => 
      user.id === id 
        ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' }
        : user
    ));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone.includes(searchTerm) ||
                         user.designation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !filterDepartment || user.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  const tableHeaders = [
    'Staff Name', 
    'Phone No.', 
    'Department', 
    'Designation', 
    'Status', 
    'Date Of Joining', 
    'Actions'
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black">Teacher Directory List</h1>
            <p className="text-black mt-2">Manage all teaching staff members</p>
          </div>
          {/* <button
            onClick={handleAddUser}
             className="bg-black hover:bg-gray-900 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
          >
            Add User
          </button> */}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name, phone, or designation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
              />
            </div>
            <div className="w-full md:w-64">
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
              >
                <option value="">All Departments</option>
                {departments.map((dept, index) => (
                  <option key={index} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>

          <Table
            headers={tableHeaders}
            data={filteredUsers}
            renderRow={(user, index) => (
              <tr 
                key={user.id} 
                className={`hover:bg-sky-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
              >
                <td className="py-4 px-4 text-black font-medium">{user.name}</td>
                <td className="py-4 px-4 text-black">{user.phone}</td>
                <td className="py-4 px-4 text-black">{user.department || 'N/A'}</td>
                <td className="py-4 px-4 text-black">{user.designation || 'N/A'}</td>
                <td className="py-4 px-4">
                  <button
                    onClick={() => toggleStatus(user.id)}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {user.status === 'Active' ? '✅' : '❌'} {user.status}
                  </button>
                </td>
                <td className="py-4 px-4 text-black">{formatDate(user.doj)}</td>
                <td className="py-4 px-4">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleViewUser(user)}
                      className="text-sky-500 hover:text-sky-700"
                      title="View"
                    >
                      👁️
                    </button>
                    <button
                      onClick={() => handleEditUser(user)}
                      className="text-sky-500 hover:text-sky-700"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-sky-50 p-6 rounded-lg shadow border border-sky-100">
            <h3 className="text-lg font-semibold text-sky-700">Total Staff</h3>
            <p className="text-3xl font-bold text-black mt-2">{users.length}</p>
          </div>
          <div className="bg-sky-50 p-6 rounded-lg shadow border border-sky-100">
            <h3 className="text-lg font-semibold text-sky-700">Active</h3>
            <p className="text-3xl font-bold text-black mt-2">
              {users.filter(u => u.status === 'Active').length}
            </p>
          </div>
          <div className="bg-sky-50 p-6 rounded-lg shadow border border-sky-100">
            <h3 className="text-lg font-semibold text-sky-700">Teachers</h3>
            <p className="text-3xl font-bold text-black mt-2">
              {users.filter(u => u.department === 'Teachers Team').length}
            </p>
          </div>
          <div className="bg-sky-50 p-6 rounded-lg shadow border border-sky-100">
            <h3 className="text-lg font-semibold text-sky-700">Under Training</h3>
            <p className="text-3xl font-bold text-black mt-2">
              {users.filter(u => u.designation === 'Under Training').length}
            </p>
          </div>
        </div>
      </div>

      <UserModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingUser(null);
        }}
        onSubmit={handleSubmitUser}
        initialData={editingUser}
      />

      <UserViewModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setViewingUser(null);
        }}
        userData={viewingUser}
      />
    </div>
  );
};

export default TeacherDirectory;