import React, { useState, useEffect } from 'react';

const AssignModal = ({ isOpen, onClose, staffData, assignType, roles, goals, onSave }) => {
  const [selectedValue, setSelectedValue] = useState('');
  const [assignTo, setAssignTo] = useState(false);

  useEffect(() => {
    if (staffData) {
      if (assignType === 'role') {
        setSelectedValue(staffData.assignedRole || '');
      } else {
        setSelectedValue(staffData.assignedGoal || '');
      }
      setAssignTo(true);
    }
  }, [staffData, assignType]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedValue) {
      onSave(assignType, selectedValue, assignTo);
    }
  };

  if (!isOpen || !staffData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {assignType === 'role' ? 'Assign Role' : 'Assign Goal'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <p className="text-gray-600 mb-6">
                Make changes to {assignType} assign here. Click save when you're done.
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    {assignType === 'role' ? 'Role Name' : 'Goal Name'}
                  </h3>
                  
                  {assignType === 'role' ? (
                    <select
                      value={selectedValue}
                      onChange={(e) => setSelectedValue(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black bg-white"
                    >
                      <option value="">Select Role</option>
                      {roles.map((role, index) => (
                        <option key={index} value={role}>{role}</option>
                      ))}
                    </select>
                  ) : (
                    <select
                      value={selectedValue}
                      onChange={(e) => setSelectedValue(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black bg-white"
                    >
                      <option value="">Select Goal</option>
                      {goals.map((goal, index) => (
                        <option key={index} value={goal}>{goal}</option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Assign To</h3>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="assignCheckbox"
                        checked={assignTo}
                        onChange={(e) => setAssignTo(e.target.checked)}
                        className="h-5 w-5 text-sky-500 rounded focus:ring-sky-400"
                      />
                      <label htmlFor="assignCheckbox" className="ml-3 text-black font-medium">
                        {staffData.name}
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                          staffData.role === 'Teacher' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {staffData.role}
                        </span>
                      </label>
                    </div>
                    <div className="mt-2 text-sm text-gray-500 ml-8">
                      Ref: {staffData.referralCode} • Phone: {staffData.phoneNo}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={!selectedValue || !assignTo}
                className="px-6 py-2.5 bg-sky-500 text-white rounded-lg hover:bg-sky-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssignModal;