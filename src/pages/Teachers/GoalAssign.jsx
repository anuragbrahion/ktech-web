/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getAssignedGoalList,
  requestApprovalForGoal,
} from "../../redux/slices/teacherSlice";
import { toast } from "react-toastify";
import { formatDateForTable, getDaysLeft } from "../../utils/globalFunction";
import LoadingSpinner from "../../components/Loader/Loader";
import Table from "../../components/Atoms/TableData/TableData";

const GoalAssign = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  const getAssignedGoalListData = useSelector(
    (state) => state.teacher?.getAssignedGoalListData,
  );
  const assignedGoalList = getAssignedGoalListData?.data?.data?.list || [];
  const totalCount = getAssignedGoalListData?.data?.data?.total || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const tableHeaders = [
    "Goal",
    "Designation",
    "Assign Date",
    "Total Duration",
    "Days Left",
    "Instant Apply",
    "Action",
  ];

  const fetchAssignedGoals = () => {
    setLoading(true);
    const params = {
      page: currentPage,
      size: itemsPerPage,
    };

    dispatch(getAssignedGoalList(params)).then((action) => {
      if (action.error) {
        toast.error(action.payload || "Failed to fetch assigned goal");
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchAssignedGoals();
  }, [currentPage, itemsPerPage]);

  const handleStartExam = (item) => {
    // Navigate to goal exam page with goal ID
    navigate(`/teacher/goal-exam/${item._id}`, {
      state: {
        goalId: item._id,
        goalName: item.name,
        designationName: item.designationName
      }
    });
  };

  const tableData = useMemo(() => {
    return assignedGoalList.map((item) => [
      item.name,
      item.designationName,
      formatDateForTable(item.assignDate),
      `${item.duration} Months`,
      getDaysLeft(item.assignDate, item.duration, "months").label,
      !item.status || item.status === "Rejected" ? (
        <span
          className="hover:text-blue-600 hover:underline cursor-pointer"
          onClick={() => handleInstantApply(item._id)}
        >
          Apply
        </span>
      ) : (
        "N/A"
      ),
      <div className="flex items-center gap-2">
        <button
          className={`
    px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
    ${
      item.status === "Approved" &&
      getDaysLeft(item.assignDate, item.duration, "months").daysLeft >= 0
        ? "bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-sm hover:shadow-md"
        : "bg-gray-100 text-gray-400 cursor-not-allowed"
    }
  `}
          title={
            item.status !== "Approved"
              ? "Exam not approved yet"
              : getDaysLeft(item.assignDate, item.duration, "months").daysLeft <
                  0
                ? "Exam expired"
                : "Start Exam"
          }
          disabled={
            item.status !== "Approved" ||
            getDaysLeft(item.assignDate, item.duration, "months").daysLeft < 0
          }
          onClick={() => handleStartExam(item)}
        >
          Start Exam
        </button>
      </div>,
    ]);
  }, [assignedGoalList]);

  const handleInstantApply = async (_id) => {
    try {
      setLoading(true);

      const response = await dispatch(requestApprovalForGoal({ _id })).unwrap();

      if (!response.error) {
        toast.success(response.message || "Request sent successfully");
        fetchAssignedGoals();
      } else {
        toast.error(response.message || "Failed to send request");
      }
    } catch (error) {
      console.error("Error: ", error);
      toast.error("Failed to send request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LoadingSpinner loading={loading} />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Assigned Goal</h1>
        <p className="text-gray-600 mt-2">Manage your all assigned goals</p>
      </div>

      <Table
        headers={tableHeaders}
        data={tableData}
        currentPage={currentPage}
        size={itemsPerPage}
        handlePageChange={setCurrentPage}
        total={totalCount}
        totalPages={totalPages}
        renderRow={(row, index) => (
  <tr
    key={index}
    className={`hover:bg-blue-50 ${
      index % 2 === 0 ? "bg-gray-50" : "bg-white"
    }`}
  >
    {row.map((cell, cellIndex) => (
      <td key={cellIndex} className="py-4 px-4">
        {cell}
      </td>
    ))}
  </tr>
)}
      />
    </>
  );
};

export default GoalAssign;