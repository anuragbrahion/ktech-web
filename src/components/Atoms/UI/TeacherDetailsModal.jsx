import React from "react";

const TeacherDetailsModal = ({ isOpen, onClose, teacherData }) => {
  if (!isOpen || !teacherData) return null;

  const getUserName = () => {
    return teacherData?.user?.name || teacherData?.name || "N/A";
  };

  const getUserEmail = () => {
    return teacherData?.user?.email || teacherData?.email || "N/A";
  };

  const getUserPhone = () => {
    return teacherData?.user?.phoneNo || teacherData?.phoneNo || "N/A";
  };

  const getAddress = () => {
    return teacherData?.address || teacherData?.user?.address || "N/A";
  };

  const getSalary = () => {
    return teacherData?.salary || teacherData?.user?.salary || "0";
  };

  const getDateOfJoining = () => {
    const date = teacherData?.dateOfJoining || teacherData?.user?.dateOfJoining;
    if (date) {
      return new Date(date).toLocaleDateString();
    }
    return "N/A";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl my-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-t-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              Teacher Details - {getUserName()}
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors text-2xl leading-none"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-gray-600 text-sm mb-1 font-medium">
                Full Name
              </label>
              <div className="px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-900">
                {getUserName()}
              </div>
            </div>

            <div>
              <label className="block text-gray-600 text-sm mb-1 font-medium">
                Email
              </label>
              <div className="px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-900">
                {getUserEmail()}
              </div>
            </div>

            <div>
              <label className="block text-gray-600 text-sm mb-1 font-medium">
                Phone Number
              </label>
              <div className="px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-900">
                {getUserPhone()}
              </div>
            </div>

            <div>
              <label className="block text-gray-600 text-sm mb-1 font-medium">
                Address
              </label>
              <div className="px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-900">
                {getAddress()}
              </div>
            </div>

            <div>
              <label className="block text-gray-600 text-sm mb-1 font-medium">
                Monthly Salary
              </label>
              <div className="px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-900">
                ₹{getSalary()}
              </div>
            </div>

            <div>
              <label className="block text-gray-600 text-sm mb-1 font-medium">
                Role
              </label>
              <div className="px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-900">
                {teacherData?.role || "Teacher"}
              </div>
            </div>

            <div>
              <label className="block text-gray-600 text-sm mb-1 font-medium">
                Date of Joining
              </label>
              <div className="px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-900">
                {getDateOfJoining()}
              </div>
            </div>

            <div>
  <label className="block text-gray-600 text-sm mb-1 font-medium">
    Status
  </label>

  <div className="px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-900">
    <span
      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
        teacherData?.status
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {teacherData?.status ? "Active" : "Inactive"}
    </span>
  </div>
</div>
          </div>

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

export default TeacherDetailsModal;