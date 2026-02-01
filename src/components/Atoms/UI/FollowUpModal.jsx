import moment from "moment-timezone";

const FollowUpModal = ({ isOpen, onClose, visitor, loading }) => {
  if (!isOpen || !visitor) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl my-8">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-black">
                Follow-up Details
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-4xl"
              type="button"
              disabled={loading}
            >
              &times;
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading follow-up data...</p>
            </div>
          ) : (
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Visitor Information
              </h3>

              {visitor.map((ele, idx) => (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4" key={idx}>
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{ele?.name}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{ele?.phoneNo}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Purpose</p>
                    <p className="font-medium">{ele?.purpose}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Meeting With</p>
                    <p className="font-medium">{ele?.meetingWith}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Follow-up Date</p>
                    <p
                      className={`font-medium ${
                        ele?.followUpDate ? "text-green-600" : "text-gray-600"
                      }`}
                    >
                      {ele?.followUpDate
                        ? moment(ele.followUpDate).format("DD MMM YYYY")
                        : "Not set"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowUpModal;
