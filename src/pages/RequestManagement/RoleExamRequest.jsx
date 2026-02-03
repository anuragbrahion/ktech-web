import React, { useState } from 'react';
import Table from '../../components/Atoms/TableData/TableData';

const RoleExamRequest = () => {
  const [requests, setRequests] = useState([
    { 
      id: 1, 
      sNo: 1,
      teacherName: 'Azharair exams testing user (teacher)', 
      email: 'ktechcompute040184@gmail.com', 
      roles: 'Role 2', 
      totalDays: '30 Days', 
      status: 'Approved',
      isActionTaken: true
    },
    { 
      id: 2, 
      sNo: 2,
      teacherName: 'shakih amin fanzk', 
      email: 'shkfanzk365@gmail.com', 
      roles: 'Role 1', 
      totalDays: '45 Days', 
      status: 'Approved',
      isActionTaken: true
    },
    { 
      id: 3, 
      sNo: 3,
      teacherName: 'malim froz shakih', 
      email: 'shakihiroj678@gmail.com', 
      roles: 'Role 1', 
      totalDays: '45 Days', 
      status: 'Approved',
      isActionTaken: true
    },
    { 
      id: 4, 
      sNo: 4,
      teacherName: 'Mohammad Anash jameel Shakih', 
      email: 'anasshakih604@gmail.com', 
      roles: 'Role 1', 
      totalDays: '45 Days', 
      status: 'Approved',
      isActionTaken: true
    },
    { 
      id: 5, 
      sNo: 5,
      teacherName: 'Azharair exams testing user (teacher)', 
      email: 'ktechcompute040184@gmail.com', 
      roles: 'Role 1', 
      totalDays: '45 Days', 
      status: 'Approved',
      isActionTaken: true
    },
    { 
      id: 6, 
      sNo: 6,
      teacherName: 'Khalid Firoz Khan', 
      email: 'khalid16029@gmail.com', 
      roles: 'Role 1', 
      totalDays: '45 Days', 
      status: 'Pending',
      isActionTaken: false
    },
    { 
      id: 7, 
      sNo: 7,
      teacherName: 'New Teacher Request', 
      email: 'newteacher@example.com', 
      roles: 'Role 3', 
      totalDays: '60 Days', 
      status: 'Pending',
      isActionTaken: false
    },
    { 
      id: 8, 
      sNo: 8,
      teacherName: 'Rejected Teacher', 
      email: 'rejected@example.com', 
      roles: 'Role 1', 
      totalDays: '45 Days', 
      status: 'Rejected',
      isActionTaken: true
    },
  ]);

  const handleApprove = (id) => {
    setRequests(requests.map(request => 
      request.id === id 
        ? { 
            ...request, 
            status: 'Approved',
            isActionTaken: true
          }
        : request
    ));
  };

  const handleReject = (id) => {
    setRequests(requests.map(request => 
      request.id === id 
        ? { 
            ...request, 
            status: 'Rejected',
            isActionTaken: true
          }
        : request
    ));
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter requests based on status
  const [filter, setFilter] = useState('all');
  
  const filteredRequests = requests.filter(request => {
    if (filter === 'all') return true;
    return request.status === filter;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRequests = filteredRequests.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const tableHeaders = ['S.No', 'Teacher Name', 'E-mail', 'Roles', 'Total Days', 'Status', 'Approve', 'Reject'];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Role Exam Requests</h1>
        <p className="text-gray-600 mt-2">Manage teacher role examination requests</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        {/* Filter Section */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md font-medium ${
                filter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Requests
            </button>
            <button
              onClick={() => setFilter('Pending')}
              className={`px-4 py-2 rounded-md font-medium ${
                filter === 'Pending' 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('Approved')}
              className={`px-4 py-2 rounded-md font-medium ${
                filter === 'Approved' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setFilter('Rejected')}
              className={`px-4 py-2 rounded-md font-medium ${
                filter === 'Rejected' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Rejected
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table
            headers={tableHeaders}
            data={currentRequests}
            renderRow={(request, index) => (
              <tr 
                key={request.id} 
                className={`hover:bg-blue-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
              >
                <td className="py-4 px-4 text-center">
                  <div className="font-medium text-gray-800">{request.sNo}</div>
                </td>
                <td className="py-4 px-4">
                  <div className="font-medium text-gray-800">{request.teacherName}</div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-gray-700 truncate max-w-xs">{request.email}</div>
                </td>
                <td className="py-4 px-4">
                  <span className="text-blue-800 rounded-full text-sm">
                    {request.roles}
                  </span>
                </td>
                <td className="py-4 px-4 text-gray-700">{request.totalDays}</td>
                <td className="py-4 px-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <button
                    onClick={() => handleApprove(request.id)}
                    disabled={request.isActionTaken}
                    className={`px-4 py-2 rounded-md font-medium text-sm ${
                      request.isActionTaken
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-200'
                    }`}
                  >
                    {request.status === 'Approved' ? 'Approved' : 'Approve'}
                  </button>
                </td>
                <td className="py-4 px-4">
                  <button
                    onClick={() => handleReject(request.id)}
                    disabled={request.isActionTaken}
                    className={`px-4 py-2 rounded-md font-medium text-sm ${
                      request.isActionTaken
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-200'
                    }`}
                  >
                    {request.status === 'Rejected' ? 'Rejected' : 'Reject'}
                  </button>
                </td>
              </tr>
            )}
          />
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No role exam requests found</h3>
            <p className="text-gray-500">
              {filter !== 'all' 
                ? `No ${filter.toLowerCase()} requests available` 
                : "No role examination requests available."}
            </p>
          </div>
        )}

        {/* Pagination */}
        {filteredRequests.length > 0 && (
          <div className="flex flex-col md:flex-row justify-between items-center mt-6 pt-6 border-t border-gray-200">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 ${
                currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700'
              }`}
            >
              Previous
            </button>
            
            <div className="flex items-center space-x-2 my-4 md:my-0">
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
        )}
      </div>
    </div>
  );
};

export default RoleExamRequest;