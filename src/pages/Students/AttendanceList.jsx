/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAttendanceList } from "../../redux/slices/teacherSlice";
import { toast } from "react-toastify";
import { formatDateForTable } from "../../utils/globalFunction";
import LoadingSpinner from "../../components/Loader/Loader";
import Table from "../../components/Atoms/TableData/TableData";

const AttendanceList = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const getAttendanceListData = useSelector(
    (state) => state.teacher?.getAttendanceListData,
  );
  const attendanceList = getAttendanceListData?.data?.data?.list || [];
  const totalCount = getAttendanceListData?.data?.data?.total || 0;
  const totalPresent = getAttendanceListData?.data?.data?.totalPresent || 0;
  const totalAbsent = getAttendanceListData?.data?.data?.totalAbsent || 0;
  const totalLeave = getAttendanceListData?.data?.data?.totalLeave || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const tableHeaders = [
    "Name",
    "Course",
    "Batch",
    "Attendance Date",
    "Attendance Status",
  ];

  const fetchAttendances = () => {
    setLoading(true);
    const params = {
      page: currentPage,
      size: itemsPerPage,
      type: "Student",
    };

    dispatch(getAttendanceList(params)).then((action) => {
      if (action.error) {
        toast.error(action.payload || "Failed to fetch courses");
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchAttendances();
  }, [currentPage, itemsPerPage]);

  const tableData = useMemo(() => {
    return attendanceList.map((item) => [
      item.user.name,
      item.course.courseName,
      `${item.batch.startTime}-${item.batch.endTime}`,
      formatDateForTable(item.date),
      item.status,
    ]);
  }, [attendanceList]);

  return (
    <>
      <LoadingSpinner loading={loading} />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Attendance</h1>
        <p className="text-gray-600 mt-2">Manage all your attendance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-blue-50 p-6 rounded-lg shadow border border-blue-100">
          <h3 className="text-lg font-semibold text-blue-700 mb-2">
            Total Count
          </h3>
          <p className="text-3xl font-bold text-black">
            {totalPresent + totalAbsent + totalLeave}
          </p>
        </div>
        <div className="bg-blue-50 p-6 rounded-lg shadow border border-blue-100">
          <h3 className="text-lg font-semibold text-blue-700 mb-2">
            Total Present
          </h3>
          <p className="text-3xl font-bold text-black">{totalPresent}</p>
        </div>
        <div className="bg-blue-50 p-6 rounded-lg shadow border border-blue-100">
          <h3 className="text-lg font-semibold text-blue-700 mb-2">
            Total Absent
          </h3>
          <p className="text-3xl font-bold text-black">{totalAbsent}</p>
        </div>
        <div className="bg-blue-50 p-6 rounded-lg shadow border border-blue-100">
          <h3 className="text-lg font-semibold text-blue-700 mb-2">
            Total Leave
          </h3>
          <p className="text-3xl font-bold text-black">{totalLeave}</p>
        </div>
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

export default AttendanceList;
