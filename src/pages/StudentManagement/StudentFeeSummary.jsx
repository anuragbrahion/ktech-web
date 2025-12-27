// pages/StudentFeeSummary.jsx
import React, { useState } from 'react';

const StudentFeeSummary = () => {
  const [selectedStudent, setSelectedStudent] = useState('rahul');
  const [selectedCourse, setSelectedCourse] = useState('ms office');

  const students = [
    { id: 1, name: 'rahul', courses: ['ms office'] },
    { id: 2, name: 'Tanzila', courses: ['Tally accounting'] },
    { id: 3, name: 'Husen', courses: ['Tally accounting'] },
    { id: 4, name: 'Priya', courses: ['Photoshop', 'CorelDraw'] },
    { id: 5, name: 'Amit', courses: ['HTML', 'c language'] }
  ];

  const courses = [
    'ms office',
    'Tally accounting',
    'Photoshop',
    'CorelDraw',
    'HTML',
    'c language',
    'C++'
  ];

  const dummyFeeData = {
    'rahul': {
      'ms office': {
        totalInstallments: 4,
        totalPaid: 12000,
        pendingAmount: 8000,
        totalFees: 20000,
        installments: [
          { id: 1, name: 'First Installment', amount: 5000, status: 'Paid', receipt: 'REC001', date: '2025-11-01' },
          { id: 2, name: 'Second Installment', amount: 5000, status: 'Paid', receipt: 'REC002', date: '2025-12-01' },
          { id: 3, name: 'Third Installment', amount: 5000, status: 'Pending', receipt: '', date: '2026-01-01' },
          { id: 4, name: 'Fourth Installment', amount: 5000, status: 'Pending', receipt: '', date: '2026-02-01' }
        ]
      }
    },
    'Tanzila': {
      'Tally accounting': {
        totalInstallments: 3,
        totalPaid: 9000,
        pendingAmount: 6000,
        totalFees: 15000,
        installments: [
          { id: 1, name: 'Registration', amount: 3000, status: 'Paid', receipt: 'REC101', date: '2025-11-15' },
          { id: 2, name: 'Course Fee', amount: 6000, status: 'Paid', receipt: 'REC102', date: '2025-12-15' },
          { id: 3, name: 'Exam Fee', amount: 6000, status: 'Pending', receipt: '', date: '2026-01-15' }
        ]
      }
    },
    'Husen': {
      'Tally accounting': {
        totalInstallments: 2,
        totalPaid: 5000,
        pendingAmount: 10000,
        totalFees: 15000,
        installments: [
          { id: 1, name: 'First Installment', amount: 5000, status: 'Paid', receipt: 'REC201', date: '2025-11-25' },
          { id: 2, name: 'Second Installment', amount: 10000, status: 'Pending', receipt: '', date: '2025-12-25' }
        ]
      }
    }
  };

  const getCurrentFeeData = () => {
    if (dummyFeeData[selectedStudent] && dummyFeeData[selectedStudent][selectedCourse]) {
      return dummyFeeData[selectedStudent][selectedCourse];
    }
    
    return {
      totalInstallments: 0,
      totalPaid: 0,
      pendingAmount: 0,
      totalFees: 0,
      installments: []
    };
  };

  const feeData = getCurrentFeeData();
  const studentCourses = students.find(s => s.name === selectedStudent)?.courses || [];

  const handleStudentChange = (studentName) => {
    setSelectedStudent(studentName);
    const student = students.find(s => s.name === studentName);
    if (student && student.courses.length > 0) {
      setSelectedCourse(student.courses[0]);
    }
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Paid': { bg: 'bg-green-100', text: 'text-green-800', label: '✓ Paid' },
      'Pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: '⏳ Pending' },
      'Overdue': { bg: 'bg-red-100', text: 'text-red-800', label: '⚠️ Overdue' },
      'Partial': { bg: 'bg-blue-100', text: 'text-blue-800', label: '↕️ Partial' }
    };
    
    const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-sky-600">Student Fee Summary</h1>
          <p className="text-black mt-2">View and manage student fee details</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-sky-600 mb-4">Select Student & Course</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-black mb-2">Student Name</label>
                <select
                  value={selectedStudent}
                  onChange={(e) => handleStudentChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                >
                  {students.map((student) => (
                    <option key={student.id} value={student.name}>{student.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-black mb-2">Student Course</label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                >
                  {studentCourses.map((course, index) => (
                    <option key={index} value={course}>{course}</option>
                  ))}
                  {studentCourses.length === 0 && (
                    courses.map((course, index) => (
                      <option key={index} value={course}>{course}</option>
                    ))
                  )}
                </select>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="h-px flex-1 bg-gray-300"></div>
              <h2 className="text-xl font-bold text-sky-600 mx-4">Fee Summary</h2>
              <div className="h-px flex-1 bg-gray-300"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-blue-50 p-6 rounded-lg shadow border border-blue-100">
                <h3 className="text-lg font-semibold text-blue-700 mb-2">Total Fees</h3>
                <p className="text-3xl font-bold text-black">{formatCurrency(feeData.totalFees)}</p>
              </div>

              <div className="bg-green-50 p-6 rounded-lg shadow border border-green-100">
                <h3 className="text-lg font-semibold text-green-700 mb-2">Total Installments</h3>
                <p className="text-3xl font-bold text-black">{feeData.totalInstallments}</p>
              </div>

              <div className="bg-green-50 p-6 rounded-lg shadow border border-green-100">
                <h3 className="text-lg font-semibold text-green-700 mb-2">Total Paid</h3>
                <p className="text-3xl font-bold text-black">{formatCurrency(feeData.totalPaid)}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {feeData.totalFees > 0 ? `${Math.round((feeData.totalPaid / feeData.totalFees) * 100)}% paid` : '0% paid'}
                </p>
              </div>

              <div className={`p-6 rounded-lg shadow border ${
                feeData.pendingAmount > 0 
                  ? 'bg-red-50 border-red-100' 
                  : 'bg-gray-50 border-gray-100'
              }`}>
                <h3 className={`text-lg font-semibold ${
                  feeData.pendingAmount > 0 ? 'text-red-700' : 'text-gray-700'
                } mb-2`}>
                  Pending Amount
                </h3>
                <p className="text-3xl font-bold text-black">{formatCurrency(feeData.pendingAmount)}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {feeData.totalFees > 0 ? `${Math.round((feeData.pendingAmount / feeData.totalFees) * 100)}% remaining` : 'No fees'}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-black font-semibold border-b">Total Installments</th>
                    <th className="py-3 px-4 text-left text-black font-semibold border-b">Total Paid</th>
                    <th className="py-3 px-4 text-left text-black font-semibold border-b">Pending Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-4 px-4 text-black text-center">{feeData.totalInstallments}</td>
                    <td className="py-4 px-4 text-black text-center">{formatCurrency(feeData.totalPaid)}</td>
                    <td className="py-4 px-4 text-black text-center">{formatCurrency(feeData.pendingAmount)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <div className="flex items-center mb-4">
              <div className="h-px flex-1 bg-gray-300"></div>
              <h2 className="text-xl font-bold text-sky-600 mx-4">Installment Details</h2>
              <div className="h-px flex-1 bg-gray-300"></div>
            </div>

            {feeData.installments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-4 text-left text-black font-semibold border-b">Sr No.</th>
                      <th className="py-3 px-4 text-left text-black font-semibold border-b">Installment Name</th>
                      <th className="py-3 px-4 text-left text-black font-semibold border-b">Amount ($)</th>
                      <th className="py-3 px-4 text-left text-black font-semibold border-b">Payment Status</th>
                      <th className="py-3 px-4 text-left text-black font-semibold border-b">Receipt Number</th>
                      <th className="py-3 px-4 text-left text-black font-semibold border-b">Due Date</th>
                      <th className="py-3 px-4 text-left text-black font-semibold border-b">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {feeData.installments.map((installment, index) => (
                      <tr key={installment.id} className="hover:bg-gray-50">
                        <td className="py-4 px-4 text-black text-center">{index + 1}</td>
                        <td className="py-4 px-4 text-black font-medium">{installment.name}</td>
                        <td className="py-4 px-4 text-black font-bold">{formatCurrency(installment.amount)}</td>
                        <td className="py-4 px-4">
                          {getStatusBadge(installment.status)}
                        </td>
                        <td className="py-4 px-4 text-black">
                          {installment.receipt ? (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                              {installment.receipt}
                            </span>
                          ) : (
                            <span className="text-gray-400">Not generated</span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-black">
                          {new Date(installment.date).toLocaleDateString('en-GB')}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex space-x-2">
                            {installment.status === 'Pending' && (
                              <button
                                className="px-3 py-1 bg-sky-500 text-white rounded-md hover:bg-sky-600 text-sm"
                                onClick={() => alert(`Mark installment ${installment.name} as paid`)}
                              >
                                Mark Paid
                              </button>
                            )}
                            <button
                              className="px-3 py-1 bg-gray-100 text-black rounded-md hover:bg-gray-200 text-sm"
                              onClick={() => alert(`Download receipt for ${installment.name}`)}
                            >
                              Receipt
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 border border-gray-200 rounded-lg">
                <p className="text-gray-500">No installment details available.</p>
                <p className="text-gray-400 text-sm mt-2">Select a different student or course</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-purple-50 p-6 rounded-lg shadow border border-purple-100">
            <h3 className="text-lg font-semibold text-purple-700">Payment Progress</h3>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-green-500 h-4 rounded-full" 
                  style={{ 
                    width: feeData.totalFees > 0 
                      ? `${(feeData.totalPaid / feeData.totalFees) * 100}%` 
                      : '0%' 
                  }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <span className="text-black">
                  {feeData.totalPaid > 0 
                    ? `${Math.round((feeData.totalPaid / feeData.totalFees) * 100)}% paid` 
                    : '0% paid'
                  }
                </span>
                <span className="text-black">
                  {feeData.pendingAmount > 0 
                    ? `${Math.round((feeData.pendingAmount / feeData.totalFees) * 100)}% pending` 
                    : '0% pending'
                  }
                </span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-6 rounded-lg shadow border border-yellow-100">
            <h3 className="text-lg font-semibold text-yellow-700">Next Due Date</h3>
            <p className="text-2xl font-bold text-black mt-2">
              {feeData.installments.find(i => i.status === 'Pending') 
                ? new Date(feeData.installments.find(i => i.status === 'Pending').date).toLocaleDateString('en-GB')
                : 'No pending dues'
              }
            </p>
            <p className="text-sm text-gray-600 mt-1">Next installment due date</p>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg shadow border border-blue-100">
            <h3 className="text-lg font-semibold text-blue-700">Installment Status</h3>
            <div className="flex justify-between mt-2">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {feeData.installments.filter(i => i.status === 'Paid').length}
                </p>
                <p className="text-sm text-gray-600">Paid</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">
                  {feeData.installments.filter(i => i.status === 'Pending').length}
                </p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">
                  {feeData.installments.filter(i => i.status === 'Overdue').length}
                </p>
                <p className="text-sm text-gray-600">Overdue</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentFeeSummary;