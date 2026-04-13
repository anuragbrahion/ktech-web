/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getAssignedRoleList,
  requestApprovalForRole,
} from "../../redux/slices/teacherSlice";
import { toast } from "react-toastify";
import { formatDateForTable, getDaysLeft } from "../../utils/globalFunction";
import LoadingSpinner from "../../components/Loader/Loader";
import Table from "../../components/Atoms/TableData/TableData";

const RoleAssign = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  const getAssignedRoleListData = useSelector(
    (state) => state.teacher?.getAssignedRoleListData,
  );
  const assignedRoleList = getAssignedRoleListData?.data?.data?.list || [];
  const totalCount = getAssignedRoleListData?.data?.data?.total || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const tableHeaders = [
    "Role",
    "Course",
    "Assign Date",
    "Total Days",
    "Days Left",
    "Instant Apply",
    "Action",
  ];

  const fetchAssignedRoles = () => {
    setLoading(true);
    const params = {
      page: currentPage,
      size: itemsPerPage,
    };

    dispatch(getAssignedRoleList(params)).then((action) => {
      if (action.error) {
        toast.error(action.payload || "Failed to fetch assigned role");
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchAssignedRoles();
  }, [currentPage, itemsPerPage]);

  const handleStartExam = (item) => {
    // Navigate to role exam page with role ID
    navigate(`/teacher/role-exam/${item._id}`, {
      state: {
        roleId: item._id,
        roleName: item.name,
        courseName: item.courseName
      }
    });
  };

  const tableData = useMemo(() => {
    return assignedRoleList.map((item) => [
      item.name,
      item.courseName,
      formatDateForTable(item.assignDate),
      `${item.days} Days`,
      `${getDaysLeft(item.assignDate, item.days)} Days`,
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
    p-2.5 rounded-xl transition-all duration-200
    ${
      item.status === "Approved" && getDaysLeft(item.assignDate, item.days) >= 0
        ? "bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-sm hover:shadow-md"
        : "bg-gray-100 text-gray-400 cursor-not-allowed"
    }
  `}
          title={
            item.status !== "Approved"
              ? "Not approved yet"
              : getDaysLeft(item.assignDate, item.days) < 0
                ? "Edit time expired"
                : "Start Exam"
          }
          disabled={
            item.status !== "Approved" ||
            getDaysLeft(item.assignDate, item.days) < 0
          }
          onClick={() => handleStartExam(item)}
        >
          Start Exam
        </button>
      </div>,
    ]);
  }, [assignedRoleList]);

  const handleInstantApply = async (_id) => {
    try {
      setLoading(true);

      const response = await dispatch(requestApprovalForRole({ _id })).unwrap();

      if (!response.error) {
        toast.success(response.message || "Request sent successfully");
        fetchAssignedRoles();
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
        <h1 className="text-3xl font-bold text-gray-900">Assigned Role</h1>
        <p className="text-gray-600 mt-2">Manage your all assigned role</p>
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

export default RoleAssign;