
const StatusPopup = ({ isOpen, onClose, onConfirm, heading, topHeading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center w-11/12 max-w-sm">
        <div className="flex flex-col items-center mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-extrabold text-gray-900">
              {topHeading || "Are you sure?"}
            </h2>
          </div>

          <p className="text-sm text-gray-600 mt-1">
            {heading || "Are you sure you want to deactivate this!"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <button
            onClick={onClose}
            className="bg-[#898989] text-white font-semibold py-2 hover:bg-gray-300 rounded-full"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="bg-yellow-400 text-black font-semibold py-2 rounded-full hover:bg-yellow-500"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusPopup;
