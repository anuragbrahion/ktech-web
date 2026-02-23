// pages/MarkStudentAttendance.jsx
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
 

const AttendanceCalendarModal = ({ 
  isOpen, 
  onClose, 
  studentData, 
  onMarkAttendance, 
  onViewAttendance,
  attendanceData, 
}) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [attendanceStatus, setAttendanceStatus] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('calendar');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const month = currentMonth.getMonth();
  const year = currentMonth.getFullYear();

  useEffect(() => {
    if (studentData && isOpen) {
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      
      setStartDate(formatDate(firstDay));
      setEndDate(formatDate(lastDay));
      
      fetchAttendanceData(formatDate(firstDay), formatDate(lastDay));
    }
  }, [studentData, isOpen, currentMonth]);

  useEffect(() => {
    if (attendanceData?.attendance) {
      setAttendanceRecords(attendanceData.attendance);
    }
  }, [attendanceData]);

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatDateForAPI = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDateForDisplay = (dateStr) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const fetchAttendanceData = async (start, end) => {
    if (!studentData) return;
    
    setLoading(true);
    try {
      const data = await onViewAttendance(
        studentData.id || studentData._id || studentData.user?._id, 
        start, 
        end
      );
      if (data && data.attendance) {
        setAttendanceRecords(data.attendance);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeSearch = () => {
    if (startDate && endDate) {
      fetchAttendanceData(startDate, endDate);
    }
  };

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    if (selectedDate && attendanceStatus && studentData) {
      setLoading(true);
      try {
        await onMarkAttendance(
          studentData.id || studentData._id || studentData.user?._id,
          attendanceStatus,
          formatDateForAPI(selectedDate)
        );
        
        await fetchAttendanceData(startDate, endDate);
        
        setSelectedDate('');
        setAttendanceStatus('');
      } catch (error) {
        console.error('Error marking attendance:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDateClick = (day) => {
    if (day) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      setSelectedDate(dateStr);
    }
  };

  const getAttendanceColor = (date) => {
    const record = attendanceRecords.find(r => {
      const recordDate = new Date(r.date).toDateString();
      const currentDate = new Date(date).toDateString();
      return recordDate === currentDate;
    });
    
    if (record) {
      switch(record.status) {
        case 'Present': return 'bg-green-500 text-white';
        case 'Absent': return 'bg-red-500 text-white';
        case 'Leave': return 'bg-yellow-500 text-white';
        case 'Half-day': return 'bg-orange-500 text-white';
        default: return 'bg-gray-100 hover:bg-gray-200 text-gray-900';
      }
    }
    return 'bg-gray-100 hover:bg-gray-200 text-gray-900';
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  const dates = [];
  for (let i = 0; i < firstDay; i++) {
    dates.push(null);
  }
  
  for (let i = 1; i <= daysInMonth; i++) {
    dates.push(i);
  }

  if (!isOpen || !studentData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-sky-500 to-sky-600 text-white p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              Attendance Details - {studentData.user?.name || studentData.name}
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="flex justify-end mb-4">
            <div className="inline-flex rounded-md shadow-sm">
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                  viewMode === 'calendar'
                    ? 'bg-sky-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } border border-gray-300`}
              >
                Calendar View
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                  viewMode === 'list'
                    ? 'bg-sky-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } border border-l-0 border-gray-300`}
              >
                List View
              </button>
            </div>
          </div>

          <div className="mb-6 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Mark Attendance</h3>
            <form onSubmit={handleStatusSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Student Name</label>
                <input
                  type="text"
                  value={studentData.user?.name || studentData.name || ''}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Status</label>
                <select
                  value={attendanceStatus}
                  onChange={(e) => setAttendanceStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900"
                  required
                >
                  <option value="">Select Status</option>
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Leave">Leave</option>
                  <option value="Half-day">Half-day</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900"
                  required
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div className="md:col-span-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Submit Attendance'}
                </button>
              </div>
            </form>
          </div>

          <div className="mb-6 bg-white border border-gray-200 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter Attendance</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Start Date</label>
                <input
                  type="date"
                  value={startDate.split('-').reverse().join('-')}
                  onChange={(e) => {
                    const [year, month, day] = e.target.value.split('-');
                    setStartDate(`${day}-${month}-${year}`);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2 font-medium">End Date</label>
                <input
                  type="date"
                  value={endDate.split('-').reverse().join('-')}
                  onChange={(e) => {
                    const [year, month, day] = e.target.value.split('-');
                    setEndDate(`${day}-${month}-${year}`);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleDateRangeSearch}
                  className="px-6 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 transition-colors"
                >
                  Search
                </button>
              </div>
            </div>
          </div>

          {viewMode === 'calendar' ? (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Attendance Calendar</h3>
              
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <button
                    onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
                    className="text-2xl text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    «
                  </button>
                  <h4 className="text-lg font-bold text-gray-900">
                    {currentMonth.toLocaleString('default', { month: 'long' })} {year}
                  </h4>
                  <button
                    onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
                    className="text-2xl text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    »
                  </button>
                </div>
                
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {days.map((day, index) => (
                    <div key={index} className="text-center font-semibold text-gray-700 py-2">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                  {dates.map((day, index) => {
                    const dateStr = day ? new Date(year, month, day).toISOString().split('T')[0] : null;
                    return (
                      <div
                        key={index}
                        onClick={() => handleDateClick(day)}
                        className={`text-center py-3 rounded cursor-pointer transition-colors ${
                          day
                            ? selectedDate === dateStr
                              ? 'ring-2 ring-sky-500 ' + getAttendanceColor(dateStr)
                              : getAttendanceColor(dateStr)
                            : 'invisible'
                        }`}
                      >
                        {day || ''}
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-6 flex flex-wrap justify-center gap-4">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                    <span className="text-gray-700">Present</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
                    <span className="text-gray-700">Absent</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
                    <span className="text-gray-700">Leave</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-orange-500 rounded mr-2"></div>
                    <span className="text-gray-700">Half-day</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Attendance Records</h3>
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
                  <p className="mt-2 text-gray-600">Loading attendance records...</p>
                </div>
              ) : attendanceRecords.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-3 px-4 text-left text-gray-700 font-semibold border-b">Date</th>
                        <th className="py-3 px-4 text-left text-gray-700 font-semibold border-b">Status</th>
                        <th className="py-3 px-4 text-left text-gray-700 font-semibold border-b">Marked By</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceRecords.map((record, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="py-3 px-4 text-gray-900 border-b">
                            {formatDateForDisplay(record.date?.split('T')[0])}
                          </td>
                          <td className="py-3 px-4 border-b">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              record.status === 'Present' ? 'bg-green-100 text-green-800' :
                              record.status === 'Absent' ? 'bg-red-100 text-red-800' :
                              record.status === 'Leave' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-orange-100 text-orange-800'
                            }`}>
                              {record.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-900 border-b">
                            {record.markedBy || 'System'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">No attendance records found for the selected period.</p>
                </div>
              )}
            </div>
          )}
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
   const studentViewData = useSelector(
    (state) => state?.examination?.studentViewAttendanceData
  );
console.log("hehehehehehehehehhehehehehe",studentViewData)
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
        size: 10,
        type: 'Student'
      })).unwrap();
      
      if (result) {
        setStudents(result.data.list || []);
        setTotalPages(result.data.totalPages || 1);
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name, roll no, or course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900"
            />
          </div> 
        </div>

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