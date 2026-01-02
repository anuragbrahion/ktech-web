const AdmissionDetailsModal = ({ isOpen, onClose, onOpenInstallments, studentData, onUpdate }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl my-8">
        <h2 className="text-2xl font-bold mb-4">Admission Details</h2>
        <button 
          onClick={onOpenInstallments}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
        >
          View Installments
        </button>
      </div>
    </div>
  );
};

export default AdmissionDetailsModal;