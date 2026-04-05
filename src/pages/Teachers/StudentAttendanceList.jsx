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
  const [filterText, setFilterText] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const getAttendanceListData = useSelector(
    (state) => state.teacher?.getAttendanceListData,
  );

  const attendanceList = getAttendanceListData?.data?.data?.list || [];
  const totalPresent = getAttendanceListData?.data?.data?.totalPresent || 0;
  const totalAbsent = getAttendanceListData?.data?.data?.totalAbsent || 0;
  const totalLeave = getAttendanceListData?.data?.data?.totalLeave || 0;

  const tableHeaders = [
    "Student Name",
    "Student Course",
    "Batch",
    "Date",
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
        toast.error(action.payload || "Failed to fetch attendance");
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchAttendances();
  }, [currentPage, itemsPerPage]);

  // Filter attendance list based on search and date range
  const filteredAttendanceList = useMemo(() => {
    let filtered = [...attendanceList];

    // Filter by student name
    if (filterText) {
      filtered = filtered.filter((item) =>
        item.user.name.toLowerCase().includes(filterText.toLowerCase())
      );
    }

    // Filter by start date
    if (startDate) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.date).toISOString().split("T")[0];
        return itemDate >= startDate;
      });
    }

    // Filter by end date
    if (endDate) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.date).toISOString().split("T")[0];
        return itemDate <= endDate;
      });
    }

    return filtered;
  }, [attendanceList, filterText, startDate, endDate]);

  const tableData = useMemo(() => {
    return filteredAttendanceList.map((item) => [
      item.user.name,
      item.course.courseName,
      `${item.batch.startTime} - ${item.batch.endTime}`,
      formatDateForTable(item.date),
      item.status,
    ]);
  }, [filteredAttendanceList]);

  // Get status color class
  const getStatusColorClass = (status) => {
    switch (status?.toLowerCase()) {
      case "present":
        return "bg-green-100 text-green-700";
      case "absent":
        return "bg-red-100 text-red-700";
      case "leave":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilterText("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <>
      <LoadingSpinner loading={loading} />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Student Attendance</h1>
        <p className="text-gray-600 mt-2">Manage all student attendance</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Present Card */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-2 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Total Present
              </p>
              <p className="text-3xl font-bold text-gray-800 mt-1">
                {totalPresent}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Absent Card */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-2 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Total Absent
              </p>
              <p className="text-3xl font-bold text-gray-800 mt-1">
                {totalAbsent}
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Leave Card */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-2 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Total Leave
              </p>
              <p className="text-3xl font-bold text-gray-800 mt-1">
                {totalLeave}
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <svg
                className="w-6 h-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* Student Name Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student Name
            </label>
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="rahul"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Start Date Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* End Date Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter Button */}
          <div>
            <button
              onClick={handleClearFilters}
              className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
            >
              Clear Filter
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <Table
        headers={tableHeaders}
        data={tableData}
        currentPage={currentPage}
        size={itemsPerPage}
        handlePageChange={setCurrentPage}
        total={filteredAttendanceList.length}
        totalPages={Math.ceil(filteredAttendanceList.length / itemsPerPage)}
        renderRow={(row, index) => (
          <tr
            key={index}
            className={`hover:bg-blue-50 transition-colors duration-150 ${
              index % 2 === 0 ? "bg-gray-50" : "bg-white"
            }`}
          >
            {row.map((cell, cellIndex) => {
              // Apply status styling for the Attendance Status column (index 4)
              const isStatusColumn = cellIndex === 4;
              return (
                <td key={cellIndex} className="py-4 px-4">
                  {isStatusColumn ? (
                    <span
                      className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColorClass(
                        cell
                      )}`}
                    >
                      {cell}
                    </span>
                  ) : (
                    <span className="text-gray-700">{cell || "-"}</span>
                  )}
                </td>
              );
            })}
          </tr>
        )}
      />

      {/* No Data Message */}
      {filteredAttendanceList.length === 0 && !loading && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm mt-4">
          <p className="text-gray-500 text-lg">No attendance records found</p>
        </div>
      )}
    </>
  );
};

export default StudentAttendanceList;