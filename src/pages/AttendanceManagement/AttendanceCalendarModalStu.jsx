import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const fetchInProgress = useRef(false);
  const lastFetchParams = useRef({});

  const getStudentId = useCallback(() => {
    return studentData?._id || studentData?.id || studentData?.user?._id || "";
  }, [studentData]);

  const getCourseId = useCallback(() => {
    return studentData?.course?._id || studentData?.courseId || "";
  }, [studentData]);

  const formatDateForAPI = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatDateForMarking = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const fetchAttendanceRecords = useCallback(async () => {
    const studentId = getStudentId();
    const courseId = getCourseId();
    
    if (!studentId || fetchInProgress.current) return;

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startDate = formatDateForAPI(firstDay);
    const endDate = formatDateForAPI(lastDay);
    
    const fetchKey = `${studentId}-${courseId}-${startDate}-${endDate}`;
    if (lastFetchParams.current === fetchKey) return;
    
    lastFetchParams.current = fetchKey;
    fetchInProgress.current = true;
    setLoading(true);
    
    try {
      const records = await onViewAttendance(
        studentId,
        startDate,
        endDate,
        courseId
      );
      
      if (records && Array.isArray(records)) {
        setAttendanceRecords(records);
      } else {
        setAttendanceRecords([]);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
      toast.error('Failed to fetch attendance records');
      setAttendanceRecords([]);
    } finally {
      setLoading(false);
      fetchInProgress.current = false;
    }
  }, [getStudentId, getCourseId, currentMonth, onViewAttendance]);

  useEffect(() => {
    if (isOpen && studentData && !initialLoadDone) {
      fetchAttendanceRecords();
      setInitialLoadDone(true);
    }
  }, [isOpen, studentData, fetchAttendanceRecords, initialLoadDone]);

  useEffect(() => {
    if (isOpen && studentData && initialLoadDone) {
      fetchAttendanceRecords();
    }
  }, [currentMonth, isOpen, studentData, fetchAttendanceRecords, initialLoadDone]);

  useEffect(() => {
    if (!isOpen) {
      setInitialLoadDone(false);
      setAttendanceRecords([]);
      setSelectedDate(new Date());
      setSelectedStatus('');
      setCurrentMonth(new Date());
      fetchInProgress.current = false;
      lastFetchParams.current = {};
    }
  }, [isOpen]);

  const getAttendanceStatusForDate = (date) => {
    const formattedDate = formatDateForAPI(date);
    
    const record = attendanceRecords.find(rec => {
      return rec.date === formattedDate;
    });
    
    return record?.status || null;
  };

  const getTileClassName = ({ date, view }) => {
    if (view === 'month') {
      const status = getAttendanceStatusForDate(date);
      if (status === 'Present') {
        return 'present-tile';
      }
      if (status === 'Absent') {
        return 'absent-tile';
      }
      if (status === 'Leave') {
        return 'leave-tile';
      }
    }
    return '';
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowMarkModal(true);
  };

  const handleMonthChange = ({ activeStartDate }) => {
    setCurrentMonth(activeStartDate);
  };

  const handleMarkAttendanceSubmit = async () => {
    if (!selectedStatus) {
      toast.error('Please select attendance status');
      return;
    }
    
    const studentId = getStudentId();
    const courseId = getCourseId();
    
    if (!studentId) {
      toast.error('Student ID not found');
      return;
    }
    
    setLoading(true);
    try {
      const formattedDate = formatDateForMarking(selectedDate);
      
      await onMarkAttendance(studentId, selectedStatus, formattedDate, courseId);
      toast.success('Attendance marked successfully');
      setShowMarkModal(false);
      setSelectedStatus('');
      
      setInitialLoadDone(false);
      await fetchAttendanceRecords();
      setInitialLoadDone(true);
    } catch (error) {
      console.error('Error marking attendance:', error);
      toast.error(error?.message || 'Failed to mark attendance');
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
            <style>
              {`
                .react-calendar {
                  width: 100%;
                  max-width: 100%;
                  border: none;
                  font-family: inherit;
                }
                .react-calendar__tile {
                  padding: 1em 0.5em;
                  position: relative;
                  font-weight: 500;
                }
                .react-calendar__tile--active {
                  background: #3b82f6 !important;
                  color: white !important;
                }
                .react-calendar__tile--now {
                  background: #eff6ff;
                }
                .react-calendar__tile:enabled:hover {
                  background: #e5e7eb;
                }
                .present-tile {
                  background-color: #22c55e !important;
                  color: white !important;
                  border-radius: 50% !important;
                }
                .absent-tile {
                  background-color: #ef4444 !important;
                  color: white !important;
                  border-radius: 50% !important;
                }
                .leave-tile {
                  background-color: #eab308 !important;
                  color: white !important;
                  border-radius: 50% !important;
                }
                .present-tile:hover {
                  background-color: #16a34a !important;
                }
                .absent-tile:hover {
                  background-color: #dc2626 !important;
                }
                .leave-tile:hover {
                  background-color: #ca8a04 !important;
                }
              `}
            </style>

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
            <div className="mb-6 flex flex-wrap gap-6 justify-center">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700 font-medium">Present</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-700 font-medium">Absent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-700 font-medium">Leave</span>
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
                  onActiveStartDateChange={handleMonthChange}
                  className="border-0 shadow-sm rounded-lg w-full"
                />
              </div>
            )}

            {/* Summary Section */}
            {attendanceRecords.length > 0 && !loading && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-3 text-center">
                  Summary for {moment(currentMonth).format('MMMM YYYY')}
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {attendanceRecords.filter(r => r.status === 'Present').length}
                    </div>
                    <div className="text-sm text-gray-500">Present</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {attendanceRecords.filter(r => r.status === 'Absent').length}
                    </div>
                    <div className="text-sm text-gray-500">Absent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {attendanceRecords.filter(r => r.status === 'Leave').length}
                    </div>
                    <div className="text-sm text-gray-500">Leave</div>
                  </div>
                </div>
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
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Mark Attendance</h3>
                <button
                  onClick={() => setShowMarkModal(false)}
                  className="text-white hover:text-gray-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
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
                </select>
              </div>
              
              {/* Current Status Display */}
              {getAttendanceStatusForDate(selectedDate) && (
                <div className="mb-4 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-600">
                    Current status for this date: 
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                      getAttendanceStatusForDate(selectedDate) === 'Present' ? 'bg-green-100 text-green-700' :
                      getAttendanceStatusForDate(selectedDate) === 'Absent' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {getAttendanceStatusForDate(selectedDate)}
                    </span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Submitting will update the status</p>
                </div>
              )}
              
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