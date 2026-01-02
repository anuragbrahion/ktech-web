import React, { useState } from 'react';
import ExamModalStudent from '../../components/Atoms/UI/ExamModalStudent';
import Table from '../../components/Atoms/TableData/TableData';

const StudentExaminations = () => {
  const [exams, setExams] = useState([
    { 
      id: 1, 
      batch: '07:00 - 08:00', 
      course: 'MS Office Basics', 
      examTitle: 'husen1 exam', 
      examTime: '24/11/2025, 21:28:00', 
      examDuration: '0 hr : 4 Min', 
      passingPercentage: 34, 
      createdAt: '24/11/2025',
      questions: [
        {
          id: 1,
          text: 'Question 1',
          options: {
            A: 'option_A',
            B: 'option_B',
            C: 'option_C',
            D: 'option_D'
          },
          correctAnswer: 'A'
        }
      ]
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [filters, setFilters] = useState({
    examTitle: '',
    courseName: '',
    batch: ''
  });

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
        createdAt: new Date().toLocaleDateString('en-GB')
      };
      setExams([...exams, newExam]);
    }
    setShowModal(false);
    setSelectedExam(null);
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
      (filters.examTitle === '' || exam.examTitle.toLowerCase().includes(filters.examTitle.toLowerCase())) &&
      (filters.courseName === '' || exam.course?.toLowerCase().includes(filters.courseName.toLowerCase())) &&
      (filters.batch === '' || exam.batch.toLowerCase().includes(filters.batch.toLowerCase()))
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
              <option value="husen1 exam">husen1 exam</option>
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
              <option value="MS Office Basics">MS Office Basics</option>
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
              <option value="ms office">ms office</option>
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
                key={exam.id} 
                className={`hover:bg-blue-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
              >
                <td className="py-4 px-4">
                  <div className="font-medium text-gray-800">{exam.batch}</div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-gray-700">{exam.course || 'N/A'}</div>
                </td>
                <td className="py-4 px-4 text-gray-800 font-medium">{exam.examTitle}</td>
                <td className="py-4 px-4 text-gray-700">{exam.examTime}</td>
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

        {filteredExams.length === 0 && (
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

        {/* Pagination - Simple version as shown in image */}
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
      />
    </div>
  );
};

export default StudentExaminations;