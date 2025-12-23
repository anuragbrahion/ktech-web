// pages/GoalManagement.jsx
 import React, { useState } from 'react';
import GoalModal from '../../components/Atoms/UI/GoalModal';
import Table from '../../components/Atoms/TableData/TableData';

const GoalManagement = () => {
  const [goals, setGoals] = useState([
    { 
      id: 1, 
      name: 'Goal 1', 
      designation: 'Under Training', 
      department: 'Teachers Team', 
      roles: ['Role 1', 'Role 2'], 
      salary: '0', 
      duration: '3 Months' 
    },
    { 
      id: 2, 
      name: 'Goal 2', 
      designation: 'Computer Teacher', 
      department: 'Teachers Team', 
      roles: ['Role 3', 'Role 4', 'Role 5', 'Role 6', 'Role 7', 'Role 8'], 
      salary: '2500', 
      duration: '6 Months' 
    },
    { 
      id: 3, 
      name: 'Goal 3', 
      designation: 'Computer Faculty', 
      department: 'Teachers Team', 
      roles: ['Role 9', 'Role 10', 'Role 11', 'Role 12', 'Role 13'], 
      salary: '3500', 
      duration: '6 Months' 
    },
    { 
      id: 4, 
      name: 'Goal 4', 
      designation: 'Lab in charge & Computer teacher', 
      department: 'Teachers Team', 
      roles: ['Role 14', 'Role 15', 'Role 16', 'Role 17', 'Role 18', 'Role 19'], 
      salary: '4500', 
      duration: '6 Months' 
    },
    { 
      id: 5, 
      name: 'Goal 5', 
      designation: 'Quality Maintenance & Lab In Charge', 
      department: 'Teachers Team', 
      roles: ['Role 20', 'Role 21', 'Role 22'], 
      salary: '6000', 
      duration: '6 Months' 
    },
    { 
      id: 6, 
      name: 'Goal 6', 
      designation: 'Branch in Charge & Marketing Person', 
      department: 'Teachers Team', 
      roles: [], 
      salary: '7000', 
      duration: '6 Months' 
    },
    { 
      id: 7, 
      name: 'Goal 7', 
      designation: 'Junior Manager', 
      department: 'Teachers', 
      roles: [], 
      salary: '8000', 
      duration: '6 Months' 
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  const handleAddGoal = () => {
    setEditingGoal(null);
    setIsModalOpen(true);
  };

  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setIsModalOpen(true);
  };

  const handleDeleteGoal = (id) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  const handleSubmitGoal = (goalData) => {
    if (editingGoal) {
      // Update existing goal
      setGoals(goals.map(goal => 
        goal.id === editingGoal.id 
          ? { 
              ...goal, 
              ...goalData,
              id: editingGoal.id
            }
          : goal
      ));
    } else {
      // Add new goal
      const newGoal = {
        id: goals.length + 1,
        ...goalData
      };
      setGoals([...goals, newGoal]);
    }
  };

  const tableHeaders = [
    'Goal Name', 
    'Designation', 
    'Department', 
    'Roles', 
    'Salary', 
    'Duration', 
    'Actions'
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black">Goal Management</h1>
            <p className="text-gray-600 mt-2">Manage goals, designations, and roles for your team</p>
          </div>
          <button
            onClick={handleAddGoal}
            className="bg-black hover:bg-gray-900 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
          >
            <span>+</span>
            <span>Add Goal</span>
          </button>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <Table
            headers={tableHeaders}
            data={goals}
            className="mb-6"
            renderRow={(goal, index) => (
              <tr 
                key={goal.id} 
                className={`hover:bg-sky-50 transition duration-200 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
              >
                <td className="py-4 px-4 text-black font-medium">{goal.name}</td>
                <td className="py-4 px-4 text-black">{goal.designation}</td>
                <td className="py-4 px-4 text-black">{goal.department}</td>
                <td className="py-4 px-4 text-black">
                  <div className="max-w-xs">
                    {goal.roles.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {goal.roles.slice(0, 3).map((role, idx) => (
                          <span 
                            key={idx} 
                            className="bg-sky-100 text-sky-700 text-xs px-2 py-1 rounded"
                          >
                            {role}
                          </span>
                        ))}
                        {goal.roles.length > 3 && (
                          <span className="text-gray-500 text-xs">
                            +{goal.roles.length - 3} more
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">No roles assigned</span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4 text-black font-semibold">₹{goal.salary}</td>
                <td className="py-4 px-4 text-black">
                  <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                    {goal.duration}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleEditGoal(goal)}
                      className="text-sky-500 hover:text-sky-700 font-medium text-sm transition duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="text-red-500 hover:text-red-700 font-medium text-sm transition duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            )}
          />
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-sky-50 to-white p-6 rounded-xl shadow border border-sky-100">
            <h3 className="text-lg font-semibold text-sky-700">Total Goals</h3>
            <p className="text-3xl font-bold text-black mt-2">{goals.length}</p>
          </div>
          
          <div className="bg-gradient-to-r from-sky-50 to-white p-6 rounded-xl shadow border border-sky-100">
            <h3 className="text-lg font-semibold text-sky-700">Total Salary</h3>
            <p className="text-3xl font-bold text-black mt-2">
              ₹{goals.reduce((total, goal) => total + parseInt(goal.salary || 0), 0)}
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-sky-50 to-white p-6 rounded-xl shadow border border-sky-100">
            <h3 className="text-lg font-semibold text-sky-700">Unique Designations</h3>
            <p className="text-3xl font-bold text-black mt-2">
              {new Set(goals.map(goal => goal.designation)).size}
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-sky-50 to-white p-6 rounded-xl shadow border border-sky-100">
            <h3 className="text-lg font-semibold text-sky-700">Avg Duration</h3>
            <p className="text-3xl font-bold text-black mt-2">
              {(() => {
                const totalMonths = goals.reduce((total, goal) => {
                  const months = parseInt(goal.duration);
                  return total + (isNaN(months) ? 0 : months);
                }, 0);
                return `${Math.round(totalMonths / goals.length)} Months`;
              })()}
            </p>
          </div>
        </div>
      </div>

      {/* Modal */}
      <GoalModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingGoal(null);
        }}
        onSubmit={handleSubmitGoal}
        initialData={editingGoal}
      />
    </div>
  );
};

export default GoalManagement;