import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import Table from '../../components/Atoms/TableData/TableData';
import AlertModal from '../../components/Modal/AlertModal'; 
import { requestRolesAssigned, requestRolesList, requestRolesUpdateStatus } from '../../redux/slices/examination';

const RoleExamRequest = () => {
  const dispatch = useDispatch();
  
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filter, setFilter] = useState('all');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionData, setActionData] = useState({ type: '', id: '', teacherId: '' });

  const requestRolesListData = useSelector(state => state.examination?.requestRolesListData);
  const requestRolesUpdateStatusData = useSelector(state => state.examination?.requestRolesUpdateStatusData);
  const requestRolesAssignedData = useSelector(state => state.examination?.requestRolesAssignedData);

  useEffect(() => {
    fetchRequests();
  }, [currentPage]);

  useEffect(() => {
    if (requestRolesListData?.data?.data?.list) {
      setRequests(requestRolesListData.data.data.list);
    }
  }, [requestRolesListData]);

  const fetchRequests = () => {
    setLoading(true);
    const params = {
      page: currentPage,
      size: itemsPerPage,
      roleId:"690dd5426fa7f65963c2b8cb"
    };
    
    dispatch(requestRolesList(params)).then((action) => {
      if (action.error) {
        toast.error(action.payload || 'Failed to fetch role requests');
      }
      setLoading(false);
    });
  };

  const handleApprove = (request) => {
    setActionData({
      type: 'approve',
      id: request._id,
      teacherId: request.teacherId || request.teacher?._id
    });
    setShowConfirmModal(true);
  };

  const handleReject = (request) => {
    setActionData({
      type: 'reject',
      id: request._id,
      teacherId: request.teacherId || request.teacher?._id
    });
    setShowConfirmModal(true);
  };

  const handleConfirmAction = () => {
    const { type, id, teacherId } = actionData;
    const status = type === 'approve' ? 'Approved' : 'Rejected';
    
    setLoading(true);
    const payload = {
      _id: id,
      teacherId: teacherId,
      status: status
    };
    
    dispatch(requestRolesUpdateStatus(payload)).then((action) => {
      if (!action.error) {
        toast.success(`Request ${status.toLowerCase()} successfully`);
        fetchRequests();
        fetchAssignedRoles();
      } else {
        toast.error(action.payload || `Failed to ${type} request`);
      }
      setLoading(false);
      setShowConfirmModal(false);
      setActionData({ type: '', id: '', teacherId: '' });
    });
  };

  const fetchAssignedRoles = () => {
    dispatch(requestRolesAssigned({page: 1, size: 100}));
  };

  const filteredRequests = requests.filter(request => {
    if (filter === 'all') return true;
    return request.status === filter;
  });

  const totalRequests = requestRolesListData?.data?.data?.total || 0;
  const totalPages = Math.ceil(totalRequests / itemsPerPage);

  const tableData = filteredRequests.map((request, index) => [
    (currentPage - 1) * itemsPerPage + index + 1,
    request.request.teacherName || 'N/A',
    request.teacherEmail || 'N/A',
    request.name || 'N/A',
    request.days || 'N/A',
    request.status || 'Pending',
    request._id,
    request.teacherId || request.teacher?._id
  ]);

  const renderRow = (row, index) => {
    const [sNo, teacherName, email, role, totalDays, status, requestId] = row;
    const request = filteredRequests[index];
    
    const isActionTaken = status === 'Approved' || status === 'Rejected';

    return (
      <tr 
        key={requestId} 
        className={`hover:bg-blue-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
      >
        <td className="py-4 px-4 text-center">
          <div className="font-medium text-gray-800">{sNo}</div>
        </td>
        <td className="py-4 px-4">
          <div className="font-medium text-gray-800">{teacherName}</div>
        </td>
        <td className="py-4 px-4">
          <div className="text-gray-700 truncate max-w-xs">{email}</div>
        </td>
        <td className="py-4 px-4">
          <span className="text-blue-800 rounded-full text-sm">
            {role}
          </span>
        </td>
        <td className="py-4 px-4 text-gray-700">{totalDays}</td>
        <td className="py-4 px-4">
          <span className={`px-3 py-1 rounded-full text-sm font-bold border ${
            status === 'Approved' ? 'bg-green-100 text-green-800 border-green-200' :
            status === 'Rejected' ? 'bg-red-100 text-red-800 border-red-200' :
            'bg-yellow-100 text-yellow-800 border-yellow-200'
          }`}>
            {status}
          </span>
        </td>
        <td className="py-4 px-4">
          <button
            onClick={() => handleApprove(request)}
            disabled={isActionTaken || loading}
            className={`px-4 py-2 rounded-md font-medium text-sm ${
              isActionTaken || loading
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-200'
            }`}
          >
            {status === 'Approved' ? 'Approved' : 'Approve'}
          </button>
        </td>
        <td className="py-4 px-4">
          <button
            onClick={() => handleReject(request)}
            disabled={isActionTaken || loading}
            className={`px-4 py-2 rounded-md font-medium text-sm ${
              isActionTaken || loading
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-200'
            }`}
          >
            {status === 'Rejected' ? 'Rejected' : 'Reject'}
          </button>
        </td>
      </tr>
    );
  };

  const tableHeaders = ['S.No', 'Teacher Name', 'E-mail', 'Roles', 'Total Days', 'Status', 'Approve', 'Reject'];

  return (
    <div className="">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Role Exam Requests</h1>
        <p className="text-gray-600 mt-2">Manage teacher role examination requests</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="mb-6">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md font-medium ${
                filter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Requests
            </button>
            <button
              onClick={() => setFilter('Pending')}
              className={`px-4 py-2 rounded-md font-medium ${
                filter === 'Pending' 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('Approved')}
              className={`px-4 py-2 rounded-md font-medium ${
                filter === 'Approved' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setFilter('Rejected')}
              className={`px-4 py-2 rounded-md font-medium ${
                filter === 'Rejected' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Rejected
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table
            headers={tableHeaders}
            data={tableData}
            renderRow={renderRow}
            currentPage={currentPage}
            size={itemsPerPage}
            handlePageChange={setCurrentPage}
            total={totalRequests}
            totalPages={totalPages}
          />
        </div>

        {filteredRequests.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No role exam requests found</h3>
            <p className="text-gray-500">
              {filter !== 'all' 
                ? `No ${filter.toLowerCase()} requests available` 
                : "No role examination requests available."}
            </p>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading role requests...</p>
          </div>
        )}
      </div>

      <AlertModal
        isOpen={showConfirmModal}
        onCancel={() => {
          setShowConfirmModal(false);
          setActionData({ type: '', id: '', teacherId: '' });
        }}
        onConfirm={handleConfirmAction}
        title={`${actionData.type === 'approve' ? 'Approve' : 'Reject'} Request`}
        description={`Are you sure you want to ${actionData.type === 'approve' ? 'approve' : 'reject'} this role request?`}
        cancelLabel="Cancel"
        confirmLabel={`Yes, ${actionData.type === 'approve' ? 'Approve' : 'Reject'}`}
        confirmClassNameButton={`${actionData.type === 'approve' ? '!bg-green-600 hover:!bg-green-700' : '!bg-red-600 hover:!bg-red-700'}`}
        isVisibleCancelButton={true}
        isVisibleConfirmButton={true}
      />
    </div>
  );
};

export default RoleExamRequest;