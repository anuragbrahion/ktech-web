/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAttendanceList } from "../../redux/slices/teacherSlice";
import { toast } from "react-toastify";
import { formatDateForTable } from "../../utils/globalFunction";
import LoadingSpinner from "../../components/Loader/Loader";
import Table from "../../components/Atoms/TableData/TableData";

const StudentAttendanceList = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const getAttendanceListData = useSelector(
    (state) => state.teacher?.getAttendanceListData,
  );
  const attendanceList = getAttendanceListData?.data?.data?.list || [];
  const totalCount = getAttendanceListData?.data?.data?.total || 0;
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
      type:"Student"
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
        <h1 className="text-3xl font-bold text-gray-900">Student Attendance</h1>
        <p className="text-gray-600 mt-2">Manage all student attendance</p>
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

export default StudentAttendanceList;
