import React, { useState, useEffect } from 'react';

const CoursePlanModal = ({ isOpen, onClose, planData, mode, courses, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    course: ''
  });

  useEffect(() => {
    if (mode === 'edit' && planData) {
      setFormData({
        name: planData.name || '',
        amount: planData.amount || '',
        course: planData.course || ''
      });
    } else {
      setFormData({
        name: '',
        amount: '',
        course: ''
      });
    }
  }, [planData, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRemoveCourse = () => {
    setFormData(prev => ({
      ...prev,
      course: ''
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      name: '',
      amount: '',
      course: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md my-8">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              Course Plan
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
          </div>

          <p className="text-gray-600 mb-6">
            {mode === 'add' ? 'Add your Plan' : 'Update your Plan'}
          </p>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Plan Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                    placeholder="Enter plan name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black pr-10"
                      placeholder="Enter amount"
                      required
                    />
                    <span className="absolute right-3 top-2 text-gray-500">$</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course
                </label>
                {formData.course ? (
                  <div className="flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md bg-gray-50">
                    <span className="text-black">{formData.course}</span>
                    <button
                      type="button"
                      onClick={handleRemoveCourse}
                      className="text-red-500 hover:text-red-700 text-lg"
                      title="Remove course"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <select
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                    required
                  >
                    <option value="">Select...</option>
                    {courses.map((course, index) => (
                      <option key={index} value={course}>{course}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t">
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
                {mode === 'add' ? 'Create Plan' : 'Update Plan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CoursePlanModal;