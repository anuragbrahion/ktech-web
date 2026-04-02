/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { formatDateForTable } from "../../utils/globalFunction";
import LoadingSpinner from "../../components/Loader/Loader";
import Table from "../../components/Atoms/TableData/TableData";
import { getStudentExamsList } from "../../redux/slices/studentSlice";

const MyExams = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);

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
        toast.error(action.payload || "Failed to fetch exams list");
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchMyExams();
  }, [currentPage]);

  const handleStartClick = (exam) => {
    setSelectedExam(exam);
    setShowInstructions(true);
  };

  const handleAcceptInstructions = () => {
    if (selectedExam) {
      // Store exam start time in sessionStorage
      sessionStorage.setItem(`exam_${selectedExam._id}_started`, Date.now().toString());
      // Navigate to exam page
      navigate(`/exam/${selectedExam._id}`, { 
        state: { examData: selectedExam } 
      });
    }
    setShowInstructions(false);
  };

  const handleCloseInstructions = () => {
    setSelectedExam(null);
    setShowInstructions(false);
  };

  const tableData = useMemo(() => {
    return resultList.map((item) => [
      <span className="capitalize font-medium">{item.course?.courseName || 'N/A'}</span>,
      <span className="text-sm">{item.batch?.startTime}-{item.batch?.endTime}</span>,
      <span className="capitalize font-semibold">{item.examtitle}</span>,
      formatDateForTable(item.time),
      <span className="text-sm">
        {item.examduration?.hours ? item.examduration.hours : 0} hr {item.examduration?.minutes ? item.examduration.minutes : 0} min
      </span>,
      <span className="font-medium">{item.passingPercentage}%</span>,
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleStartClick(item)}
          className={`
            px-4 py-2 rounded-lg font-medium transition transform hover:scale-105
            ${item.hallticketdata && !item.ispassed 
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
          `}
          disabled={!item.hallticketdata || item.ispassed}
          title={!item.hallticketdata ? "Hall ticket not available" : item.ispassed ? "Exam already passed" : "Start Exam"}
        >
          {item.ispassed ? 'Completed' : 'Start Exam'}
        </button>
        {item.ispassed && (
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
            Passed
          </span>
        )}
      </div>,
    ]);
  }, [resultList]);

  return (
    <>
      <LoadingSpinner loading={loading} />
      
      {/* Exam Instructions Modal */}
      {showInstructions && selectedExam && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black opacity-50" onClick={handleCloseInstructions}></div>
            
            {/* Modal */}
            <div className="relative bg-white rounded-2xl max-w-2xl w-full p-8 shadow-xl">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 -mt-8 -mx-8 mb-6 px-8 py-6 rounded-t-2xl">
                <h2 className="text-2xl font-bold text-white">Exam Instructions</h2>
                <p className="text-blue-100 mt-1">{selectedExam.examtitle}</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Total Questions</p>
                    <p className="text-xl font-bold text-blue-600">{selectedExam.totalQuestions || 'N/A'}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="text-xl font-bold text-green-600">
                      {selectedExam.examduration?.hours || 0}h {selectedExam.examduration?.minutes || 0}m
                    </p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Passing %</p>
                    <p className="text-xl font-bold text-purple-600">{selectedExam.passingPercentage}%</p>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Total Marks</p>
                    <p className="text-xl font-bold text-orange-600">{selectedExam.totalMarks || 'N/A'}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold text-gray-800 mb-3">Important Guidelines:</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    <li>Read each question carefully before answering</li>
                    <li>You can navigate between questions using the question palette</li>
                    <li>The exam will be automatically submitted when the timer reaches zero</li>
                    <li>Do not refresh the page during the exam</li>
                    <li>Ensure you have a stable internet connection</li>
                    <li>Your answers are saved as you progress</li>
                    <li>Once submitted, you cannot retake the exam</li>
                  </ul>
                </div>

                <div className="border-t pt-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="acceptInstructions"
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-700">I have read and understood all the instructions</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleAcceptInstructions}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition shadow-lg"
                >
                  Start Exam Now
                </button>
                <button
                  onClick={handleCloseInstructions}
                  className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Exams</h1>
        <p className="text-gray-600 mt-2">Manage and start your enrolled exams</p>
      </div>

      {resultList.length === 0 && !loading ? (
        <div className="text-center py-12 bg-white rounded-xl shadow">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900">No Exams Found</h3>
          <p className="text-gray-500 mt-1">You don't have any exams scheduled at the moment.</p>
        </div>
      ) : (
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
              className={`hover:bg-blue-50 transition ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
            >
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="py-4 px-4">
                  {cell}
                </td>
              ))}
            </tr>
          )}
        />
      )}
    </>
  );
};

export default MyExams;