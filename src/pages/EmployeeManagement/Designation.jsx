import React, { useState } from 'react';
import Table from '../../components/Atoms/TableData/TableData';

const DesignationModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [designations, setDesignations] = useState(
    initialData?.designations || [{ name: '', salary: '' }, { name: '', salary: '' }]
  );

  const addDesignationField = () => {
    setDesignations([...designations, { name: '', salary: '' }]);
  };

  const removeDesignationField = (index) => {
    if (designations.length > 2) {
      const newDesignations = [...designations];
      newDesignations.splice(index, 1);
      setDesignations(newDesignations);
    }
  };

  const handleChange = (index, field, value) => {
    const newDesignations = [...designations];
    newDesignations[index][field] = value;
    setDesignations(newDesignations);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const filteredDesignations = designations.filter(
      des => des.name.trim() !== '' && des.salary.trim() !== ''
    );
    onSubmit(filteredDesignations);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="bg-sky-500 text-white p-4 rounded-t-lg">
          <h2 className="text-xl font-semibold">
            {initialData ? 'Edit Designation' : 'Add Designation'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-black mb-4">Designation</h3>
            <div className="space-y-4">
              {designations.map((des, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={des.name}
                      onChange={(e) => handleChange(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                      placeholder={`Designation ${index + 1}`}
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="number"
                      value={des.salary}
                      onChange={(e) => handleChange(index, 'salary', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                      placeholder="Salary"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeDesignationField(index)}
                    className="text-red-500 hover:text-red-700"
                    disabled={designations.length <= 2}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addDesignationField}
              className="mt-4 text-sky-500 hover:text-sky-700 text-sm font-medium"
            >
              + Add more designation fields
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
              Create Designation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


const DesignationManagement = () => {
  const [designations, setDesignations] = useState([
    { id: 1, name: 'CEO', salary: '100000', status: 'Active' },
    { id: 2, name: 'Franchise Partner & Share Holder', salary: '5000', status: 'Active' },
    { id: 3, name: 'Managing Director', salary: '18000', status: 'Active' },
    { id: 4, name: 'Assistant Manager', salary: '14000', status: 'Active' },
    { id: 5, name: 'Senior Manager & Branch Manager', salary: '11000', status: 'Active' },
    { id: 6, name: 'Junior Manager', salary: '8000', status: 'Active' },
    { id: 7, name: 'Branch in Charge & Marketing Person', salary: '7000', status: 'Active' },
    { id: 8, name: 'Quality Maintenance & Lab in Charna', salary: '6000', status: 'Active' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDesignation, setEditingDesignation] = useState(null);

  const handleAddDesignation = () => {
    setEditingDesignation(null);
    setIsModalOpen(true);
  };

  const handleEditDesignation = (designation) => {
    setEditingDesignation(designation);
    setIsModalOpen(true);
  };

  const handleDeleteDesignation = (id) => {
    setDesignations(designations.filter(des => des.id !== id));
  };

  const handleSubmitDesignation = (newDesignations) => {
    if (editingDesignation) {
      const updated = designations.map(des => 
        des.id === editingDesignation.id 
          ? { ...des, name: newDesignations[0]?.name || des.name, salary: newDesignations[0]?.salary || des.salary }
          : des
      );
      setDesignations(updated);
    } else {
      const ids = designations.map(d => d.id);
      const maxId = ids.length > 0 ? Math.max(...ids) : 0;
      
      const newDes = newDesignations.map((des, index) => ({
        id: maxId + index + 1,
        name: des.name,
        salary: des.salary,
        status: 'Active'
      }));
      
      setDesignations([...designations, ...newDes]);
    }
  };

  const toggleStatus = (id) => {
    setDesignations(designations.map(des => 
      des.id === id 
        ? { ...des, status: des.status === 'Active' ? 'Inactive' : 'Active' }
        : des
    ));
  };

  const tableHeaders = ['Designation', 'Salary', 'Status', 'Actions'];

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black">Designation</h1>
            <p className="text-gray-600 mt-2">Manage designations and their salaries</p>
          </div>
          <button
            onClick={handleAddDesignation}
           className="bg-black hover:bg-gray-900 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
          >
            Add Designation
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <Table
            headers={tableHeaders}
            data={designations}
            renderRow={(des, index) => (
              <tr 
                key={des.id} 
                className={`hover:bg-sky-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
              >
                <td className="py-4 px-4 text-black font-medium">{des.name}</td>
                <td className="py-4 px-4 text-black">{des.salary} ₽</td>
                <td className="py-4 px-4">
                  <button
                    onClick={() => toggleStatus(des.id)}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      des.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {des.status}
                  </button>
                </td>
                <td className="py-4 px-4">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleEditDesignation(des)}
                      className="text-sky-500 hover:text-sky-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteDesignation(des.id)}
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-sky-50 p-6 rounded-lg shadow border border-sky-100">
            <h3 className="text-lg font-semibold text-sky-700">Total Designations</h3>
            <p className="text-3xl font-bold text-black mt-2">{designations.length}</p>
          </div>
          <div className="bg-sky-50 p-6 rounded-lg shadow border border-sky-100">
            <h3 className="text-lg font-semibold text-sky-700">Active</h3>
            <p className="text-3xl font-bold text-black mt-2">
              {designations.filter(d => d.status === 'Active').length}
            </p>
          </div>
          <div className="bg-sky-50 p-6 rounded-lg shadow border border-sky-100">
            <h3 className="text-lg font-semibold text-sky-700">Total Salary</h3>
            <p className="text-3xl font-bold text-black mt-2">
              {designations.reduce((total, des) => total + parseInt(des.salary || 0), 0)} ₽
            </p>
          </div>
        </div>
      </div>

      <DesignationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingDesignation(null);
        }}
        onSubmit={handleSubmitDesignation}
        initialData={editingDesignation}
      />
    </div>
  );
};

export default DesignationManagement;