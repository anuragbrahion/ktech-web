import React from 'react';

const ViewBatchModal = ({ isOpen, onClose, batchData }) => {
  if (!isOpen || !batchData) return null;

  const coursesList = batchData.courses.split(',').map(course => course.trim());

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl my-8 max-h-[90vh] overflow-hidden overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Batch Details</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Schedule</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Start Time:</span>
                    <span className="font-bold text-black text-lg">{batchData.startTime}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">End Time:</span>
                    <span className="font-bold text-black text-lg">{batchData.endTime}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-bold text-black">
                      {(() => {
                        const start = parseInt(batchData.startTime.split(':')[0]);
                        const end = parseInt(batchData.endTime.split(':')[0]);
                        const startPeriod = batchData.startTime.includes('PM') ? 12 : 0;
                        const endPeriod = batchData.endTime.includes('PM') ? 12 : 0;
                        const totalHours = (end + endPeriod) - (start + startPeriod);
                        return `${totalHours} hour${totalHours > 1 ? 's' : ''}`;
                      })()}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Seat Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Seats:</span>
                    <span className="font-bold text-blue-600 text-lg">{batchData.totalSeats}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Available Seats:</span>
                    <span className={`font-bold text-lg ${
                      parseInt(batchData.availableSeats) > 0 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {batchData.availableSeats}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Booked Seats:</span>
                    <span className="font-bold text-yellow-600 text-lg">
                      {batchData.totalSeats - batchData.availableSeats}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Status & Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      batchData.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {batchData.status.charAt(0).toUpperCase() + batchData.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Created At:</span>
                    <span className="font-medium text-black">{batchData.createdAt}</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Batch ID:</span>
                    <span className="font-mono text-black">BATCH{batchData.id.toString().padStart(4, '0')}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Courses Included</h3>
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200 max-h-60 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {coursesList.map((course, index) => (
                    <div key={index} className="flex items-center">
                      <span className="w-2 h-2 bg-sky-500 rounded-full mr-2"></span>
                      <span className="text-black">{course}</span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Total {coursesList.length} course{coursesList.length > 1 ? 's' : ''} in this batch
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t mt-6">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBatchModal;