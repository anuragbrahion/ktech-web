import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Table from '../../components/Atoms/TableData/TableData';
import GoalExamModal from '../../components/Atoms/UI/GoalExamModal';
import { examinationsList, createExaminationGoal, updateExaminationGoal } from '../../redux/slices/examination';
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

  const exams = examinationsListData?.data?.data?.list || [];
  const totalPages = examinationsListData?.data?.data?.page || 1;

  useEffect(() => {
    fetchData();
  }, [currentPage, dispatch]);

  const fetchData = () => {
    dispatch(examinationsList({
      page: currentPage,
      size: itemsPerPage,
      query: JSON.stringify({ type: "Goal" })
    }));
    dispatch(goalsAllDocuments());
  };

  useEffect(() => {
    if (createExaminationGoalData?.success || updateExaminationGoalData?.success) {
      fetchData();
      setShowModal(false);
      setSelectedExam(null);
    }
  }, [createExaminationGoalData, updateExaminationGoalData]);

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
        hours: parseInt(examData.durationHours) || 0,
        minutes: parseInt(examData.durationMinutes) || 0
      },
      passingPercentage: parseInt(examData.passingPercentage),
      questions: formattedQuestions,
      goal: examData.goalName,
      type: 'Goal'
    };

    if (isEditing && selectedExam) {
      dispatch(updateExaminationGoal({
        id: selectedExam._id,
        data: payload
      }));
    } else {
      dispatch(createExaminationGoal(payload));
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const tableHeaders = ['Goal Name', 'Exam Title', 'Exam Duration', 'Passing Percentage', 'Actions'];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Goal Examinations List</h1>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="mb-6 flex justify-end">
          <button
            onClick={handleAddExam}
            className="px-6 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 font-medium flex items-center gap-2"
          >
            <span>+</span> Add Goal Examination
          </button>
        </div>

        <Table
          headers={tableHeaders}
          data={exams}
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
          loading={examinationsListData?.loading}
          emptyMessage="No goal examinations available. Click 'Add Goal Examination' to create one."
          renderRow={(exam) => (
            <tr key={exam._id} className="hover:bg-gray-50">
              <td className="py-4 px-4">
                <div className="font-medium text-gray-800">{exam.goal?.name || exam.goal}</div>
              </td>
              <td className="py-4 px-4 text-gray-800 font-medium">{exam.examtitle}</td>
              <td className="py-4 px-4 text-gray-700">
                {exam.examduration?.hours || 0} hr : {exam.examduration?.minutes || 0} min
              </td>
              <td className="py-4 px-4">
                <span className="font-semibold text-gray-800">{exam.passingPercentage}%</span>
              </td>
              <td className="py-4 px-4">
                <button
                  onClick={() => handleEditExam(exam)}
                  className="px-3 py-1 bg-sky-500 text-white rounded hover:bg-sky-600 text-sm"
                >
                  Edit
                </button>
              </td>
            </tr>
          )}
        />
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
        goalsData={goalsData?.data?.data?.list || []}
        loading={createExaminationGoalData?.loading || updateExaminationGoalData?.loading}
      />
    </div>
  );
};

export default GoalExamination;