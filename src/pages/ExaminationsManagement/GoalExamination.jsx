import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Table from '../../components/Atoms/TableData/TableData';
import GoalExamModal from '../../components/Atoms/UI/GoalExamModal';
import { examinationsList, createExaminationGoal, updateExaminationGoal } from '../../redux/slices/examination';
import { goalsAllDocuments } from '../../redux/slices/employee';
import { toast } from 'react-toastify';

const GoalExamination = () => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 5;

  const examinationsListData = useSelector(state => state.examination.examinationsListData);
  const createExaminationGoalData = useSelector(state => state.examination.createExaminationGoalData);
  const updateExaminationGoalData = useSelector(state => state.examination.updateExaminationGoalData);
  const goalsData = useSelector(state => state.employee.goalsAllDocumentsData);

  const exams = examinationsListData?.data?.data?.list || [];
  const total = examinationsListData?.data?.data?.total || 0;
  const totalPages = examinationsListData?.data?.data?.totalPages || Math.ceil(total / itemsPerPage) || 1;

  const fetchData = useCallback(() => {
    setLoading(true);
    dispatch(examinationsList({
      page: currentPage,
      size: itemsPerPage,
      query: JSON.stringify({ type: "Goal" })
    })).finally(() => {
      setLoading(false);
    });
    dispatch(goalsAllDocuments());
  }, [currentPage, dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (createExaminationGoalData?.data && !createExaminationGoalData?.loading) {
      toast.success(createExaminationGoalData.data.isDraft ? 'Goal exam draft saved successfully' : 'Goal exam created successfully');
      fetchData();
      setShowModal(false);
      setSelectedExam(null);
    }
    if (createExaminationGoalData?.error) {
      toast.error(createExaminationGoalData.error.message || 'Failed to create exam');
    }
  }, [createExaminationGoalData, fetchData]);

  useEffect(() => {
    if (updateExaminationGoalData?.data && !updateExaminationGoalData?.loading) {
      toast.success(updateExaminationGoalData.data.isDraft ? 'Goal exam draft updated successfully' : 'Goal exam updated successfully');
      fetchData();
      setShowModal(false);
      setSelectedExam(null);
    }
    if (updateExaminationGoalData?.error) {
      toast.error(updateExaminationGoalData.error.message || 'Failed to update exam');
    }
  }, [updateExaminationGoalData, fetchData]);

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
      type: 'Goal',
      isDraft: examData.isDraft || false
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

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedExam(null);
    setIsEditing(false);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const formatDuration = (duration) => {
    const hours = duration?.hours || 0;
    const minutes = duration?.minutes || 0;
    if (hours === 0 && minutes === 0) return 'Not set';
    if (hours === 0) return `${minutes} min`;
    if (minutes === 0) return `${hours} hr`;
    return `${hours} hr ${minutes} min`;
  };

  const tableHeaders = ['Goal Name', 'Exam Title', 'Exam Duration', 'Passing Percentage', 'Status', 'Actions'];

  const isLoading = loading || createExaminationGoalData?.loading || updateExaminationGoalData?.loading;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Goal Examinations List</h1>
        <p className="text-gray-600 mt-2">Manage goal-based examinations and questions</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="mb-6 flex justify-end">
          <button
            onClick={handleAddExam}
            disabled={isLoading}
            className="px-6 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
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
          loading={isLoading}
          emptyMessage="No goal examinations available. Click 'Add Goal Examination' to create one."
          renderRow={(exam) => (
            <tr key={exam._id} className="hover:bg-gray-50">
              <td className="py-4 px-4">
                <div className="font-medium text-gray-800">{exam.goal?.name || exam.goal}</div>
              </td>
              <td className="py-4 px-4 text-gray-800 font-medium">{exam.examtitle}</td>
              <td className="py-4 px-4 text-gray-700">
                {formatDuration(exam.examduration)}
              </td>
              <td className="py-4 px-4">
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                  {exam.passingPercentage}%
                </span>
              </td>
              <td className="py-4 px-4">
                {exam.isDraft ? (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                    Draft
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Published
                  </span>
                )}
              </td>
              <td className="py-4 px-4">
                <button
                  onClick={() => handleEditExam(exam)}
                  disabled={isLoading}
                  className="px-3 py-1 bg-sky-500 text-white rounded hover:bg-sky-600 text-sm transition-colors disabled:opacity-50"
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
        onClose={handleCloseModal}
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