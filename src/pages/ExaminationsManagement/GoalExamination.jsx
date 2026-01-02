import React, { useState } from 'react';
import Table from '../../components/Atoms/TableData/TableData';
import GoalExamModal from '../../components/Atoms/UI/GoalExamModal';

const GoalExamination = () => {
  const [exams, setExams] = useState([
    { 
      id: 1, 
      goalName: 'Complete Photoshop Certification', 
      designation: 'Graphic Designer', 
      examTitle: 'Photoshop Certification Exam', 
      examDuration: '2 hr : 0 Min', 
      passingPercentage: 75, 
      createdAt: '01/12/2025',
      questions: [
        {
          id: 1,
          text: 'What is the shortcut for creating a new layer?',
          options: {
            A: 'Ctrl+Shift+N',
            B: 'Ctrl+N',
            C: 'Shift+N',
            D: 'Alt+Shift+N'
          },
          correctAnswer: 'A'
        }
      ]
    },
    { 
      id: 2, 
      goalName: 'Excel Advanced Skills', 
      designation: 'Data Analyst', 
      examTitle: 'Advanced Excel Test', 
      examDuration: '1 hr : 30 Min', 
      passingPercentage: 80, 
      createdAt: '28/11/2025',
      questions: [
        {
          id: 1,
          text: 'Which function is used for vertical lookup?',
          options: {
            A: 'HLOOKUP',
            B: 'VLOOKUP',
            C: 'LOOKUP',
            D: 'XLOOKUP'
          },
          correctAnswer: 'B'
        }
      ]
    },
    { 
      id: 3, 
      goalName: 'Web Development Fundamentals', 
      designation: 'Junior Developer', 
      examTitle: 'Frontend Basics Test', 
      examDuration: '1 hr : 45 Min', 
      passingPercentage: 70, 
      createdAt: '25/11/2025',
      questions: [
        {
          id: 1,
          text: 'What does CSS stand for?',
          options: {
            A: 'Creative Style Sheets',
            B: 'Cascading Style Sheets',
            C: 'Computer Style Sheets',
            D: 'Colorful Style Sheets'
          },
          correctAnswer: 'B'
        }
      ]
    },
    { 
      id: 4, 
      goalName: 'Project Management Basics', 
      designation: 'Project Coordinator', 
      examTitle: 'PM Fundamentals Exam', 
      examDuration: '2 hr : 15 Min', 
      passingPercentage: 65, 
      createdAt: '20/11/2025',
      questions: [
        {
          id: 1,
          text: 'What is the triple constraint in project management?',
          options: {
            A: 'Time, Cost, Quality',
            B: 'Scope, Time, Cost',
            C: 'Quality, Scope, Risk',
            D: 'Cost, Quality, Scope'
          },
          correctAnswer: 'B'
        }
      ]
    },
    { 
      id: 5, 
      goalName: 'Digital Marketing Certification', 
      designation: 'Marketing Specialist', 
      examTitle: 'Digital Marketing Final', 
      examDuration: '1 hr : 0 Min', 
      passingPercentage: 85, 
      createdAt: '15/11/2025',
      questions: [
        {
          id: 1,
          text: 'What does SEO stand for?',
          options: {
            A: 'Search Engine Optimization',
            B: 'Social Engagement Optimization',
            C: 'Search Experience Optimization',
            D: 'Systematic Engine Operation'
          },
          correctAnswer: 'A'
        }
      ]
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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
    if (isEditing && selectedExam) {
      // Update existing exam
      setExams(exams.map(exam => 
        exam.id === selectedExam.id ? { ...exam, ...examData, id: exam.id } : exam
      ));
    } else {
      // Add new exam
      const newExam = {
        id: exams.length + 1,
        ...examData,
        createdAt: new Date().toLocaleDateString('en-GB'),
        examDuration: `${examData.durationHours} hr : ${examData.durationMinutes} Min`
      };
      setExams([...exams, newExam]);
    }
    setShowModal(false);
    setSelectedExam(null);
  };

  // Pagination calculations
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
        {/* Add Button */}
        <div className="mb-6 flex justify-end items-center">
          <button
            onClick={handleAddExam}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium flex items-center gap-2"
          >
            <span>+</span> Add Goal Examination
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table
            headers={tableHeaders}
            data={currentExams}
            renderRow={(exam, index) => (
              <tr 
                key={exam.id} 
                className={`hover:bg-blue-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
              >
                <td className="py-4 px-4">
                  <div className="font-medium text-gray-800">{exam.goalName}</div>
                </td>
                <td className="py-4 px-4">
                  <span className="text-blue-800 rounded-full text-sm">
                    {exam.designation}
                  </span>
                </td>
                <td className="py-4 px-4 text-gray-800 font-medium">{exam.examTitle}</td>
                <td className="py-4 px-4 text-gray-700">{exam.examDuration}</td>
                <td className="py-4 px-4">
                  <span className="font-bold text-gray-800">{exam.passingPercentage}%</span>
                </td>
                <td className="py-4 px-4 text-gray-700">{exam.createdAt}</td>
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

        {exams.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No results.</h3>
            <p className="text-gray-500">
              No goal examinations available. Click 'Add Goal Examination' to create one.
            </p>
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
      />
    </div>
  );
};

export default GoalExamination;