/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ExamModalStudent from '../../components/Atoms/UI/ExamModalStudent';
import Table from '../../components/Atoms/TableData/TableData';
import {
  createExaminationStudent,
  examinationsList,
  updateExaminationStudent,
  examinationsSingleDocument,
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
  const [editLoading, setEditLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
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
    setLoading(true);
    dispatch(
      examinationsList({
        page,
        size: itemsPerPage,
        query: JSON.stringify({ type: 'Student' }),
      })
    ).finally(() => {
      setLoading(false);
    });
  }, [dispatch]);

  useEffect(() => {
    fetchExams(currentPage);
    dispatch(coursesAllDocuments());
    dispatch(courseBatchesAllDocuments());
  }, [dispatch, currentPage, fetchExams]);

  // Handle successful creation
  useEffect(() => {
    if (createExaminationStudentData?.data && !createExaminationStudentData?.loading) {
      toast.success(createExaminationStudentData.data.isDraft ? 'Exam draft saved successfully' : 'Exam created successfully');
      setSubmitLoading(false);
      fetchExams(currentPage);
      handleCloseModal();
    }
    if (createExaminationStudentData?.error) {
      toast.error(createExaminationStudentData.error.message || 'Failed to create exam');
      setSubmitLoading(false);
    }
  }, [createExaminationStudentData]);

  // Handle successful update
  useEffect(() => {
    if (updateExaminationStudentData?.data && !updateExaminationStudentData?.loading) {
      toast.success(updateExaminationStudentData.data.isDraft ? 'Exam draft updated successfully' : 'Exam updated successfully');
      setSubmitLoading(false);
      fetchExams(currentPage);
      handleCloseModal();
    }
    if (updateExaminationStudentData?.error) {
      toast.error(updateExaminationStudentData.error.message || 'Failed to update exam');
      setSubmitLoading(false);
    }
  }, [updateExaminationStudentData]);

  // Handle single document fetch for editing
  useEffect(() => {
    if (examinationsSingleDocumentData?.data) {
      setSelectedExam(examinationsSingleDocumentData.data?.data);
      setEditLoading(false);
      setShowModal(true);
    }
    if (examinationsSingleDocumentData?.data?.error) {
      toast.error(examinationsSingleDocumentData?.data?.message);
      setEditLoading(false);
      setShowModal(false);
    }
  }, [examinationsSingleDocumentData]);

  const handleEditExam = async (exam) => {
    setEditLoading(true);
    setIsEditing(true);
    setSelectedExam(null);
    await dispatch(examinationsSingleDocument({ _id: exam._id }));
  };

  const handleSaveExam = (examData) => {
    setSubmitLoading(true);
    
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
      course: examData.courseId,
      batch: examData.batchId,
      isDraft: examData.isDraft || false,
      type: 'Student',
    };
    if (isEditing && selectedExam) {
      dispatch(updateExaminationStudent({
        _id: selectedExam._id,
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
    setEditLoading(false);
    setSubmitLoading(false);
  };

  const formatDuration = (duration) => {
    const hours = duration?.hours || 0;
    const minutes = duration?.minutes || 0;
    if (hours === 0 && minutes === 0) return 'Not set';
    if (hours === 0) return `${minutes} min`;
    if (minutes === 0) return `${hours} hr`;
    return `${hours} hr ${minutes} min`;
  };

  // Safe data extraction
  const exams = examinationsData?.data?.data?.list || [];
  const total = examinationsData?.data?.data?.total || 0;
  const totalPages = examinationsData?.data?.data?.totalPages || Math.ceil(total / itemsPerPage) || 1;

  const tableHeaders = [
    'Batch',
    'Course',
    'Exam Title',
    'Exam Duration',
    'Passing Percentage',
    'Status',
    'Actions',
  ];

  const isLoading = loading || editLoading || submitLoading;

  return (
    <div className="">
      <LoadingSpinner loading={isLoading} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Student Examination Lists
        </h1>
        <p className="text-gray-600 mt-2">Manage student examinations and questions</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => {
              setSelectedExam(null);
              setIsEditing(false);
              setShowModal(true);
            }}
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors disabled:opacity-50"
          >
            + Add Examination
          </button>
        </div>

        <div className="overflow-x-auto">
          {exams && exams.length > 0 ? (
            <Table
              headers={tableHeaders}
              data={exams}
              currentPage={currentPage}
              totalPages={totalPages}
              handlePageChange={setCurrentPage}
              renderRow={(exam, index) => (
                <tr
                  key={exam._id || index}
                  className={`hover:bg-blue-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                >
                  <td className="py-4 px-4">
                    {exam.batch
                      ? (exam.batch.batchName || `${exam.batch.startTime || ''} - ${exam.batch.endTime || ''}`)
                      : 'N/A'}
                  </td>
                  <td className="py-4 px-4">
                    {exam.course?.courseName || 'N/A'}
                  </td>
                  <td className="py-4 px-4 font-medium">
                    {exam.examtitle || 'N/A'}
                  </td>
                  <td className="py-4 px-4">
                    {formatDuration(exam.examduration)}
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                      {exam.passingPercentage ?? 0}%
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
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-colors disabled:opacity-50"
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
          ) : (
            !isLoading && (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No examinations found
                </h3>
                <p className="text-gray-500">Click "Add Examination" to create your first exam</p>
              </div>
            )
          )}
        </div>
      </div>

      <ExamModalStudent
        isOpen={showModal}
        onClose={handleCloseModal}
        onSave={handleSaveExam}
        examData={selectedExam}
        isEditing={isEditing}
        coursesData={coursesData || []}
        batchesData={batchesData || []}
        loading={submitLoading}
      />
    </div>
  );
};

export default StudentExaminations;