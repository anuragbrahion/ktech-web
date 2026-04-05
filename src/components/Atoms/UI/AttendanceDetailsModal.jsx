// components/AttendanceDetailsModal/AttendanceDetailsModal.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const AttendanceDetailsModal = ({ isOpen, onClose, studentData, onSubmit }) => {
  const [formData, setFormData] = useState({
    status: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (studentData) {
      setFormData({
        status: '',
        date: new Date().toISOString().split('T')[0]
      });
    }
  }, [studentData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.status) {
      toast.error('Please select attendance status');
      return;
    }
    
    if (!formData.date) {
      toast.error('Please select date');
      return;
    }
    
    setSubmitting(true);
    try {
      // Get student ID from studentData
      const studentId = studentData._id || studentData.id;
      // Get course ID if available
      const courseId = studentData.course?._id || studentData.courseId;
      
      await onSubmit(studentId, formData.status, formData.date, courseId);
      onClose();
    } catch (error) {
      console.error('Error submitting attendance:', error);
    } finally {
      setSubmitting(false);
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

  // Get student display name (handle different data structures)
  const getStudentName = () => {
    return studentData.user?.name || studentData.name || 'Unknown Student';
  };

  // Get course name (handle different data structures)
  const getCourseName = () => {
    return studentData.course?.courseName || studentData.courseName || 'Not Assigned';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-t-lg">
          <h2 className="text-xl font-semibold">Mark Attendance</h2>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {/* Student Name */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-medium">Student Name</label>
            <input
              type="text"
              value={getStudentName()}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
              readOnly
            />
          </div>
          
          {/* Course */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-medium">Course</label>
            <input
              type="text"
              value={getCourseName()}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
              readOnly
            />
          </div>
          
          {/* Status Selection */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2 font-medium">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
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
          
          {/* Date Selection */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2 font-medium">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              required
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                'Submit Attendance'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AttendanceDetailsModal;