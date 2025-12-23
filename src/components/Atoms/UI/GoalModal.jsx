// components/GoalModal/GoalModal.jsx
import React, { useState, useEffect } from 'react';

const GoalModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData = null 
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    designation: initialData?.designation || '',
    department: initialData?.department || '',
    roles: initialData?.roles || [],
    salary: initialData?.salary || '',
    duration: initialData?.duration || ''
  });

  const [availableRoles, setAvailableRoles] = useState([
    'Role 1', 'Role 2', 'Role 3', 'Role 4', 'Role 5', 'Role 6', 'Role 7', 'Role 8',
    'Role 9', 'Role 10', 'Role 11', 'Role 12', 'Role 13', 'Role 14', 'Role 15',
    'Role 16', 'Role 17', 'Role 18', 'Role 19', 'Role 20', 'Role 21', 'Role 22'
  ]);

  const designations = [
    'Under Training',
    'Computer Teacher',
    'Computer Faculty',
    'Lab in charge & Computer teacher',
    'Quality Maintenance & Lab In Charge',
    'Branch in Charge & Marketing Person',
    'Junior Manager'
  ];

  const departments = [
    'Teachers Team',
    'Teachers',
    'Administration',
    'Management'
  ];

  const durations = [
    '1 Month',
    '2 Months',
    '3 Months',
    '6 Months',
    '12 Months'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ 
      name: '', 
      designation: '', 
      department: '', 
      roles: [], 
      salary: '', 
      duration: '' 
    });
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleToggle = (role) => {
    setFormData(prev => {
      if (prev.roles.includes(role)) {
        return {
          ...prev,
          roles: prev.roles.filter(r => r !== role)
        };
      } else {
        return {
          ...prev,
          roles: [...prev.roles, role]
        };
      }
    });
  };

  const handleSelectAllRoles = () => {
    setFormData(prev => ({
      ...prev,
      roles: availableRoles
    }));
  };

  const handleClearAllRoles = () => {
    setFormData(prev => ({
      ...prev,
      roles: []
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="bg-sky-500 text-white p-4 rounded-t-lg sticky top-0">
          <h2 className="text-xl font-semibold">
            {initialData ? 'Edit Goal' : 'Add Goal'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-black mb-2">Goal Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="Enter goal name"
                required
              />
            </div>
            
            <div>
              <label className="block text-black mb-2">Designation</label>
              <select
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              >
                <option value="">---No Select---</option>
                {designations.map((designation, index) => (
                  <option key={index} value={designation}>
                    {designation}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-black mb-2">Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              >
                <option value="">---No Select---</option>
                {departments.map((department, index) => (
                  <option key={index} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-black mb-2">Salary</label>
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="Enter salary"
                required
              />
            </div>
            
            <div>
              <label className="block text-black mb-2">Duration</label>
              <select
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              >
                <option value="">---No Select---</option>
                {durations.map((duration, index) => (
                  <option key={index} value={duration}>
                    {duration}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Roles Selection */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <label className="block text-black font-medium">Roles</label>
              <div className="space-x-2">
                <button
                  type="button"
                  onClick={handleSelectAllRoles}
                  className="text-sm text-sky-500 hover:text-sky-700"
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={handleClearAllRoles}
                  className="text-sm text-sky-500 hover:text-sky-700"
                >
                  Clear All
                </button>
              </div>
            </div>
            
            <div className="border border-gray-300 rounded-md p-4 max-h-60 overflow-y-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {availableRoles.map((role, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`role-${index}`}
                      checked={formData.roles.includes(role)}
                      onChange={() => handleRoleToggle(role)}
                      className="h-4 w-4 text-sky-600 rounded focus:ring-sky-500"
                    />
                    <label 
                      htmlFor={`role-${index}`} 
                      className="ml-2 text-sm text-black cursor-pointer"
                    >
                      {role}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {formData.roles.length > 0 && (
              <div className="mt-3 p-3 bg-sky-50 rounded">
                <p className="text-sm text-sky-700">
                  <span className="font-medium">Selected Roles:</span> {formData.roles.join(', ')}
                </p>
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-black rounded-md hover:bg-gray-50 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 transition duration-200"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalModal;