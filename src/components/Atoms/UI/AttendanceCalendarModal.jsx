import React, { useState, useEffect, useCallback, useRef } from "react";

const AttendanceCalendarModal = ({
  isOpen,
  onClose,
  teacherData,
  onMarkAttendance,
  onViewAttendance,
  attendanceData,
}) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [attendanceStatus, setAttendanceStatus] = useState("");
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState("calendar");
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const fetchInProgress = useRef(false);
  const lastFetchParams = useRef({});

  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const month = currentMonth.getMonth();
  const year = currentMonth.getFullYear();

  const getTeacherId = useCallback(() => {
    return teacherData?._id || teacherData?.id || teacherData?.user?._id || "";
  }, [teacherData]);

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

  const formatDateForDisplay = (dateStr) => {
    if (!dateStr) return "";
    if (dateStr.includes("-")) {
      const parts = dateStr.split("-");
      if (parts[0].length === 4) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      } else {
        return `${parts[0]}/${parts[1]}/${parts[2]}`;
      }
    }
    return dateStr;
  };

  const fetchAttendanceData = useCallback(async () => {
    const teacherId = getTeacherId();
    if (!teacherId || fetchInProgress.current) return;

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const start = formatDateForAPI(firstDay);
    const end = formatDateForAPI(lastDay);
    
    const fetchKey = `${teacherId}-${start}-${end}`;
    if (lastFetchParams.current === fetchKey) return;
    
    lastFetchParams.current = fetchKey;
    fetchInProgress.current = true;
    setLoading(true);
    
    try {
      const data = await onViewAttendance(teacherId, start, end);
      if (data && Array.isArray(data)) {
        setAttendanceRecords(data);
      } else {
        setAttendanceRecords([]);
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
      setAttendanceRecords([]);
    } finally {
      setLoading(false);
      fetchInProgress.current = false;
    }
  }, [getTeacherId, year, month, onViewAttendance]);

  useEffect(() => {
    if (isOpen && teacherData && !initialLoadDone) {
      fetchAttendanceData();
      setInitialLoadDone(true);
    }
  }, [isOpen, teacherData, fetchAttendanceData, initialLoadDone]);

  useEffect(() => {
    if (isOpen && teacherData && initialLoadDone) {
      fetchAttendanceData();
    }
  }, [currentMonth, isOpen, teacherData, fetchAttendanceData, initialLoadDone]);

  useEffect(() => {
    if (!isOpen) {
      setInitialLoadDone(false);
      setAttendanceRecords([]);
      setSelectedDate("");
      setAttendanceStatus("");
      setCurrentMonth(new Date());
      fetchInProgress.current = false;
      lastFetchParams.current = {};
    }
  }, [isOpen]);

  useEffect(() => {
    if (attendanceData && Array.isArray(attendanceData) && attendanceData.length > 0) {
      setAttendanceRecords(attendanceData);
    }
  }, [attendanceData]);

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate || !attendanceStatus) {
      return;
    }

    const teacherId = getTeacherId();
    if (!teacherId) return;

    setSubmitting(true);
    try {
      const success = await onMarkAttendance(teacherId, attendanceStatus, selectedDate);
      if (success) {
        setInitialLoadDone(false);
        await fetchAttendanceData();
        setInitialLoadDone(true);
        setSelectedDate("");
        setAttendanceStatus("");
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // Rest of your component remains the same...
  const handleDateClick = (day) => {
    if (day) {
      const dateObj = new Date(year, month, day);
      const formattedDate = formatDateForMarking(dateObj);
      setSelectedDate(formattedDate);
    }
  };

  const getAttendanceStatusForDate = (date) => {
    const dateStr = formatDateForMarking(date);
    const record = attendanceRecords.find(r => {
      const recordDate = r.date?.split("T")[0] || r.date;
      return recordDate === dateStr;
    });
    return record?.status || null;
  };

  const getAttendanceColor = (date) => {
    const status = getAttendanceStatusForDate(date);
    switch (status) {
      case "Present":
        return "bg-green-500 text-white";
      case "Absent":
        return "bg-red-500 text-white";
      case "Leave":
        return "bg-yellow-500 text-white";
      case "Half-day":
        return "bg-orange-500 text-white";
      default:
        return "bg-gray-100 hover:bg-gray-200 text-gray-900";
    }
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

  const previousMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };

  const isSelectedDate = (day) => {
    if (!selectedDate) return false;
    const dateObj = new Date(year, month, day);
    return formatDateForMarking(dateObj) === selectedDate;
  };

  const getUserName = () => {
    return teacherData?.user?.name || teacherData?.name || "Unknown Teacher";
  };

  if (!isOpen || !teacherData) return null;

  return (
    // Your existing JSX remains exactly the same
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-t-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              Attendance Details - {getUserName()}
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors text-2xl leading-none"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="flex justify-end mb-4">
            <div className="inline-flex rounded-md shadow-sm">
              <button
                onClick={() => setViewMode("calendar")}
                className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                  viewMode === "calendar"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                } border border-gray-300`}
              >
                Calendar View
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                  viewMode === "list"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
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
                <label className="block text-gray-700 mb-2 font-medium">Teacher Name</label>
                <input
                  type="text"
                  value={getUserName()}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">Status</label>
                <select
                  value={attendanceStatus}
                  onChange={(e) => setAttendanceStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  required
                />
              </div>

              <div className="md:col-span-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Attendance"}
                </button>
              </div>
            </form>
          </div>

          {viewMode === "calendar" ? (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Attendance Calendar</h3>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-6">
                  <button
                    onClick={previousMonth}
                    className="text-2xl text-gray-600 hover:text-gray-800 transition-colors px-3 py-1 rounded hover:bg-gray-100"
                  >
                    ‹
                  </button>
                  <h4 className="text-xl font-bold text-gray-900">
                    {currentMonth.toLocaleString("default", { month: "long" })} {year}
                  </h4>
                  <button
                    onClick={nextMonth}
                    className="text-2xl text-gray-600 hover:text-gray-800 transition-colors px-3 py-1 rounded hover:bg-gray-100"
                  >
                    ›
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {days.map((day, index) => (
                    <div key={index} className="text-center font-semibold text-gray-600 text-sm py-2">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {dates.map((day, index) => {
                    const dateObj = day ? new Date(year, month, day) : null;
                    const isCurrentMonth = day !== null;
                    const attendanceColor = dateObj ? getAttendanceColor(dateObj) : "";
                    const isSelected = dateObj ? isSelectedDate(day) : false;
                    const todayClass = dateObj && isToday(day) ? "ring-2 ring-blue-500" : "";

                    return (
                      <div
                        key={index}
                        onClick={() => handleDateClick(day)}
                        className={`
                          text-center py-3 rounded cursor-pointer transition-all
                          ${isCurrentMonth ? attendanceColor : "invisible"}
                          ${isSelected ? "ring-2 ring-blue-500 ring-offset-1" : ""}
                          ${todayClass}
                        `}
                      >
                        {day || ""}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200 flex flex-wrap justify-center gap-6">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                    <span className="text-gray-700 text-sm">Present</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
                    <span className="text-gray-700 text-sm">Absent</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
                    <span className="text-gray-700 text-sm">Leave</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-orange-500 rounded mr-2"></div>
                    <span className="text-gray-700 text-sm">Half-day</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Attendance Records</h3>
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <p className="mt-2 text-gray-600">Loading attendance records...</p>
                </div>
              ) : attendanceRecords.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-3 px-4 text-left text-gray-700 font-semibold border-b">Date</th>
                        <th className="py-3 px-4 text-left text-gray-700 font-semibold border-b">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceRecords.map((record, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="py-3 px-4 text-gray-900 border-b">
                            {formatDateForDisplay(record.date?.split("T")[0] || record.date)}
                           </td>
                          <td className="py-3 px-4 border-b">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              record.status === "Present"
                                ? "bg-green-100 text-green-800"
                                : record.status === "Absent"
                                ? "bg-red-100 text-red-800"
                                : record.status === "Leave"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-orange-100 text-orange-800"
                            }`}>
                              {record.status}
                            </span>
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

export default AttendanceCalendarModal;