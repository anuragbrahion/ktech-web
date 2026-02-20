import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ExamModalStudent from '../../components/Atoms/UI/ExamModalStudent';
import Table from '../../components/Atoms/TableData/TableData';
import {
  createExaminationStudent,
  examinationsList,
  updateExaminationStudent,
} from '../../redux/slices/examination';
import {
  courseBatchesAllDocuments,
  coursesAllDocuments,
} from '../../redux/slices/course';

const StudentExaminations = () => {
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  // Redux selectors
  const examinationsData = useSelector(
    (state) => state.examination.examinationsListData
  );

  const createExaminationStudentData = useSelector(
    (state) => state.examination.createExaminationStudentData
  );

  const updateExaminationStudentData = useSelector(
    (state) => state.examination.updateExaminationStudentData
  );

  const coursesData = useSelector(
    (state) => state.course.coursesAllDocumentsData?.data?.data?.list
  );
 
  const batchesData = useSelector(
    (state) => state.course.courseBatchesAllDocumentsData?.data?.data?.list
  );

  // Fetch exams
  const fetchExams = (page = 1) => {
    dispatch(
      examinationsList({
        page,
        size: itemsPerPage,
        query: JSON.stringify({ type: 'Student' }),
      })
    );
  };

  useEffect(() => {
    fetchExams(currentPage);
    dispatch(coursesAllDocuments({populate: 'courses'}));
    dispatch(courseBatchesAllDocuments());
  }, [dispatch, currentPage]);

  const exams = examinationsData?.data?.data?.list || [];
  const totalPages = examinationsData?.totalPages || 1;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

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
    console.log("object111111111",examData)
    const formattedQuestions = examData.questions.map((q) => ({
      question: q.text,
      option_1: q.options.A,
      option_2: q.options.B,
      option_3: q.options.C,
      option_4: q.options.D,
      answer: q.correctAnswer,
    }));

    const payload = {
      examtitle: examData.examTitle,
      examduration: {
        hours: parseInt(examData.durationHours),
        minutes: parseInt(examData.durationMinutes),
      },
      passingPercentage: parseInt(examData.passingPercentage),
      questions: formattedQuestions,
      course: examData.course?._id,
      batch: examData.batch?._id,
      isDraft: false,
      type: 'Student',
    };

    if (isEditing && selectedExam) {
      dispatch(
        updateExaminationStudent({
          id: selectedExam._id,
          ...payload,
        })
      );
    } else {
      dispatch(createExaminationStudent(payload));
    }
  };

  const tableHeaders = [
    'Batch',
    'Course',
    'Exam Title',
    'Exam Duration',
    'Passing Percentage',
    'Created At',
    'Actions',
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Student Examination Lists
        </h1>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="mb-6 flex justify-end">
          <button
            onClick={handleAddExam}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
          >
            + Add Examination
          </button>
        </div>

        <div className="overflow-x-auto">
          <Table
            headers={tableHeaders}
            data={exams}
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
            renderRow={(exam, index) => (
              <tr
                key={exam._id}
                className={`hover:bg-blue-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  }`}
              >
                <td className="py-4 px-4">
                  {exam.batch
                    ? `${exam.batch.startTime} - ${exam.batch.endTime}`
                    : 'N/A'}
                </td>
                <td className="py-4 px-4">
                  {exam.course?.courseName || 'N/A'}
                </td>
                <td className="py-4 px-4 font-medium">
                  {exam.examtitle || 'N/A'}
                </td>
                <td className="py-4 px-4">
                  {exam.examduration?.hours || 0} hr :{' '}
                  {exam.examduration?.minutes || 0} min
                </td>
                <td className="py-4 px-4 font-bold">
                  {exam.passingPercentage ?? 0}%
                </td>
                <td className="py-4 px-4">
                  {exam.type || 'N/A'}
                </td>
                <td className="py-4 px-4">
                  <button
                    onClick={() => handleEditExam(exam)}
                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded"
                  >
                    👁️
                  </button>
                </td>
              </tr>
            )}
          />
        </div>

        {exams.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No examinations found
            </h3>
          </div>
        )}
      </div>

      <ExamModalStudent
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedExam(null);
        }}
        onSave={handleSaveExam}
        examData={selectedExam}
        isEditing={isEditing}
        coursesData={coursesData || []}
        batchesData={batchesData || []}
        loading={
          createExaminationStudentData?.loading ||
          updateExaminationStudentData?.loading
        }
      />
    </div>
  );
};

export default StudentExaminations;