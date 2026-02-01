import { useState } from "react";

const FollowUpPopup = ({ isOpen, onClose, followUps, onMoveToAdmission }) => {
  const [loading, setLoading] = useState({});
   if (!isOpen) return null;

  const handleMoveToAdmission = async (inquiry) => {
    if (window.confirm('Are you sure you want to move this inquiry to admission?')) {
      setLoading(prev => ({ ...prev, [inquiry._id]: true }));
      
      try {
        await onMoveToAdmission(inquiry);
      } finally {
        setLoading(prev => ({ ...prev, [inquiry._id]: false }));
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Today's Follow Ups</h2>
              <p className="text-gray-600 mt-2">
                Date: {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <p className="text-gray-800 font-medium">
              You have {followUps.length} follow up{followUps.length !== 1 ? 's' : ''} scheduled for today.
            </p>
          </div>

          {followUps.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-gray-700 font-semibold">Sr No.</th>
                    <th className="py-3 px-4 text-left text-gray-700 font-semibold">Name</th>
                    <th className="py-3 px-4 text-left text-gray-700 font-semibold">Phone No</th>
                    <th className="py-3 px-4 text-left text-gray-700 font-semibold">Course</th>
                    <th className="py-3 px-4 text-left text-gray-700 font-semibold">Status</th>
                    <th className="py-3 px-4 text-left text-gray-700 font-semibold">Remarks</th>
                    <th className="py-3 px-4 text-left text-gray-700 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {followUps.map((followUp, index) => (
                    <tr 
                      key={followUp._id} 
                      className={`hover:bg-blue-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                    >
                      <td className="py-3 px-4 text-gray-900">{index + 1}</td>
                      <td className="py-3 px-4 text-gray-900 font-medium">{followUp.name}</td>
                      <td className="py-3 px-4 text-gray-900">
                        <a href={`tel:${followUp.phoneNo}`} className="text-blue-600 hover:text-blue-800">
                          {followUp.phoneNo}
                        </a>
                      </td>
                      <td className="py-3 px-4 text-gray-900">{followUp.course?.courseName || 'N/A'}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-sm ${
                          followUp.status?.name === 'New' ? 'bg-yellow-100 text-yellow-800' :
                          followUp.status?.name === 'Contacted' ? 'bg-blue-100 text-blue-800' :
                          followUp.status?.name === 'Interested' ? 'bg-green-100 text-green-800' :
                          followUp.status?.name === 'Not Interested' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {followUp.status?.name || 'Pending'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-900 text-sm max-w-xs">
                        {followUp.remarks || 'No remarks'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleMoveToAdmission(followUp)}
                            className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm disabled:opacity-50"
                            disabled={loading[followUp._id]}
                          >
                            {loading[followUp._id] ? 'Processing...' : 'Move to Admission'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🎉</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No follow-ups for today</h3>
              <p className="text-gray-500">Great job! All follow-ups are completed.</p>
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FollowUpPopup;