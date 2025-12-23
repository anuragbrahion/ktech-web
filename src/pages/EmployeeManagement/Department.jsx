// components/DepartmentModal/DepartmentModal.jsx
import React, { useState } from 'react';
import Table from '../../components/Atoms/TableData/TableData';

const DepartmentModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [department, setDepartment] = useState(
    initialData?.department || [{ name: '' }, { name: '' }]
  );

  const addDepartmentField = () => {
    setDepartment([...department, { name: '' }]);
  };

  const removeDepartmentField = (index) => {
    if (department.length > 2) {
      const newDepartment = [...department];
      newDepartment.splice(index, 1);
      setDepartment(newDepartment);
    }
  };

  const handleChange = (index, value) => {
    const newDepartment = [...department];
    newDepartment[index].name = value;
    setDepartment(newDepartment);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const filteredDepartment = department.filter(
      dept => dept.name.trim() !== ''
    );
    onSubmit(filteredDepartment);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="bg-sky-500 text-white p-4 rounded-t-lg">
          <h2 className="text-xl font-semibold">
            {initialData ? 'Edit Department' : 'Add Department'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-black mb-4">Department</h3>
            <div className="space-y-4">
              {department.map((dept, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={dept.name}
                      onChange={(e) => handleChange(index, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                      placeholder={`Department ${index + 1}`}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeDepartmentField(index)}
                    className="text-red-500 hover:text-red-700"
                    disabled={department.length <= 2}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addDepartmentField}
              className="mt-4 text-sky-500 hover:text-sky-700 text-sm font-medium"
            >
              + Add more department fields
            </button>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-black rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600"
            >
              Create Department
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Department = () => {
  const [departments, setDepartments] = useState([
    { id: 1, name: 'Deviopers Team', status: 'Active' },
    { id: 2, name: 'Reception Team', status: 'Active' },
    { id: 3, name: 'Backoffice Team', status: 'Active' },
    { id: 4, name: 'Teachers Team', status: 'Active' },
    { id: 5, name: 'Sales Team', status: 'Active' },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const itemsPerPage = 10;

  const handleAddDepartment = () => {
    setEditingDepartment(null);
    setIsModalOpen(true);
  };

  const handleEditDepartment = (dept) => {
    setEditingDepartment(dept);
    setIsModalOpen(true);
  };

  const handleDeleteDepartment = (id) => {
    setDepartments(departments.filter(dept => dept.id !== id));
  };

  const handleSubmitDepartment = (newDepartments) => {
    if (editingDepartment) {
      const updated = departments.map(dept => 
        dept.id === editingDepartment.id 
          ? { ...dept, name: newDepartments[0]?.name || dept.name }
          : dept
      );
      setDepartments(updated);
    } else {
      const ids = departments.map(d => d.id);
      const maxId = ids.length > 0 ? Math.max(...ids) : 0;
      
      const newDept = newDepartments.map((dept, index) => ({
        id: maxId + index + 1,
        name: dept.name,
        status: 'Active'
      }));
      
      setDepartments([...departments, ...newDept]);
    }
  };

  const toggleStatus = (id) => {
    setDepartments(departments.map(dept => 
      dept.id === id 
        ? { ...dept, status: dept.status === 'Active' ? 'Inactive' : 'Active' }
        : dept
    ));
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDepartments = departments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(departments.length / itemsPerPage);

  const tableHeaders = ['Department', 'Status', 'Actions'];

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black">Department</h1>
            <p className="text-black mt-2">Manage all departments in the organization</p>
          </div>
          <button
            onClick={handleAddDepartment}
           className="bg-black hover:bg-gray-900 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
          >
            Add Department
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-black">Department ({departments.length})</h2>
          </div>
          
          <Table
            headers={tableHeaders}
            data={currentDepartments}
            renderRow={(dept, index) => (
              <tr 
                key={dept.id} 
                className={`hover:bg-sky-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
              >
                <td className="py-4 px-4 text-black font-medium">{dept.name}</td>
                <td className="py-4 px-4">
                  <button
                    onClick={() => toggleStatus(dept.id)}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      dept.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {dept.status}
                  </button>
                </td>
                <td className="py-4 px-4">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleEditDepartment(dept)}
                      className="text-sky-500 hover:text-sky-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteDepartment(dept.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            )}
          />

          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-md ${
                  currentPage === 1 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-sky-50 text-sky-600 hover:bg-sky-100'
                }`}
              >
                Previous
              </button>
              
              <span className="text-black">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-md ${
                  currentPage === totalPages 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-sky-50 text-sky-600 hover:bg-sky-100'
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-sky-50 p-6 rounded-lg shadow border border-sky-100">
            <h3 className="text-lg font-semibold text-sky-700">Total Departments</h3>
            <p className="text-3xl font-bold text-black mt-2">{departments.length}</p>
          </div>
          <div className="bg-sky-50 p-6 rounded-lg shadow border border-sky-100">
            <h3 className="text-lg font-semibold text-sky-700">Active</h3>
            <p className="text-3xl font-bold text-black mt-2">
              {departments.filter(d => d.status === 'Active').length}
            </p>
          </div>
          <div className="bg-sky-50 p-6 rounded-lg shadow border border-sky-100">
            <h3 className="text-lg font-semibold text-sky-700">Inactive</h3>
            <p className="text-3xl font-bold text-black mt-2">
              {departments.filter(d => d.status === 'Inactive').length}
            </p>
          </div>
        </div>
      </div>

      <DepartmentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingDepartment(null);
        }}
        onSubmit={handleSubmitDepartment}
        initialData={editingDepartment}
      />
    </div>
  );
};

export default Department;