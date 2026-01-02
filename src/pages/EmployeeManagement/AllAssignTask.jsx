// pages/AllAssignTask.jsx
import React, { useState } from 'react';
import Table from '../../components/Atoms/TableData/TableData';

const AllAssignTask = () => {
  const [tasks, setTasks] = useState([
    { 
      id: 1, 
      staffName: 'Nikhat Harun shaikh', 
      title: 'ok mica karna hai', 
      description: '40,000 kisi bhi kimat per lana hai kai', 
      assignDate: '2025-11-08', 
      status: 'In-Progress',
      notes: ''
    },
    { 
      id: 2, 
      staffName: 'Ram manish bhai sondagar', 
      title: 'ms office ka exam dene ka preparation karna hai 01 dec 2025 ko exam liya jayenga', 
      description: 'ram sir', 
      assignDate: '2025-11-08', 
      status: 'In-Progress',
      notes: ''
    },
    { 
      id: 3, 
      staffName: 'Ubed Samir Mirza', 
      title: 'sabhi staff ka naam or mobile number ka list banana hai or apne pass rakhna hai', 
      description: 'ubed', 
      assignDate: '2025-11-08', 
      status: 'Completed',
      notes: ''
    },
    { 
      id: 4, 
      staffName: 'Saniya rahim Khan 2', 
      title: 'role 1 ka exam paaper banana hai 80 per passing marks 100 moq', 
      description: '', 
      assignDate: '2025-11-08', 
      status: 'Completed',
      notes: ''
    },
    { 
      id: 5, 
      staffName: 'alfiya Maksud ali sayad', 
      title: 'kal 10 logo ko calling karni hai', 
      description: '', 
      assignDate: '2025-11-11', 
      status: 'Completed',
      notes: ''
    },
    { 
      id: 6, 
      staffName: 'Nikhat Harun shaikh', 
      title: 'fees laani hai 4000 aaj 11-11-2025', 
      description: '', 
      assignDate: '2025-11-11', 
      status: 'In-Progress',
      notes: ''
    },
    { 
      id: 7, 
      staffName: 'Anna Nura', 
      title: 'delalils as a admission form of student azhar sir ko whatsano ner send', 
      description: '', 
      assignDate: new Date().toISOString().split('T')[0], 
      status: 'Pending',
      notes: ''
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleStatusChange = (id, newStatus) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, status: newStatus } : task
    ));
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  const statuses = ['All', 'Pending', 'In-Progress', 'Completed'];
  const staffNames = [...new Set(tasks.map(task => task.staffName))];

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || filterStatus === 'All' || task.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);

  const tableHeaders = [
    'Staff Name', 
    'Title', 
    'Description', 
    'Assign Date', 
    'Status', 
    'Actions'
  ];

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'Pending').length,
    inProgress: tasks.filter(t => t.status === 'In-Progress').length,
    completed: tasks.filter(t => t.status === 'Completed').length
  };

  return (
    <div className="">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black">Assign Task List</h1>
          <p className="text-black mt-2">View and manage all assigned tasks</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-lg shadow border border-blue-100">
            <h3 className="text-lg font-semibold text-blue-700">Total Tasks</h3>
            <p className="text-3xl font-bold text-black mt-2">{stats.total}</p>
          </div>
          <div className="bg-yellow-50 p-6 rounded-lg shadow border border-yellow-100">
            <h3 className="text-lg font-semibold text-yellow-700">Pending</h3>
            <p className="text-3xl font-bold text-black mt-2">{stats.pending}</p>
          </div>
          <div className="bg-orange-50 p-6 rounded-lg shadow border border-orange-100">
            <h3 className="text-lg font-semibold text-orange-700">In-Progress</h3>
            <p className="text-3xl font-bold text-black mt-2">{stats.inProgress}</p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg shadow border border-green-100">
            <h3 className="text-lg font-semibold text-green-700">Completed</h3>
            <p className="text-3xl font-bold text-black mt-2">{stats.completed}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by staff name, title, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
              />
            </div>
            <div className="w-full md:w-64">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
              >
                <option value="">All Status</option>
                {statuses.map((status, index) => (
                  <option key={index} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          <Table
            headers={tableHeaders}
            data={currentTasks}
            renderRow={(task, index) => (
              <tr 
                key={task.id} 
                className={`hover:bg-sky-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
              >
                <td className="py-4 px-4 text-black font-medium">{task.staffName}</td>
                <td className="py-4 px-4 text-black">
                  <div className="max-w-xs">
                    <p className="font-medium">{task.title}</p>
                  </div>
                </td>
                <td className="py-4 px-4 text-black">
                  <div className="max-w-xs">
                    {task.description || <span className="text-gray-400">No description</span>}
                  </div>
                </td>
                <td className="py-4 px-4 text-black">{formatDate(task.assignDate)}</td>
                <td className="py-4 px-4">
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                    className={`px-3 py-1 rounded-full text-sm font-medium border-0 ${
                      task.status === 'Completed' 
                        ? 'bg-green-100 text-green-800' 
                        : task.status === 'In-Progress'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    <option value="Pending" className="bg-white text-black">Pending</option>
                    <option value="In-Progress" className="bg-white text-black">In-Progress</option>
                    <option value="Completed" className="bg-white text-black">Completed</option>
                  </select>
                </td>
                <td className="py-4 px-4">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleDeleteTask(task.id)}
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

        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-sky-700 mb-4">Additional Notes</h3>
          <p className="text-black italic">
            anna nura delalils as a admission form of student azhar sir ko whatsano ner send
          </p>
        </div>
      </div>
    </div>
  );
};

export default AllAssignTask;