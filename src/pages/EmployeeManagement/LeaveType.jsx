// pages/LeaveType.jsx
import React, { useState } from 'react';
import Table from '../../components/Atoms/TableData/TableData';
import LeaveTypeModal from '../../components/Atoms/UI/LeaveTypeModal';

const LeaveType = () => {
  const [leaveTypes, setLeaveTypes] = useState([
    { id: 1, name: 'leave without pay', status: 'Active' },
    { id: 2, name: 'leave with pay', status: 'Active' },
    { id: 3, name: 'Full day', status: 'Active' },
    { id: 4, name: 'Half day', status: 'Active' },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLeaveType, setEditingLeaveType] = useState(null);
  const itemsPerPage = 10;

  const handleAddLeaveType = () => {
    setEditingLeaveType(null);
    setIsModalOpen(true);
  };

  const handleEditLeaveType = (leaveType) => {
    setEditingLeaveType(leaveType);
    setIsModalOpen(true);
  };

  const handleDeleteLeaveType = (id) => {
    setLeaveTypes(leaveTypes.filter(lt => lt.id !== id));
  };

  const handleSubmitLeaveType = (newLeaveTypes) => {
    if (editingLeaveType) {
      const updated = leaveTypes.map(lt => 
        lt.id === editingLeaveType.id 
          ? { ...lt, name: newLeaveTypes[0]?.name || lt.name }
          : lt
      );
      setLeaveTypes(updated);
    } else {
      const ids = leaveTypes.map(d => d.id);
      const maxId = ids.length > 0 ? Math.max(...ids) : 0;
      
      const newLt = newLeaveTypes.map((lt, index) => ({
        id: maxId + index + 1,
        name: lt.name,
        status: 'Active'
      }));
      
      setLeaveTypes([...leaveTypes, ...newLt]);
    }
  };

  const toggleStatus = (id) => {
    setLeaveTypes(leaveTypes.map(lt => 
      lt.id === id 
        ? { ...lt, status: lt.status === 'Active' ? 'Inactive' : 'Active' }
        : lt
    ));
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLeaveTypes = leaveTypes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(leaveTypes.length / itemsPerPage);

  const tableHeaders = ['Type', 'Status', 'Actions'];

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black">Leave Type</h1>
            <p className="text-black mt-2">Manage leave types and their status</p>
          </div>
          <button
            onClick={handleAddLeaveType}
             className="bg-black hover:bg-gray-900 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
          >
            Add Type
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <Table
            headers={tableHeaders}
            data={currentLeaveTypes}
            renderRow={(lt, index) => (
              <tr 
                key={lt.id} 
                className={`hover:bg-sky-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
              >
                <td className="py-4 px-4 text-black font-medium">{lt.name}</td>
                <td className="py-4 px-4">
                  <button
                    onClick={() => toggleStatus(lt.id)}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      lt.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {lt.status}
                  </button>
                </td>
                <td className="py-4 px-4">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleEditLeaveType(lt)}
                      className="text-sky-500 hover:text-sky-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteLeaveType(lt.id)}
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
            <h3 className="text-lg font-semibold text-sky-700">Total Types</h3>
            <p className="text-3xl font-bold text-black mt-2">{leaveTypes.length}</p>
          </div>
          <div className="bg-sky-50 p-6 rounded-lg shadow border border-sky-100">
            <h3 className="text-lg font-semibold text-sky-700">Active</h3>
            <p className="text-3xl font-bold text-black mt-2">
              {leaveTypes.filter(d => d.status === 'Active').length}
            </p>
          </div>
          <div className="bg-sky-50 p-6 rounded-lg shadow border border-sky-100">
            <h3 className="text-lg font-semibold text-sky-700">Inactive</h3>
            <p className="text-3xl font-bold text-black mt-2">
              {leaveTypes.filter(d => d.status === 'Inactive').length}
            </p>
          </div>
        </div>
      </div>

      <LeaveTypeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingLeaveType(null);
        }}
        onSubmit={handleSubmitLeaveType}
        initialData={editingLeaveType}
      />
    </div>
  );
};

export default LeaveType;