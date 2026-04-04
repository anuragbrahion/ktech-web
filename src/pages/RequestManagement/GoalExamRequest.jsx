/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Table from "../../components/Atoms/TableData/TableData";
import AlertModal from "../../components/Modal/AlertModal";
import {
  requestGoalsList,
  requestGoalsUpdateStatus,
  requestGoalsAssigned,
} from "../../redux/slices/examination";
import Loader from "../../components/Loader/Loader";
import { goalsAllDocuments } from "../../redux/slices/employee";

const GoalExamRequest = () => {
  const dispatch = useDispatch();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filter, setFilter] = useState("all");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionData, setActionData] = useState({
    type: "",
    id: "",
    teacherId: "",
  });
  const [selectedGoal, setSelectedGoal] = useState(null);

  const requestGoalsListData = useSelector(
    (state) => state.examination?.requestGoalsListData,
  );
  const goalsAllDocumentsData = useSelector(
    (state) => state.employee?.goalsAllDocumentsData,
  );
  const allGoals = goalsAllDocumentsData?.data?.data?.list || [];

  useEffect(() => {
    if (selectedGoal) fetchRequests();
  }, [currentPage, filter, selectedGoal]);

  useEffect(() => {
    if (requestGoalsListData?.data?.data?.list) {
      setRequests(requestGoalsListData.data.data.list);
    }
  }, [requestGoalsListData]);

  const fetchRequests = () => {
    setLoading(true);
    const params = {
      page: currentPage,
      size: itemsPerPage,
      goalId: selectedGoal,
    };

    if (filter && filter !== "all") {
      params.status = filter;
    }

    dispatch(requestGoalsList(params)).then((action) => {
      if (action.error) {
        toast.error(action.payload || "Failed to fetch goal requests");
      }
      setLoading(false);
    });
  };

  const handleApprove = (request) => {
    setActionData({
      type: "approve",
      id: request._id,
      teacherId: request.teacherId || request.teacher?._id,
    });
    setShowConfirmModal(true);
  };

  const handleReject = (request) => {
    setActionData({
      type: "reject",
      id: request._id,
      teacherId: request.teacherId || request.teacher?._id,
    });
    setShowConfirmModal(true);
  };

  const handleConfirmAction = () => {
    const { type, id, teacherId } = actionData;
    const status = type === "approve" ? "Approved" : "Rejected";

    setLoading(true);
    const payload = {
      _id: id,
      teacherId: teacherId,
      status: status,
    };

    dispatch(requestGoalsUpdateStatus(payload)).then((action) => {
      if (!action.error) {
        toast.success(`Request ${status.toLowerCase()} successfully`);
        fetchRequests();
        fetchAssignedGoals();
      } else {
        toast.error(action.payload || `Failed to ${type} request`);
      }
      setLoading(false);
      setShowConfirmModal(false);
      setActionData({ type: "", id: "", teacherId: "" });
    });
  };

  const fetchAssignedGoals = () => {
    dispatch(requestGoalsAssigned({ page: 1, size: 100 }));
  };

  const totalRequests = requestGoalsListData?.data?.data?.total || 0;
  const totalPages = Math.ceil(totalRequests / itemsPerPage);

  const tableData = requests.map((request, index) => [
    (currentPage - 1) * itemsPerPage + index + 1,
    request.teacherName || "N/A",
    request.teacherEmail || "N/A",
    request.name || "N/A",
    request.duration || "N/A",
    request.status || "Pending",
    request._id,
    request.teacherId || request.teacher?._id,
  ]);

  const renderRow = (row, index) => {
    const [sNo, teacherName, email, goal, totalDays, status, requestId] = row;
    const request = requests[index];

    const isActionTaken = status === "Approved" || status === "Rejected";

    return (
      <tr
        key={requestId}
        className={`hover:bg-blue-50 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
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
          <span className="text-blue-800 rounded-full text-sm">{goal}</span>
        </td>
        <td className="py-4 px-4 text-gray-700">{totalDays}</td>
        <td className="py-4 px-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-bold border ${
              status === "Approved"
                ? "bg-green-100 text-green-800 border-green-200"
                : status === "Rejected"
                  ? "bg-red-100 text-red-800 border-red-200"
                  : "bg-yellow-100 text-yellow-800 border-yellow-200"
            }`}
          >
            {status}
          </span>
        </td>
        <td className="py-4 px-4">
          <div className="flex gap-2">
            <button
              onClick={() => handleApprove(request)}
              disabled={isActionTaken || loading}
              className={`px-4 py-2 rounded-md font-medium text-sm ${
                isActionTaken || loading
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-green-100 text-green-700 hover:bg-green-200 border border-green-200"
              }`}
            >
              {status === "Approved" ? "Approved" : "Approve"}
            </button>
            <button
              onClick={() => handleReject(request)}
              disabled={isActionTaken || loading}
              className={`px-4 py-2 rounded-md font-medium text-sm ${
                isActionTaken || loading
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-red-100 text-red-700 hover:bg-red-200 border border-red-200"
              }`}
            >
              {status === "Rejected" ? "Rejected" : "Reject"}
            </button>
          </div>
        </td>
      </tr>
    );
  };

  const tableHeaders = [
    "S.No",
    "Teacher Name",
    "E-mail",
    "Goals",
    "Total Days",
    "Status",
    "Action",
  ];

  useEffect(() => {
    dispatch(goalsAllDocuments({ select: "name" }));
  }, []);

  useEffect(() => {
    if (allGoals.length > 0) {
      setSelectedGoal(allGoals[0]._id);
    }
  }, [allGoals]);

  return (
    <>
      <Loader loading={loading} />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Goals Exam Requests
        </h1>
        <p className="text-gray-600 mt-2">
          Manage teacher goals examination requests
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 bg-gray-100 p-1 rounded-xl w-fit">
            {[
              { label: "All", value: "all" },
              { label: "Pending", value: "Pending" },
              { label: "Approved", value: "Approved" },
              { label: "Rejected", value: "Rejected" },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setFilter(item.value)}
                className={`px-4 py-1.5 text-sm font-medium rounded-lg transition ${
                  filter === item.value
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Role Select */}
          <div className="w-full md:w-64">
            <select
              value={selectedGoal}
              onChange={(e) => setSelectedGoal(e.target.value)}
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 capitalize"
            >
              {allGoals.map((role, index) => (
                <option key={index} value={role._id}>
                  {role.name}
                </option>
              ))}
            </select>
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
      </div>

      <AlertModal
        isOpen={showConfirmModal}
        onCancel={() => {
          setShowConfirmModal(false);
          setActionData({ type: "", id: "", teacherId: "" });
        }}
        onConfirm={handleConfirmAction}
        title={`${actionData.type === "approve" ? "Approve" : "Reject"} Request`}
        description={`Are you sure you want to ${actionData.type === "approve" ? "approve" : "reject"} this goal request?`}
        cancelLabel="Cancel"
        confirmLabel={`Yes, ${actionData.type === "approve" ? "Approve" : "Reject"}`}
        confirmClassNameButton={`${actionData.type === "approve" ? "!bg-green-600 hover:!bg-green-700" : "!bg-red-600 hover:!bg-red-700"}`}
        isVisibleCancelButton={true}
        isVisibleConfirmButton={true}
      />
    </>
  );
};

export default GoalExamRequest;
