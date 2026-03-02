/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAssignedGoalList,
  requestApprovalForGoal,
} from "../../redux/slices/teacherSlice";
import { toast } from "react-toastify";
import { formatDateForTable, getDaysLeft } from "../../utils/globalFunction";
import LoadingSpinner from "../../components/Loader/Loader";
import Table from "../../components/Atoms/TableData/TableData";
import { Edit2 } from "lucide-react";

const GoalAssign = () => {
  const dispatch = useDispatch();
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
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent"
          title="Edit"
          disabled={
            item.status != "Approved" ||
            getDaysLeft(item.assignDate, item.duration, "months").daysLeft < 0
          }
        >
          <Edit2 className="w-4 h-4" />
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
            className={`hover:bg-blue-50 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
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
