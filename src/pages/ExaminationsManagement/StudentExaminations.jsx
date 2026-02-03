import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ExamModalStudent from '../../components/Atoms/UI/ExamModalStudent';
import Table from '../../components/Atoms/TableData/TableData'; 
import { createExaminationStudent, examinationsList, updateExaminationStudent } from '../../redux/slices/examination';
import { courseBatchesAllDocuments, coursesAllDocuments } from '../../redux/slices/course';

const StudentExaminations = () => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [filters, setFilters] = useState({
    examTitle: '',
    courseName: '',
    batch: ''
  });

  const examinationsListData = useSelector(state => state.examination.examinationsListData);
  const createExaminationStudentData = useSelector(state => state.examination.createExaminationStudentData);
  const updateExaminationStudentData = useSelector(state => state.examination.updateExaminationStudentData);
  const coursesData = useSelector(state => state.course.coursesAllDocumentsData);
  const batchesData = useSelector(state => state.batch.courseBatchesAllDocumentsData);

  const exams = examinationsListData?.data?.filter(exam => exam.type === 'Student') || [];

  useEffect(() => {
    dispatch(examinationsList());
    dispatch(coursesAllDocuments());
    dispatch(courseBatchesAllDocuments());
  }, [dispatch]);

  useEffect(() => {
    if (createExaminationStudentData?.success || updateExaminationStudentData?.success) {
      dispatch(examinationsList());
      setShowModal(false);
      setSelectedExam(null);
    }
  }, [createExaminationStudentData, updateExaminationStudentData, dispatch]);

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
      course: examData.course,
      batch: examData.batch,
      isDraft: false,
      type: 'Student'
    };

    if (isEditing && selectedExam) {
      dispatch(updateExaminationStudent({
        id: selectedExam._id,
        ...payload
      }));
    } else {
      dispatch(createExaminationStudent(payload));
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredExams = exams.filter(exam => {
    return (
      (filters.examTitle === '' || exam.examtitle.toLowerCase().includes(filters.examTitle.toLowerCase())) &&
      (filters.courseName === '' || exam.course?.name?.toLowerCase().includes(filters.courseName.toLowerCase())) &&
      (filters.batch === '' || exam.batch?.name?.toLowerCase().includes(filters.batch.toLowerCase()))
    );
  });

  const tableHeaders = ['Batch', 'Course', 'Exam Title', 'Exam Time', 'Exam Duration', 'Passing Percentage', 'Created At', 'Actions'];

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Student Examination Lists</h1>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <select
              name="examTitle"
              value={filters.examTitle}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Exam Title</option>
              {[...new Set(exams.map(exam => exam.examtitle))].map(title => (
                <option key={title} value={title}>{title}</option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              name="courseName"
              value={filters.courseName}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Course Name</option>
              {coursesData?.data?.map(course => (
                <option key={course._id} value={course.name}>{course.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              name="batch"
              value={filters.batch}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Batch</option>
              {batchesData?.data?.map(batch => (
                <option key={batch._id} value={batch.name}>{batch.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <button 
              onClick={() => setFilters({ examTitle: '', courseName: '', batch: '' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700"
            >
              Clear Filters
            </button>
          </div>
        </div>

        <div className="mb-6 flex justify-end items-center">
          <button
            onClick={handleAddExam}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium flex items-center gap-2"
          >
            <span>+</span> Add Examination
          </button>
        </div>

        <div className="overflow-x-auto">
          <Table
            headers={tableHeaders}
            data={filteredExams}
            renderRow={(exam, index) => (
              <tr 
                key={exam._id} 
                className={`hover:bg-blue-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
              >
                <td className="py-4 px-4">
                  <div className="font-medium text-gray-800">{exam.batch?.name || exam.batch}</div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-gray-700">{exam.course?.name || exam.course || 'N/A'}</div>
                </td>
                <td className="py-4 px-4 text-gray-800 font-medium">{exam.examtitle}</td>
                <td className="py-4 px-4 text-gray-700">
                  {new Date(exam.createdAt).toLocaleString('en-GB')}
                </td>
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

        {filteredExams.length === 0 && !examinationsListData?.loading && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No examinations found</h3>
            <p className="text-gray-500">
              {Object.values(filters).some(f => f !== '') 
                ? "No exams match your filter criteria" 
                : "No examinations available. Click 'Add Examination' to create one."}
            </p>
          </div>
        )}

        {examinationsListData?.loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        )}

        {filteredExams.length > 0 && (
          <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
            <button 
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-gray-700"
            >
              Previous
            </button>
            <button 
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-gray-700"
            >
              Next
            </button>
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
        coursesData={coursesData?.data || []}
        batchesData={batchesData?.data || []}
        loading={createExaminationStudentData?.loading || updateExaminationStudentData?.loading}
      />
    </div>
  );
};

export default StudentExaminations;