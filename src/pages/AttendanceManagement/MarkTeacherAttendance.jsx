// pages/MarkTeacherAttendance.jsx
import React, { useState } from 'react';
import Table from '../../components/Atoms/TableData/TableData';
import TeacherDetailsModal from '../../components/Atoms/UI/TeacherDetailsModal';
import AttendanceCalendarModal from '../../components/Atoms/UI/AttendanceCalendarModal';

const MarkTeacherAttendance = () => {
  const [teachers, setTeachers] = useState([
    { 
      id: 1, 
      name: 'irfan gujammusutia palai', 
      role: 'Teacher', 
      phoneNo: '9879867620',
      email: 'irfan10.patel@gmail.com',
      walletAmount: '0',
      address: 'aikta apartment flat 306 parsi street salyyyyedp',
      salary: '3000',
      dob: '1965-12-28',
      doj: '2025-12-05',
      password: ''
    },
    { 
      id: 2, 
      name: 'Husen', 
      role: 'Teacher', 
      phoneNo: '9638802418' 
    },
    { 
      id: 3, 
      name: 'Hasim Mohan Shakh', 
      role: 'Teacher', 
      phoneNo: '9326329381' 
    },
    { 
      id: 4, 
      name: 'Shasta Nasir Shakh', 
      role: 'Teacher', 
      phoneNo: '8799211218' 
    },
    { 
      id: 5, 
      name: 'shakh amin fauuk', 
      role: 'Teacher', 
      phoneNo: '9726197045' 
    },
    { 
      id: 6, 
      name: 'malim froze shakh', 
      role: 'Teacher', 
      phoneNo: '8155009033' 
    },
    { 
      id: 7, 
      name: 'Shasta Nasir Shakh', 
      role: 'Teacher', 
      phoneNo: '8799211218' 
    },
    { 
      id: 8, 
      name: 'Mohammad Anash jameel Shakh', 
      role: 'Teacher', 
      phoneNo: '9824904840' 
    },
  ]);

  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleViewDetails = (teacher) => {
    setSelectedTeacher(teacher);
    setShowDetailsModal(true);
  };

  const handleAttendanceCalendar = (teacher) => {
    setSelectedTeacher(teacher);
    setShowCalendarModal(true);
  };

  const handleUpdateTeacher = (updatedData) => {
    setTeachers(teachers.map(teacher => 
      teacher.id === selectedTeacher.id 
        ? { ...teacher, ...updatedData }
        : teacher
    ));
    setSelectedTeacher(null);
  };

  const filteredTeachers = teachers.filter(teacher => 
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.phoneNo.includes(searchTerm) ||
    teacher.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: teachers.length,
    present: Math.floor(teachers.length * 0.8),
    absent: Math.floor(teachers.length * 0.1),
    leave: Math.floor(teachers.length * 0.1)
  };

  const tableHeaders = [
    'Teacher Name', 
    'Role', 
    'Phone No.', 
    'Actions', 
    'Check Attendance'
  ];

  return (
    <div className="">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Marked Teacher Attendance</h1>
          <p className="text-black mt-2">Manage teacher attendance and details</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-sky-50 p-6 rounded-lg shadow border border-sky-100">
            <h3 className="text-lg font-semibold text-sky-700">Total Teachers</h3>
            <p className="text-3xl font-bold text-black mt-2">{stats.total}</p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg shadow border border-green-100">
            <h3 className="text-lg font-semibold text-green-700">Present Today</h3>
            <p className="text-3xl font-bold text-black mt-2">{stats.present}</p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg shadow border border-red-100">
            <h3 className="text-lg font-semibold text-red-700">Absent Today</h3>
            <p className="text-3xl font-bold text-black mt-2">{stats.absent}</p>
          </div>
          <div className="bg-yellow-50 p-6 rounded-lg shadow border border-yellow-100">
            <h3 className="text-lg font-semibold text-yellow-700">On Leave</h3>
            <p className="text-3xl font-bold text-black mt-2">{stats.leave}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name, phone, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
              />
            </div>
            <div className="text-sm text-gray-600">
              Showing {filteredTeachers.length} of {teachers.length} teachers
            </div>
          </div>

          <Table
            headers={tableHeaders}
            data={filteredTeachers}
            renderRow={(teacher, index) => (
              <tr 
                key={teacher.id} 
                className={`hover:bg-sky-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
              >
                <td className="py-4 px-4 text-black font-medium">{teacher.name}</td>
                <td className="py-4 px-4 text-black">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {teacher.role}
                  </span>
                </td>
                <td className="py-4 px-4 text-black">{teacher.phoneNo}</td>
                <td className="py-4 px-4">
                  <button
                    onClick={() => handleViewDetails(teacher)}
                    className="text-sky-500 hover:text-sky-700"
                    title="View/Edit Details"
                  >
                    👁️
                  </button>
                </td>
                <td className="py-4 px-4">
                  <button
                    onClick={() => handleAttendanceCalendar(teacher)}
                    className="px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 text-sm font-medium"
                  >
                    Attendance Calendar
                  </button>
                </td>
              </tr>
            )}
          />
        </div>

      </div>

      <TeacherDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedTeacher(null);
        }}
        teacherData={selectedTeacher}
        onUpdate={handleUpdateTeacher}
      />

      <AttendanceCalendarModal
        isOpen={showCalendarModal}
        onClose={() => {
          setShowCalendarModal(false);
          setSelectedTeacher(null);
        }}
        teacherData={selectedTeacher}
      />
    </div>
  );
};

export default MarkTeacherAttendance;