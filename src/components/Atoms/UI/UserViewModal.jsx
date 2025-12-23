// components/UserViewModal/UserViewModal.jsx
import React from 'react';

const UserViewModal = ({ isOpen, onClose, userData }) => {
  if (!isOpen || !userData) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl">
        <div className="bg-sky-500 text-white p-4 rounded-t-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">User Details</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200"
            >
              ✕
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6 mb-6">
            <div className="w-32 h-32 bg-sky-100 rounded-full flex items-center justify-center">
              {userData.profileImage ? (
                <img
                  src={userData.profileImage}
                  alt={userData.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-4xl text-sky-500">
                  {userData.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-black">{userData.name}</h3>
              <p className="text-gray-600">{userData.designation}</p>
              <p className="text-gray-600">{userData.department}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Email</label>
                <p className="text-black">{userData.email}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500">Phone No.</label>
                <p className="text-black">{userData.phone}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500">Address</label>
                <p className="text-black">{userData.address}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Designation</label>
                <p className="text-black">{userData.designation}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500">Department</label>
                <p className="text-black">{userData.department}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500">Date of Birth</label>
                <p className="text-black">{formatDate(userData.dob)}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500">Date of Joining</label>
                <p className="text-black">{formatDate(userData.doj)}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t">
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600"
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

export default UserViewModal;