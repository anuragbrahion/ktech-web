import React, { useState } from 'react';

const AddBatchModal = ({ isOpen, onClose, onSubmit, courses, timeSlots }) => {
  const [formData, setFormData] = useState({
    startTime: '',
    endTime: '',
    totalSeats: '',
    availableSeats: '',
    selectedCourses: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCourseToggle = (course) => {
    setFormData(prev => {
      const isSelected = prev.selectedCourses.includes(course);
      return {
        ...prev,
        selectedCourses: isSelected
          ? prev.selectedCourses.filter(c => c !== course)
          : [...prev.selectedCourses, course]
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const batchData = {
      startTime: formData.startTime,
      endTime: formData.endTime,
      totalSeats: formData.totalSeats,
      availableSeats: formData.availableSeats || formData.totalSeats,
      courses: formData.selectedCourses.join(', ')
    };
    onSubmit(batchData);
    setFormData({
      startTime: '',
      endTime: '',
      totalSeats: '',
      availableSeats: '',
      selectedCourses: []
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl my-8 max-h-[90vh] overflow-hidden overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Batch</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
          </div>

          <p className="text-gray-600 mb-6">Add your batch here</p>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Start Time & End Time</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time
                    </label>
                    <select
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                      required
                    >
                      <option value="">--:--</option>
                      {timeSlots.map((time, index) => (
                        <option key={index} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time
                    </label>
                    <select
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                      required
                    >
                      <option value="">--:--</option>
                      {timeSlots.map((time, index) => (
                        <option key={index} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Total Seat</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Seats
                    </label>
                    <input
                      type="number"
                      name="totalSeats"
                      value={formData.totalSeats}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                      placeholder="Enter total seats"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available Seats
                    </label>
                    <input
                      type="number"
                      name="availableSeats"
                      value={formData.availableSeats}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                      placeholder="Enter available seats"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Courses</h3>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Course for batch
                </label>
                <div className="border border-gray-300 rounded-md p-4 max-h-60 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {courses.map((course, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`course-${index}`}
                          checked={formData.selectedCourses.includes(course)}
                          onChange={() => handleCourseToggle(course)}
                          className="h-4 w-4 text-sky-500 rounded focus:ring-sky-400"
                        />
                        <label htmlFor={`course-${index}`} className="ml-2 text-black text-sm">
                          {course}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                {formData.selectedCourses.length > 0 && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-md border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Selected courses:</p>
                    <p className="text-black text-sm">{formData.selectedCourses.join(', ')}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 font-medium"
              >
                Add Batch
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBatchModal;