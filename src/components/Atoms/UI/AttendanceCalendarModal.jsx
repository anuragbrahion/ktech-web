// components/AttendanceCalendarModal/AttendanceCalendarModal.jsx
import React, { useState } from 'react';

const AttendanceCalendarModal = ({ isOpen, onClose, teacherData }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [attendanceStatus, setAttendanceStatus] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const currentDate = new Date('2025-12-01');
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  
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

  const handleDateClick = (day) => {
    if (day) {
      const dateStr = `2025-12-${day.toString().padStart(2, '0')}`;
      setSelectedDate(dateStr);
    }
  };

  const handleStatusSubmit = (e) => {
    e.preventDefault();
    if (selectedDate && attendanceStatus) {
      const newRecord = {
        date: selectedDate,
        status: attendanceStatus
      };
      setAttendanceRecords([...attendanceRecords, newRecord]);
      setSelectedDate('');
      setAttendanceStatus('');
    }
  };

  if (!isOpen || !teacherData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden overflow-y-auto">
        <div className="bg-sky-500 text-white p-4 rounded-t-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Attendance Details - {teacherData.name}</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200"
            >
              ✕
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <form onSubmit={handleStatusSubmit} className="space-y-4">
              <div>
                <label className="block text-black mb-2">Name</label>
                <input
                  type="text"
                  value={teacherData.name}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-black"
                />
              </div>
              
              <div>
                <label className="block text-black mb-2">Status</label>
                <select
                  value={attendanceStatus}
                  onChange={(e) => setAttendanceStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                  required
                >
                  <option value="">Select...</option>
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Leave">Leave</option>
                  <option value="Half-day">Half-day</option>
                </select>
              </div>
              
              <div>
                <label className="block text-black mb-2">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                  required
                />
              </div>
              
              <div className="pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-sky-700 mb-4">
              Check Attendance Calendar Report here.
            </h3>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <button className="text-2xl text-gray-600 hover:text-gray-800">«</button>
                <h4 className="text-lg font-bold text-black">December 2025</h4>
                <button className="text-2xl text-gray-600 hover:text-gray-800">»</button>
              </div>
              
              <div className="grid grid-cols-7 gap-1 mb-2">
                {days.map((day, index) => (
                  <div key={index} className="text-center font-semibold text-gray-700 py-2">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {dates.map((day, index) => (
                  <div
                    key={index}
                    onClick={() => handleDateClick(day)}
                    className={`text-center py-3 rounded cursor-pointer ${
                      day 
                        ? selectedDate === `2025-12-${day.toString().padStart(2, '0')}`
                          ? 'bg-sky-500 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-black'
                        : 'invisible'
                    }`}
                  >
                    {day || ''}
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex justify-center space-x-6">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                  <span className="text-black">Present</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
                  <span className="text-black">Absent</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
                  <span className="text-black">Leave</span>
                </div>
              </div>
            </div>
          </div>
          
          {attendanceRecords.length > 0 && (
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-sky-700 mb-3">Attendance Records</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-2 px-4 text-left text-black font-semibold border-b">Date</th>
                      <th className="py-2 px-4 text-left text-black font-semibold border-b">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceRecords.map((record, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="py-2 px-4 text-black">
                          {new Date(record.date).toLocaleDateString('en-GB')}
                        </td>
                        <td className="py-2 px-4">
                          <span className={`px-2 py-1 rounded text-sm ${
                            record.status === 'Present' ? 'bg-green-100 text-green-800' :
                            record.status === 'Absent' ? 'bg-red-100 text-red-800' :
                            record.status === 'Leave' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          <div className="mt-8 pt-6 border-t">
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-100 text-black rounded-md hover:bg-gray-200"
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