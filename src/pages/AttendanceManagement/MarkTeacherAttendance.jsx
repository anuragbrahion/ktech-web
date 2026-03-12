// pages/MarkTeacherAttendance.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Table from '../../components/Atoms/TableData/TableData';
import TeacherDetailsModal from '../../components/Atoms/UI/TeacherDetailsModal';
import AttendanceCalendarModal from '../../components/Atoms/UI/AttendanceCalendarModal';
import {
  teacherAttendanceView,
  teacherMarkAttendance,
  attendanceList
} from '../../redux/slices/examination';
import { toast } from 'react-toastify';

const MarkTeacherAttendance = () => {
  const dispatch = useDispatch();
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);

  const AttendenceData = useSelector(
    (state) => state?.examination?.attendanceListData,
  );

  const teachData = useSelector(
    (state) => state?.examination?.teacherAttendanceViewData,
  );

  useEffect(() => {
    fetchTeachersList();
  }, [currentPage, searchTerm]);

  const fetchTeachersList = async () => {
    setLoading(true);
    try {
      const result = await dispatch(
        attendanceList({
          page: currentPage,
          size: itemsPerPage,
          type: "Teacher",
          ...(searchTerm && { keyWord: searchTerm })
        })
      ).unwrap();
      if (result) {
        setTeachers(result.data.list || []);
        setTotalPages(Math.ceil((result.data.total || 0) / itemsPerPage) || 1);
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (teacher) => {
    setSelectedTeacher(teacher);
    setShowDetailsModal(true);
  };

  const handleAttendanceCalendar = (teacher) => {
    setSelectedTeacher(teacher);
    setShowCalendarModal(true);
  };

  const handleMarkAttendance = async (teacherId, status, date) => {
    try {
      const result = await dispatch(teacherMarkAttendance({
        teacherId,
        status,
        date
      })).unwrap();
      if (result) {
        toast.success('Attendance marked successfully');
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
      toast.error('Failed to mark attendance');
    }
  };

  const handleViewAttendance = async (teacherId, startDate, endDate) => {
    try {
      const result = await dispatch(teacherAttendanceView({
        startDate,
        endDate,
        teacherId
      })).unwrap();

      return result.data;
    } catch (error) {
      console.error('Error fetching attendance:', error);
      return [];
    }
  };

  const tableHeaders = [
    'Teacher Name',
    'Role',
    'Status',
    'Actions',
    'Check Attendance'
  ];

 
  return (
    <div className="">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Mark Teacher Attendance</h1>
        <p className="text-gray-600 mt-2">Manage teacher attendance and details</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        {/* <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name, phone, or role..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
  setCurrentPage(1);
  fetchTeachersList();
}}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Refresh
            </button>
          </div>
        </div> */}

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
            <p className="mt-2 text-gray-600">Loading teachers...</p>
          </div>
        ) : (
          <>
            <Table
              headers={tableHeaders}
              data={teachers}
              currentPage={currentPage}
              totalPages={totalPages}
              handlePageChange={setCurrentPage}
              renderRow={(teacher, index) => (
                <tr
                  key={teacher.id || teacher._id}
                  className={`hover:bg-sky-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                >
                  <td className="py-4 px-4 text-gray-900 font-medium">{teacher.user.name}</td>
                  <td className="py-4 px-4 text-gray-900">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {teacher.role || 'Teacher'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-900">{teacher.status}</td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleViewDetails(teacher)}
                      className="text-sky-500 hover:text-sky-700 transition-colors"
                      title="View/Edit Details"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleAttendanceCalendar(teacher)}
                      className="px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 text-sm font-medium transition-colors"
                    >
                      Attendance Calendar
                    </button>
                  </td>
                </tr>
              )}
            />
          </>
        )}
      </div>

      <TeacherDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedTeacher(null);
        }}
        teacherData={selectedTeacher}
      />

      <AttendanceCalendarModal
        isOpen={showCalendarModal}
        onClose={() => {
          setShowCalendarModal(false);
          setSelectedTeacher(null);
        }}
        teacherData={selectedTeacher}
        onMarkAttendance={handleMarkAttendance}
        onViewAttendance={handleViewAttendance}
        teachData={teachData}
      />
    </div>
  );
};

export default MarkTeacherAttendance;