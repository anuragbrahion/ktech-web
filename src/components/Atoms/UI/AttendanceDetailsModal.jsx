const AttendanceDetailsModal = ({ isOpen, onClose, studentData, onSubmit }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-sky-600 mb-4">Attendance Details</h2>
        <form>
          <div className="mb-4">
            <label className="block text-black mb-2">Name</label>
            <input 
              type="text" 
              value={studentData?.name || ''}
              className="w-full px-3 py-2 border rounded text-black"
              readOnly
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-black mb-2">Course</label>
            <select className="w-full px-3 py-2 border rounded text-black">
              <option>Select...</option>
              <option>ms office</option>
              <option>Tally accounting</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-black mb-2">Status</label>
            <select className="w-full px-3 py-2 border rounded text-black">
              <option>Select...</option>
              <option>Present</option>
              <option>Absent</option>
              <option>Leave</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-black mb-2">Date</label>
            <input 
              type="date" 
              className="w-full px-3 py-2 border rounded text-black"
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded text-black"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 bg-sky-500 text-white rounded"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AttendanceDetailsModal;