/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Table from "../../components/Atoms/TableData/TableData";
import StudentAdmissionModal from "../../components/Atoms/UI/StudentAdmissionModal";
import { useDispatch, useSelector } from "react-redux";
import {
  studentAdmissionsList,
  createNewAdmission,
  updateAdmission,
  studentAdmissionsView,
  coursesAllDocuments,
  courseBatchesAllDocuments,
  coursePlansAllDocuments,
} from "../../redux/slices/course";
import { teachersAllDocuments } from "../../redux/slices/employee";

const Admission = ({ adminId }) => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [viewMode, setViewMode] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const admissionList = useSelector(
    (state) => state?.course?.studentAdmissionsListData?.data?.data,
  );

  const createData = useSelector(
    (state) => state?.course?.createNewAdmissionData?.data?.data?.list,
  );
  const updateData = useSelector(
    (state) => state?.course?.updateAdmissionData?.data?.data?.list,
  );
  const coursesData = useSelector(
    (state) => state?.course?.coursesAllDocumentsData?.data?.data?.list,
  );
  const batchesData = useSelector(
    (state) => state?.course?.courseBatchesAllDocumentsData?.data?.data?.list,
  );
  const plansData = useSelector(
    (state) => state?.course?.coursePlansAllDocumentsData?.data?.data?.list,
  );
  const teachersData = useSelector(
    (state) => state?.employee?.teachersAllDocumentsData?.data?.data?.list,
  );

  useEffect(() => {
    fetchData();
    loadMasterData();
  }, [currentPage]);

  useEffect(() => {
    if (createData?.success || updateData?.success) {
      fetchData();
      setIsModalOpen(false);
      setEditingStudent(null);
      setViewMode(null);
    }
  }, [createData, updateData]);

  const fetchData = () => {
    dispatch(
      studentAdmissionsList({
        page: currentPage,
        size: itemsPerPage,
        query: JSON.stringify({ adminId }),
      }),
    );
  };

  const loadMasterData = () => {
    dispatch(coursesAllDocuments());
    dispatch(courseBatchesAllDocuments({ query: JSON.stringify({ adminId }) }));
    dispatch(coursePlansAllDocuments({ query: JSON.stringify({ adminId }) }));
    dispatch(teachersAllDocuments({ query: JSON.stringify({ adminId }) }));
  };

  const handleAddStudent = () => {
    setEditingStudent(null);
    setViewMode(null);
    setIsModalOpen(true);
  };

  const handleEditStudent = async (student) => {
    const result = await dispatch(studentAdmissionsView({ _id: student._id }));
    setEditingStudent(result?.payload?.data || student);
    setViewMode(null);
    setIsModalOpen(true);
  };

  const handleViewStudent = async (student) => {
    const result = await dispatch(studentAdmissionsView({ _id: student._id }));
    setEditingStudent(result?.payload?.data || student);
    setViewMode("view");
    setIsModalOpen(true);
  };

  const handleShowAdmissionForm = async (student) => {
    const result = await dispatch(studentAdmissionsView({ _id: student._id }));
    setEditingStudent(result?.payload?.data || student);
    setViewMode("admissionForm");
    setIsModalOpen(true);
  };

  const handleShowFees = async (student) => {
    const result = await dispatch(studentAdmissionsView({ _id: student._id }));
    setEditingStudent(result?.payload?.data || student);
    setViewMode("fees");
    setIsModalOpen(true);
  };

  const handleShowCertificate = async (student) => {
    const result = await dispatch(studentAdmissionsView({ _id: student._id }));
    setEditingStudent(result?.payload?.data || student);
    setViewMode("certificate");
    setIsModalOpen(true);
  };

  const handleSubmitStudent = async (studentData) => {
    const payload = {
      name: studentData.name,
      surname: studentData.surname,
      email: studentData.email,
      loginEmail: studentData.loginEmail,
      loginPassword: studentData.loginPassword,
      phoneNo: parseInt(studentData.mobile) || 0,
      aadharNo: studentData.aadharNo,
      address: studentData.address,
      addressProof: studentData.addressProof || "Electricity Bill",
      admissionSource: studentData.source,
      batch: studentData.batch,
      course: studentData.course,
      plan: studentData.plan,
      admissionSession: studentData.admissionSession,
      courseDuration: parseInt(studentData.courseDuration) || 1,
      category: studentData.category,
      religion: studentData.religion,
      qualification: studentData.educationQualification,
      bloodGroup: studentData.bloodGroup,
      fatherName: studentData.fatherHusbandName,
      motherName: studentData.mothersName,
      fatherOccupation: studentData.fathersOccupation,
      fatherPhoneNo: parseInt(studentData.fathersMobileNo) || 0,
      motherPhoneNo: parseInt(studentData.mothersMobileNo) || 0,
      dateOfBirth: studentData.dob,
      gender: studentData.gender,
      discountRate:
        studentData.discountRate === "Percent" ? "Percent" : "Fixed",
      discountAmount: parseInt(studentData.discountAmount) || 0,
      remarks: studentData.remarks,
      examType: "Online",
      referredBy: studentData.referralCode || "",
      admissionDate: studentData.admissionDate,
      incentive: parseInt(studentData.incentive) || 0,
      teacherid: studentData.staffName,
      installments:
        studentData.installments?.map((inst) => ({
          name: inst.name || `Installment ${inst.id}`,
          amount: parseInt(inst.amount) || 0,
          date: inst.date,
          paymentStatus: inst.paymentStatus || "Pending",
          receiptNumber: inst.receiptNumber || null,
          paymentmode: inst.mode || null,
          transctionId: inst.transactionId || null,
        })) || [],
    };

    if (editingStudent) {
      await dispatch(
        updateAdmission({ id: editingStudent._id, data: payload }),
      );
    } else {
      await dispatch(createNewAdmission(payload));
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  const tableHeaders = [
    "Student Name",
    "Referral Code",
    "Type",
    "Roll No.",
    "Course",
    "Admission Date",
    "Created At",
    "Actions",
  ];

  const printAdmissionForm = (student) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Admission Form - ${student.name} ${student.surname}</title>
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
            <div class="row"><div class="label">Student Name:</div><div class="value">${student.name} ${student.surname}</div></div>
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
          </div>
          <div class="signature">
            <div class="row"><div class="label">Student Signature:</div><div class="value">____________________</div></div>
            <div class="row"><div class="label">Principal Signature:</div><div class="value">____________________</div></div>
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
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Certificate - ${student.name} ${student.surname}</title>
          <style>
            body { font-family: 'Times New Roman', Times, serif; margin: 0; padding: 40px; background: #f8f9fa; min-height: 100vh; }
            .certificate-container { border: 20px solid #0ea5e9; border-radius: 15px; padding: 50px; background: white; box-shadow: 0 0 30px rgba(0,0,0,0.1); max-width: 800px; margin: 0 auto; }
            .certificate-header { text-align: center; margin-bottom: 40px; }
            .institute-name { font-size: 36px; color: #1e40af; font-weight: bold; margin-bottom: 10px; text-transform: uppercase; }
            .certificate-title { font-size: 28px; color: #dc2626; font-weight: bold; margin-bottom: 10px; text-decoration: underline; }
            .student-name { font-size: 32px; color: #1e40af; font-weight: bold; margin: 20px 0; text-decoration: underline; }
            .course-details { font-size: 20px; color: #334155; margin: 20px 0; }
            .certificate-footer { margin-top: 60px; display: flex; justify-content: space-between; }
            .signature-line { border-top: 2px solid #000; width: 200px; margin: 10px auto; padding-top: 10px; }
            .date { font-size: 16px; margin-top: 30px; text-align: center; color: #64748b; }
            @media print { body { padding: 0; } .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="certificate-container">
            <div class="certificate-header">
              <div class="institute-name">XYZ Institute of Technology</div>
              <div class="certificate-title">CERTIFICATE OF ADMISSION</div>
            </div>
            <div class="text-center mb-8">
              <p>This certifies that</p>
              <div class="student-name">${student.name} ${student.surname}</div>
              <p>has been admitted to our institute for the course</p>
              <div class="course-details"><strong>${student.course}</strong><br>Roll No: ${student.rollNo}<br>Session: ${student.admissionSession}</div>
            </div>
            <div class="date">Date of Admission: ${formatDate(student.admissionDate)}</div>
            <div class="certificate-footer">
              <div class="text-center"><div class="signature-line"></div><div>Principal</div></div>
              <div class="text-center"><div class="signature-line"></div><div>Director</div></div>
            </div>
          </div>
          <div class="no-print" style="text-align: center; margin-top: 20px;">
            <button onclick="window.print()">Print Certificate</button>
            <button onclick="window.close()">Close</button>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const totalPages = admissionList?.page || 1;

  return (
    <>
      <div className="mb-8 flex justify-between">
        <div>
          <h1 className="text-3xl font-bold">Student Admission List</h1>
          <p className="text-black mt-2">
            Manage student admissions and enrollment
          </p>
        </div>
        <div className="flex justify-end items-center mb-6">
          <button
            onClick={handleAddStudent}
            className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-8 rounded-lg transition duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <span>+</span> Add Student Admission
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <Table
          headers={tableHeaders}
          data={admissionList?.list || []}
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
          renderRow={(student) => (
            <tr key={student._id} className="hover:bg-sky-50">
              <td className="py-4 px-4 text-black capitalize">
                {student.name || "-"}
              </td>
              <td className="py-4 px-4 text-black font-mono text-sm uppercase">
                {student?.user?.referralCode || "-"}
              </td>
              <td className="py-4 px-4">
                <span
                  className={`text-sm font-medium ${student.type === "New-Admission" ? "text-green-700" : "text-blue-700"}`}
                >
                  {student.type || "-"}
                </span>
              </td>
              <td className="py-4 px-4 text-black">{student.rollNo || "-"}</td>
              <td className="py-4 px-4 text-black">
                {student.course?.courseName || student.course || "-"}
              </td>
              <td className="py-4 px-4 text-black">
                {student.admissionDate
                  ? formatDate(student.admissionDate)
                  : "-"}
              </td>
              <td className="py-4 px-4 text-black">
                {student.createdAt ? formatDate(student.createdAt) : "-"}
              </td>
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
                </div>
              </td>
            </tr>
          )}
        />
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
        coursesData={coursesData || []}
        batchesData={batchesData || []}
        plansData={plansData || []}
        teachersData={teachersData?.data || []}
        loading={createData?.loading || updateData?.loading}
      />
    </>
  );
};

export default Admission;



// /* eslint-disable react-hooks/exhaustive-deps */
// import React, { useEffect, useState } from "react";
// import Table from "../../components/Atoms/TableData/TableData";
// import StudentAdmissionModal from "../../components/Atoms/UI/StudentAdmissionModal";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   studentAdmissionsList,
//   createNewAdmission,
//   updateAdmission,
//   studentAdmissionsView,
//   coursesAllDocuments,
//   courseBatchesAllDocuments,
//   coursePlansAllDocuments,
// } from "../../redux/slices/course";
// import { teachersAllDocuments } from "../../redux/slices/employee";

// const Admission = ({ adminId }) => {
//   const dispatch = useDispatch();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingStudent, setEditingStudent] = useState(null);
//   const [viewMode, setViewMode] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   const admissionList = useSelector(
//     (state) => state?.course?.studentAdmissionsListData?.data?.data,
//   );

//   const createData = useSelector(
//     (state) => state?.course?.createNewAdmissionData?.data?.data?.list,
//   );
//   const updateData = useSelector(
//     (state) => state?.course?.updateAdmissionData?.data?.data?.list,
//   );
//   // const viewData = useSelector((state) => state?.course?.studentAdmissionsViewData?.data?.data?.list);
//   const coursesData = useSelector(
//     (state) => state?.course?.coursesAllDocumentsData?.data?.data?.list,
//   );
//   const batchesData = useSelector(
//     (state) => state?.course?.courseBatchesAllDocumentsData?.data?.data?.list,
//   );
//   console.log(batchesData,"batchesDatabatchesDatabatchesData")
//   const plansData = useSelector(
//     (state) => state?.plan?.coursePlansAllDocumentsData?.data?.data?.list,
//   );
//   const teachersData = useSelector(
//     (state) => state?.employee?.teachersAllDocumentsData?.data?.data?.list,
//   );
//   useEffect(() => {
//     fetchData();
//     loadMasterData();
//   }, [currentPage]);

//   useEffect(() => {
//     if (createData?.success || updateData?.success) {
//       fetchData();
//       setIsModalOpen(false);
//       setEditingStudent(null);
//       setViewMode(null);
//     }
//   }, [createData, updateData]);

//   const fetchData = () => {
//     dispatch(
//       studentAdmissionsList({
//         page: currentPage,
//         size: itemsPerPage,
//         query: JSON.stringify({ adminId }),
//       }),
//     );
//   };

//   const loadMasterData = () => {
//     dispatch(coursesAllDocuments());
//     dispatch(courseBatchesAllDocuments({ query: JSON.stringify({ adminId }) }));
//     dispatch(coursePlansAllDocuments({ query: JSON.stringify({ adminId }) }));
//     dispatch(teachersAllDocuments({ query: JSON.stringify({ adminId }) }));
//   };

//   const handleAddStudent = () => {
//     setEditingStudent(null);
//     setViewMode(null);
//     setIsModalOpen(true);
//   };

//   const handleEditStudent = async (student) => {
//     const result = await dispatch(studentAdmissionsView({ _id: student._id }));
//     setEditingStudent(result?.payload?.data || student);
//     setViewMode(null);
//     setIsModalOpen(true);
//   };

//   const handleViewStudent = async (student) => {
//     const result = await dispatch(studentAdmissionsView({ _id: student._id }));
//     setEditingStudent(result?.payload?.data || student);
//     setViewMode("view");
//     setIsModalOpen(true);
//   };

//   const handleShowAdmissionForm = async (student) => {
//     const result = await dispatch(studentAdmissionsView({ _id: student._id }));
//     setEditingStudent(result?.payload?.data || student);
//     setViewMode("admissionForm");
//     setIsModalOpen(true);
//   };

//   const handleShowFees = async (student) => {
//     const result = await dispatch(studentAdmissionsView({ _id: student._id }));
//     setEditingStudent(result?.payload?.data || student);
//     setViewMode("fees");
//     setIsModalOpen(true);
//   };

//   const handleShowCertificate = async (student) => {
//     const result = await dispatch(studentAdmissionsView({ _id: student._id }));
//     setEditingStudent(result?.payload?.data || student);
//     setViewMode("certificate");
//     setIsModalOpen(true);
//   };

//   const handleSubmitStudent = async (studentData) => {
//     const payload = {
//       name: studentData.name,
//       surname: studentData.surname,
//       email: studentData.email,
//       loginEmail: studentData.loginEmail,
//       loginPassword: studentData.loginPassword,
//       phoneNo: parseInt(studentData.mobile) || 0,
//       aadharNo: studentData.aadharNo,
//       address: studentData.address,
//       addressProof: studentData.addressProof || "Electricity Bill",
//       admissionSource: studentData.source,
//       batch: studentData.batch,
//       course: studentData.course,
//       plan: studentData.plan,
//       admissionSession: studentData.admissionSession,
//       courseDuration: parseInt(studentData.courseDuration) || 1,
//       category: studentData.category,
//       religion: studentData.religion,
//       qualification: studentData.educationQualification,
//       bloodGroup: studentData.bloodGroup,
//       fatherName: studentData.fatherHusbandName,
//       motherName: studentData.mothersName,
//       fatherOccupation: studentData.fathersOccupation,
//       fatherPhoneNo: parseInt(studentData.fathersMobileNo) || 0,
//       motherPhoneNo: parseInt(studentData.mothersMobileNo) || 0,
//       dateOfBirth: studentData.dob,
//       gender: studentData.gender,
//       discountRate:
//         studentData.discountRate === "Percent" ? "Percent" : "Fixed",
//       discountAmount: parseInt(studentData.discountAmount) || 0,
//       remarks: studentData.remarks,
//       examType: "Online",
//       referredBy: studentData.referralCode || "",
//       admissionDate: studentData.admissionDate,
//       incentive: parseInt(studentData.incentive) || 0,
//       teacherid: studentData.staffName,
//       installments:
//         studentData.installments?.map((inst) => ({
//           name: inst.name || `Installment ${inst.id}`,
//           amount: parseInt(inst.amount) || 0,
//           date: inst.date,
//           paymentStatus: inst.paymentStatus || "Pending",
//           receiptNumber: inst.receiptNumber || null,
//           paymentmode: inst.mode || null,
//           transctionId: inst.transactionId || null,
//         })) || [],
//     };

//     if (editingStudent) {
//       await dispatch(
//         updateAdmission({ id: editingStudent._id, data: payload }),
//       );
//     } else {
//       await dispatch(createNewAdmission(payload));
//     }
//   };

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-GB");
//   };

//   const tableHeaders = [
//     "Student Name",
//     "Referral Code",
//     "Type",
//     "Roll No.",
//     "Course",
//     "Admission Date",
//     "Created At",
//     "Actions",
//   ];

//   const printAdmissionForm = (student) => {
//     const printWindow = window.open("", "_blank");
//     printWindow.document.write(`
//       <html>
//         <head>
//           <title>Admission Form - ${student.name} ${student.surname}</title>
//           <style>
//             body { font-family: Arial, sans-serif; margin: 20px; }
//             .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
//             .header h1 { color: #0369a1; }
//             .info-section { margin-bottom: 30px; }
//             .info-section h2 { color: #0369a1; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
//             .row { display: flex; margin-bottom: 10px; }
//             .label { font-weight: bold; width: 200px; }
//             .value { flex: 1; }
//             .signature { margin-top: 100px; border-top: 1px solid #000; padding-top: 10px; }
//             @media print { .no-print { display: none; } }
//           </style>
//         </head>
//         <body>
//           <div class="header">
//             <h1>XYZ INSTITUTE OF TECHNOLOGY</h1>
//             <h2>STUDENT ADMISSION FORM</h2>
//           </div>
//           <div class="info-section">
//             <h2>Personal Information</h2>
//             <div class="row"><div class="label">Student Name:</div><div class="value">${student.name} ${student.surname}</div></div>
//             <div class="row"><div class="label">Father/Husband Name:</div><div class="value">${student.fatherHusbandName}</div></div>
//             <div class="row"><div class="label">Mother's Name:</div><div class="value">${student.mothersName}</div></div>
//             <div class="row"><div class="label">Date of Birth:</div><div class="value">${formatDate(student.dob)}</div></div>
//             <div class="row"><div class="label">Gender:</div><div class="value">${student.gender}</div></div>
//             <div class="row"><div class="label">Aadhar No:</div><div class="value">${student.aadharNo}</div></div>
//           </div>
//           <div class="info-section">
//             <h2>Contact Information</h2>
//             <div class="row"><div class="label">Mobile:</div><div class="value">${student.mobile}</div></div>
//             <div class="row"><div class="label">Email:</div><div class="value">${student.email}</div></div>
//             <div class="row"><div class="label">Address:</div><div class="value">${student.address}</div></div>
//           </div>
//           <div class="info-section">
//             <h2>Course Information</h2>
//             <div class="row"><div class="label">Course:</div><div class="value">${student.course}</div></div>
//             <div class="row"><div class="label">Roll No:</div><div class="value">${student.rollNo}</div></div>
//             <div class="row"><div class="label">Admission Date:</div><div class="value">${formatDate(student.admissionDate)}</div></div>
//             <div class="row"><div class="label">Admission Session:</div><div class="value">${student.admissionSession}</div></div>
//           </div>
//           <div class="signature">
//             <div class="row"><div class="label">Student Signature:</div><div class="value">____________________</div></div>
//             <div class="row"><div class="label">Principal Signature:</div><div class="value">____________________</div></div>
//           </div>
//           <div class="no-print" style="margin-top: 20px;">
//             <button onclick="window.print()">Print Form</button>
//             <button onclick="window.close()">Close</button>
//           </div>
//         </body>
//       </html>
//     `);
//     printWindow.document.close();
//   };

//   const printCertificate = (student) => {
//     const printWindow = window.open("", "_blank");
//     printWindow.document.write(`
//       <html>
//         <head>
//           <title>Certificate - ${student.name} ${student.surname}</title>
//           <style>
//             body { font-family: 'Times New Roman', Times, serif; margin: 0; padding: 40px; background: #f8f9fa; min-height: 100vh; }
//             .certificate-container { border: 20px solid #0ea5e9; border-radius: 15px; padding: 50px; background: white; box-shadow: 0 0 30px rgba(0,0,0,0.1); max-width: 800px; margin: 0 auto; }
//             .certificate-header { text-align: center; margin-bottom: 40px; }
//             .institute-name { font-size: 36px; color: #1e40af; font-weight: bold; margin-bottom: 10px; text-transform: uppercase; }
//             .certificate-title { font-size: 28px; color: #dc2626; font-weight: bold; margin-bottom: 10px; text-decoration: underline; }
//             .student-name { font-size: 32px; color: #1e40af; font-weight: bold; margin: 20px 0; text-decoration: underline; }
//             .course-details { font-size: 20px; color: #334155; margin: 20px 0; }
//             .certificate-footer { margin-top: 60px; display: flex; justify-content: space-between; }
//             .signature-line { border-top: 2px solid #000; width: 200px; margin: 10px auto; padding-top: 10px; }
//             .date { font-size: 16px; margin-top: 30px; text-align: center; color: #64748b; }
//             @media print { body { padding: 0; } .no-print { display: none; } }
//           </style>
//         </head>
//         <body>
//           <div class="certificate-container">
//             <div class="certificate-header">
//               <div class="institute-name">XYZ Institute of Technology</div>
//               <div class="certificate-title">CERTIFICATE OF ADMISSION</div>
//             </div>
//             <div class="text-center mb-8">
//               <p>This certifies that</p>
//               <div class="student-name">${student.name} ${student.surname}</div>
//               <p>has been admitted to our institute for the course</p>
//               <div class="course-details"><strong>${student.course}</strong><br>Roll No: ${student.rollNo}<br>Session: ${student.admissionSession}</div>
//             </div>
//             <div class="date">Date of Admission: ${formatDate(student.admissionDate)}</div>
//             <div class="certificate-footer">
//               <div class="text-center"><div class="signature-line"></div><div>Principal</div></div>
//               <div class="text-center"><div class="signature-line"></div><div>Director</div></div>
//             </div>
//           </div>
//           <div class="no-print" style="text-align: center; margin-top: 20px;">
//             <button onclick="window.print()">Print Certificate</button>
//             <button onclick="window.close()">Close</button>
//           </div>
//         </body>
//       </html>
//     `);
//     printWindow.document.close();
//   };

//   const totalPages = admissionList?.page || 1;

//   return (
//     <>
//       <div className="mb-8 flex justify-between">
//         <div>
//           <h1 className="text-3xl font-bold">Student Admission List</h1>
//           <p className="text-black mt-2">
//             Manage student admissions and enrollment
//           </p>
//         </div>
//         <div className="flex justify-end items-center mb-6">
//           <button
//             onClick={handleAddStudent}
//             className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-8 rounded-lg transition duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
//           >
//             <span>+</span> Add Student Admission
//           </button>
//         </div>
//       </div>

//       <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
//         <Table
//           headers={tableHeaders}
//           data={admissionList?.list || []}
//           currentPage={currentPage}
//           totalPages={totalPages}
//           handlePageChange={handlePageChange}
//           renderRow={(student) => (
//             <tr key={student._id} className="hover:bg-sky-50">
//               <td className="py-4 px-4 text-black capitalize">
//                 {student.name || "-"}
//               </td>
//               <td className="py-4 px-4 text-black font-mono text-sm uppercase">
//                 {student?.user?.referralCode || "-"}
//               </td>
//               <td className="py-4 px-4">
//                 <span
//                   className={`text-sm font-medium ${student.type === "New-Admission" ? "text-green-700" : "text-blue-700"}`}
//                 >
//                   {student.type || "-"}
//                 </span>
//               </td>
//               <td className="py-4 px-4 text-black">{student.rollNo || "-"}</td>
//               <td className="py-4 px-4 text-black">
//                 {student.course?.courseName || student.course || "-"}
//               </td>
//               <td className="py-4 px-4 text-black">
//                 {student.admissionDate
//                   ? formatDate(student.admissionDate)
//                   : "-"}
//               </td>
//               <td className="py-4 px-4 text-black">
//                 {student.createdAt ? formatDate(student.createdAt) : "-"}
//               </td>
//               <td className="py-4 px-4">
//                 <div className="flex space-x-3">
//                   <button
//                     onClick={() => handleViewStudent(student)}
//                     className="text-sky-500 hover:text-sky-700 p-1 hover:bg-sky-50 rounded"
//                     title="View Details"
//                   >
//                     👁️
//                   </button>
//                   <button
//                     onClick={() => handleEditStudent(student)}
//                     className="text-yellow-500 hover:text-yellow-700 p-1 hover:bg-yellow-50 rounded"
//                     title="Edit"
//                   >
//                     ✏️
//                   </button>
//                   <button
//                     onClick={() => handleShowAdmissionForm(student)}
//                     className="text-purple-500 hover:text-purple-700 p-1 hover:bg-purple-50 rounded"
//                     title="Admission Form"
//                   >
//                     📄
//                   </button>
//                   <button
//                     onClick={() => handleShowFees(student)}
//                     className="text-green-500 hover:text-green-700 p-1 hover:bg-green-50 rounded"
//                     title="Admission Fees"
//                   >
//                     💰
//                   </button>
//                   <button
//                     onClick={() => handleShowCertificate(student)}
//                     className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded"
//                     title="Certificate"
//                   >
//                     🏆
//                   </button>
//                 </div>
//               </td>
//             </tr>
//           )}
//         />
//       </div>

//       <StudentAdmissionModal
//         isOpen={isModalOpen}
//         onClose={() => {
//           setIsModalOpen(false);
//           setEditingStudent(null);
//           setViewMode(null);
//         }}
//         onSubmit={handleSubmitStudent}
//         initialData={editingStudent}
//         viewMode={viewMode}
//         onPrintAdmissionForm={printAdmissionForm}
//         onPrintCertificate={printCertificate}
//         coursesData={coursesData || []}
//         batchesData={batchesData || []}
//         plansData={plansData?.data || []}
//         teachersData={teachersData?.data || []}
//         loading={createData?.loading || updateData?.loading}
//       />
//     </>
//   );
// };

// export default Admission;
