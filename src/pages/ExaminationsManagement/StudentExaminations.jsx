import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ExamModalStudent from '../../components/Atoms/UI/ExamModalStudent';
import Table from '../../components/Atoms/TableData/TableData';
import {
  createExaminationStudent,
  examinationsList,
  updateExaminationStudent,
  examinationsSingleDocument,
  clearExaminationSingleData,
} from '../../redux/slices/examination';
import {
  courseBatchesAllDocuments,
  coursesAllDocuments,
} from '../../redux/slices/course';
import LoadingSpinner from '../../components/Loader/Loader';
import { toast } from 'react-toastify';

const StudentExaminations = () => {
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 10;

  const examinationsData = useSelector(
    (state) => state.examination.examinationsListData
  );

  const createExaminationStudentData = useSelector(
    (state) => state.examination.createExaminationStudentData
  );

  const updateExaminationStudentData = useSelector(
    (state) => state.examination.updateExaminationStudentData
  );

  const examinationsSingleDocumentData = useSelector(
    (state) => state.examination.examinationsSingleDocumentData
  );

  const coursesData = useSelector(
    (state) => state.course.coursesAllDocumentsData?.data?.data?.list
  );

  const batchesData = useSelector(
    (state) => state.course.courseBatchesAllDocumentsData?.data?.data?.list
  );

  const fetchExams = useCallback((page = 1) => {
    dispatch(
      examinationsList({
        page,
        size: itemsPerPage,
        query: JSON.stringify({ type: 'Student' }),
      })
    );
  }, [dispatch]);

  useEffect(() => {
    fetchExams(currentPage);
    dispatch(coursesAllDocuments());
    dispatch(courseBatchesAllDocuments());
  }, [dispatch, currentPage, fetchExams]);

  useEffect(() => {
    if (createExaminationStudentData?.data) {
      toast.success('Exam created successfully');
      fetchExams(currentPage);
      setShowModal(false);
      setSelectedExam(null);
    }
  }, [createExaminationStudentData, fetchExams, currentPage]);

  useEffect(() => {
    if (updateExaminationStudentData?.data) {
      toast.success('Exam updated successfully');
      fetchExams(currentPage);
      setShowModal(false);
      setSelectedExam(null);
    }
  }, [updateExaminationStudentData, fetchExams, currentPage]);

  useEffect(() => {
    if (examinationsSingleDocumentData?.data) {
      setSelectedExam(examinationsSingleDocumentData.data);
      setLoading(false);
    }
  }, [examinationsSingleDocumentData]);

  const exams = examinationsData?.data?.data?.list || [];
  const totalPages = examinationsData?.data?.data?.totalPages || 
                     Math.ceil((examinationsData?.data?.data?.total || 0) / itemsPerPage) || 1;

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

  const handleEditExam = async (exam) => {
    setLoading(true);
    setIsEditing(true);
    setShowModal(true);
    await dispatch(examinationsSingleDocument(exam._id));
  };

  const handleSaveExam = (examData) => {
    const formattedQuestions = examData.questions.map((q, idx) => ({
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
        hours: parseInt(examData.durationHours) || 0,
        minutes: parseInt(examData.durationMinutes) || 0,
      },
      passingPercentage: parseInt(examData.passingPercentage),
      questions: formattedQuestions,
      course: examData.courseId || examData.course?._id,
      batch: examData.batchId || examData.batch?._id,
      isDraft: false,
      type: 'Student',
    };

    if (isEditing && selectedExam) {
      dispatch(updateExaminationStudent({
        id: selectedExam._id,
        ...payload,
      }));
    } else {
      dispatch(createExaminationStudent(payload));
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedExam(null);
    setIsEditing(false);
    dispatch(clearExaminationSingleData());
  };

  const tableHeaders = [
    'Batch',
    'Course',
    'Exam Title',
    'Exam Duration',
    'Passing Percentage',
    'Actions',
  ];

  return (
    <div className="p-6">
      <LoadingSpinner loading={loading} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Student Examination Lists
        </h1>
        <p className="text-gray-600 mt-2">Manage student examinations and questions</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="mb-6 flex justify-end">
          <button
            onClick={handleAddExam}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors"
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
                className={`hover:bg-blue-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
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
                <td className="py-4 px-4">
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                    {exam.passingPercentage ?? 0}%
                  </span>
                </td>
                <td className="py-4 px-4">
                  <button
                    onClick={() => handleEditExam(exam)}
                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-colors"
                    title="Edit Exam"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
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
            <p className="text-gray-500">Click "Add Examination" to create your first exam</p>
          </div>
        )}
      </div>

      <ExamModalStudent
        isOpen={showModal}
        onClose={handleCloseModal}
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