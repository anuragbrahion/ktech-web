const InstallmentDetailsModal = ({ isOpen, onClose, studentData, onSubmit }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl my-8">
        <h2 className="text-2xl font-bold mb-4">Installments</h2>
        {/* Installment form content from image 4 */}
      </div>
    </div>
  );
};

export default InstallmentDetailsModal;