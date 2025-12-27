// pages/StudentAdmissionList.jsx
import React, { useState } from 'react';
import Table from '../../components/Atoms/TableData/TableData';
import StudentAdmissionModal from '../../components/Atoms/UI/StudentAdmissionModal';

const Admission = () => {
  const [students, setStudents] = useState([
    { 
      id: 1, 
      studentName: 'rahul', 
      surname: 'Sharma',
      fatherHusbandName: 'Rajesh Sharma',
      mothersName: 'Sita Sharma',
      dob: '2000-05-15',
      aadharNo: '123456789012',
      gender: 'Male',
      category: 'General',
      religion: 'Hindu',
      mobile: '9876543210',
      email: 'rahul@gmail.com',
      educationQualification: '12th Pass',
      bloodGroup: 'B+',
      admissionDate: '2025-11-30',
      admissionSession: '2025-2026',
      address: '123 Main Street, Delhi',
      referralCode: '949a64cf1dc4', 
      fathersMobileNo: '9876543211',
      fathersOccupation: 'Business',
      mothersMobileNo: '9876543212',
      loginEmail: 'rahul@student.com',
      loginPassword: 'password123',
      type: 'New-Admission', 
      rollNo: 'ROLL20250004', 
      course: 'ms office',
      startDate: '2025-11-30',
      endDate: '2026-05-30',
      createdAt: '2025-11-30',
      source: 'Walk-in',
      batch: 'Morning',
      plan: 'Monthly',
      incentive: '1000',
      staffName: 'Staff 1',
      courseFees: '15000',
      discountRate: '10',
      discountAmount: '1500',
      totalFees: '13500',
      feesReceived: '5000',
      balance: '8500',
      remarks: 'Good',
      installments: [
        { id: 1, amount: '5000', date: '2025-11-30', mode: 'Cash' }
      ]
    },
    { 
      id: 2, 
      studentName: 'Tanzila', 
      surname: 'Khan',
      fatherHusbandName: 'Ahmad Khan',
      mothersName: 'Fatima Khan',
      dob: '2001-08-22',
      aadharNo: '234567890123',
      gender: 'Female',
      category: 'OBC',
      religion: 'Muslim',
      mobile: '8765432109',
      email: 'tanzila@gmail.com',
      educationQualification: 'Graduate',
      bloodGroup: 'A+',
      admissionDate: '2025-11-24',
      admissionSession: '2025-2026',
      address: '456 Park Avenue, Mumbai',
      referralCode: '8602bc9c01ba', 
      fathersMobileNo: '8765432110',
      fathersOccupation: 'Teacher',
      mothersMobileNo: '8765432111',
      loginEmail: 'tanzila@student.com',
      loginPassword: 'password456',
      type: 'New-Admission', 
      rollNo: 'ROLL20250003', 
      course: 'Tally accounting',
      startDate: '2025-11-24',
      endDate: '2026-05-24',
      createdAt: '2025-11-24',
      source: 'Referral',
      batch: 'Evening',
      plan: 'Yearly',
      incentive: '1500',
      staffName: 'Staff 2',
      courseFees: '20000',
      discountRate: '15',
      discountAmount: '3000',
      totalFees: '17000',
      feesReceived: '10000',
      balance: '7000',
      remarks: 'Excellent',
      installments: [
        { id: 1, amount: '10000', date: '2025-11-24', mode: 'Online' }
      ]
    },
    { 
      id: 3, 
      studentName: 'Husen', 
      surname: 'Patel',
      fatherHusbandName: 'Ramesh Patel',
      mothersName: 'Geeta Patel',
      dob: '1999-03-10',
      aadharNo: '345678901234',
      gender: 'Male',
      category: 'General',
      religion: 'Hindu',
      mobile: '7654321098',
      email: 'husen@gmail.com',
      educationQualification: 'Post Graduate',
      bloodGroup: 'O+',
      admissionDate: '2025-11-25',
      admissionSession: '2025-2026',
      address: '789 MG Road, Bangalore',
      referralCode: '08ebc58db22e', 
      fathersMobileNo: '7654321099',
      fathersOccupation: 'Engineer',
      mothersMobileNo: '7654321100',
      loginEmail: 'husen@student.com',
      loginPassword: 'password789',
      type: 'Re-Admission', 
      rollNo: 'ROLL20250002', 
      course: 'Tally accounting',
      startDate: '2025-11-25',
      endDate: '2026-05-25',
      createdAt: '2025-11-24',
      source: 'Online',
      batch: 'Afternoon',
      plan: 'Half Yearly',
      incentive: '800',
      staffName: 'Staff 3',
      courseFees: '18000',
      discountRate: '5',
      discountAmount: '900',
      totalFees: '17100',
      feesReceived: '10000',
      balance: '7100',
      remarks: 'Average',
      installments: [
        { id: 1, amount: '5000', date: '2025-11-25', mode: 'Card' },
        { id: 2, amount: '5000', date: '2025-12-25', mode: 'Cash' }
      ]
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [viewMode, setViewMode] = useState(null); // 'view', 'admissionForm', 'fees', 'certificate'
  const [filters, setFilters] = useState({
    studentName: '',
    course: '',
    rollNo: '',
    startDate: '',
    endDate: ''
  });

  const courses = [...new Set(students.map(student => student.course))];

  const handleAddStudent = () => {
    setEditingStudent(null);
    setViewMode(null);
    setIsModalOpen(true);
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setViewMode(null);
    setIsModalOpen(true);
  };

  const handleViewStudent = (student) => {
    setEditingStudent(student);
    setViewMode('view');
    setIsModalOpen(true);
  };

  const handleShowAdmissionForm = (student) => {
    setEditingStudent(student);
    setViewMode('admissionForm');
    setIsModalOpen(true);
  };

  const handleShowFees = (student) => {
    setEditingStudent(student);
    setViewMode('fees');
    setIsModalOpen(true);
  };

  const handleShowCertificate = (student) => {
    setEditingStudent(student);
    setViewMode('certificate');
    setIsModalOpen(true);
  };

  const handleDeleteStudent = (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      setStudents(students.filter(student => student.id !== id));
      alert('Student deleted successfully!');
    }
  };

  const handleSubmitStudent = (studentData) => {
    if (editingStudent) {
      setStudents(students.map(student => 
        student.id === editingStudent.id 
          ? { 
              ...student, 
              ...studentData,
              admissionDate: studentData.startDate || student.admissionDate,
              referralCode: student.referralCode || generateReferralCode()
            }
          : student
      ));
      alert('Student updated successfully!');
    } else {
      const newStudent = {
        id: students.length + 1,
        ...studentData,
        admissionDate: studentData.startDate,
        createdAt: new Date().toISOString().split('T')[0],
        referralCode: generateReferralCode()
      };
      setStudents([...students, newStudent]);
      alert('Student added successfully!');
    }
  };

  const generateReferralCode = () => {
    return Math.random().toString(36).substring(2, 14);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  const filteredStudents = students.filter(student => {
    const matchesName = !filters.studentName || 
                       student.studentName.toLowerCase().includes(filters.studentName.toLowerCase());
    const matchesCourse = !filters.course || student.course === filters.course;
    const matchesRollNo = !filters.rollNo || student.rollNo.includes(filters.rollNo);
    const matchesStartDate = !filters.startDate || student.startDate === filters.startDate;
    const matchesEndDate = !filters.endDate || student.endDate === filters.endDate;
    
    return matchesName && matchesCourse && matchesRollNo && matchesStartDate && matchesEndDate;
  });

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      studentName: '',
      course: '',
      rollNo: '',
      startDate: '',
      endDate: ''
    });
  };

  const tableHeaders = [
    'Student Name', 
    'Referral Code', 
    'Type', 
    'Roll No.', 
    'Course', 
    'Admission Date', 
    'Created At', 
    'Actions'
  ];

  const stats = {
    total: students.length,
    newAdmissions: students.filter(s => s.type === 'New-Admission').length,
    reAdmissions: students.filter(s => s.type === 'Re-Admission').length,
    activeCourses: new Set(students.map(s => s.course)).size
  };

  const printAdmissionForm = (student) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Admission Form - ${student.studentName}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
            .header h1 { color: #0369a1; }
            .info-section { margin-bottom: 30px; }
            .info-section h2 { color: #0369a1; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
            .row { display: flex; margin-bottom: 10px; }
            .label { font-weight: bold; width: 200px; }
            .value { flex: 1; }
            .signature { margin-top: 100px; border-top: 1px solid #000; padding-top: 10px; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>XYZ INSTITUTE OF TECHNOLOGY</h1>
            <h2>STUDENT ADMISSION FORM</h2>
          </div>
          
          <div class="info-section">
            <h2>Personal Information</h2>
            <div class="row"><div class="label">Student Name:</div><div class="value">${student.studentName} ${student.surname}</div></div>
            <div class="row"><div class="label">Father/Husband Name:</div><div class="value">${student.fatherHusbandName}</div></div>
            <div class="row"><div class="label">Mother's Name:</div><div class="value">${student.mothersName}</div></div>
            <div class="row"><div class="label">Date of Birth:</div><div class="value">${formatDate(student.dob)}</div></div>
            <div class="row"><div class="label">Gender:</div><div class="value">${student.gender}</div></div>
            <div class="row"><div class="label">Aadhar No:</div><div class="value">${student.aadharNo}</div></div>
          </div>
          
          <div class="info-section">
            <h2>Contact Information</h2>
            <div class="row"><div class="label">Mobile:</div><div class="value">${student.mobile}</div></div>
            <div class="row"><div class="label">Email:</div><div class="value">${student.email}</div></div>
            <div class="row"><div class="label">Address:</div><div class="value">${student.address}</div></div>
          </div>
          
          <div class="info-section">
            <h2>Course Information</h2>
            <div class="row"><div class="label">Course:</div><div class="value">${student.course}</div></div>
            <div class="row"><div class="label">Roll No:</div><div class="value">${student.rollNo}</div></div>
            <div class="row"><div class="label">Admission Date:</div><div class="value">${formatDate(student.admissionDate)}</div></div>
            <div class="row"><div class="label">Admission Session:</div><div class="value">${student.admissionSession}</div></div>
            <div class="row"><div class="label">Course Fees:</div><div class="value">₹${student.totalFees}</div></div>
          </div>
          
          <div class="signature">
            <div class="row">
              <div class="label">Student Signature:</div>
              <div class="value">____________________</div>
            </div>
            <div class="row">
              <div class="label">Principal Signature:</div>
              <div class="value">____________________</div>
            </div>
          </div>
          
          <div class="no-print" style="margin-top: 20px;">
            <button onclick="window.print()">Print Form</button>
            <button onclick="window.close()">Close</button>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const printCertificate = (student) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Certificate - ${student.studentName}</title>
          <style>
            body { 
              font-family: 'Times New Roman', Times, serif; 
              margin: 0;
              padding: 40px;
              background: linear-gradient(to bottom, #f8f9fa, #e9ecef);
              min-height: 100vh;
            }
            .certificate-container {
              border: 20px solid #0ea5e9;
              border-radius: 15px;
              padding: 50px;
              background: white;
              box-shadow: 0 0 30px rgba(0,0,0,0.1);
              position: relative;
              max-width: 800px;
              margin: 0 auto;
            }
            .certificate-header {
              text-align: center;
              margin-bottom: 40px;
            }
            .institute-name {
              font-size: 36px;
              color: #1e40af;
              font-weight: bold;
              letter-spacing: 2px;
              margin-bottom: 10px;
              text-transform: uppercase;
            }
            .certificate-title {
              font-size: 28px;
              color: #dc2626;
              font-weight: bold;
              margin-bottom: 10px;
              text-decoration: underline;
            }
            .certificate-subtitle {
              font-size: 18px;
              color: #475569;
              margin-bottom: 30px;
            }
            .certificate-body {
              text-align: center;
              margin: 40px 0;
              line-height: 1.8;
            }
            .student-name {
              font-size: 32px;
              color: #1e40af;
              font-weight: bold;
              margin: 20px 0;
              text-decoration: underline;
            }
            .course-details {
              font-size: 20px;
              color: #334155;
              margin: 20px 0;
            }
            .certificate-footer {
              margin-top: 60px;
              display: flex;
              justify-content: space-between;
            }
            .signature-box {
              text-align: center;
              width: 45%;
            }
            .signature-line {
              border-top: 2px solid #000;
              width: 200px;
              margin: 10px auto;
              padding-top: 10px;
            }
            .seal {
              position: absolute;
              right: 50px;
              bottom: 50px;
              width: 150px;
              opacity: 0.3;
            }
            .date {
              font-size: 16px;
              margin-top: 30px;
              text-align: center;
              color: #64748b;
            }
            @media print { 
              body { padding: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="certificate-container">
            <div class="certificate-header">
              <div class="institute-name">XYZ Institute of Technology</div>
              <div class="certificate-title">CERTIFICATE OF ADMISSION</div>
              <div class="certificate-subtitle">This certifies that</div>
            </div>
            
            <div class="certificate-body">
              <p>Mr./Ms.</p>
              <div class="student-name">${student.studentName} ${student.surname}</div>
              <p>has been admitted to our institute for the course</p>
              <div class="course-details">
                <strong>${student.course}</strong><br>
                Roll No: ${student.rollNo}<br>
                Session: ${student.admissionSession}
              </div>
              <p>with all the privileges and responsibilities pertaining thereto.</p>
            </div>
            
            <div class="date">
              Date of Admission: ${formatDate(student.admissionDate)}
            </div>
            
            <div class="certificate-footer">
              <div class="signature-box">
                <div class="signature-line"></div>
                <div>Principal</div>
                <div>XYZ Institute of Technology</div>
              </div>
              
              <div class="signature-box">
                <div class="signature-line"></div>
                <div>Director</div>
                <div>XYZ Institute of Technology</div>
              </div>
            </div>
            
            <div class="seal">
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#dc2626" stroke-width="2"/>
                <circle cx="50" cy="50" r="40" fill="none" stroke="#dc2626" stroke-width="1"/>
                <text x="50" y="35" text-anchor="middle" font-size="8" fill="#dc2626">OFFICIAL SEAL</text>
                <text x="50" y="50" text-anchor="middle" font-size="6" fill="#dc2626">XYZ INSTITUTE</text>
                <text x="50" y="65" text-anchor="middle" font-size="6" fill="#dc2626">OF TECHNOLOGY</text>
              </svg>
            </div>
          </div>
          
          <div class="no-print" style="text-align: center; margin-top: 20px;">
            <button onclick="window.print()" style="padding: 10px 20px; font-size: 16px; margin: 0 10px;">Print Certificate</button>
            <button onclick="window.close()" style="padding: 10px 20px; font-size: 16px; margin: 0 10px;">Close</button>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-sky-600">Student Admission List</h1>
          <p className="text-black mt-2">Manage student admissions and enrollment</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-black">Total Count</h2>
              <p className="text-4xl font-bold text-sky-600">{students.length}</p>
            </div>
            <button
              onClick={handleAddStudent}
              className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-8 rounded-lg transition duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <span>+</span>
              Add Student Admission
            </button>
          </div>

          <div className="border-t border-b border-gray-200 py-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-black mb-2">Student Name</label>
                <select
                  value={filters.studentName}
                  onChange={(e) => handleFilterChange('studentName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                >
                  <option value="">--- no select ---</option>
                  {[...new Set(students.map(s => s.studentName))].map((name, index) => (
                    <option key={index} value={name}>{name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-black mb-2">End Date</label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                />
              </div>

              <div>
                <label className="block text-black mb-2">Student Course</label>
                <select
                  value={filters.course}
                  onChange={(e) => handleFilterChange('course', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                >
                  <option value="">--- no select ---</option>
                  {courses.map((course, index) => (
                    <option key={index} value={course}>{course}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-black mb-2">Student Roll No</label>
                <select
                  value={filters.rollNo}
                  onChange={(e) => handleFilterChange('rollNo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                >
                  <option value="">--- no select ---</option>
                  {[...new Set(students.map(s => s.rollNo))].map((rollNo, index) => (
                    <option key={index} value={rollNo}>{rollNo}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-black mb-2">Start Date</label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full py-2 bg-gray-100 text-black rounded-md hover:bg-gray-200"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-xl font-bold text-black">Student List</h3>
          </div>

          <Table
            headers={tableHeaders}
            data={filteredStudents}
            renderRow={(student, index) => (
              <tr 
                key={student.id} 
                className={`hover:bg-sky-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
              >
                <td className="py-4 px-4 text-black font-medium">{student.studentName}</td>
                <td className="py-4 px-4 text-black font-mono text-sm">{student.referralCode}</td>
                <td className="py-4 px-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    student.type === 'New-Admission' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {student.type}
                  </span>
                </td>
                <td className="py-4 px-4 text-black font-bold">{student.rollNo}</td>
                <td className="py-4 px-4 text-black">
                  <span className="px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-sm">
                    {student.course}
                  </span>
                </td>
                <td className="py-4 px-4 text-black">{formatDate(student.admissionDate)}</td>
                <td className="py-4 px-4 text-black">{formatDate(student.createdAt)}</td>
                <td className="py-4 px-4">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleViewStudent(student)}
                      className="text-sky-500 hover:text-sky-700 p-1 hover:bg-sky-50 rounded"
                      title="View Details"
                    >
                      👁️
                    </button>
                    <button
                      onClick={() => handleEditStudent(student)}
                      className="text-yellow-500 hover:text-yellow-700 p-1 hover:bg-yellow-50 rounded"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleShowAdmissionForm(student)}
                      className="text-purple-500 hover:text-purple-700 p-1 hover:bg-purple-50 rounded"
                      title="Admission Form"
                    >
                      📄
                    </button>
                    <button
                      onClick={() => handleShowFees(student)}
                      className="text-green-500 hover:text-green-700 p-1 hover:bg-green-50 rounded"
                      title="Admission Fees"
                    >
                      💰
                    </button>
                    <button
                      onClick={() => handleShowCertificate(student)}
                      className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded"
                      title="Certificate"
                    >
                      🏆
                    </button>
                    <button
                      onClick={() => handleDeleteStudent(student.id)}
                      className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-50 rounded"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-sky-50 p-6 rounded-lg shadow border border-sky-100">
            <h3 className="text-lg font-semibold text-sky-700">Total Students</h3>
            <p className="text-3xl font-bold text-black mt-2">{stats.total}</p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg shadow border border-green-100">
            <h3 className="text-lg font-semibold text-green-700">New Admissions</h3>
            <p className="text-3xl font-bold text-black mt-2">{stats.newAdmissions}</p>
          </div>
          <div className="bg-blue-50 p-6 rounded-lg shadow border border-blue-100">
            <h3 className="text-lg font-semibold text-blue-700">Re-Admissions</h3>
            <p className="text-3xl font-bold text-black mt-2">{stats.reAdmissions}</p>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg shadow border border-purple-100">
            <h3 className="text-lg font-semibold text-purple-700">Active Courses</h3>
            <p className="text-3xl font-bold text-black mt-2">{stats.activeCourses}</p>
          </div>
        </div>
      </div>

      <StudentAdmissionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingStudent(null);
          setViewMode(null);
        }}
        onSubmit={handleSubmitStudent}
        initialData={editingStudent}
        viewMode={viewMode}
        onPrintAdmissionForm={printAdmissionForm}
        onPrintCertificate={printCertificate}
      />
    </div>
  );
};

export default Admission;