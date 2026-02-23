import React from "react";

const TeacherDetailsModal = ({ isOpen, onClose, teacherData }) => {
  if (!isOpen || !teacherData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl my-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-500 to-sky-600 text-white p-4 rounded-t-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              Teacher Details - {teacherData?.user?.name || teacherData?.name}
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            <Detail label="Full Name" value={teacherData?.user?.name || teacherData?.name} />
            <Detail label="Email" value={teacherData?.user?.email || teacherData?.email} />
            <Detail label="Phone Number" value={teacherData?.user?.phoneNo || teacherData?.phoneNo} />
            <Detail label="Wallet Amount" value={teacherData?.walletAmount || "0"} />
            <Detail label="Address" value={teacherData?.address || "-"} />
            <Detail label="Monthly Salary" value={teacherData?.salary || "-"} />
            <Detail label="Role" value={teacherData?.role || "Teacher"} />
            <Detail label="Date of Birth" value={teacherData?.dob || "-"} />
            <Detail label="Date of Joining" value={teacherData?.doj || "-"} />

          </div>

          {/* Footer */}
          <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* Reusable Detail Component */
const Detail = ({ label, value }) => (
  <div>
    <label className="block text-gray-600 text-sm mb-1 font-medium">
      {label}
    </label>
    <div className="px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-900">
      {value || "-"}
    </div>
  </div>
);

export default TeacherDetailsModal;