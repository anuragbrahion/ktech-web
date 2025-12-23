// pages/BranchManagement.jsx
import React, { useState } from 'react';
import Table from '../../components/Atoms/TableData/TableData';
import ExamDetailsModal from '../../components/Atoms/UI/ExamDetailsModal';

const BranchManagement = () => {
  const [exams, setExams] = useState([
    { 
      id: 1, 
      staffName: 'Azharsir exams testing user (teacher)', 
      staffEmail: 'ktechcomputer640184@gmail.com', 
      type: 'Role', 
      examTitle: 'Role 1 Final Exam', 
      marks: 13, 
      result: 'PASS'
    },
    { 
      id: 2, 
      staffName: 'Azharsir exams testing user (teacher)', 
      staffEmail: 'ktechcomputer640184@gmail.com', 
      type: 'Role', 
      examTitle: 'Role 1 Final Exam', 
      marks: 9, 
      result: 'FALL'
    },
    { 
      id: 3, 
      staffName: 'Ubed Samir Mirza', 
      staffEmail: 'sameermirza0947@gmail.com', 
      type: 'Role', 
      examTitle: 'Role 1 Final Exam', 
      marks: 11, 
      result: 'FALL'
    },
    { 
      id: 4, 
      staffName: 'Ubed Samir Mirza', 
      staffEmail: 'sameermirza0947@gmail.com', 
      type: 'Role', 
      examTitle: 'role 1 try', 
      marks: 1, 
      result: 'PASS'
    },
    { 
      id: 5, 
      staffName: 'Azharsir exams testing user (teacher)', 
      staffEmail: 'ktechcomputer640184@gmail.com', 
      type: 'Role', 
      examTitle: 'Role 1 Attempt 3rd', 
      marks: 62, 
      result: 'FALL'
    },
    { 
      id: 6, 
      staffName: 'Azharsir exams testing user (teacher)', 
      staffEmail: 'ktechcomputer640184@gmail.com', 
      type: 'Role', 
      examTitle: 'role 2 exam', 
      marks: 83, 
      result: 'PASS'
    },
    { 
      id: 7, 
      staffName: 'satyaprakash gotam Gomati prashad', 
      staffEmail: 'aryarroy6792@gmail.com', 
      type: 'Role', 
      examTitle: 'Role 1 Attempt 3rd', 
      marks: 0, 
      result: 'FALL'
    },
    { 
      id: 8, 
      staffName: 'mahin firoz shaikh', 
      staffEmail: 'shaikhfiroj6799@gmail.com', 
      type: 'Role', 
      examTitle: 'Role 1 Attempt 3rd', 
      marks: 0, 
      result: 'FALL'
    },
  ]);

  const [selectedExam, setSelectedExam] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterResult, setFilterResult] = useState('');

  const handleViewDetails = (exam) => {
    setSelectedExam(exam);
    setIsModalOpen(true);
  };

  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.staffEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.examTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesResult = !filterResult || exam.result === filterResult;
    return matchesSearch && matchesResult;
  });

  const stats = {
    total: exams.length,
    pass: exams.filter(e => e.result === 'PASS').length,
    fail: exams.filter(e => e.result === 'FALL').length,
    average: exams.reduce((sum, exam) => sum + exam.marks, 0) / exams.length
  };

  const tableHeaders = [
    'Staff Name', 
    'Staff e-mail', 
    'Type', 
    'Exam Title', 
    'Marks', 
    'Result', 
    'Details of Order'
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black">All Past Exam List</h1>
          <p className="text-black mt-2">View and analyze all past exam results</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-sky-50 p-6 rounded-lg shadow border border-sky-100">
            <h3 className="text-lg font-semibold text-sky-700">Total Exams</h3>
            <p className="text-3xl font-bold text-black mt-2">{stats.total}</p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg shadow border border-green-100">
            <h3 className="text-lg font-semibold text-green-700">Passed</h3>
            <p className="text-3xl font-bold text-black mt-2">{stats.pass}</p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg shadow border border-red-100">
            <h3 className="text-lg font-semibold text-red-700">Failed</h3>
            <p className="text-3xl font-bold text-black mt-2">{stats.fail}</p>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg shadow border border-purple-100">
            <h3 className="text-lg font-semibold text-purple-700">Avg Marks</h3>
            <p className="text-3xl font-bold text-black mt-2">{stats.average.toFixed(1)}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by staff name, email, or exam title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
              />
            </div>
            <div className="w-full md:w-64">
              <select
                value={filterResult}
                onChange={(e) => setFilterResult(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
              >
                <option value="">All Results</option>
                <option value="PASS">PASS</option>
                <option value="FALL">FAIL</option>
              </select>
            </div>
          </div>

          <Table
            headers={tableHeaders}
            data={filteredExams}
            renderRow={(exam, index) => (
              <tr 
                key={exam.id} 
                className={`hover:bg-sky-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
              >
                <td className="py-4 px-4 text-black font-medium">{exam.staffName}</td>
                <td className="py-4 px-4 text-black">{exam.staffEmail}</td>
                <td className="py-4 px-4 text-black">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {exam.type}
                  </span>
                </td>
                <td className="py-4 px-4 text-black font-medium">{exam.examTitle}</td>
                <td className="py-4 px-4 text-black font-bold">{exam.marks}/100</td>
                <td className="py-4 px-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    exam.result === 'PASS' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-sky-700 mb-4">Performance Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-black">Pass Rate</span>
                <span className="font-bold text-green-600">
                  {((stats.pass / stats.total) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-black">Fail Rate</span>
                <span className="font-bold text-red-600">
                  {((stats.fail / stats.total) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-black">Highest Score</span>
                <span className="font-bold text-purple-600">
                  {Math.max(...exams.map(e => e.marks))}/100
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-black">Lowest Score</span>
                <span className="font-bold text-orange-600">
                  {Math.min(...exams.map(e => e.marks))}/100
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-sky-700 mb-4">Exam Types Distribution</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-black">Role Exams</span>
                <span className="font-bold">
                  {exams.filter(e => e.type === 'Role').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-black">Course Exams</span>
                <span className="font-bold">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-black">Skill Tests</span>
                <span className="font-bold">0</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ExamDetailsModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedExam(null);
        }}
        examData={selectedExam}
      />
    </div>
  );
};

export default BranchManagement;