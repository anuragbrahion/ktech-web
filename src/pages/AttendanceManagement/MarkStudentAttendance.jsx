import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Table from '../../components/Atoms/TableData/TableData';
import AttendanceDetailsModal from '../../components/Atoms/UI/AttendanceDetailsModal';
 
import {
  studentMarkAttendance,
  studentViewAttendance,
  attendanceList
} from '../../redux/slices/examination';
import moment from 'moment-timezone';
import AttendanceCalendarModal from '../../components/Atoms/UI/AttendanceCalendarModal';
 

const MarkStudentAttendance = () => {
  const dispatch = useDispatch();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
   const [itemsPerPage] = useState(10);
   
   const studentAttendanceViewData = useSelector(
    (state) => state?.examination?.studentViewAttendanceData
  );

  useEffect(() => {
    fetchStudentsList();
  }, [currentPage]);

  const fetchStudentsList = async () => {
    setLoading(true);
    try {
      const result = await dispatch(attendanceList({
       page: currentPage,
          size: itemsPerPage, 
        type: 'Student',
         ...(searchTerm && { keyWord: searchTerm })
      })).unwrap();
      
      if (result) {
        setStudents(result.data.list || []);
         setTotalPages(Math.ceil((result.data.total || 0) / itemsPerPage) || 1);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceMark = (student) => {
    setSelectedStudent(student);
    setShowAttendanceModal(true);
  };

  const handleCheckAttendance = (student) => {
    setSelectedStudent(student);
    setShowCalendarModal(true);
  };

  const handleMarkAttendance = async (studentId, status, date) => {
    try {
      const result = await dispatch(studentMarkAttendance({
        studentId,
        status,
        date,
        courseId:selectedStudent?.course?._id
      })).unwrap();
      
      if (result) {
        alert('Attendance marked successfully');
        setShowAttendanceModal(false);
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
      alert('Failed to mark attendance');
    }
  };

  const handleViewAttendance = async (studentId, startDate, endDate) => {
    try {
      const result = await dispatch(studentViewAttendance({
        startDate,
        endDate,
        studentId,
        courseId:selectedStudent?.course?._id
      })).unwrap();
      
      return result.data;
    } catch (error) {
      console.error('Error fetching attendance:', error);
      return [];
    }
  };
 
  const tableHeaders = [
    'Student Name',
     'Course',
    'Admission Date',
    'Attendance Mark',
    'Check Attendance'
  ];

  return (
    <div className="">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Mark Student Attendance</h1>
        <p className="text-gray-600 mt-2">Manage student attendance and details</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        {/* <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name, roll no, or course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900"
            />
          </div> 
        </div> */}

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
            <p className="mt-2 text-gray-600">Loading students...</p>
          </div>
        ) : (
          <>
            <Table
              headers={tableHeaders}
              data={students}
              currentPage={currentPage}
              totalPages={totalPages}
              handlePageChange={setCurrentPage}
              renderRow={(student, index) => (
                <tr
                  key={index}
                  className={`hover:bg-sky-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                >
                  <td className="py-4 px-4 text-gray-900 font-medium">
                    {student.user?.name || student.name}
                  </td> 
                  <td className="py-4 px-4 text-gray-900">
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                      {student.course.courseName}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-900">
                    {moment(student.date).format('YYYY-MM-DD')} 
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleAttendanceMark(student)}
                      className="text-2xl hover:scale-110 transition-transform"
                      title="Mark Attendance"
                    >
                      📝
                    </button>
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleCheckAttendance(student)}
                      className="px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 text-sm font-medium transition-colors"
                    >
                      Attendance Calendar
                    </button>
                  </td>
                </tr>
              )}
            />

            {totalPages > 1 && (
              <div className="flex justify-center mt-6 gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="px-3 py-1">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <AttendanceDetailsModal
        isOpen={showAttendanceModal}
        onClose={() => {
          setShowAttendanceModal(false);
          setSelectedStudent(null);
        }}
        studentData={selectedStudent}
        onSubmit={handleMarkAttendance}
      />

      <AttendanceCalendarModal
        isOpen={showCalendarModal}
        onClose={() => {
          setShowCalendarModal(false);
          setSelectedStudent(null);
        }}
        studentData={selectedStudent}
        onMarkAttendance={handleMarkAttendance}
        onViewAttendance={handleViewAttendance}
        attendanceData={studentAttendanceViewData}
        type="student"
      />
    </div>
  );
};

export default MarkStudentAttendance;