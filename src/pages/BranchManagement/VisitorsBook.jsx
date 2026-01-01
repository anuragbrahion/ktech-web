import React, { useState } from 'react';
import Table from '../../components/Atoms/TableData/TableData';
import AddVisitorModal from '../../components/Atoms/UI/AddVisitorModal';

const VisitorsBook = () => {
  const [visitors, setVisitors] = useState([
    { 
      id: 1, 
      name: 'John Doe', 
      phoneNo: '9876543210', 
      meetingWith: 'Principal', 
      date: '2025-01-15', 
      followUpDate: '2025-01-22', 
      purpose: 'Admission Inquiry', 
      totalPersons: 2, 
      inTime: '10:30 AM', 
      outTime: '11:15 AM' 
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      phoneNo: '9123456789', 
      meetingWith: 'Administrator', 
      date: '2025-01-16', 
      followUpDate: '2025-01-23', 
      purpose: 'Fee Payment', 
      totalPersons: 1, 
      inTime: '02:15 PM', 
      outTime: '02:45 PM' 
    },
    { 
      id: 3, 
      name: 'Robert Johnson', 
      phoneNo: '9988776655', 
      meetingWith: 'Teacher', 
      date: '2025-01-14', 
      followUpDate: '2025-01-21', 
      purpose: 'Student Progress', 
      totalPersons: 2, 
      inTime: '09:45 AM', 
      outTime: '10:30 AM' 
    },
    { 
      id: 4, 
      name: 'Sarah Williams', 
      phoneNo: '8899776655', 
      meetingWith: 'Coordinator', 
      date: '2025-01-17', 
      followUpDate: '2025-01-24', 
      purpose: 'Course Information', 
      totalPersons: 3, 
      inTime: '11:00 AM', 
      outTime: '11:45 AM' 
    },
    { 
      id: 5, 
      name: 'Michael Brown', 
      phoneNo: '7766554433', 
      meetingWith: 'Principal', 
      date: '2025-01-13', 
      followUpDate: '2025-01-20', 
      purpose: 'Interview', 
      totalPersons: 1, 
      inTime: '03:30 PM', 
      outTime: '04:15 PM' 
    },
    { 
      id: 6, 
      name: 'Emily Davis', 
      phoneNo: '8877665544', 
      meetingWith: 'Administrator', 
      date: '2025-01-18', 
      followUpDate: '2025-01-25', 
      purpose: 'Document Submission', 
      totalPersons: 1, 
      inTime: '01:00 PM', 
      outTime: '01:30 PM' 
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const handleAddVisitor = (visitorData) => {
    const newVisitor = {
      id: visitors.length + 1,
      ...visitorData,
      inTime: formatTime(visitorData.inTime),
      outTime: formatTime(visitorData.outTime),
      date: formatDate(visitorData.date),
      followUpDate: formatDate(visitorData.followUpDate)
    };
    setVisitors([newVisitor, ...visitors]);
    setShowAddModal(false);
  };

  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    });
  };

  const filteredVisitors = visitors.filter(visitor => {
    const matchesSearch = 
      visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.phoneNo.includes(searchTerm) ||
      visitor.meetingWith.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = !filterDate || visitor.date === filterDate;
    
    return matchesSearch && matchesDate;
  });

  // const stats = {
  //   total: visitors.length,
  //   today: visitors.filter(v => v.date === new Date().toLocaleDateString('en-US')).length,
  //   upcomingFollowups: visitors.filter(v => {
  //     const followUp = new Date(v.followUpDate);
  //     const today = new Date();
  //     const nextWeek = new Date(today);
  //     nextWeek.setDate(today.getDate() + 7);
  //     return followUp >= today && followUp <= nextWeek;
  //   }).length,
  //   pending: 2 // You can calculate this based on your logic
  // };

  const tableHeaders = [
    'Visitor Name',
    'Phone No',
    'Meeting With',
    'Date',
    'Follow Up Date',
    'Purpose',
    'Total Persons',
    'Actions'
  ];

  return (
    <div className="">
      <div className="container mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-start md:items-center mb-4 flex-col md:flex-row gap-4">
            <div>
              <h1 className="text-3xl font-bold text-black">Visitor's Book List</h1>
              <p className="text-black mt-2">Manage and track all visitor records</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 font-medium flex items-center gap-2"
            >
              <span className="text-xl">+</span>
              Add Visitor
            </button>
          </div>
        </div>

        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-sky-50 p-6 rounded-lg shadow border border-sky-100">
            <h3 className="text-lg font-semibold text-sky-700">Total Visitors</h3>
            <p className="text-3xl font-bold text-black mt-2">{stats.total}</p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg shadow border border-green-100">
            <h3 className="text-lg font-semibold text-green-700">Today's Visitors</h3>
            <p className="text-3xl font-bold text-black mt-2">{stats.today}</p>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg shadow border border-purple-100">
            <h3 className="text-lg font-semibold text-purple-700">Upcoming Follow-ups</h3>
            <p className="text-3xl font-bold text-black mt-2">{stats.upcomingFollowups}</p>
          </div>
          <div className="bg-yellow-50 p-6 rounded-lg shadow border border-yellow-100">
            <h3 className="text-lg font-semibold text-yellow-700">Pending Actions</h3>
            <p className="text-3xl font-bold text-black mt-2">{stats.pending}</p>
          </div>
        </div> */}

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              <div className="flex-1 md:flex-none">
                <input
                  type="text"
                  placeholder="Search visitors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                />
              </div>
              <div className="flex-1 md:flex-none">
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                />
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Showing {filteredVisitors.length} of {visitors.length} visitors
            </div>
          </div>

          {filteredVisitors.length > 0 ? (
            <Table
              headers={tableHeaders}
              data={filteredVisitors}
              renderRow={(visitor, index) => (
                <tr 
                  key={visitor.id} 
                  className={`hover:bg-sky-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                >
                  <td className="py-4 px-4 text-black font-medium">{visitor.name}</td>
                  <td className="py-4 px-4 text-black">{visitor.phoneNo}</td>
                  <td className="py-4 px-4 text-black">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {visitor.meetingWith}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-black">{visitor.date}</td>
                  <td className="py-4 px-4 text-black">
                    <span className={`py-1 rounded-full text-sm ${
                      new Date(visitor.followUpDate) < new Date() 
                        ? 'text-red-800' 
                        : ' text-green-800'
                    }`}>
                      {visitor.followUpDate}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-black">{visitor.purpose}</td>
                  <td className="py-4 px-4 text-black">
                      {visitor.totalPersons}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <button
                        className="text-sky-500 hover:text-sky-700"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        className="text-green-500 hover:text-green-700"
                        title="Follow-up"
                      >
                        🔄
                      </button>
                      <button
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
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No visitors found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || filterDate 
                  ? "No visitors match your search criteria" 
                  : "No visitor records available. Add your first visitor!"}
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600"
              >
                Add First Visitor
              </button>
            </div>
          )}
        </div>
      </div>

      <AddVisitorModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddVisitor}
      />
    </div>
  );
};

export default VisitorsBook;