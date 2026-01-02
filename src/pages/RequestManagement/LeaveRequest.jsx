import React, { useEffect, useState } from 'react';
import Table from '../../components/Atoms/TableData/TableData';


const ViewLeaveModal = ({ isOpen, onClose, leaveData }) => {
  if (!isOpen || !leaveData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Leave Request
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Update your request</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* User Name */}
              <div>
                <label className="block text-gray-700 mb-2">User Name</label>
                <div className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {leaveData.userName}
                </div>
              </div>

              {/* Apply Date */}
              <div>
                <label className="block text-gray-700 mb-2">Apply Date</label>
                <div className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {leaveData.applyDate}
                </div>
              </div>

              {/* From and To Dates */}
              <div>
                <label className="block text-gray-700 mb-2">From</label>
                <div className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {leaveData.leaveFrom}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">To</label>
                <div className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {leaveData.leaveTo}
                </div>
              </div>

              {/* Leave Type */}
              <div>
                <label className="block text-gray-700 mb-2">Leave Type</label>
                <div className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {leaveData.leaveType}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-gray-700 mb-2">Status</label>
                <div className={`w-full px-4 py-2 border rounded-md ${
                  leaveData.status === 'Approved' ? 'bg-green-100 text-green-800 border-green-200' :
                  leaveData.status === 'Rejected' ? 'bg-red-100 text-red-800 border-red-200' :
                  'bg-yellow-100 text-yellow-800 border-yellow-200'
                }`}>
                  {leaveData.status}
                </div>
              </div>
            </div>

            {/* Reason */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Reason</label>
              <div className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 min-h-[100px]">
                {leaveData.reason || 'No reason provided'}
              </div>
            </div>

            {/* Remarks (if any) */}
            {leaveData.remarks && (
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Remarks</label>
                <div className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 min-h-[80px]">
                  {leaveData.remarks}
                </div>
              </div>
            )}
          </div>

          {/* Close Button */}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const UpdateStatusModal = ({ isOpen, onClose, onSave, leaveData }) => {
  const [status, setStatus] = useState('');
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    if (leaveData) {
      setStatus(leaveData.status);
      setRemarks(leaveData.remarks || '');
    }
  }, [leaveData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!status) return;
    
    onSave({ status, remarks });
  };

  if (!isOpen || !leaveData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Update Leave Status
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Change the status of this leave request
            </h3>
            
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-gray-600 mb-1">Leave Request Details:</p>
              <p className="font-medium text-gray-800">{leaveData.userName}</p>
              <p className="text-sm text-gray-600">
                {leaveData.leaveType} from {leaveData.leaveFrom} to {leaveData.leaveTo}
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Status Dropdown */}
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select...</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              {/* Remarks Textarea */}
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Remarks</label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                  placeholder="Add remarks for status update (optional)"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                >
                  Update Status
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const LeaveRequest = () => {
  const [leaves, setLeaves] = useState([
    { 
      id: 1, 
      userName: 'Venial Subhash Kakraie', 
      applyDate: '01/12/2025', 
      leaveType: 'leave with pay', 
      leaveFrom: '02/12/2025', 
      leaveTo: '05/12/2025', 
      status: 'Approved',
      reason: 'Medical checkup',
      remarks: ''
    },
    { 
      id: 2, 
      userName: 'Rahul Prabhakar Balagir', 
      applyDate: '01/12/2025', 
      leaveType: 'leave with pay', 
      leaveFrom: '19/01/2026', 
      leaveTo: '06/02/2026', 
      status: 'Approved',
      reason: 'Family function',
      remarks: ''
    },
    { 
      id: 3, 
      userName: 'Mohammad Anash jamedi Shakh', 
      applyDate: '25/11/2025', 
      leaveType: 'Full day', 
      leaveFrom: '11/12/2025', 
      leaveTo: '20/12/2025', 
      status: 'Approved',
      reason: 'Personal work',
      remarks: ''
    },
    { 
      id: 4, 
      userName: 'shakh amin fank', 
      applyDate: '15/11/2025', 
      leaveType: 'Half day', 
      leaveFrom: '15/11/2025', 
      leaveTo: '15/11/2025', 
      status: 'Rejected',
      reason: 'Doctor appointment',
      remarks: 'Insufficient notice period'
    },
    { 
      id: 5, 
      userName: 'Yasmin Maksud Shakh', 
      applyDate: '14/11/2025', 
      leaveType: 'Half day', 
      leaveFrom: '14/11/2025', 
      leaveTo: '14/11/2025', 
      status: 'Pending',
      reason: 'Urgent personal work',
      remarks: ''
    },
    { 
      id: 6, 
      userName: 'Zeenat Ahemad Ali Shah', 
      applyDate: '12/11/2025', 
      leaveType: 'Half day', 
      leaveFrom: '12/11/2025', 
      leaveTo: '13/11/2025', 
      status: 'Pending',
      reason: 'Wedding ceremony',
      remarks: ''
    },
    { 
      id: 7, 
      userName: 'Ram manshi bhai sordagar', 
      applyDate: '11/11/2025', 
      leaveType: 'Full day', 
      leaveFrom: '12/11/2025', 
      leaveTo: '14/11/2025', 
      status: 'Pending',
      reason: 'Outstation work',
      remarks: ''
    },
    { 
      id: 8, 
      userName: 'Nishba Rahimuddin Shakh', 
      applyDate: '12/11/2025', 
      leaveType: 'Half day', 
      leaveFrom: '12/11/2025', 
      leaveTo: '13/11/2025', 
      status: 'Rejected',
      reason: 'College fest',
      remarks: 'Not approved by department head'
    },
  ]);

  const [showViewModal, setShowViewModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [filters, setFilters] = useState({
    userName: '',
    leaveType: '',
    leaveStatus: ''
  });

  // Filter handlers
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      userName: '',
      leaveType: '',
      leaveStatus: ''
    });
  };

  // Action handlers
  const handleViewLeave = (leave) => {
    setSelectedLeave(leave);
    setShowViewModal(true);
  };

  const handleUpdateStatus = (leave) => {
    setSelectedLeave(leave);
    setShowStatusModal(true);
  };

  const handleSaveStatus = (updatedData) => {
    setLeaves(leaves.map(leave => 
      leave.id === selectedLeave.id 
        ? { 
            ...leave, 
            status: updatedData.status,
            remarks: updatedData.remarks
          }
        : leave
    ));
    setShowStatusModal(false);
    setSelectedLeave(null);
  };

  // Filter leaves
  const filteredLeaves = leaves.filter(leave => {
    return (
      (filters.userName === '' || leave.userName.toLowerCase().includes(filters.userName.toLowerCase())) &&
      (filters.leaveType === '' || leave.leaveType === filters.leaveType) &&
      (filters.leaveStatus === '' || leave.status === filters.leaveStatus)
    );
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Pagination calculations
  const totalPages = Math.ceil(filteredLeaves.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLeaves = filteredLeaves.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const tableHeaders = ['User Name', 'Apply Date', 'Leave Type', 'Leave From', 'Leave To', 'Status', 'Actions'];

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
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Leave Requests</h1>
        <p className="text-gray-600 mt-2">Manage and review employee leave requests</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        {/* Filter Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <select
              name="userName"
              value={filters.userName}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">--- no select ---</option>
              <option value="Venial Subhash Kakraie">Venial Subhash Kakraie</option>
              <option value="Rahul Prabhakar Balagir">Rahul Prabhakar Balagir</option>
              <option value="Mohammad Anash jamedi Shakh">Mohammad Anash jamedi Shakh</option>
              <option value="shakh amin fank">shakh amin fank</option>
              <option value="Yasmin Maksud Shakh">Yasmin Maksud Shakh</option>
              <option value="Zeenat Ahemad Ali Shah">Zeenat Ahemad Ali Shah</option>
              <option value="Ram manshi bhai sordagar">Ram manshi bhai sordagar</option>
              <option value="Nishba Rahimuddin Shakh">Nishba Rahimuddin Shakh</option>
            </select>
          </div>
          
          <div>
            <select
              name="leaveType"
              value={filters.leaveType}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">--- no select ---</option>
              <option value="leave with pay">leave with pay</option>
              <option value="Full day">Full day</option>
              <option value="Half day">Half day</option>
            </select>
          </div>
          
          <div>
            <select
              name="leaveStatus"
              value={filters.leaveStatus}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">--- no select ---</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          
          <div>
            <button 
              onClick={handleResetFilters}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
            >
              Filter
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table
            headers={tableHeaders}
            data={currentLeaves}
            renderRow={(leave, index) => (
              <tr 
                key={leave.id} 
                className={`hover:bg-blue-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
              >
                <td className="py-4 px-4">
                  <div className="font-medium text-gray-800">{leave.userName}</div>
                </td>
                <td className="py-4 px-4 text-gray-700">{leave.applyDate}</td>
                <td className="py-4 px-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    leave.leaveType === 'Full day' ? 'bg-blue-100 text-blue-800' :
                    leave.leaveType === 'Half day' ? 'bg-purple-100 text-purple-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {leave.leaveType}
                  </span>
                </td>
                <td className="py-4 px-4 text-gray-700">{leave.leaveFrom}</td>
                <td className="py-4 px-4 text-gray-700">{leave.leaveTo}</td>
                <td className="py-4 px-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getStatusColor(leave.status)}`}>
                    {leave.status}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewLeave(leave)}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded text-xl"
                      title="View Leave Details"
                    >
                      💬
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(leave)}
                      className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded text-xl"
                      title="Update Leave Status"
                    >
                      💬
                    </button>
                  </div>
                </td>
              </tr>
            )}
          />
        </div>

        {filteredLeaves.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No leave requests found</h3>
            <p className="text-gray-500">
              {Object.values(filters).some(f => f !== '') 
                ? "No leave requests match your filter criteria" 
                : "No leave requests available."}
            </p>
          </div>
        )}

        {/* Pagination */}
        {filteredLeaves.length > 0 && (
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

      {/* View Leave Modal */}
      <ViewLeaveModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedLeave(null);
        }}
        leaveData={selectedLeave}
      />

      {/* Update Status Modal */}
      <UpdateStatusModal
        isOpen={showStatusModal}
        onClose={() => {
          setShowStatusModal(false);
          setSelectedLeave(null);
        }}
        onSave={handleSaveStatus}
        leaveData={selectedLeave}
      />
    </div>
  );
};

export default LeaveRequest;