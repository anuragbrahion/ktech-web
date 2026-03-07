/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { formatDateForTable } from "../../utils/globalFunction";
import LoadingSpinner from "../../components/Loader/Loader";
import Table from "../../components/Atoms/TableData/TableData";
import { getStudentExamsList } from "../../redux/slices/studentSlice";

const MyExams = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  const getStudentExamsListData = useSelector(
    (state) => state.student?.getStudentExamsListData,
  );
  const resultList =
    getStudentExamsListData?.data?.data &&
    Array.isArray(getStudentExamsListData?.data?.data) &&
    getStudentExamsListData?.data?.data?.length
      ? getStudentExamsListData?.data?.data?.[0]?.list
      : getStudentExamsListData?.data?.data?.list || [];
  const totalCount =
    getStudentExamsListData?.data?.data &&
    Array.isArray(getStudentExamsListData?.data?.data) &&
    getStudentExamsListData?.data?.data?.length
      ? getStudentExamsListData?.data?.data?.[0]?.total
      : getStudentExamsListData?.data?.data?.total || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const tableHeaders = [
    "Course",
    "Batch",
    "Exam",
    "Exam Time",
    "Exam Duration",
    "Passing Percentage",
    "Action",
  ];

  const fetchMyExams = () => {
    setLoading(true);
    const params = {
      page: currentPage,
      size: itemsPerPage,
    };

    dispatch(getStudentExamsList(params)).then((action) => {
      if (action.error) {
        toast.error(action.payload || "Failed to fetch tasks list");
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchMyExams();
  }, [currentPage, itemsPerPage]);

  const tableData = useMemo(() => {
    return resultList.map((item) => [
      <span className="capitalize">{item.course.courseName}</span>,
      `${item.batch.startTime}-${item.batch.endTime}`,
      <span className="capitalize">{item.examtitle}</span>,
      formatDateForTable(item.time),
      `${item.examduration.hours ? item.examduration.hours : 0} hr ${item.examduration.minutes ? item.examduration.minutes : 0} min`,
      item.passingPercentage,
      <div className="flex items-center gap-2">
        <button
          onClick={() => {}}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          title="Start Exam"
          disabled={!item.hallticketdata || item.ispassed}
        >
          Start
        </button>
      </div>,
    ]);
  }, [resultList]);

  return (
    <>
      <LoadingSpinner loading={loading} />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Exams</h1>
        <p className="text-gray-600 mt-2">Manage your enrolled exams</p>
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

export default MyExams;
