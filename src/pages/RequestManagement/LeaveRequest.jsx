/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import Table from '../../components/Atoms/TableData/TableData';
import AlertModal from '../../components/Modal/AlertModal';
import {
  requestLeavesList,
  requestLeavesUpdateStatus,
  requestLeavesApply
} from '../../redux/slices/examination';
import moment from 'moment-timezone';

 
const ViewLeaveModal = ({ isOpen, onClose, leaveData }) => {
  if (!isOpen || !leaveData) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString || error;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Leave Request Details
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
          </div>

          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 mb-2">User Name</label>
                <div className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 capitalize">
                  {leaveData.name?.name || leaveData.userName || 'N/A'}
                </div>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Apply Date</label>
                <div className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {formatDate(leaveData.applyDate)}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">From Date</label>
                <div className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {formatDate(leaveData.startDate)}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">To Date</label>
                <div className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {formatDate(leaveData.endDate)}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Leave Type</label>
                <div className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50">
                  {leaveData.leaveType?.name || 'N/A'}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Status</label>
                <div className={`w-full px-4 py-2 border rounded-md ${
                  leaveData.leaveStatus === 'Approved' ? 'bg-green-100 text-green-800 border-green-200' :
                  leaveData.leaveStatus === 'Rejected' ? 'bg-red-100 text-red-800 border-red-200' :
                  'bg-yellow-100 text-yellow-800 border-yellow-200'
                }`}>
                  {leaveData.leaveStatus || 'Pending'}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Reason</label>
              <div className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 min-h-[2vh] break-words break-all">
                {leaveData.reason || 'No reason provided'}
              </div>
            </div>

            {leaveData.remarks && (
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Remarks</label>
                <div className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 min-h-[2vh] break-words break-all">
                  {leaveData.remarks}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const UpdateStatusModal = ({ isOpen, onClose, onSave, leaveData, loading }) => {
  const [leaveStatus, setStatus] = useState('');
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    if (leaveData) {
      setStatus(leaveData.leaveStatus || '');
      setRemarks(leaveData.remarks || '');
    }
  }, [leaveData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!leaveStatus) return;
    
    onSave({ leaveStatus, remarks });
  };

  if (!isOpen || !leaveData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Update Leave Status
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-gray-600 mb-1">Leave Request:</p>
              <p className="font-medium text-gray-800 capitalize">
                {leaveData.name?.name || 'N/A'}
              </p>
              <p className="text-sm text-gray-600">
                {leaveData.leaveType?.name || leaveData.leaveType || 'N/A'} • 
                {leaveData.startDate ? ` From: ${new Date(leaveData.startDate).toLocaleDateString()}` : ''} • 
                {leaveData.endDate ? ` To: ${new Date(leaveData.endDate).toLocaleDateString()}` : ''}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Status *</label>
              <select
                value={leaveStatus}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={loading}
              >
                <option value="">Select...</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Remarks</label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                placeholder="Add remarks for leaveStatus update (optional)"
                disabled={loading}
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700 font-medium"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const ApplyLeaveModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    leaveType: '',
    reason: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      startDate: '',
      endDate: '',
      leaveType: '',
      reason: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Apply for Leave
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
              disabled={loading}
            >
              &times;
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Start Date *</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={loading}
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2">End Date *</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={loading}
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Leave Type *</label>
              <select
                name="leaveType"
                value={formData.leaveType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={loading}
              >
                <option value="">Select Leave Type</option>
                <option value="690f09866fa7f65963c2d707">Sick Leave</option>
                <option value="690f09866fa7f65963c2d708">Casual Leave</option>
                <option value="690f09866fa7f65963c2d709">Earned Leave</option>
                <option value="690f09866fa7f65963c2d70a">Maternity Leave</option>
                <option value="690f09866fa7f65963c2d70b">Paternity Leave</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Reason *</label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                placeholder="Please provide a reason for your leave"
                required
                disabled={loading}
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700 font-medium"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Leave Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const LeaveRequest = () => {
  const dispatch = useDispatch();
  
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  const [showViewModal, setShowViewModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
 
  const requestLeavesListData = useSelector(state => state.examination?.requestLeavesListData); 

  useEffect(() => {
    fetchLeaves();
  }, [currentPage]);

  useEffect(() => {
    if (requestLeavesListData?.data?.data?.list) {
      setLeaves(requestLeavesListData.data.data.list);
    }
  }, [requestLeavesListData]);

  const fetchLeaves = () => {
    setLoading(true);
    const params = {
      page: currentPage,
      size: itemsPerPage
    };
    
    dispatch(requestLeavesList(params)).then((action) => {
      if (action.error) {
        toast.error(action.payload || 'Failed to fetch leave requests');
      }
      setLoading(false);
    });
  };

  const handleViewLeave = (leave) => {
    setSelectedLeave(leave);
    setShowViewModal(true);
  };

  const handleUpdateStatus = (leave) => {
    setSelectedLeave(leave);
    setShowStatusModal(true);
  };

  const handleSaveStatus = (updatedData) => {
    const payload = {
      _id: selectedLeave._id,
      leaveStatus: updatedData.leaveStatus,
      remarks: updatedData.remarks
    };
    
    setLoading(true);
    dispatch(requestLeavesUpdateStatus(payload)).then((action) => {
      if (!action.error) {
        toast.success(`Leave leaveStatus updated to ${updatedData.leaveStatus}`);
        fetchLeaves();
      } else {
        toast.error(action.payload || 'Failed to update leave leaveStatus');
      }
      setLoading(false);
      setShowStatusModal(false);
      setSelectedLeave(null);
    });
  };

  const handleApplyLeave = (leaveData) => {
    setLoading(true);
    const formattedData = {
      ...leaveData,
      applyDate: new Date().toISOString(),
      startDate: leaveData.startDate,
      endDate: leaveData.endDate,
      leaveType: leaveData.leaveType,
      reason: leaveData.reason
    };
    
    dispatch(requestLeavesApply(formattedData)).then((action) => {
      if (!action.error) {
        toast.success('Leave application submitted successfully');
        setShowApplyModal(false);
        fetchLeaves();
      } else {
        toast.error(action.payload || 'Failed to submit leave application');
      }
      setLoading(false);
    });
  };

  const totalLeaves = requestLeavesListData?.data?.data?.total || 0;
  const totalPages = Math.ceil(totalLeaves / itemsPerPage);

  const tableData = leaves.map((leave, index) => [
    leave.name?.name || 'N/A',
    leave.applyDate ? new Date(leave.applyDate).toLocaleDateString() : 'N/A',
    leave.leaveType?.name || 'N/A',
    leave.startDate || 'N/A',
    leave.endDate || 'N/A',
    leave.leaveStatus || 'Pending',
    leave._id
  ]);

  const renderRow = (row, index) => {
    const [userName, applyDate, leaveType, leaveFrom, leaveTo, leaveStatus, leaveId] = row;
    const leave = leaves[index];

    return (
      <tr 
        key={leaveId} 
        className={`hover:bg-blue-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
      >
        <td className="py-4 px-4">
          <div className="font-medium text-gray-800 capitalize">{userName}</div>
        </td>
        <td className="py-4 px-4 text-gray-700">{applyDate}</td>
        <td className="py-4 px-4">
          <span className={`text-sm ${
            leaveType === 'Full day' ? 'bg-blue-100 text-blue-800' :
            leaveType === 'Half day' ? 'bg-purple-100 text-purple-800' :
            'text-green-800'
          }`}>
            {leaveType}
          </span>
        </td>
        <td className="py-4 px-4 text-gray-700">
  {moment(leaveFrom).format('YYYY-MM-DD')}
</td>
        <td className="py-4 px-4 text-gray-700">{moment(leaveTo).format('YYYY-MM-DD')}</td>
        <td className="py-4 px-4">
          <span className={`px-3 py-1 rounded-full text-sm font-bold border ${
            leaveStatus === 'Approved' ? 'bg-green-100 text-green-800 border-green-200' :
            leaveStatus === 'Rejected' ? 'bg-red-100 text-red-800 border-red-200' :
            'bg-yellow-100 text-yellow-800 border-yellow-200'
          }`}>
            {leaveStatus}
          </span>
        </td>
        <td className="py-4 px-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleViewLeave(leave)}
              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded text-xl"
              title="View Leave Details"
              disabled={loading}
            >
              👁️
            </button>
            <button
              onClick={() => handleUpdateStatus(leave)}
              className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded text-xl"
              title="Update Leave Status"
              disabled={loading}
            >
              ✏️
            </button>
          </div>
        </td>
      </tr>
    );
  };

  const tableHeaders = ['User Name', 'Apply Date', 'Leave Type', 'Leave From', 'Leave To', 'Status', 'Actions']; 

  return (
    <div className="">
      <div className="mb-8">
        <div className="flex justify-between items-start md:items-center mb-4 flex-col md:flex-row gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Leave Requests</h1>
            <p className="text-gray-600 mt-2">Manage and review employee leave requests</p>
          </div>
          <button
            onClick={() => setShowApplyModal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
            disabled={loading}
          >
            <span className="text-xl">+</span>
            Apply for Leave
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
       
        <div className="overflow-x-auto">
          <Table
            headers={tableHeaders}
            data={tableData}
            renderRow={renderRow}
            currentPage={currentPage}
            size={itemsPerPage}
            handlePageChange={setCurrentPage}
            total={totalLeaves}
            totalPages={totalPages}
          />
        </div> 

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading leave requests...</p>
          </div>
        )}
      </div>

      <ViewLeaveModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedLeave(null);
        }}
        leaveData={selectedLeave}
      />

      <UpdateStatusModal
        isOpen={showStatusModal}
        onClose={() => {
          setShowStatusModal(false);
          setSelectedLeave(null);
        }}
        onSave={handleSaveStatus}
        leaveData={selectedLeave}
        loading={loading}
      />

      <ApplyLeaveModal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        onSubmit={handleApplyLeave}
        loading={loading}
      /> 
    </div>
  );
};

export default LeaveRequest;