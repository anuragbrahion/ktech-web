import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllStuCouseName, getAllStudFeeName } from '../../redux/slices/course';
import Table from '../../components/Atoms/TableData/TableData';

const StudentFeeSummary = () => {
  const dispatch = useDispatch();
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [studentCourses, setStudentCourses] = useState([]);
  const [loading, setLoading] = useState(false); 
  
  const allStudents = useSelector(state => state.course.getAllStudFeeNameData?.data?.data?.list || []);
   
  useEffect(() => {
    dispatch(getAllStudFeeName());
  }, [dispatch]);

  useEffect(() => {
    if (selectedStudent) {
      setLoading(true);
      dispatch(getAllStuCouseName({ id: selectedStudent }))
        .then((res) => {
          if(res){
            setStudentCourses(res?.payload?.data?.list || []);
            setLoading(false);
          }
        })
        .catch(() => setLoading(false));
    }
  }, [selectedStudent, dispatch]);

  useEffect(() => {
    if (studentCourses.length > 0 && !selectedCourse) {
      setSelectedCourse(studentCourses[0]._id);
    }
  }, [studentCourses]);

  const handleStudentChange = (studentId) => {
    setSelectedStudent(studentId);
    setSelectedCourse('');
    setStudentCourses([]);
  };

  const getSelectedCourseData = () => {
    return studentCourses.find(course => course._id === selectedCourse) || null;
  };

  const getCurrentFeeData = () => {
    const selectedCourseData = getSelectedCourseData();
    
    if (!selectedCourse || !selectedCourseData || !selectedCourseData.installments) {
      return {
        totalInstallments: 0,
        totalPaid: 0,
        pendingAmount: 0,
        totalFees: 0,
        installments: []
      };
    }

    const installments = selectedCourseData.installments || [];
    
    if (!installments.length) {
      return {
        totalInstallments: 0,
        totalPaid: 0,
        pendingAmount: 0,
        totalFees: 0,
        installments: []
      };
    }

    const totalFees = installments.reduce((sum, item) => sum + item.amount, 0);
    const totalPaid = installments.reduce((sum, item) => 
      sum + (item.paymentStatus === 'Paid' ? item.amount : 0), 0);
    const pendingAmount = totalFees - totalPaid;
    const totalInstallments = installments.length;

    const formattedInstallments = installments.map((item, index) => ({
      id: item._id || index + 1,
      name: item.name || `Installment ${index + 1}`,
      amount: item.amount,
      status: item.paymentStatus || (item.status ? 'Paid' : 'Pending'),
      receipt: item.receiptNumber || '',
      date: item.date,
      paymentMode: item.paymentmode || 'N/A'
    }));

    return {
      totalInstallments,
      totalPaid,
      pendingAmount,
      totalFees,
      installments: formattedInstallments
    };
  };

  const feeData = getCurrentFeeData(); 
  const selectedCourseData = getSelectedCourseData();

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Paid': { text: 'text-green-800', label: '✓ Paid' },
      'Pending': { text: 'text-yellow-800', label: '⏳ Pending' },
      'Partial': { text: 'text-blue-800', label: '↕️ Partial' }
    };
    
    const config = statusConfig[status] || { text: 'text-gray-800', label: status };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const installmentHeaders = [
    'Sr No.',
    'Installment Name',
    'Amount',
    'Payment Status',
    'Receipt Number',
    'Due Date',
    'Payment Mode'
  ];

  const renderInstallmentRow = (installment, index) => (
    <tr key={installment.id} className="hover:bg-gray-50">
      <td className="py-4 px-4 text-black text-center">{index + 1}</td>
      <td className="py-4 px-4 text-black font-medium">{installment.name}</td>
      <td className="py-4 px-4 text-black font-bold">{formatCurrency(installment.amount)}</td>
      <td className="py-4 px-4">{getStatusBadge(installment.status)}</td>
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
        {installment.date ? new Date(installment.date).toLocaleDateString('en-GB') : 'N/A'}
      </td>
      <td className="py-4 px-4 text-black">{installment.paymentMode}</td>
    </tr>
  );

  return (
    <div className="">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Student Fee Summary</h1>
          <p className="text-black mt-2">View and manage student fee details</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Select Student & Course</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-black mb-2">Student Name</label>
                <select
                  value={selectedStudent}
                  onChange={(e) => handleStudentChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                >
                  <option value="">Select a student</option>
                  {allStudents.map((student) => (
                    <option key={student._id} value={student._id}>
                      {student.name || student.full_name || `Student ${student._id}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-black mb-2">Student Course</label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                  disabled={loading || studentCourses.length === 0}
                >
                  <option value="">Select a course</option>
                  {studentCourses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.course?.courseName || 'Unnamed Course'}
                    </option>
                  ))}
                </select>
                {loading && <p className="text-sm text-gray-500 mt-1">Loading courses...</p>}
                {!loading && studentCourses.length === 0 && selectedStudent && (
                  <p className="text-sm text-gray-500 mt-1">No courses found for this student</p>
                )}
              </div>
            </div>
          </div>

          {selectedStudent && selectedCourse && selectedCourseData && (
            <>
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Student & Course Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Student Name</p>
                    <p className="text-lg font-medium text-black">{selectedCourseData.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Course</p>
                    <p className="text-lg font-medium text-black">{selectedCourseData.course?.courseName}</p>
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

                  <div className={`p-6 rounded-lg shadow border ${feeData.pendingAmount > 0 ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-100'}`}>
                    <h3 className={`text-lg font-semibold ${feeData.pendingAmount > 0 ? 'text-red-700' : 'text-gray-700'} mb-2`}>
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
                  <Table
                    headers={installmentHeaders}
                    data={feeData.installments}
                    renderRow={renderInstallmentRow}
                  />
                ) : (
                  <div className="text-center py-8 border border-gray-200 rounded-lg">
                    <p className="text-gray-500">No installment details available for this course.</p>
                    <p className="text-gray-400 text-sm mt-2">All installments for this course are empty.</p>
                  </div>
                )}
              </div>
            </>
          )}

          {selectedStudent && studentCourses.length > 0 && !selectedCourse && !loading && (
            <div className="text-center py-8 border border-gray-200 rounded-lg">
              <p className="text-gray-500">Please select a course to view fee details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentFeeSummary;