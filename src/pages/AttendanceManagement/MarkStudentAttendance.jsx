import React, { useState } from 'react';
import Table from '../../components/Atoms/TableData/TableData';
import AttendanceDetailsModal from '../../components/Atoms/UI/AttendanceDetailsModal';
import StudentDetailsModal from '../../components/Atoms/UI/StudentDetailsModal';
import AdmissionDetailsModal from '../../components/Atoms/UI/AdmissionDetailsModal';
import InstallmentDetailsModal from '../../components/Atoms/UI/InstallmentDetailsModal';
import AttendanceCalendarModal from '../../components/Atoms/UI/AttendanceCalendarModal';

const MarkStudentAttendance = () => {
  const [students, setStudents] = useState([
    { 
      id: 1, 
      name: 'rahul', 
      rollNo: 'ROLL20250004',
      course: 'ms office',
      admissionDate: '30/11/2025',
      attendanceMark: '💬',
      dob: '05/22/2007',
      gender: 'Male',
      email: 'rahul@gmail.com',
      phone: '9898379375',
      address: 'limbayat',
      fatherName: 'kishore',
      fatherPhone: '9898767654',
      motherName: 'sanjana',
      motherPhone: '9797686865',
      loginEmail: 'rahul@gmail.com',
      loginPassword: 'rahul22052007',
      religion: 'Hindu',
      education: '12th',
      bloodGroup: 'B-',
      admissionSession: 'november 2025',
      referralCode: '08ebc584b22e',
      totalFee: '5000',
      courseDuration: '2',
      examType: 'Offline',
      courseFees: '5000',
      discountRate: 'Select',
      discountAmount: '0',
      totalFees: '5000',
      feesReceived: '0',
      balance: '5000'
    },
    { 
      id: 2, 
      name: 'Tanzila', 
      rollNo: 'ROLL20250003',
      course: 'Tally accounting',
      admissionDate: '24/11/2025',
      attendanceMark: '💬',
      dob: '10/15/2006',
      gender: 'Female',
      email: 'tanzila@gmail.com',
      phone: '9876543210',
      address: 'surat',
      fatherName: 'rahim',
      fatherPhone: '9876543211',
      motherName: 'fatima',
      motherPhone: '9876543212',
      loginEmail: 'tanzila@gmail.com',
      loginPassword: 'tanzila15102006',
      religion: 'Muslim',
      education: '12th',
      bloodGroup: 'O+',
      admissionSession: 'november 2025',
      referralCode: '08ebc584b22f',
      totalFee: '6000',
      courseDuration: '3',
      examType: 'Online',
      courseFees: '6000',
      discountRate: '5%',
      discountAmount: '300',
      totalFees: '5700',
      feesReceived: '2000',
      balance: '3700'
    },
    { 
      id: 3, 
      name: 'Husen', 
      rollNo: 'ROLL20250002',
      course: 'Tally accounting',
      admissionDate: '25/11/2025',
      attendanceMark: '💬',
      dob: '08/12/2005',
      gender: 'Male',
      email: 'husen@gmail.com',
      phone: '9123456789',
      address: 'vadodara',
      fatherName: 'mohammed',
      fatherPhone: '9123456780',
      motherName: 'aisha',
      motherPhone: '9123456781',
      loginEmail: 'husen@gmail.com',
      loginPassword: 'husen12082005',
      religion: 'Muslim',
      education: '12th',
      bloodGroup: 'A+',
      admissionSession: 'november 2025',
      referralCode: '08ebc584b230',
      totalFee: '6000',
      courseDuration: '3',
      examType: 'Offline',
      courseFees: '6000',
      discountRate: '10%',
      discountAmount: '600',
      totalFees: '5400',
      feesReceived: '3000',
      balance: '2400'
    },
    { 
      id: 4, 
      name: 'Husen', 
      rollNo: 'ROLL20250001',
      course: 'ms office',
      admissionDate: '25/09/2025',
      attendanceMark: '💬',
      dob: '03/18/2007',
      gender: 'Male',
      email: 'husen2@gmail.com',
      phone: '9988776655',
      address: 'ahmedabad',
      fatherName: 'ali',
      fatherPhone: '9988776644',
      motherName: 'zainab',
      motherPhone: '9988776633',
      loginEmail: 'husen2@gmail.com',
      loginPassword: 'husen218032007',
      religion: 'Muslim',
      education: '11th',
      bloodGroup: 'AB+',
      admissionSession: 'september 2025',
      referralCode: '08ebc584b231',
      totalFee: '5000',
      courseDuration: '2',
      examType: 'Offline',
      courseFees: '5000',
      discountRate: '0%',
      discountAmount: '0',
      totalFees: '5000',
      feesReceived: '5000',
      balance: '0'
    },
  ]);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showStudentDetailsModal, setShowStudentDetailsModal] = useState(false);
  const [showAdmissionModal, setShowAdmissionModal] = useState(false);
  const [showInstallmentModal, setShowInstallmentModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeAction, setActiveAction] = useState('eye'); // 'eye' or 'fire'

  const handleAttendanceMark = (student) => {
    setSelectedStudent(student);
    setShowAttendanceModal(true);
  };

  const handleViewDetails = (student, actionType) => {
    setSelectedStudent(student);
    setActiveAction(actionType);
    
    if (actionType === 'eye') {
      setShowStudentDetailsModal(true);
    } else if (actionType === 'fire') {
      // For fire icon, we need to decide which modal to show
      // Based on your images, let's show admission details first
      setShowAdmissionModal(true);
    }
  };

  const handleOpenInstallments = () => {
    setShowAdmissionModal(false);
    setShowInstallmentModal(true);
  };

  const handleCheckAttendance = (student) => {
    setSelectedStudent(student);
    setShowCalendarModal(true);
  };

  const handleUpdateAttendance = (studentId, status, date) => {
    // Update attendance logic here
    console.log(`Update attendance for ${studentId}: ${status} on ${date}`);
  };

  const handleUpdateStudent = (updatedData) => {
    setStudents(students.map(student => 
      student.id === selectedStudent.id 
        ? { ...student, ...updatedData }
        : student
    ));
    setSelectedStudent(null);
    setShowStudentDetailsModal(false);
  };

  const handleUpdateAdmission = (updatedData) => {
    setStudents(students.map(student => 
      student.id === selectedStudent.id 
        ? { ...student, ...updatedData }
        : student
    ));
    setSelectedStudent(null);
    setShowAdmissionModal(false);
  };

  const handleAddInstallment = (installmentData) => {
    // Add installment logic here
    console.log('Add installment:', installmentData);
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: students.length,
    present: Math.floor(students.length * 0.75),
    absent: Math.floor(students.length * 0.15),
    leave: Math.floor(students.length * 0.10)
  };

  const tableHeaders = [
    'Student Name', 
    'Roll NO', 
    'Course', 
    'Admission Date', 
    'Attendance Mark', 
    'Actions', 
    'Check Attendance'
  ];

  return (
    <div className="">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Marked Student Attendance</h1>
          <p className="text-black mt-2">Manage student attendance and details</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-sky-50 p-6 rounded-lg shadow border border-sky-100">
            <h3 className="text-lg font-semibold text-sky-700">Total Students</h3>
            <p className="text-3xl font-bold text-black mt-2">{stats.total}</p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg shadow border border-green-100">
            <h3 className="text-lg font-semibold text-green-700">Present Today</h3>
            <p className="text-3xl font-bold text-black mt-2">{stats.present}</p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg shadow border border-red-100">
            <h3 className="text-lg font-semibold text-red-700">Absent Today</h3>
            <p className="text-3xl font-bold text-black mt-2">{stats.absent}</p>
          </div>
          <div className="bg-yellow-50 p-6 rounded-lg shadow border border-yellow-100">
            <h3 className="text-lg font-semibold text-yellow-700">On Leave</h3>
            <p className="text-3xl font-bold text-black mt-2">{stats.leave}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name, roll no, or course..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
              />
            </div>
            <div className="text-sm text-gray-600">
              Showing {filteredStudents.length} of {students.length} students
            </div>
          </div>

          <Table
            headers={tableHeaders}
            data={filteredStudents}
            renderRow={(student, index) => (
              <tr 
                key={student.id} 
                className={`hover:bg-sky-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
              >
                <td className="py-4 px-4 text-black font-medium">{student.name}</td>
                <td className="py-4 px-4 text-black font-mono">{student.rollNo}</td>
                <td className="py-4 px-4 text-black">
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                    {student.course}
                  </span>
                </td>
                <td className="py-4 px-4 text-black">{student.admissionDate}</td>
                <td className="py-4 px-4">
                  <button
                    onClick={() => handleAttendanceMark(student)}
                    className="text-2xl hover:scale-110 transition-transform"
                    title="Mark Attendance"
                  >
                    {student.attendanceMark}
                  </button>
                </td>
                <td className="py-4 px-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewDetails(student, 'eye')}
                      className="text-sky-500 hover:text-sky-700 text-xl"
                      title="View Student Details"
                    >
                      👁️
                    </button>
                    <button
                      onClick={() => handleViewDetails(student, 'fire')}
                      className="text-red-500 hover:text-red-700 text-xl"
                      title="View Admission & Installments"
                    >
                      🔥
                    </button>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <button
                    onClick={() => handleCheckAttendance(student)}
                    className="px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 text-sm font-medium"
                  >
                    Attendance Calendar
                  </button>
                </td>
              </tr>
            )}
          />
        </div>

      </div>

      {/* Modals */}
      <AttendanceDetailsModal
        isOpen={showAttendanceModal}
        onClose={() => {
          setShowAttendanceModal(false);
          setSelectedStudent(null);
        }}
        studentData={selectedStudent}
        onSubmit={handleUpdateAttendance}
      />

      <StudentDetailsModal
        isOpen={showStudentDetailsModal}
        onClose={() => {
          setShowStudentDetailsModal(false);
          setSelectedStudent(null);
        }}
        studentData={selectedStudent}
        onUpdate={handleUpdateStudent}
      />

      <AdmissionDetailsModal
        isOpen={showAdmissionModal}
        onClose={() => {
          setShowAdmissionModal(false);
          setSelectedStudent(null);
        }}
        onOpenInstallments={handleOpenInstallments}
        studentData={selectedStudent}
        onUpdate={handleUpdateAdmission}
      />

      <InstallmentDetailsModal
        isOpen={showInstallmentModal}
        onClose={() => {
          setShowInstallmentModal(false);
          setSelectedStudent(null);
        }}
        studentData={selectedStudent}
        onSubmit={handleAddInstallment}
      />

      <AttendanceCalendarModal
        isOpen={showCalendarModal}
        onClose={() => {
          setShowCalendarModal(false);
          setSelectedStudent(null);
        }}
        studentData={selectedStudent}
        type="student"
      />
    </div>
  );
};

export default MarkStudentAttendance;