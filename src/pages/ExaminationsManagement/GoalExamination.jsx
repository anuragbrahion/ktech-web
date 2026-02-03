import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Table from '../../components/Atoms/TableData/TableData';
import GoalExamModal from '../../components/Atoms/UI/GoalExamModal';
import {  examinationsList, createExaminationGoal, updateExaminationGoal } from '../../redux/slices/examination';
import { goalsAllDocuments } from '../../redux/slices/employee';
 
const GoalExamination = () => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const examinationsListData = useSelector(state => state.examination.examinationsListData);
  const createExaminationGoalData = useSelector(state => state.examination.createExaminationGoalData);
  const updateExaminationGoalData = useSelector(state => state.examination.updateExaminationGoalData);
  const goalsData = useSelector(state => state.employee.goalsAllDocumentsData);

  const exams = examinationsListData?.data?.filter(exam => exam.type === 'Goal') || [];

  useEffect(() => {
    dispatch(examinationsList());
    dispatch(goalsAllDocuments());
  }, [dispatch]);

  useEffect(() => {
    if (createExaminationGoalData?.success || updateExaminationGoalData?.success) {
      dispatch(examinationsList());
      setShowModal(false);
      setSelectedExam(null);
    }
  }, [createExaminationGoalData, updateExaminationGoalData, dispatch]);

  const handleAddExam = () => {
    setSelectedExam(null);
    setIsEditing(false);
    setShowModal(true);
  };

  const handleEditExam = (exam) => {
    setSelectedExam(exam);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSaveExam = (examData) => {
    const formattedQuestions = examData.questions.map(q => ({
      question: q.text,
      option_1: q.options.A,
      option_2: q.options.B,
      option_3: q.options.C,
      option_4: q.options.D,
      answer: q.correctAnswer
    }));

    const payload = {
      examtitle: examData.examTitle,
      examduration: {
        hours: parseInt(examData.durationHours),
        minutes: parseInt(examData.durationMinutes)
      },
      passingPercentage: parseInt(examData.passingPercentage),
      questions: formattedQuestions,
      goal: examData.goal,
      isDraft: examData.isDraft || false,
      type: 'Goal'
    };

    if (isEditing && selectedExam) {
      dispatch(updateExaminationGoal({
        id: selectedExam._id,
        ...payload
      }));
    } else {
      dispatch(createExaminationGoal(payload));
    }
  };

  const totalPages = Math.ceil(exams.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentExams = exams.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const tableHeaders = ['Goal Name', 'Designation', 'Exam Title', 'Exam Duration', 'Passing Percentage', 'Created At', 'Actions'];

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Goal Examinations List</h1>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="mb-6 flex justify-end items-center">
          <button
            onClick={handleAddExam}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium flex items-center gap-2"
          >
            <span>+</span> Add Goal Examination
          </button>
        </div>

        <div className="overflow-x-auto">
          <Table
            headers={tableHeaders}
            data={currentExams}
            renderRow={(exam, index) => (
              <tr 
                key={exam._id} 
                className={`hover:bg-blue-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
              >
                <td className="py-4 px-4">
                  <div className="font-medium text-gray-800">{exam.goal?.name || exam.goal}</div>
                </td>
                <td className="py-4 px-4">
                  <span className="text-blue-800 rounded-full text-sm">
                    {exam.goal?.designation || 'N/A'}
                  </span>
                </td>
                <td className="py-4 px-4 text-gray-800 font-medium">{exam.examtitle}</td>
                <td className="py-4 px-4 text-gray-700">
                  {exam.examduration?.hours || 0} hr : {exam.examduration?.minutes || 0} Min
                </td>
                <td className="py-4 px-4">
                  <span className="font-bold text-gray-800">{exam.passingPercentage}%</span>
                </td>
                <td className="py-4 px-4 text-gray-700">
                  {new Date(exam.createdAt).toLocaleDateString('en-GB')}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditExam(exam)}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded"
                      title="View/Edit Exam"
                    >
                      👁️
                    </button>
                  </div>
                </td>
              </tr>
            )}
          />
        </div>

        {exams.length === 0 && !examinationsListData?.loading && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No results.</h3>
            <p className="text-gray-500">
              No goal examinations available. Click 'Add Goal Examination' to create one.
            </p>
          </div>
        )}

        {examinationsListData?.loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        )}

        {exams.length > 0 && (
          <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 ${
                currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700'
              }`}
            >
              Previous
            </button>
            
            <div className="flex items-center space-x-2">
              {Array.from({ length: Math.min(4, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 4) {
                  pageNum = i + 1;
                } else if (currentPage <= 2) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 1) {
                  pageNum = totalPages - 3 + i;
                } else {
                  pageNum = currentPage - 1 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md ${
                      currentPage === pageNum
                        ? 'bg-blue-500 text-white'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {totalPages > 4 && currentPage < totalPages - 2 && (
                <>
                  <span className="text-gray-500">...</span>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md ${
                      currentPage === totalPages
                        ? 'bg-blue-500 text-white'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>
            
            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 ${
                currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700'
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>

      <GoalExamModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedExam(null);
        }}
        onSave={handleSaveExam}
        examData={selectedExam}
        isEditing={isEditing}
        goalsData={goalsData?.data || []}
        loading={createExaminationGoalData?.loading || updateExaminationGoalData?.loading}
      />
    </div>
  );
};

export default GoalExamination;