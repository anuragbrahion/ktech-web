const StudentDetailsModal = ({ isOpen, onClose, studentData, onUpdate }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl my-8">
        <h2 className="text-2xl font-bold text-sky-600 mb-4">Student Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Display all student personal details here */}
          {/* Name, DOB, Gender, Email, Phone, etc. */}
        </div>
      </div>
    </div>
  );
};

export default StudentDetailsModal;