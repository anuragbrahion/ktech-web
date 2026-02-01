// components/Atoms/UI/TodaysFollowUpsPopup.jsx
import React from 'react';
import { X, Calendar, User, Phone, Mail, Book } from 'lucide-react';
import Table from '../TableData/TableData';
 
const TodaysFollowUpsPopup = ({ 
  isOpen, 
  onClose, 
  followUps, 
  onMoveToAdmission, 
  getStatusName, 
  loading
}) => {
  if (!isOpen) return null;

  const tableHeaders = ['Name', 'Phone No', 'Remarks', 'Actions'];
  
   const tableData = followUps.map(inquiry => [
    inquiry.name || 'N/A',
    inquiry.phoneNo || 'N/A',
    inquiry.remarks || 'No remarks',
   ]);

   const renderRow = (row, index) => {
    const [name, phoneNo, remarks, inquiryId] = row;
    const inquiry = followUps[index];

    return (
      <tr key={inquiryId || index} className="hover:bg-gray-50">
        <td className="py-3 px-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">{name}</div>
              <div className="text-sm text-gray-500">{inquiry.email || 'No email'}</div>
            </div>
          </div>
        </td>
        <td className="py-3 px-4 border-b">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-400" />
            <a 
              href={`tel:${phoneNo}`} 
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              {phoneNo}
            </a>
          </div>
        </td> 
        <td className="py-3 px-4 border-b">
          <div className="text-gray-600 text-sm max-w-xs truncate" title={remarks}>
            {remarks??"N/A"}
          </div>
        </td>
        <td className="py-3 px-4 border-b">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onMoveToAdmission(inquiry)}
              className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm disabled:opacity-50"
              disabled={loading}
              title="Move to Admission"
            >
              Move
            </button>
            <button
              onClick={() => window.open(`tel:${phoneNo}`, '_blank')}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
              title="Call"
            >
              <Phone className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Today's Follow-ups</h2>
                  <p className="text-gray-600">
                    {followUps.length} follow-up{followUps.length !== 1 ? 's' : ''} scheduled for today
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

         <div className="p-6 overflow-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          {followUps.length > 0 ? (
            <div>
              <Table
                headers={tableHeaders}
                data={tableData}
                renderRow={renderRow}
              />
              
              {/* Stats Summary */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-blue-600 font-medium">Total Follow-ups</div>
                  <div className="text-2xl font-bold text-gray-900">{followUps.length}</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-green-600 font-medium">Ready for Admission</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {followUps.filter(f => getStatusName(f.status) === 'Interested').length}
                  </div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="text-sm text-yellow-600 font-medium">Need Follow-up</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {followUps.filter(f => getStatusName(f.status) === 'Contacted').length}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No follow-ups today</h3>
              <p className="text-gray-600 mb-6">All clear! No follow-ups scheduled for today.</p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Close
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {followUps.length > 0 && (
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Showing {followUps.length} follow-up{followUps.length !== 1 ? 's' : ''}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    // Optional: Add print functionality
                    window.print();
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Print List
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodaysFollowUpsPopup;