import React, { useState } from 'react';
import Table from '../../components/Atoms/TableData/TableData';
import StatusModal from '../../components/Atoms/UI/StatusModal';

const InquiryStatus = () => {
  const [statuses, setStatuses] = useState([
    { 
      id: 1, 
      name: 'Deative', 
      type: 'inactive',
      createdAt: '15/11/2025',
      description: 'Inactive or deactivated inquiries'
    },
    { 
      id: 2, 
      name: 'Cancelled', 
      type: 'cancelled',
      createdAt: '12/11/2025',
      description: 'Cancelled inquiries'
    },
    { 
      id: 3, 
      name: 'Pending......', 
      type: 'pending',
      createdAt: '10/11/2025',
      description: 'Inquiries pending review or follow-up'
    },
    { 
      id: 4, 
      name: 'Active', 
      type: 'active',
      createdAt: '08/11/2025',
      description: 'Active and ongoing inquiries'
    },
    { 
      id: 5, 
      name: 'Converted', 
      type: 'converted',
      createdAt: '05/11/2025',
      description: 'Inquiries converted to admissions'
    },
    { 
      id: 6, 
      name: 'Follow-up', 
      type: 'followup',
      createdAt: '01/11/2025',
      description: 'Inquiries requiring follow-up'
    },
    { 
      id: 7, 
      name: 'Not Interested', 
      type: 'not_interested',
      createdAt: '28/10/2025',
      description: 'Inquiries marked as not interested'
    },
    { 
      id: 8, 
      name: 'Enrolled', 
      type: 'enrolled',
      createdAt: '25/10/2025',
      description: 'Inquiries that have enrolled'
    },
  ]);

  const [selectedStatus, setSelectedStatus] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const handleAddStatus = () => {
    setModalMode('add');
    setSelectedStatus(null);
    setShowStatusModal(true);
  };

  const handleEditStatus = (status) => {
    setModalMode('edit');
    setSelectedStatus(status);
    setShowStatusModal(true);
  };

  const handleSaveStatus = (statusData) => {
    if (modalMode === 'add') {
      const newStatus = {
        id: statuses.length + 1,
        ...statusData,
        type: getStatusType(statusData.name),
        createdAt: new Date().toLocaleDateString('en-GB'),
        description: statusData.description || ''
      };
      setStatuses([newStatus, ...statuses]);
    } else {
      const updatedStatus = {
        ...statusData,
        type: getStatusType(statusData.name)
      };
      setStatuses(statuses.map(status => 
        status.id === selectedStatus.id 
          ? { ...status, ...updatedStatus }
          : status
      ));
    }
    setShowStatusModal(false);
    setSelectedStatus(null);
  };

  const getStatusType = (name) => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes('active')) return 'active';
    if (nameLower.includes('cancel')) return 'cancelled';
    if (nameLower.includes('deative') || nameLower.includes('inactive')) return 'inactive';
    if (nameLower.includes('pending')) return 'pending';
    if (nameLower.includes('convert')) return 'converted';
    if (nameLower.includes('follow')) return 'followup';
    if (nameLower.includes('enroll')) return 'enrolled';
    if (nameLower.includes('not interested')) return 'not_interested';
    return 'other';
  };

  const getStatusColor = (type) => {
    switch(type) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'converted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'followup': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'enrolled': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'not_interested': return 'bg-pink-100 text-pink-800 border-pink-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleToggleStatus = (statusId) => {
    setStatuses(statuses.map(status => 
      status.id === statusId 
        ? { 
            ...status, 
            type: status.type === 'active' ? 'inactive' : 'active',
            name: status.type === 'active' ? `Inactive - ${status.name}` : status.name.replace('Inactive - ', '')
          }
        : status
    ));
  };

  const handleDeleteStatus = (statusId) => {
    if (window.confirm('Are you sure you want to delete this status?')) {
      setStatuses(statuses.filter(status => status.id !== statusId));
    }
  };

  const filteredStatuses = statuses.filter(status => {
    const matchesSearch = 
      status.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (status.description && status.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = 
      typeFilter === 'all' || status.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const tableHeaders = ['Status', 'Type', 'Created At', 'Description', 'Actions'];

  const statusTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'converted', label: 'Converted' },
    { value: 'followup', label: 'Follow-up' },
    { value: 'enrolled', label: 'Enrolled' },
    { value: 'not_interested', label: 'Not Interested' }
  ];

  return (
    <div className="">
      <div className="container mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-start md:items-center mb-4 flex-col md:flex-row gap-4">
            <div>
              <h1 className="text-3xl font-bold">Status Management</h1>
              <p className="text-black mt-2">Manage inquiry statuses and their configurations</p>
            </div>
            <button
              onClick={handleAddStatus}
              className="px-6 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 font-medium flex items-center gap-2"
            >
              <span className="text-xl">+</span>
              Add Status
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 md:w-64">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
              >
                {statusTypes.map((type, index) => (
                  <option key={index} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search statuses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
              />
            </div>
            
            <div className="md:w-32">
              <button className="w-full px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600">
                Filter
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table
              headers={tableHeaders}
              data={filteredStatuses}
              renderRow={(status, index) => (
                <tr 
                  key={status.id} 
                  className={`hover:bg-sky-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                >
                  <td className="py-4 px-4">
                    <div className="font-medium text-black text-lg">{status.name}</div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(status.type)}`}>
                      {status.type.charAt(0).toUpperCase() + status.type.slice(1).replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-black">{status.createdAt}</td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-600 max-w-xs">
                      {status.description}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditStatus(status)}
                        className="text-sky-500 hover:text-sky-700 text-lg"
                        title="Edit Status"
                      >
                        👁️
                      </button>
                      <button
                        onClick={() => handleToggleStatus(status.id)}
                        className={`text-lg ${
                          status.type === 'active' || status.type === 'converted' || status.type === 'enrolled'
                            ? 'text-yellow-500 hover:text-yellow-700' 
                            : 'text-green-500 hover:text-green-700'
                        }`}
                        title={status.type === 'active' ? 'Deactivate' : 'Activate'}
                      >
                        {status.type === 'active' || status.type === 'converted' || status.type === 'enrolled' ? '⏸️' : '▶️'}
                      </button>
                      <button
                        onClick={() => handleDeleteStatus(status.id)}
                        className="text-red-500 hover:text-red-700 text-lg"
                        title="Delete Status"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            />
          </div>

          {filteredStatuses.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🏷️</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No statuses found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || typeFilter !== 'all' 
                  ? "No statuses match your search criteria" 
                  : "No statuses available. Add your first status!"}
              </p>
              <button
                onClick={handleAddStatus}
                className="px-6 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600"
              >
                Add First Status
              </button>
            </div>
          )}

          {filteredStatuses.length > 0 && (
            <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50">
                Previous
              </button>
              <div className="text-sm text-gray-600">
                Page 1 of {Math.ceil(filteredStatuses.length / 10)}
              </div>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50">
                Next
              </button>
            </div>
          )}
        </div>

        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-sky-700 mb-4">Status Color Guide</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
              <span className="text-black text-sm">Active</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
              <span className="text-black text-sm">Pending</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
              <span className="text-black text-sm">Cancelled</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-gray-500 mr-2"></span>
              <span className="text-black text-sm">Inactive</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
              <span className="text-black text-sm">Converted</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-purple-500 mr-2"></span>
              <span className="text-black text-sm">Follow-up</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></span>
              <span className="text-black text-sm">Enrolled</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-pink-500 mr-2"></span>
              <span className="text-black text-sm">Not Interested</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Status colors help quickly identify the state of inquiries in the system.
          </p>
        </div>
      </div>

      <StatusModal
        isOpen={showStatusModal}
        onClose={() => {
          setShowStatusModal(false);
          setSelectedStatus(null);
        }}
        statusData={selectedStatus}
        mode={modalMode}
        onSubmit={handleSaveStatus}
      />
    </div>
  );
};

export default InquiryStatus;