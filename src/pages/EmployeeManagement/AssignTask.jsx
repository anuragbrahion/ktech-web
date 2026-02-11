// pages/AssignTask.jsx
import React, { useState } from 'react';
import Table from '../../components/Atoms/TableData/TableData';
import AssignTaskModal from '../../components/Atoms/UI/AssignTaskModal';

const AssignTask = () => {
  const [staffList, setStaffList] = useState([
    { 
      id: 1, 
      name: 'irfan gulanmruslufa patel', 
      referralCode: '95680dac8bfa', 
      role: 'Teacher', 
      phone: '9879867620',
      tasks: []
    },
    { 
      id: 2, 
      name: 'Husen', 
      referralCode: '4b721b0aafc5', 
      role: 'Teacher', 
      phone: '9638902418',
      tasks: []
    },
    { 
      id: 3, 
      name: 'Hasim Mohsin Shaikh', 
      referralCode: '8066acc10646', 
      role: 'Teacher', 
      phone: '9328329381',
      tasks: []
    },
    { 
      id: 4, 
      name: 'rahul', 
      referralCode: '949a84cf1dc4', 
      role: 'Student', 
      phone: '9898379375',
      tasks: []
    },
    { 
      id: 5, 
      name: 'Tanzila', 
      referralCode: '86429cb601ba', 
      role: 'Student', 
      phone: '9898988998',
      tasks: []
    },
    { 
      id: 6, 
      name: 'Husen', 
      referralCode: '08ebc584b22e', 
      role: 'Student', 
      phone: '9638902418',
      tasks: []
    },
    { 
      id: 7, 
      name: 'Shaista Nasir Shaikh', 
      referralCode: '00fb7914ac7e', 
      role: 'Teacher', 
      phone: '8799211218',
      tasks: []
    },
    { 
      id: 8, 
      name: 'shaikh amin faruk', 
      referralCode: '46e9d1055e6b', 
      role: 'Teacher', 
      phone: '9726197045',
      tasks: []
    },
  ]);

  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');

  const roles = [...new Set(staffList.map(staff => staff.role))];

  const handleTaskAssign = (staff) => {
    setSelectedStaff(staff);
    setIsModalOpen(true);
  };

  const handleSubmitTask = (tasks) => {
    if (selectedStaff) {
      setStaffList(staffList.map(staff => 
        staff.id === selectedStaff.id 
          ? { ...staff, tasks: [...staff.tasks, ...tasks] }
          : staff
      ));
    }
    setSelectedStaff(null);
  };

  const handleDeleteTask = (staffId, taskIndex) => {
    setStaffList(staffList.map(staff => {
      if (staff.id === staffId) {
        const updatedTasks = [...staff.tasks];
        updatedTasks.splice(taskIndex, 1);
        return { ...staff, tasks: updatedTasks };
      }
      return staff;
    }));
  };

  const filteredStaff = staffList.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.phone.includes(searchTerm) ||
                         staff.referralCode.includes(searchTerm);
    const matchesRole = !filterRole || staff.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const tableHeaders = [
    'Staff Name', 
    'Referral Code', 
    'Role', 
    'Phone No.', 
    'Task Assign', 
    'Assigned Tasks'
  ];

  return (
    <div className="">
      <div className="">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black">Task Assign List</h1>
          <p className="text-black mt-2">Assign and manage tasks for staff members</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name, phone, or referral code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                 className="bg-white border hover:bg-gray-900 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
              />
            </div>
            <div className="w-full md:w-64">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                 className="bg-black hover:bg-gray-900 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
              >
                <option value="">All Roles</option>
                {roles.map((role, index) => (
                  <option key={index} value={role}>{role}</option>
                ))}
              </select>
            </div>
          </div>

          <Table
            headers={tableHeaders}
            data={filteredStaff}
            renderRow={(staff, index) => (
              <tr 
                key={staff.id} 
                className={`hover:bg-sky-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
              >
                <td className="py-4 px-4 text-black font-medium">{staff.name}</td>
                <td className="py-4 px-4 text-black font-mono text-sm">{staff.referralCode}</td>
                <td className="py-4 px-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    staff.role === 'Teacher' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {staff.role}
                  </span>
                </td>
                <td className="py-4 px-4 text-black">{staff.phone}</td>
                <td className="py-4 px-4">
                  <button
                    onClick={() => handleTaskAssign(staff)}
                    className="px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 text-sm font-medium"
                  >
                    Task-Assign
                  </button>
                </td>
                <td className="py-4 px-4">
                  <div className="space-y-2 max-w-xs">
                    {staff.tasks.length > 0 ? (
                      staff.tasks.map((task, taskIndex) => (
                        <div key={taskIndex} className="flex justify-between items-start p-2 bg-gray-50 rounded">
                          <div>
                            <p className="text-sm font-medium text-black">{task.title}</p>
                            <p className="text-xs text-gray-600 truncate">{task.description}</p>
                          </div>
                          <button
                            onClick={() => handleDeleteTask(staff.id, taskIndex)}
                            className="text-red-500 hover:text-red-700 text-xs"
                          >
                            Remove
                          </button>
                        </div>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm">No tasks assigned</span>
                    )}
                  </div>
                </td>
              </tr>
            )}
          />
        </div> 
      </div>

      <AssignTaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedStaff(null);
        }}
        onSubmit={handleSubmitTask}
        initialData={selectedStaff}
        users={staffList}
      />
    </div>
  );
};

export default AssignTask;