// components/AttendanceDetailsModal/AttendanceDetailsModal.jsx
import React, { useState, useEffect } from 'react';

const AttendanceDetailsModal = ({ isOpen, onClose, studentData, onSubmit }) => {
  const [formData, setFormData] = useState({
    status: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (studentData) {
      setFormData({
        status: '',
        date: new Date().toISOString().split('T')[0]
      });
    }
  }, [studentData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (studentData) {
      onSubmit(studentData.id || studentData._id, formData.status, formData.date);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen || !studentData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="bg-gradient-to-r from-sky-500 to-sky-600 text-white p-4 rounded-t-lg">
          <h2 className="text-xl font-semibold">Mark Attendance</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-medium">Student Name</label>
            <input
              type="text"
              value={studentData.user?.name || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
              readOnly
            />
          </div> 
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-medium">Course</label>
            <input
              type="text"
              value={studentData.course.courseName ||  ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
              readOnly
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-medium">Status *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
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
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2 font-medium">Date *</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900"
              required
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 transition-colors"
            >
              Submit Attendance
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AttendanceDetailsModal;