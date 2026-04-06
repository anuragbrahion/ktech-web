/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Table from "../../components/Atoms/TableData/TableData";
import ExamDetailsModalStudent from "../../components/Atoms/UI/ExamDetailsModalStudent";
import { useDispatch, useSelector } from "react-redux";
import {
  examinationsResultList,
  examinationsResultView,
} from "../../redux/slices/examination";

const AllPastExaminationsList = () => {
  const dispatch = useDispatch();

  const resData = useSelector(
    (state) => state?.examination?.examinationsResultListData,
  );

  const viewData = useSelector(
    (state) => state?.examination?.examinationsResultViewData,
  );

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  // const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    result: "all",
    type: "all",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getData = (page = 1, filters) => {
    const query = {};

    if (filters.type && filters.type !== "all") {
      query.type = filters.type;
    }

    if (filters.result && filters.result !== "all") {
      query.result = filters.result;
    }
    dispatch(
      examinationsResultList({
        page,
        size: itemsPerPage,
        query: JSON.stringify(query),
      }),
    );
  };

  useEffect(() => {
    getData(currentPage, filters);
  }, [currentPage, filters]);

  const handleViewDetails = (exam) => {
    dispatch(examinationsResultView({ _id: exam._id })).then(() => {
      setShowDetailsModal(true);
    });
  };

  const exams = resData?.data?.data?.list || [];
  const totalPages = resData?.data?.data?.page || 1;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const tableHeaders = [
    "Start Name",
    "Email",
    "Type",
    "Exam Title",
    "Marks",
    "Result",
    "Action",
  ];

  const getScoreColor = (marks, passingPercentage) => {
    return marks >= passingPercentage ? "text-green-600" : "text-red-600";
  };

  const getResultColor = (result) => {
    return result === "PASS" ? "text-green-600" : "text-red-600";
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">All Past Exam List</h1>
        <p className="text-black mt-2">
          View and manage all past examination records
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <select
            value={filters.result}
            onChange={(e) => setFilters({ ...filters, result: e.target.value })}
            className="px-4 py-2 border rounded-md"
          >
            <option value="all">All Results</option>
            <option value="PASS">Pass</option>
            <option value="FAIL">Fail</option>
          </select>

          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="px-4 py-2 border rounded-md"
          >
            <option value="all">All Types</option>
            <option value="Role">Role</option>
            <option value="Goal">Goal</option>
            <option value="Student">Student</option>
          </select>

          {/* <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded-md"
          /> */}
        </div>

        {/* Table */}
        <Table
          headers={tableHeaders}
          data={exams}
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
          renderRow={(exam) => (
            <tr key={exam.id}>
              <td className="py-4 px-4">{exam?.userId?.name}</td>
              <td className="py-4 px-4">{exam?.userId?.email}</td>
              <td className="py-4 px-4">{exam.type}</td>
              <td className="py-4 px-4">{exam?.examination?.examtitle}</td>
              <td className="py-4 px-4">
                <span
                  className={`font-bold ${getScoreColor(
                    exam.marks,
                    exam?.examination?.passingPercentage,
                  )}`}
                >
                  {exam.marks}
                </span>
              </td>
              <td className="py-4 px-4">
                <span className={`font-bold ${getResultColor(exam.result)}`}>
                  {exam.result}
                </span>
              </td>
              <td className="py-4 px-4">
                <button
                  onClick={() => handleViewDetails(exam)}
                  className="px-4 py-2 bg-sky-500 text-white rounded"
                >
                  View
                </button>
              </td>
            </tr>
          )}
        />
      </div>

      <ExamDetailsModalStudent
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        examData={viewData}
      />
    </div>
  );
};

export default AllPastExaminationsList;
