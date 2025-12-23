// components/RoleModal/RoleModal.jsx
import React, { useState } from 'react';

const RoleModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData = null 
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    course: initialData?.course || '',
    days: initialData?.days || ''
  });

  const courses = [
    'ms office',
    'Tally accounting',
    'Photoshop',
    'CorelDraw',
    'HTML',
    'c language',
    'C++'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: '', course: '', days: '' });
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="bg-sky-500 text-white p-4 rounded-t-lg">
          <h2 className="text-xl font-semibold">
            {initialData ? 'Edit Role' : 'Add Role'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block text-black mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Enter role name"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-black mb-2">Course</label>
            <select
              name="course"
              value={formData.course}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            >
              <option value="">No Selected</option>
              {courses.map((course, index) => (
                <option key={index} value={course.toLowerCase()}>
                  {course}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-6">
            <label className="block text-black mb-2">Days</label>
            <input
              type="number"
              name="days"
              value={formData.days}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="Enter number of days"
              required
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-black rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleModal;