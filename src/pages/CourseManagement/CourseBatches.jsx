import React, { useState } from 'react';
import AddBatchModal from '../../components/Atoms/UI/AddBatchModal';
import ViewBatchModal from '../../components/Atoms/UI/ViewBatchModal';
import Table from '../../components/Atoms/TableData/TableData';

const CourseBatches = () => {
  const [batches, setBatches] = useState([
    { 
      id: 1, 
      startTime: '11:00 AM', 
      endTime: '11:59 AM', 
      totalSeats: 10,
      availableSeats: 10,
      courses: 'Digital Marketing, UI/UX Design, Hindi/gujrati typing / internet, computer hardware, C++, c language, python java script, php, Java, CSS, Digital Print Textile Design, embroidery design, Spoken English, Adobe illustrator HTML, Tripta relly CorelDraw, Photoshop, Tally accounting, ms office',
      status: 'active',
      createdAt: '18/11/2025'
    },
    { 
      id: 2, 
      startTime: '10:00 AM', 
      endTime: '11:00 AM', 
      totalSeats: 10,
      availableSeats: 10,
      courses: 'Digital Marketing, UI/UX Design, Hindi/gujrati typing / internet, computer hardware, C++, c language, python java script, php, Java, CSS, Digital Print Textile Design, embroidery design, Spoken English, Adobe illustrator HTML, Tripta relly CorelDraw, Photoshop, Tally accounting, ms office',
      status: 'active',
      createdAt: '18/11/2025'
    },
    { 
      id: 3, 
      startTime: '02:00 PM', 
      endTime: '03:30 PM', 
      totalSeats: 15,
      availableSeats: 8,
      courses: 'Python, JavaScript, Web Development',
      status: 'active',
      createdAt: '20/11/2025'
    },
    { 
      id: 4, 
      startTime: '06:00 PM', 
      endTime: '08:00 PM', 
      totalSeats: 20,
      availableSeats: 5,
      courses: 'Data Science, Machine Learning, AI',
      status: 'active',
      createdAt: '22/11/2025'
    },
    { 
      id: 5, 
      startTime: '09:00 AM', 
      endTime: '10:30 AM', 
      totalSeats: 12,
      availableSeats: 12,
      courses: 'Mobile App Development, Flutter, React Native',
      status: 'inactive',
      createdAt: '25/11/2025'
    },
    { 
      id: 6, 
      startTime: '04:00 PM', 
      endTime: '06:00 PM', 
      totalSeats: 25,
      availableSeats: 3,
      courses: 'Cloud Computing, AWS, DevOps',
      status: 'active',
      createdAt: '28/11/2025'
    },
    { 
      id: 7, 
      startTime: '01:00 PM', 
      endTime: '03:00 PM', 
      totalSeats: 18,
      availableSeats: 15,
      courses: 'Cyber Security, Ethical Hacking',
      status: 'active',
      createdAt: '30/11/2025'
    },
  ]);

  const [selectedBatch, setSelectedBatch] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [filters, setFilters] = useState({
    startTime: 'all',
    endTime: 'all',
    status: 'all',
    startDate: '',
    endDate: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddBatch = (batchData) => {
    const newBatch = {
      id: batches.length + 1,
      ...batchData,
      createdAt: new Date().toLocaleDateString('en-GB'),
      status: 'active'
    };
    setBatches([newBatch, ...batches]);
    setShowAddModal(false);
  };

  const handleViewBatch = (batch) => {
    setSelectedBatch(batch);
    setShowViewModal(true);
  };

  const handleToggleStatus = (batchId) => {
    setBatches(batches.map(batch => 
      batch.id === batchId 
        ? { ...batch, status: batch.status === 'active' ? 'inactive' : 'active' }
        : batch
    ));
  };

  const handleDeleteBatch = (batchId) => {
    if (window.confirm('Are you sure you want to delete this batch?')) {
      setBatches(batches.filter(batch => batch.id !== batchId));
    }
  };

  const filteredBatches = batches.filter(batch => {
    const matchesSearch = 
      batch.courses.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.startTime.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStartTime = filters.startTime === 'all' || true;
    const matchesEndTime = filters.endTime === 'all' || true;
    const matchesStatus = filters.status === 'all' || batch.status === filters.status;
    
    const matchesDate = () => {
      if (!filters.startDate && !filters.endDate) return true;
      
      const batchDate = new Date(batch.createdAt.split('/').reverse().join('-'));
      const startDate = filters.startDate ? new Date(filters.startDate) : null;
      const endDate = filters.endDate ? new Date(filters.endDate) : null;
      
      if (startDate && endDate) {
        return batchDate >= startDate && batchDate <= endDate;
      }
      if (startDate) return batchDate >= startDate;
      if (endDate) return batchDate <= endDate;
      
      return true;
    };
    
    return matchesSearch && matchesStartTime && matchesEndTime && matchesStatus && matchesDate();
  });

  const courses = [
    'Digital Marketing',
    'UI/UX Design',
    'Hindi/gujrati typing / internet',
    'computer hardware',
    'C++',
    'c language',
    'python',
    'java script',
    'php',
    'Java',
    'CSS',
    'Digital Print Textile Design',
    'embroidery design',
    'Spoken English',
    'Adobe illustrator HTML',
    'Tripta relly CorelDraw',
    'Photoshop',
    'Tally accounting',
    'ms office',
    'Web Development',
    'Data Science',
    'Mobile App Development',
    'Cloud Computing',
    'Cyber Security'
  ];

  const timeSlots = [
    '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM',
    '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
    '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM'
  ];

  const tableHeaders = ['Start Time', 'End Time', 'Total Seat', 'Available Seat', 'Courses', 'Status', 'Created At', 'Actions'];

  return (
    <div className="">
      <div className="container mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-start md:items-center mb-4 flex-col md:flex-row gap-4">
            <div>
              <h1 className="text-3xl font-bold">Course Batches</h1>
              <p className="text-black mt-2">Manage all course batches and schedules</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 font-medium flex items-center gap-2"
            >
              <span className="text-xl">+</span>
              Add Batch
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div>
              <select
                value={filters.startTime}
                onChange={(e) => setFilters({...filters, startTime: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
              >
                <option value="all">Select Batch Start Time</option>
                {timeSlots.map((time, index) => (
                  <option key={index} value={time}>{time}</option>
                ))}
              </select>
            </div>
            
            <div>
              <select
                value={filters.endTime}
                onChange={(e) => setFilters({...filters, endTime: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
              >
                <option value="all">Select Batch End Time</option>
                {timeSlots.map((time, index) => (
                  <option key={index} value={time}>{time}</option>
                ))}
              </select>
            </div>
            
            <div>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
              >
                <option value="all">Select Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            
            <div>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                placeholder="Start Date"
              />
            </div>
            
            <div>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                placeholder="End Date"
              />
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by courses or time..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
              />
            </div>
            <div className="text-sm text-gray-600 ml-4">
              Showing {filteredBatches.length} of {batches.length} batches
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table
              headers={tableHeaders}
              data={filteredBatches}
              renderRow={(batch, index) => (
                <tr 
                  key={batch.id} 
                  className={`hover:bg-sky-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                >
                  <td className="py-4 px-4">
                    <span className="font-bold text-black text-lg">{batch.startTime}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-bold text-black text-lg">{batch.endTime}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <span className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-800 rounded-full text-lg font-bold">
                        {batch.totalSeats}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-lg font-bold ${
                        batch.availableSeats > 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {batch.availableSeats}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-black max-w-xs truncate">
                      {batch.courses}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <span className={`w-3 h-3 rounded-full mr-2 ${
                        batch.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                      }`}></span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        batch.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {batch.status.charAt(0).toUpperCase() + batch.status.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-black">{batch.createdAt}</td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewBatch(batch)}
                        className="text-sky-500 hover:text-sky-700 text-lg"
                        title="View Batch Details"
                      >
                        👁️
                      </button>
                      <button
                        onClick={() => handleToggleStatus(batch.id)}
                        className={`text-lg ${
                          batch.status === 'active' 
                            ? 'text-yellow-500 hover:text-yellow-700' 
                            : 'text-green-500 hover:text-green-700'
                        }`}
                        title={batch.status === 'active' ? 'Deactivate Batch' : 'Activate Batch'}
                      >
                        {batch.status === 'active' ? '⏸️' : '▶️'}
                      </button>
                      <button
                        onClick={() => handleDeleteBatch(batch.id)}
                        className="text-red-500 hover:text-red-700 text-lg"
                        title="Delete Batch"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            />
          </div>

          {filteredBatches.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🕐</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No batches found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || Object.values(filters).some(f => f !== 'all' && f !== '') 
                  ? "No batches match your search criteria" 
                  : "No course batches available. Add your first batch!"}
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600"
              >
                Add First Batch
              </button>
            </div>
          )}
        </div>
      </div>

      <AddBatchModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddBatch}
        courses={courses}
        timeSlots={timeSlots}
      />

      <ViewBatchModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedBatch(null);
        }}
        batchData={selectedBatch}
      />
    </div>
  );
};

export default CourseBatches;