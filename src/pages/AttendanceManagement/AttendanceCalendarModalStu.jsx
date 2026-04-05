import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { toast } from 'react-toastify';
import moment from 'moment';

const AttendanceCalendarModalStu = ({ 
  isOpen, 
  onClose, 
  studentData, 
  onMarkAttendance, 
  onViewAttendance
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMarkModal, setShowMarkModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: moment().startOf('month').format('DD-MM-YYYY'),
    endDate: moment().endOf('month').format('DD-MM-YYYY')
  });

  useEffect(() => {
    if (isOpen && studentData) {
      fetchAttendanceRecords();
    }
  }, [isOpen, studentData, dateRange]);

  const fetchAttendanceRecords = async () => {
    if (!studentData) return;
    
    setLoading(true);
    try {
      const studentId = studentData._id || studentData.id;
      const courseId = studentData.course?._id || studentData.courseId;
      
      const records = await onViewAttendance(
        studentId,
        dateRange.startDate,
        dateRange.endDate,
        courseId
      );
      setAttendanceRecords(records || []);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      toast.error('Failed to fetch attendance records');
    } finally {
      setLoading(false);
    }
  };

  const getAttendanceStatusForDate = (date) => {
    const formattedDate = moment(date).format('YYYY-MM-DD');
    const record = attendanceRecords.find(
      (rec) => moment(rec.date).format('YYYY-MM-DD') === formattedDate
    );
    return record ? record.status : null;
  };

  const getTileClassName = ({ date, view }) => {
    if (view === 'month') {
      const status = getAttendanceStatusForDate(date);
      if (status === 'Present') return 'bg-green-100 text-green-800 rounded-full';
      if (status === 'Absent') return 'bg-red-100 text-red-800 rounded-full';
      if (status === 'Leave') return 'bg-yellow-100 text-yellow-800 rounded-full';
      if (status === 'Half-day') return 'bg-orange-100 text-orange-800 rounded-full';
    }
    return '';
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowMarkModal(true);
  };

  const handleMarkAttendanceSubmit = async () => {
    if (!selectedStatus) {
      toast.error('Please select attendance status');
      return;
    }
    
    setLoading(true);
    try {
      const studentId = studentData._id || studentData.id;
      const courseId = studentData.course?._id || studentData.courseId;
      const formattedDate = moment(selectedDate).format('YYYY-MM-DD');
      
      await onMarkAttendance(studentId, selectedStatus, formattedDate, courseId);
      toast.success('Attendance marked successfully');
      setShowMarkModal(false);
      setSelectedStatus('');
      await fetchAttendanceRecords();
    } catch (error) {
      console.error('Error marking attendance:', error);
      toast.error('Failed to mark attendance');
    } finally {
      setLoading(false);
    }
  };

  const getStudentName = () => {
    return studentData?.user?.name || studentData?.name || 'Unknown Student';
  };

  const getCourseName = () => {
    return studentData?.course?.courseName || studentData?.courseName || 'Not Assigned';
  };

  if (!isOpen || !studentData) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-t-lg sticky top-0">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Attendance Calendar</h2>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="p-6">
            {/* Student Info */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Student Name</label>
                  <p className="font-medium text-gray-900">{getStudentName()}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Course</label>
                  <p className="font-medium text-gray-900">{getCourseName()}</p>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="mb-6 flex flex-wrap gap-4 justify-center">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-100 rounded-full"></div>
                <span className="text-sm text-gray-600">Present</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-100 rounded-full"></div>
                <span className="text-sm text-gray-600">Absent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-100 rounded-full"></div>
                <span className="text-sm text-gray-600">Leave</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-100 rounded-full"></div>
                <span className="text-sm text-gray-600">Half-day</span>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p className="mt-2 text-gray-600">Loading attendance records...</p>
              </div>
            )}

            {/* Calendar */}
            {!loading && (
              <div className="flex justify-center">
                <Calendar
                  onChange={setSelectedDate}
                  value={selectedDate}
                  tileClassName={getTileClassName}
                  onClickDay={handleDateClick}
                  className="border-0 shadow-sm rounded-lg"
                />
              </div>
            )}

            {/* Instructions */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 text-center">
                💡 Click on any date to mark attendance for that day
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mark Attendance Modal */}
      {showMarkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-t-lg">
              <h3 className="text-lg font-semibold">Mark Attendance</h3>
              <button
                onClick={() => setShowMarkModal(false)}
                className="absolute top-4 right-4 text-white hover:text-gray-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-medium">Date</label>
                <input
                  type="text"
                  value={moment(selectedDate).format('DD/MM/YYYY')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
                  readOnly
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 mb-2 font-medium">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Status</option>
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Leave">Leave</option>
                  <option value="Half-day">Half-day</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowMarkModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleMarkAttendanceSubmit}
                  disabled={loading}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AttendanceCalendarModalStu;