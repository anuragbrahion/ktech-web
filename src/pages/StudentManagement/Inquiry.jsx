// pages/Inquiry.jsx
import React, { useState, useEffect } from 'react';
import Table from '../../components/Atoms/TableData/TableData';
import InquiryModal from '../../components/Atoms/UI/InquiryModal';

const Inquiry = () => {
  const [inquiries, setInquiries] = useState([
    // Sample data
    {
      id: 1,
      name: 'John Doe',
      phoneNo: '9876543210',
      email: 'john@example.com',
      course: 'Tally accounting',
      source: 'Website',
      status: 'New',
      followUpDate: new Date().toISOString().split('T')[0], // Today's date
      remarks: 'Interested in Tally course',
      address: '123 Main Street',
      education: 'Graduate',
      createdAt: new Date().toISOString().split('T')[0]
    },
    {
      id: 2,
      name: 'Jane Smith',
      phoneNo: '8765432109',
      email: 'jane@example.com',
      course: 'ms office',
      source: 'Referral',
      status: 'Interested',
      followUpDate: new Date().toISOString().split('T')[0], // Today's date
      remarks: 'Wants to learn Excel',
      address: '456 Park Avenue',
      education: '12th Pass',
      createdAt: '2024-01-15'
    },
    {
      id: 3,
      name: 'Robert Johnson',
      phoneNo: '7654321098',
      email: 'robert@example.com',
      course: 'Photoshop',
      source: 'Walk-in',
      status: 'Contacted',
      followUpDate: '2024-01-20',
      remarks: 'Follow up next week',
      address: '789 MG Road',
      education: 'Graduate',
      createdAt: '2024-01-10'
    }
  ]);

  const [followUps, setFollowUps] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFollowUpPopupOpen, setIsFollowUpPopupOpen] = useState(true); // Popup opens by default
  const [editingInquiry, setEditingInquiry] = useState(null);
  const [activeTab, setActiveTab] = useState('today'); // 'today' or 'all'
  const [filters, setFilters] = useState({
    name: '',
    source: '',
    status: '',
    followUpDate: ''
  });

  const sources = [...new Set(inquiries.map(inq => inq.source).filter(Boolean))];
  const statuses = [...new Set(inquiries.map(inq => inq.status).filter(Boolean))];

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayFollowUps = inquiries.filter(inq => inq.followUpDate === today);
    setFollowUps(todayFollowUps);
  }, [inquiries]);

  const handleAddInquiry = () => {
    setEditingInquiry(null);
    setIsModalOpen(true);
  };

  const handleEditInquiry = (inquiry) => {
    setEditingInquiry(inquiry);
    setIsModalOpen(true);
  };

  const handleDeleteInquiry = (id) => {
    if (window.confirm('Are you sure you want to delete this inquiry?')) {
      setInquiries(inquiries.filter(inq => inq.id !== id));
      alert('Inquiry deleted successfully!');
    }
  };

  const handleSubmitInquiry = (inquiryData) => {
    if (editingInquiry) {
      setInquiries(inquiries.map(inq => 
        inq.id === editingInquiry.id 
          ? { ...inq, ...inquiryData }
          : inq
      ));
      alert('Inquiry updated successfully!');
    } else {
      const newInquiry = {
        id: inquiries.length + 1,
        ...inquiryData,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setInquiries([...inquiries, newInquiry]);
      alert('Inquiry added successfully!');
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesName = !filters.name || 
                       inquiry.name.toLowerCase().includes(filters.name.toLowerCase());
    const matchesSource = !filters.source || inquiry.source === filters.source;
    const matchesStatus = !filters.status || inquiry.status === filters.status;
    const matchesFollowUpDate = !filters.followUpDate || inquiry.followUpDate === filters.followUpDate;
    
    return matchesName && matchesSource && matchesStatus && matchesFollowUpDate;
  });

  const todayInquiries = inquiries.filter(inq => {
    const today = new Date().toISOString().split('T')[0];
    return inq.followUpDate === today;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  const clearFilters = () => {
    setFilters({
      name: '',
      source: '',
      status: '',
      followUpDate: ''
    });
  };

  const handleDoneFollowUps = () => {
    setIsFollowUpPopupOpen(false);
    alert('Follow ups marked as reviewed!');
  };

  const FollowUpPopup = () => {
    if (!isFollowUpPopupOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl">
          <div className="bg-sky-500 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h2 className="text-xl font-semibold">Today's Follow Ups</h2>
            <button
              onClick={() => setIsFollowUpPopupOpen(false)}
              className="text-white hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>
          
          <div className="p-6">
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-black font-medium">
                You have {followUps.length} follow up{followUps.length !== 1 ? 's' : ''} scheduled for today.
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Date: {new Date().toLocaleDateString('en-GB')}
              </p>
            </div>

            {followUps.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-4 text-left text-gray-700 font-semibold">Sr No.</th>
                      <th className="py-3 px-4 text-left text-gray-700 font-semibold">Name</th>
                      <th className="py-3 px-4 text-left text-gray-700 font-semibold">Phone No</th>
                      <th className="py-3 px-4 text-left text-gray-700 font-semibold">Course</th>
                      <th className="py-3 px-4 text-left text-gray-700 font-semibold">Status</th>
                      <th className="py-3 px-4 text-left text-gray-700 font-semibold">Remarks</th>
                      <th className="py-3 px-4 text-left text-gray-700 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {followUps.map((followUp, index) => (
                      <tr 
                        key={followUp.id} 
                        className={`hover:bg-sky-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                      >
                        <td className="py-3 px-4 text-black">{index + 1}</td>
                        <td className="py-3 px-4 text-black font-medium">{followUp.name}</td>
                        <td className="py-3 px-4 text-black">
                          <a href={`tel:${followUp.phoneNo}`} className="text-sky-600 hover:text-sky-800">
                            {followUp.phoneNo}
                          </a>
                        </td>
                        <td className="py-3 px-4 text-black">{followUp.course || 'N/A'}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-sm ${
                            followUp.status === 'New' ? 'bg-yellow-100 text-yellow-800' :
                            followUp.status === 'Contacted' ? 'bg-blue-100 text-blue-800' :
                            followUp.status === 'Interested' ? 'bg-green-100 text-green-800' :
                            followUp.status === 'Not Interested' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {followUp.status || 'Pending'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-black text-sm max-w-xs truncate">
                          {followUp.remarks || 'No remarks'}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                handleEditInquiry(followUp);
                                setIsFollowUpPopupOpen(false);
                              }}
                              className="text-sky-500 hover:text-sky-700 p-1 hover:bg-sky-50 rounded"
                              title="Edit"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm('Mark as contacted?')) {
                                  const updatedInquiries = inquiries.map(inq =>
                                    inq.id === followUp.id 
                                      ? { ...inq, status: 'Contacted' }
                                      : inq
                                  );
                                  setInquiries(updatedInquiries);
                                  alert('Marked as contacted!');
                                }
                              }}
                              className="text-green-500 hover:text-green-700 p-1 hover:bg-green-50 rounded"
                              title="Mark as Contacted"
                            >
                              📞
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm('Schedule follow up for tomorrow?')) {
                                  const tomorrow = new Date();
                                  tomorrow.setDate(tomorrow.getDate() + 1);
                                  const tomorrowStr = tomorrow.toISOString().split('T')[0];
                                  
                                  const updatedInquiries = inquiries.map(inq =>
                                    inq.id === followUp.id 
                                      ? { ...inq, followUpDate: tomorrowStr }
                                      : inq
                                  );
                                  setInquiries(updatedInquiries);
                                  alert('Follow up scheduled for tomorrow!');
                                }
                              }}
                              className="text-purple-500 hover:text-purple-700 p-1 hover:bg-purple-50 rounded"
                              title="Schedule for Tomorrow"
                            >
                              📅
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No follow-ups for today. Great job!</p>
              </div>
            )}

            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
              <button
                onClick={() => setIsFollowUpPopupOpen(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Skip
              </button>
              <button
                onClick={handleDoneFollowUps}
                className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-sky-600">Inquiry Management</h1>
          <p className="text-black mt-2">Manage customer inquiries and follow-ups</p>
        </div>

        {/* Main Content - Single Column Layout */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('today')}
                className={`px-4 py-2 rounded-md ${
                  activeTab === 'today'
                    ? 'bg-sky-500 text-white'
                    : 'bg-gray-100 text-black hover:bg-gray-200'
                }`}
              >
                Today's Follow-ups ({todayInquiries.length})
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-md ${
                  activeTab === 'all'
                    ? 'bg-sky-500 text-white'
                    : 'bg-gray-100 text-black hover:bg-gray-200'
                }`}
              >
                All Inquiries ({inquiries.length})
              </button>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setIsFollowUpPopupOpen(true)}
                className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 flex items-center gap-2"
              >
                <span>📋</span>
                Show Today's Follow-ups
              </button>
              <button
                onClick={handleAddInquiry}
                className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 flex items-center gap-2"
              >
                <span>+</span>
                Add Inquiry
              </button>
            </div>
          </div>

          {activeTab === 'today' && (
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Today's Follow-ups ({todayInquiries.length})
                </h3>
                <p className="text-sm text-gray-600">
                  Follow-ups scheduled for {new Date().toLocaleDateString('en-GB')}
                </p>
              </div>

              {todayInquiries.length > 0 ? (
                <Table
                  headers={['Name', 'Phone No', 'Course', 'Source', 'Status', 'Remarks', 'Actions']}
                  data={todayInquiries}
                  renderRow={(inquiry, index) => (
                    <tr 
                      key={inquiry.id} 
                      className={`hover:bg-sky-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                    >
                      <td className="py-4 px-4 text-black font-medium">{inquiry.name}</td>
                      <td className="py-4 px-4 text-black">
                        <a href={`tel:${inquiry.phoneNo}`} className="text-sky-600 hover:text-sky-800">
                          {inquiry.phoneNo}
                        </a>
                      </td>
                      <td className="py-4 px-4 text-black">{inquiry.course || 'N/A'}</td>
                      <td className="py-4 px-4 text-black">
                        {inquiry.source ? (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                            {inquiry.source}
                          </span>
                        ) : 'N/A'}
                      </td>
                      <td className="py-4 px-4 text-black">
                        {inquiry.status ? (
                          <span className={`px-2 py-1 rounded text-sm ${
                            inquiry.status === 'New' ? 'bg-yellow-100 text-yellow-800' :
                            inquiry.status === 'Contacted' ? 'bg-blue-100 text-blue-800' :
                            inquiry.status === 'Interested' ? 'bg-green-100 text-green-800' :
                            inquiry.status === 'Not Interested' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {inquiry.status}
                          </span>
                        ) : 'N/A'}
                      </td>
                      <td className="py-4 px-4 text-black text-sm max-w-xs truncate">
                        {inquiry.remarks || 'No remarks'}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditInquiry(inquiry)}
                            className="text-sky-500 hover:text-sky-700 p-1 hover:bg-sky-50 rounded"
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('Mark as contacted?')) {
                                const updatedInquiries = inquiries.map(inq =>
                                  inq.id === inquiry.id 
                                    ? { ...inq, status: 'Contacted' }
                                    : inq
                                );
                                setInquiries(updatedInquiries);
                                alert('Marked as contacted!');
                              }
                            }}
                            className="text-green-500 hover:text-green-700 p-1 hover:bg-green-50 rounded"
                            title="Mark as Contacted"
                          >
                            📞
                          </button>
                          <button
                            onClick={() => handleDeleteInquiry(inquiry.id)}
                            className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded"
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                />
              ) : (
                <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500 mb-2">No follow-ups scheduled for today</p>
                  <button
                    onClick={handleAddInquiry}
                    className="px-4 py-2 bg-sky-100 text-sky-700 rounded-md hover:bg-sky-200"
                  >
                    Add New Inquiry
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'all' && (
            <>
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-black mb-2">Name</label>
                    <select
                      value={filters.name}
                      onChange={(e) => handleFilterChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                    >
                      <option value="">No Select ---</option>
                      {[...new Set(inquiries.map(i => i.name))].map((name, index) => (
                        <option key={index} value={name}>{name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-black mb-2">Sources</label>
                    <select
                      value={filters.source}
                      onChange={(e) => handleFilterChange('source', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                    >
                      <option value="">No Select ---</option>
                      {sources.map((source, index) => (
                        <option key={index} value={source}>{source}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-black mb-2">Select Status</label>
                    <select
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                    >
                      <option value="">No Select ---</option>
                      {statuses.map((status, index) => (
                        <option key={index} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-black mb-2">FollowUpDate</label>
                    <div className="flex space-x-2">
                      <input
                        type="date"
                        value={filters.followUpDate}
                        onChange={(e) => handleFilterChange('followUpDate', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                      />
                      <button
                        onClick={clearFilters}
                        className="px-3 py-2 bg-gray-200 text-black rounded-md hover:bg-gray-300"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                {filteredInquiries.length > 0 ? (
                  <Table
                    headers={['Name', 'Phone No', 'Follow Up Date', 'Course', 'Source', 'Status', 'Actions']}
                    data={filteredInquiries}
                    renderRow={(inquiry, index) => (
                      <tr 
                        key={inquiry.id} 
                        className={`hover:bg-sky-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                      >
                        <td className="py-4 px-4 text-black font-medium">{inquiry.name}</td>
                        <td className="py-4 px-4 text-black">
                          <a href={`tel:${inquiry.phoneNo}`} className="text-sky-600 hover:text-sky-800">
                            {inquiry.phoneNo}
                          </a>
                        </td>
                        <td className="py-4 px-4 text-black">
                          <span className={`${inquiry.followUpDate === new Date().toISOString().split('T')[0] ? 'font-bold text-red-600' : ''}`}>
                            {formatDate(inquiry.followUpDate)}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-black">{inquiry.course || 'N/A'}</td>
                        <td className="py-4 px-4 text-black">
                          {inquiry.source ? (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                              {inquiry.source}
                            </span>
                          ) : 'N/A'}
                        </td>
                        <td className="py-4 px-4 text-black">
                          {inquiry.status ? (
                            <span className={`px-2 py-1 rounded text-sm ${
                              inquiry.status === 'New' ? 'bg-yellow-100 text-yellow-800' :
                              inquiry.status === 'Contacted' ? 'bg-blue-100 text-blue-800' :
                              inquiry.status === 'Interested' ? 'bg-green-100 text-green-800' :
                              inquiry.status === 'Not Interested' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {inquiry.status}
                            </span>
                          ) : 'N/A'}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditInquiry(inquiry)}
                              className="text-sky-500 hover:text-sky-700 p-1 hover:bg-sky-50 rounded"
                              title="Edit"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDeleteInquiry(inquiry.id)}
                              className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded"
                              title="Delete"
                            >
                              🗑️
                            </button>
                            <button
                              onClick={() => {
                                const today = new Date().toISOString().split('T')[0];
                                const updatedInquiries = inquiries.map(inq =>
                                  inq.id === inquiry.id 
                                    ? { ...inq, followUpDate: today }
                                    : inq
                                );
                                setInquiries(updatedInquiries);
                                alert('Follow up scheduled for today!');
                              }}
                              className="text-purple-500 hover:text-purple-700 p-1 hover:bg-purple-50 rounded"
                              title="Schedule for Today"
                            >
                              📅
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  />
                ) : (
                  <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500 mb-2">No inquiries found</p>
                    <button
                      onClick={handleAddInquiry}
                      className="px-4 py-2 bg-sky-100 text-sky-700 rounded-md hover:bg-sky-200"
                    >
                      Add New Inquiry
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-sky-50 p-6 rounded-lg shadow border border-sky-100">
            <h3 className="text-lg font-semibold text-sky-700">Total Inquiries</h3>
            <p className="text-3xl font-bold text-black mt-2">{inquiries.length}</p>
          </div>
          <div className="bg-yellow-50 p-6 rounded-lg shadow border border-yellow-100">
            <h3 className="text-lg font-semibold text-yellow-700">Today's Follow-ups</h3>
            <p className="text-3xl font-bold text-black mt-2">{todayInquiries.length}</p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg shadow border border-green-100">
            <h3 className="text-lg font-semibold text-green-700">Interested</h3>
            <p className="text-3xl font-bold text-black mt-2">
              {inquiries.filter(i => i.status === 'Interested').length}
            </p>
          </div>
          <div className="bg-blue-50 p-6 rounded-lg shadow border border-blue-100">
            <h3 className="text-lg font-semibold text-blue-700">New</h3>
            <p className="text-3xl font-bold text-black mt-2">
              {inquiries.filter(i => i.status === 'New').length}
            </p>
          </div>
        </div>
      </div>

      {/* Follow Up Popup - Opens by default */}
      <FollowUpPopup />

      <InquiryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingInquiry(null);
        }}
        onSubmit={handleSubmitInquiry}
        initialData={editingInquiry}
      />
    </div>
  );
};

export default Inquiry;