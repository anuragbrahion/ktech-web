import React, { useState } from 'react';
import Table from '../../components/Atoms/TableData/TableData';

const AddComplaintModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    complaintBy: '',
    complaintType: '',
    complaintStatus: '',
    phoneNumber: '',
    assignedTo: '',
    dateOfComplaint: '',
    remarks: '',
    description: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Format the data for saving
    const complaintToSave = {
      ...formData,
      phoneNo: formData.phoneNumber,
      date: formData.dateOfComplaint || new Date().toLocaleDateString('en-GB'),
      resolvedDate: '',
      createdAt: new Date().toLocaleDateString('en-GB')
    };
    
    onSave(complaintToSave);
    
    // Reset form
    setFormData({
      complaintBy: '',
      complaintType: '',
      complaintStatus: '',
      phoneNumber: '',
      assignedTo: '',
      dateOfComplaint: '',
      remarks: '',
      description: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800"># Complaint</h2>
              <h3 className="text-lg font-semibold text-gray-600 mt-1">Add Complaint</h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Complaint By */}
              <div>
                <label className="block text-gray-700 mb-2">Complaint By</label>
                <select
                  name="complaintBy"
                  value={formData.complaintBy}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select...</option>
                  <option value="John Doe">John Doe</option>
                  <option value="Jane Smith">Jane Smith</option>
                  <option value="Robert Johnson">Robert Johnson</option>
                  <option value="Sarah Williams">Sarah Williams</option>
                  <option value="Michael Brown">Michael Brown</option>
                </select>
              </div>

              {/* Complaint Type */}
              <div>
                <label className="block text-gray-700 mb-2">Complaint Type</label>
                <select
                  name="complaintType"
                  value={formData.complaintType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select...</option>
                  <option value="Technical Issue">Technical Issue</option>
                  <option value="Billing Issue">Billing Issue</option>
                  <option value="Service Request">Service Request</option>
                  <option value="Quality Issue">Quality Issue</option>
                </select>
              </div>

              {/* Complaint Status */}
              <div>
                <label className="block text-gray-700 mb-2">Complaint Status</label>
                <select
                  name="complaintStatus"
                  value={formData.complaintStatus}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select...</option>
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter phone number"
                  required
                />
              </div>

              {/* Assigned To */}
              <div>
                <label className="block text-gray-700 mb-2">Assigned To</label>
                <select
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select...</option>
                  <option value="IT Support Team">IT Support Team</option>
                  <option value="Billing Department">Billing Department</option>
                  <option value="Service Team">Service Team</option>
                  <option value="Quality Control">Quality Control</option>
                  <option value="Customer Support">Customer Support</option>
                </select>
              </div>

              {/* Date of Complaint */}
              <div>
                <label className="block text-gray-700 mb-2">Date of Complaint</label>
                <input
                  type="date"
                  name="dateOfComplaint"
                  value={formData.dateOfComplaint}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-gray-700 mb-2">Remarks</label>
                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                  placeholder="Enter remarks"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                  placeholder="Enter detailed description of the complaint"
                  required
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-8">
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
                Create Complaint
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};


const Complaints = () => {
  const [complaints, setComplaints] = useState([
    { 
      id: 1, 
      complaintBy: 'John Doe', 
      complaintType: 'Technical Issue', 
      complaintStatus: 'Open', 
      phoneNo: '+1-234-567-8901', 
      date: '15/01/2025', 
      resolvedDate: '', 
      remarks: 'System not responding', 
      assignedTo: 'IT Support Team', 
      createdAt: '15/01/2025',
      description: 'The system crashes frequently when processing large files.'
    },
    { 
      id: 2, 
      complaintBy: 'Jane Smith', 
      complaintType: 'Billing Issue', 
      complaintStatus: 'In Progress', 
      phoneNo: '+1-234-567-8902', 
      date: '14/01/2025', 
      resolvedDate: '', 
      remarks: 'Incorrect charges', 
      assignedTo: 'Billing Department', 
      createdAt: '14/01/2025',
      description: 'I was charged twice for the same service.'
    },
    { 
      id: 3, 
      complaintBy: 'Robert Johnson', 
      complaintType: 'Service Request', 
      complaintStatus: 'Resolved', 
      phoneNo: '+1-234-567-8903', 
      date: '10/01/2025', 
      resolvedDate: '12/01/2025', 
      remarks: 'Service completed', 
      assignedTo: 'Service Team', 
      createdAt: '10/01/2025',
      description: 'Requested for additional training sessions.'
    },
    { 
      id: 4, 
      complaintBy: 'Sarah Williams', 
      complaintType: 'Quality Issue', 
      complaintStatus: 'Closed', 
      phoneNo: '+1-234-567-8904', 
      date: '08/01/2025', 
      resolvedDate: '10/01/2025', 
      remarks: 'Quality standards not met', 
      assignedTo: 'Quality Control', 
      createdAt: '08/01/2025',
      description: 'The delivered product does not meet the specified quality standards.'
    },
    { 
      id: 5, 
      complaintBy: 'Michael Brown', 
      complaintType: 'Technical Issue', 
      complaintStatus: 'Open', 
      phoneNo: '+1-234-567-8905', 
      date: '05/01/2025', 
      resolvedDate: '', 
      remarks: 'Login problems', 
      assignedTo: 'IT Support Team', 
      createdAt: '05/01/2025',
      description: 'Unable to login to the portal after password reset.'
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [filters, setFilters] = useState({
    complaintBy: '',
    complaintType: '',
    complaintStatus: '',
    startDate: '',
    endDate: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleAddComplaint = () => {
    setShowAddModal(true);
  };

  const handleSaveComplaint = (complaintData) => {
    const newComplaint = {
      id: complaints.length + 1,
      ...complaintData,
      createdAt: new Date().toLocaleDateString('en-GB'),
      date: complaintData.date || new Date().toLocaleDateString('en-GB')
    };
    setComplaints([...complaints, newComplaint]);
    setShowAddModal(false);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      complaintBy: '',
      complaintType: '',
      complaintStatus: '',
      startDate: '',
      endDate: ''
    });
  };

  // Filter complaints
  const filteredComplaints = complaints.filter(complaint => {
    const matchesComplaintBy = filters.complaintBy === '' || 
      complaint.complaintBy.toLowerCase().includes(filters.complaintBy.toLowerCase());
    
    const matchesComplaintType = filters.complaintType === '' || 
      complaint.complaintType === filters.complaintType;
    
    const matchesComplaintStatus = filters.complaintStatus === '' || 
      complaint.complaintStatus === filters.complaintStatus;
    
    // Date filtering
    let matchesDate = true;
    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      const complaintDate = new Date(complaint.date.split('/').reverse().join('-'));
      matchesDate = matchesDate && complaintDate >= startDate;
    }
    
    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      const complaintDate = new Date(complaint.date.split('/').reverse().join('-'));
      matchesDate = matchesDate && complaintDate <= endDate;
    }
    
    return matchesComplaintBy && matchesComplaintType && matchesComplaintStatus && matchesDate;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentComplaints = filteredComplaints.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const tableHeaders = ['Complaint By', 'Complaint Type', 'Complaint Status', 'Phone No', 'Date', 'Resolved Date', 'Remarks', 'Assigned To', 'Created At', 'Actions'];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Open':
        return 'text-red-800';
      case 'In Progress':
        return 'text-yellow-800';
      case 'Resolved':
        return 'text-green-800';
      case 'Closed':
        return 'text-blue-800';
      default:
        return 'text-gray-800';
    }
  };

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Complaints</h1>
        <p className="text-gray-600 mt-2">Manage and track customer complaints</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        {/* Filter Section */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Row 1 */}
            <div>
              <label className="block text-gray-700 mb-2">Complaint By</label>
              <select
                name="complaintBy"
                value={filters.complaintBy}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select...</option>
                {Array.from(new Set(complaints.map(c => c.complaintBy))).map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Complaint Type</label>
              <select
                name="complaintType"
                value={filters.complaintType}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select...</option>
                <option value="Technical Issue">Technical Issue</option>
                <option value="Billing Issue">Billing Issue</option>
                <option value="Service Request">Service Request</option>
                <option value="Quality Issue">Quality Issue</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Row 2 */}
            <div>
              <label className="block text-gray-700 mb-2">Complaint Status</label>
              <select
                name="complaintStatus"
                value={filters.complaintStatus}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select...</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-end">
              <button
                onClick={handleAddComplaint}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium flex items-center justify-center gap-2"
              >
                <span>+</span> Raise Complaints
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table
            headers={tableHeaders}
            data={currentComplaints}
            renderRow={(complaint, index) => (
              <tr 
                key={complaint.id} 
                className={`hover:bg-blue-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
              >
                <td className="py-4 px-4">
                  <div className="font-medium text-gray-800">{complaint.complaintBy}</div>
                </td>
                <td className="">
                  <span className={`rounded-full text-sm ${
                    complaint.complaintType === 'Technical Issue' ? 'text-red-800' :
                    complaint.complaintType === 'Billing Issue' ? 'text-orange-800' :
                    complaint.complaintType === 'Service Request' ? 'text-green-800' :
                    'text-blue-800'
                  }`}>
                    {complaint.complaintType}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className={`rounded-full text-sm font-bold ${getStatusColor(complaint.complaintStatus)}`}>
                    {complaint.complaintStatus}
                  </span>
                </td>
                <td className="py-4 px-4 text-gray-700">{complaint.phoneNo}</td>
                <td className="py-4 px-4 text-gray-700">{complaint.date}</td>
                <td className="py-4 px-4 text-gray-700">
                  {complaint.resolvedDate || '-'}
                </td>
                <td className="py-4 px-4 text-gray-700 max-w-xs truncate">
                  {complaint.remarks}
                </td>
                <td className="py-4 px-4">
                  <span className=" text-purple-800 rounded-full text-sm">
                    {complaint.assignedTo}
                  </span>
                </td>
                <td className="py-4 px-4 text-gray-700">{complaint.createdAt}</td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <button
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded"
                      title="View Complaint"
                    >
                      👁️
                    </button>
                    <button
                      className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded"
                      title="Edit Complaint"
                    >
                      ✏️
                    </button>
                  </div>
                </td>
              </tr>
            )}
          />
        </div>

        {filteredComplaints.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No results.</h3>
            <p className="text-gray-500">
              {Object.values(filters).some(f => f !== '') 
                ? "No complaints match your filter criteria" 
                : "No complaints available. Click 'Raise Complaints' to create one."}
            </p>
          </div>
        )}

        {/* Pagination */}
        {filteredComplaints.length > 0 && (
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

      {/* Add Complaint Modal */}
      <AddComplaintModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleSaveComplaint}
      />
    </div>
  );
};

export default Complaints;