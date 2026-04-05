import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Table from '../../components/Atoms/TableData/TableData';
import AttendanceDetailsModal from '../../components/Atoms/UI/AttendanceDetailsModal';
import {
  studentMarkAttendance,
  studentViewAttendance
} from '../../redux/slices/examination';
import { toast } from 'react-toastify';
import moment from 'moment-timezone';
import LoadingSpinner from '../../components/Loader/Loader';
import AttendanceCalendarModalStu from './AttendanceCalendarModalStu';
import { studentAdmissionsList } from '../../redux/slices/course';

const MarkStudentAttendance = () => {
  const dispatch = useDispatch();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [itemsPerPage] = useState(10);

  const studentAttendanceViewData = useSelector(
    (state) => state?.examination?.studentViewAttendanceData
  );

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  const fetchStudentsList = useCallback(async () => {
    setLoading(true);
    const payload = {
      page: currentPage,
      size: itemsPerPage,
    };
    try {
      const result = await dispatch(studentAdmissionsList(payload)).unwrap();
      if (result && result.data) {
        setStudents(result.data.list || []);
        setTotalCount(result.data.total || 0);
        setTotalPages(Math.ceil((result.data.total || 0) / itemsPerPage) || 1);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error(error?.message || 'Failed to fetch students list');
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, debouncedSearchTerm, dispatch]);

  useEffect(() => {
    fetchStudentsList();
  }, [fetchStudentsList]);

  const handleAttendanceMark = (student) => {
    setSelectedStudent(student);
    setShowAttendanceModal(true);
  };

  const handleCheckAttendance = (student) => {
    setSelectedStudent(student);
    setShowCalendarModal(true);
  };

  const handleMarkAttendance = async (studentId, status, date, courseId) => {
    try {
      const result = await dispatch(studentMarkAttendance({
        studentId,
        status,
        date,
        courseId: courseId || selectedStudent?.course?._id
      })).unwrap();

      if (result) {
        toast.success('Attendance marked successfully');
        setShowAttendanceModal(false);
        setSelectedStudent(null);
        // Refresh the attendance view if calendar modal is open
        if (showCalendarModal) {
          // Trigger refresh in calendar modal
          setShowCalendarModal(false);
          setTimeout(() => {
            setShowCalendarModal(true);
          }, 100);
        }
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
      toast.error(error?.message || 'Failed to mark attendance');
    }
  };

  const handleViewAttendance = async (studentId, startDate, endDate, courseId) => {
    try {
      const result = await dispatch(studentViewAttendance({
        startDate,
        endDate,
        studentId,
        courseId: courseId || selectedStudent?.course?._id
      })).unwrap();

      return result?.data || [];
    } catch (error) {
      console.error('Error fetching attendance:', error);
      toast.error(error?.message || 'Failed to fetch attendance records');
      return [];
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setCurrentPage(1);
  };

  const tableHeaders = [
    'Student Name',
    // 'Course',
    'Admission Date',
    'Mark Attendance',
    'View Attendance'
  ];

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return moment(dateString).format('DD/MM/YYYY');
  };

  return (
    <div className="p-6">
      <LoadingSpinner loading={loading} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mark Student Attendance</h1>
        <p className="text-gray-600 mt-2">Manage student attendance and details</p>
      </div>

      {/* Search Section */}
      {/* <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Student
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or email..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Total Students: {totalCount}
          </div>
        </div>
      </div> */}

      {/* Students Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {students.length === 0 && !loading ? (
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 mx-auto text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p className="text-gray-500 text-lg">No students found</p>
            <p className="text-gray-400 text-sm mt-1">
              {searchTerm ? 'Try a different search term' : 'No students available'}
            </p>
          </div>
        ) : (
          <Table
            headers={tableHeaders}
            data={students}
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={setCurrentPage}
            renderRow={(student, index) => (
              <tr
                key={student._id || index}
                className={`hover:bg-blue-50 transition-colors duration-150 ${
                  index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                }`}
              >
                <td className="py-4 px-4">
                  <div>
                    <p className="font-medium text-gray-900">{student.name}</p>
                    <p className="text-sm text-gray-500">{student.email}</p>
                  </div>
                </td>
                {/* <td className="p-2">
                  <span className="p-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                    {student.course?.courseName || 'Not Assigned'}
                  </span>
                </td> */}
                <td className="py-4 px-4 text-gray-600">
                  {formatDate(student.admissionDate)}
                </td>
                <td className="py-4 px-4">
                  <button
                    onClick={() => handleAttendanceMark(student)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 text-sm font-medium"
                    title="Mark Attendance"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Mark
                  </button>
                </td>
                <td className="py-4 px-4">
                  <button
                    onClick={() => handleCheckAttendance(student)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 text-sm font-medium"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Calendar
                  </button>
                </td>
              </tr>
            )}
          />
        )}

        {/* Pagination Info */}
        {students.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center text-sm text-gray-600">
            <span>
              Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} students
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
              >
                Previous
              </button>
              <span className="px-3 py-1">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Attendance Details Modal */}
      <AttendanceDetailsModal
        isOpen={showAttendanceModal}
        onClose={() => {
          setShowAttendanceModal(false);
          setSelectedStudent(null);
        }}
        studentData={selectedStudent}
        onSubmit={handleMarkAttendance}
      />

      <AttendanceCalendarModalStu
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