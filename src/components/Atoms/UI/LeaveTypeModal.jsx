// components/LeaveTypeModal/LeaveTypeModal.jsx
import React, { useState } from 'react';

const LeaveTypeModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [leaveTypes, setLeaveTypes] = useState(
    initialData?.leaveTypes || [{ name: '' }]
  );

  const addLeaveTypeField = () => {
    setLeaveTypes([...leaveTypes, { name: '' }]);
  };

  const removeLeaveTypeField = (index) => {
    if (leaveTypes.length > 1) {
      const newLeaveTypes = [...leaveTypes];
      newLeaveTypes.splice(index, 1);
      setLeaveTypes(newLeaveTypes);
    }
  };

  const handleChange = (index, value) => {
    const newLeaveTypes = [...leaveTypes];
    newLeaveTypes[index].name = value;
    setLeaveTypes(newLeaveTypes);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const filteredLeaveTypes = leaveTypes.filter(
      lt => lt.name.trim() !== ''
    );
    onSubmit(filteredLeaveTypes);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="bg-sky-500 text-white p-4 rounded-t-lg">
          <h2 className="text-xl font-semibold">
            {initialData ? 'Update Type' : 'Add Type'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-black mb-4">Type</h3>
            <div className="space-y-4">
              {leaveTypes.map((lt, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={lt.name}
                      onChange={(e) => handleChange(index, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                      placeholder={`Leave Type ${index + 1}`}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeLeaveTypeField(index)}
                    className="text-red-500 hover:text-red-700"
                    disabled={leaveTypes.length <= 1}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addLeaveTypeField}
              className="mt-4 text-sky-500 hover:text-sky-700 text-sm font-medium"
            >
              + Add more type fields
            </button>
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
              {initialData ? 'Update Type' : 'Create Type'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaveTypeModal;