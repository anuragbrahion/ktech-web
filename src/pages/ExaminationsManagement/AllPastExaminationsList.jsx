import React, { useState } from 'react';
import Table from '../../components/Atoms/TableData/TableData';
import ExamDetailsModalStudent from '../../components/Atoms/UI/ExamDetailsModalStudent';

const AllPastExaminationsList = () => {
  const [exams, setExams] = useState([
    { 
      id: 1, 
      name: 'Ankarair exama testing user (teacher)', 
      email: 'Nextcompute840184@gmail.com',
      type: 'Role',
      examTitle: 'Role 1 Final Exam',
      marks: 13,
      totalMarks: 15,
      result: 'PASS',
      passingPercentage: 85
    },
    { 
      id: 2, 
      name: 'Ankarair exama testing user (teacher)', 
      email: 'Nextcompute840184@gmail.com',
      type: 'Role',
      examTitle: 'Role 1 Final Exam',
      marks: 9,
      totalMarks: 15,
      result: 'FAIL',
      passingPercentage: 85
    },
    { 
      id: 3, 
      name: 'Ubeci Sami Mzra', 
      email: 'sameemintza5/MT@gmail.com',
      type: 'Role',
      examTitle: 'Role 1 Final Exam',
      marks: 11,
      totalMarks: 15,
      result: 'FAIL',
      passingPercentage: 85
    },
    { 
      id: 4, 
      name: 'Ubeci Sami Mzra', 
      email: 'sameemintza5/MT@gmail.com',
      type: 'Role',
      examTitle: 'role 1 try',
      marks: 1,
      totalMarks: 15,
      result: 'PASS',
      passingPercentage: 85
    },
    { 
      id: 5, 
      name: 'Ankarair exama testing user (teacher)', 
      email: 'Nextcompute840184@gmail.com',
      type: 'Role',
      examTitle: 'Role 1 Attempt Sui',
      marks: 62,
      totalMarks: 100,
      result: 'FAIL',
      passingPercentage: 85
    },
    { 
      id: 6, 
      name: 'Ankarair exama testing user (teacher)', 
      email: 'Nextcompute840184@gmail.com',
      type: 'Role',
      examTitle: 'role 2 exam',
      marks: 63,
      totalMarks: 100,
      result: 'PASS',
      passingPercentage: 85
    },
    { 
      id: 7, 
      name: 'sshyaprakash goitam Gomali pratabad', 
      email: 'arymmy6757@gmail.com',
      type: 'Role',
      examTitle: 'Role 1 Attempt Sui',
      marks: 0,
      totalMarks: 100,
      result: 'FAIL',
      passingPercentage: 85
    },
    { 
      id: 8, 
      name: 'mainin fruct shaith', 
      email: 'shaithing6757@gmail.com',
      type: 'Role',
      examTitle: 'Role 1 Attempt Sui',
      marks: 0,
      totalMarks: 100,
      result: 'FAIL',
      passingPercentage: 85
    },
    { 
      id: 9, 
      name: 'sshyaprakash goitam Gomali pratabad', 
      email: 'arymmy6757@gmail.com',
      type: 'Role',
      examTitle: 'Role 1 Attempt Sui',
      marks: 62,
      totalMarks: 100,
      result: 'FAIL',
      passingPercentage: 85
    },
    { 
      id: 10, 
      name: 'Nargis Abdu Haq Ansari', 
      email: 'aka505207@gmail.com',
      type: 'Role',
      examTitle: 'Role 1 Attempt Sui',
      marks: 0,
      totalMarks: 100,
      result: 'FAIL',
      passingPercentage: 85
    },
  ]);

  const [selectedExam, setSelectedExam] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    result: 'all',
    type: 'all'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleViewDetails = (exam) => {
    setSelectedExam(exam);
    setShowDetailsModal(true);
  };

  const filteredExams = exams.filter(exam => {
    const matchesSearch = 
      exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.examTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesResult = 
      filters.result === 'all' || exam.result === filters.result;
    
    const matchesType = 
      filters.type === 'all' || exam.type === filters.type;
    
    return matchesSearch && matchesResult && matchesType;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredExams.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentExams = filteredExams.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const tableHeaders = ['Start Name', 'Start e-mail', 'Type', 'Exam Title', 'Marks', 'Result', 'Details of Order'];

  const getScoreColor = (marks, totalMarks, passingPercentage) => {
    const percentage = (marks / totalMarks) * 100;
    return percentage >= passingPercentage ? 'text-green-600' : 'text-red-600';
  };

  const getResultColor = (result) => {
    return result === 'PASS' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">All Past Exam List</h1>
          <p className="text-black mt-2">View and manage all past examination records</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <select
                value={filters.result}
                onChange={(e) => setFilters({...filters, result: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
              >
                <option value="all">All Results</option>
                <option value="PASS">Pass</option>
                <option value="FAIL">Fail</option>
              </select>
            </div>
            
            <div>
              <select
                value={filters.type}
                onChange={(e) => setFilters({...filters, type: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
              >
                <option value="all">All Types</option>
                <option value="Role">Role</option>
                <option value="Theory">Theory</option>
                <option value="Practical">Practical</option>
              </select>
            </div>
            
            <div>
              <input
                type="text"
                placeholder="Search by name, email, or exam title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table
              headers={tableHeaders}
              data={currentExams}
              renderRow={(exam, index) => (
                <tr 
                  key={exam.id} 
                  className={`hover:bg-sky-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                >
                  <td className="py-4 px-4">
                    <div className="font-medium text-black">{exam.name}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-black truncate max-w-xs">{exam.email}</div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {exam.type}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-black font-medium">{exam.examTitle}</td>
                  <td className="py-4 px-4">
                    <span className={`font-bold ${getScoreColor(exam.marks, exam.totalMarks, exam.passingPercentage)}`}>
                      {exam.marks}/{exam.totalMarks}
                    </span>
                    <div className="text-xs text-gray-500">
                      {((exam.marks / exam.totalMarks) * 100).toFixed(1)}%
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${getResultColor(exam.result)} ${
                      exam.result === 'PASS' 
                        ? 'bg-green-100 border border-green-200' 
                        : 'bg-red-100 border border-red-200'
                    }`}>
                      {exam.result}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleViewDetails(exam)}
                      className="px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 text-sm font-medium"
                    >
                      View
                    </button>
                  </td>
                </tr>
              )}
            />
          </div>

          {filteredExams.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No exam records found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || filters.result !== 'all' || filters.type !== 'all' 
                  ? "No exams match your search criteria" 
                  : "No past examination records available."}
              </p>
            </div>
          )}

          {filteredExams.length > 0 && (
            <div className="flex flex-col md:flex-row justify-between items-center mt-6 pt-6 border-t border-gray-200">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 ${
                  currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700'
                }`}
              >
                Previous
              </button>
              
              <div className="flex items-center space-x-2 my-4 md:my-0">
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
                          ? 'bg-sky-500 text-white'
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
                          ? 'bg-sky-500 text-white'
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
      </div>

      <ExamDetailsModalStudent
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedExam(null);
        }}
        examData={selectedExam}
      />
    </div>
  );
};

export default AllPastExaminationsList;