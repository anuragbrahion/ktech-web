/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAttendanceList } from "../../redux/slices/teacherSlice";
import { toast } from "react-toastify";
import { formatDateForTable } from "../../utils/globalFunction";
import LoadingSpinner from "../../components/Loader/Loader";
import Table from "../../components/Atoms/TableData/TableData";

const TeacherAttendance = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const getMyAttendanceListData = useSelector(
    (state) => state.teacher?.getAttendanceListData,
  );

  const attendanceList = getMyAttendanceListData?.data?.data?.list || [];
  const totalCount = getMyAttendanceListData?.data?.data?.total || 0;
  const totalPresent = getMyAttendanceListData?.data?.data?.totalPresent || 0;
  const totalAbsent = getMyAttendanceListData?.data?.data?.totalAbsent || 0;
  const totalLeave = getMyAttendanceListData?.data?.data?.totalLeave || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);
   const tableHeaders = ["Teacher Name", "Attendance Date", "Attendance Status"];

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchAttendances = useCallback(() => {
    setLoading(true);
    const params = {
      page: currentPage,
      size: itemsPerPage,
      type: "Teacher",
      ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
      ...(statusFilter && { status: statusFilter }),
    };

    dispatch(getAttendanceList(params)).then((action) => {
      if (action.error) {
        toast.error(action.payload || "Failed to fetch attendance");
      }
      setLoading(false);
    });
  }, [currentPage, itemsPerPage, debouncedSearchTerm, startDate, endDate, statusFilter, dispatch]);

  useEffect(() => {
    fetchAttendances();
  }, [fetchAttendances]);

  const tableData = useMemo(() => {
    return attendanceList.map((item) => [
      item.user.name,
      formatDateForTable(item.date),
      item.status,
    ]);
  }, [attendanceList]);

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
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
    setStatusFilter("");
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <LoadingSpinner loading={loading} />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Teacher Attendance List
        </h1>
        <p className="text-gray-600 mt-2">Manage all teacher attendance records</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Total Count Card */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-2 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Total Records
              </p>
              <p className="text-3xl font-bold text-gray-800 mt-1">
                {totalPresent + totalAbsent + totalLeave}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
          </div>
        </div>

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
      {/* <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
           <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teacher Name
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

           <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Attendance Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Leave">Leave</option>
            </select>
          </div>

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

           <div>
            <button
              onClick={handleClearFilters}
              className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div> */}

      {/* Table */}
      <Table
        headers={tableHeaders}
        data={tableData}
        currentPage={currentPage}
        size={itemsPerPage}
        handlePageChange={handlePageChange}
        total={totalCount}
        totalPages={totalPages}
        renderRow={(row, index) => (
            <tr
            key={index}
            className={`hover:bg-blue-50 transition-colors duration-150 ${
              index % 2 === 0 ? "bg-gray-50" : "bg-white"
            }`}
          >
            {row.map((cell, cellIndex) => {
              const isStatusColumn = cellIndex === 2;
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
      {attendanceList.length === 0 && !loading && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm mt-4">
          <p className="text-gray-500 text-lg">No attendance records found</p>
        </div>
      )}
    </>
  );
};

export default TeacherAttendance;