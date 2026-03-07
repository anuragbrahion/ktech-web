/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getExamResultList,
  getExamResultView,
} from "../../redux/slices/teacherSlice";
import { toast } from "react-toastify";
import { formatDateForTable } from "../../utils/globalFunction";
import LoadingSpinner from "../../components/Loader/Loader";
import Table from "../../components/Atoms/TableData/TableData";
import { Eye } from "lucide-react";
import DefaultPreviewModal from "../../components/Modal/DefaultModal";
import ExamResultContent from "./Components/ExamResultContent";

const PastExams = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [viewModalData, setViewModalData] = useState({
    isOpen: false,
    data: {},
  });

  const getExamResultListData = useSelector(
    (state) => state.teacher?.getExamResultListData,
  );
  const resultList = getExamResultListData?.data?.data?.list || [];
  const totalCount = getExamResultListData?.data?.data?.total || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const tableHeaders = [
    "Exam",
    "Exam Type",
    "Marks",
    "Result",
    "Date",
    "Action",
  ];

  const fetchTasks = () => {
    setLoading(true);
    const params = {
      page: currentPage,
      size: itemsPerPage,
    };

    dispatch(getExamResultList(params)).then((action) => {
      if (action.error) {
        toast.error(action.payload || "Failed to fetch tasks list");
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchTasks();
  }, [currentPage, itemsPerPage]);

  const handleViewModal = async (id) => {
    try {
      setActionLoading(true);
      const payload = {
        _id: id,
      };

      const response = await dispatch(getExamResultView(payload)).unwrap();

      if (!response.error) {
        setViewModalData({ isOpen: true, data: response.data });
      } else {
        toast.error(response.message || "Failed to load exam result");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load exam result");
    } finally {
      setActionLoading(false);
    }
  };

  const tableData = useMemo(() => {
    return resultList.map((item) => [
      item.examination.examtitle,
      item.type,
      item.marks,
      item.result,
      formatDateForTable(item.createdAt),
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleViewModal(item._id)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
          title="View"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>,
    ]);
  }, [resultList]);


  return (
    <>
      <LoadingSpinner loading={loading || actionLoading} />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">All Exam Results</h1>
        <p className="text-gray-600 mt-2">Manage your all exam results</p>
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

      <DefaultPreviewModal
        isOpen={viewModalData.isOpen}
        closeModal={() => setViewModalData({ isOpen: false, data: {} })}
        heading="View Examinations Result"
        isLoading={actionLoading}
        showCancelButton={false}
        showSubmitButton={false}
      >
        <div className="space-y-6">
            {viewModalData.data && <ExamResultContent examData={viewModalData.data} />}
        </div>
      </DefaultPreviewModal>
    </>
  );
};

export default PastExams;
