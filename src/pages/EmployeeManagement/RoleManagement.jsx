// pages/RoleManagement.jsx
import React, { useState } from 'react';
import Table from '../../components/Atoms/TableData/TableData';
import RoleModal from '../../components/Atoms/RoleModal';
 
const RoleManagement = () => {
  const [roles, setRoles] = useState([
    { id: 1, name: 'Role 1', course: 'ms office', days: '45 Days' },
    { id: 2, name: 'Role 2', course: 'Tally accounting', days: '30 Days' },
    { id: 3, name: 'Role 3', course: 'Photoshop', days: '45 Days' },
    { id: 4, name: 'Role 4', course: 'CorelDraw', days: '45 Days' },
    { id: 5, name: 'Role 5', course: 'HTML', days: '20 Days' },
    { id: 6, name: 'Role 6', course: 'c language', days: '20 Days' },
    { id: 7, name: 'Role 7', course: 'C++', days: '20 Days' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  const handleAddRole = () => {
    setEditingRole(null);
    setIsModalOpen(true);
  };

  const handleEditRole = (role) => {
    const roleData = {
      ...role,
      days: role.days.replace(' Days', '')
    };
    setEditingRole(roleData);
    setIsModalOpen(true);
  };

  const handleDeleteRole = (id) => {
    setRoles(roles.filter(role => role.id !== id));
  };

  const handleSubmitRole = (roleData) => {
    if (editingRole) {
      // Update existing role
      setRoles(roles.map(role => 
        role.id === editingRole.id 
          ? { 
              ...role, 
              name: roleData.name, 
              course: roleData.course, 
              days: `${roleData.days} Days` 
            }
          : role
      ));
    } else {
      // Add new role
      const newRole = {
        id: roles.length + 1,
        name: roleData.name,
        course: roleData.course,
        days: `${roleData.days} Days`
      };
      setRoles([...roles, newRole]);
    }
  };

  const tableHeaders = ['Role Name', 'Course', 'Total Days', 'Delete'];

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black">Role Management</h1>
          <button
            onClick={handleAddRole}
            className="bg-black hover:bg-gray-900 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
          >
            Add Role
          </button>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <Table
            headers={tableHeaders}
            data={roles}
            renderRow={(role, index) => (
              <tr 
                key={role.id} 
                className={`hover:bg-sky-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
              >
                <td className="py-3 px-4 text-black">{role.name}</td>
                <td className="py-3 px-4 text-black">{role.course}</td>
                <td className="py-3 px-4 text-black">{role.days}</td>
                <td className="py-3 px-4">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleEditRole(role)}
                      className="text-sky-500 hover:text-sky-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteRole(role.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            )}
          />
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-sky-100 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-sky-700">Total Roles</h3>
            <p className="text-3xl font-bold text-black mt-2">{roles.length}</p>
          </div>
          <div className="bg-sky-100 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-sky-700">Total Days</h3>
            <p className="text-3xl font-bold text-black mt-2">
              {roles.reduce((total, role) => total + parseInt(role.days), 0)} Days
            </p>
          </div>
          <div className="bg-sky-100 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-sky-700">Unique Courses</h3>
            <p className="text-3xl font-bold text-black mt-2">
              {new Set(roles.map(role => role.course)).size}
            </p>
          </div>
        </div>
      </div>

      {/* Modal */}
      <RoleModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingRole(null);
        }}
        onSubmit={handleSubmitRole}
        initialData={editingRole}
      />
    </div>
  );
};

export default RoleManagement;