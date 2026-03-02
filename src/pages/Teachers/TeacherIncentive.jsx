/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getIncentiveList } from "../../redux/slices/teacherSlice";
import { toast } from "react-toastify";
import Table from "../../components/Atoms/TableData/TableData";
import LoadingSpinner from "../../components/Loader/Loader";
import { formatCurrency, formatDateForTable } from "../../utils/globalFunction";

const TeacherIncentive = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const getIncentiveListData = useSelector(
    (state) => state.teacher?.getIncentiveListData,
  );
  const incentiveList = getIncentiveListData?.data?.data?.list || [];
  const totalCount = getIncentiveListData?.data?.data?.total || 0;
  const totalIncentive = getIncentiveListData?.data?.data?.totalIncentive || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const tableHeaders = [
    "Student Name",
    "Course",
    "Admission Date",
    "Incentive Amount",
  ];

  const fetchIncentives = () => {
    setLoading(true);
    const params = {
      page: currentPage,
      size: itemsPerPage,
    };

    dispatch(getIncentiveList(params)).then((action) => {
      if (action.error) {
        toast.error(action.payload || "Failed to fetch courses");
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchIncentives();
  }, [currentPage, itemsPerPage]);

  const tableData = useMemo(() => {
    return incentiveList.map((item) => [
      item.name,
      item.course.courseName,
      formatDateForTable(item.admissionDate),
      formatCurrency(item.incentive),
    ]);
  }, [incentiveList]);

  return (
    <>
      <LoadingSpinner loading={loading} />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Incentives</h1>
        <p className="text-gray-600 mt-2">Manage all incentives here</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-blue-50 p-6 rounded-lg shadow border border-blue-100">
          <h3 className="text-lg font-semibold text-blue-700 mb-2">
            Total Incentive
          </h3>
          <p className="text-3xl font-bold text-black">
            {formatCurrency(totalIncentive)}
          </p>
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

export default TeacherIncentive;
