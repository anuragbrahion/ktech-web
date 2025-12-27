// components/Atoms/UI/StudentAdmissionModal.jsx
import React, { useState, useEffect } from 'react';

const StudentAdmissionModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData = null, 
  viewMode = null,
  onPrintAdmissionForm,
  onPrintCertificate
}) => {
  const [formData, setFormData] = useState({
    // Personal Information
    profilePhoto: null,
    name: initialData?.studentName || '',
    surname: initialData?.surname || '',
    fatherHusbandName: initialData?.fatherHusbandName || '',
    mothersName: initialData?.mothersName || '',
    dob: initialData?.dob || '',
    aadharNo: initialData?.aadharNo || '',
    gender: initialData?.gender || '',
    category: initialData?.category || '',
    religion: initialData?.religion || '',
    
    // Contact Information
    mobile: initialData?.mobile || '',
    email: initialData?.email || '',
    educationQualification: initialData?.educationQualification || '',
    bloodGroup: initialData?.bloodGroup || '',
    admissionDate: initialData?.admissionDate || '',
    admissionSession: initialData?.admissionSession || '',
    address: initialData?.address || '',
    referralCode: initialData?.referralCode || '',
    
    // Family Information
    fathersMobileNo: initialData?.fathersMobileNo || '',
    fathersOccupation: initialData?.fathersOccupation || '',
    mothersMobileNo: initialData?.mothersMobileNo || '',
    
    // Account Information
    loginEmail: initialData?.loginEmail || '',
    loginPassword: initialData?.loginPassword || '',
    
    // Signature
    signature: null,
    
    // Course Information
    source: initialData?.source || '',
    batch: initialData?.batch || '',
    course: initialData?.course || '',
    plan: initialData?.plan || '',
    incentive: initialData?.incentive || '',
    staffName: initialData?.staffName || '',
    courseFees: initialData?.courseFees || '',
    discountRate: initialData?.discountRate || '',
    discountAmount: initialData?.discountAmount || '',
    totalFees: initialData?.totalFees || '',
    feesReceived: initialData?.feesReceived || '',
    balance: initialData?.balance || '',
    remarks: initialData?.remarks || '',
    
    // Installments
    installments: initialData?.installments || [],
    
    // Additional fields
    type: initialData?.type || 'New-Admission',
    rollNo: initialData?.rollNo || '',
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
  });

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        profilePhoto: null,
        name: initialData.studentName || '',
        surname: initialData.surname || '',
        fatherHusbandName: initialData.fatherHusbandName || '',
        mothersName: initialData.mothersName || '',
        dob: initialData.dob || '',
        aadharNo: initialData.aadharNo || '',
        gender: initialData.gender || '',
        category: initialData.category || '',
        religion: initialData.religion || '',
        mobile: initialData.mobile || '',
        email: initialData.email || '',
        educationQualification: initialData.educationQualification || '',
        bloodGroup: initialData.bloodGroup || '',
        admissionDate: initialData.admissionDate || '',
        admissionSession: initialData.admissionSession || '',
        address: initialData.address || '',
        referralCode: initialData.referralCode || '',
        fathersMobileNo: initialData.fathersMobileNo || '',
        fathersOccupation: initialData.fathersOccupation || '',
        mothersMobileNo: initialData.mothersMobileNo || '',
        loginEmail: initialData.loginEmail || '',
        loginPassword: initialData.loginPassword || '',
        signature: null,
        source: initialData.source || '',
        batch: initialData.batch || '',
        course: initialData.course || '',
        plan: initialData.plan || '',
        incentive: initialData.incentive || '',
        staffName: initialData.staffName || '',
        courseFees: initialData.courseFees || '',
        discountRate: initialData.discountRate || '',
        discountAmount: initialData.discountAmount || '',
        totalFees: initialData.totalFees || '',
        feesReceived: initialData.feesReceived || '',
        balance: initialData.balance || '',
        remarks: initialData.remarks || '',
        installments: initialData.installments || [],
        type: initialData.type || 'New-Admission',
        rollNo: initialData.rollNo || '',
        startDate: initialData.startDate || '',
        endDate: initialData.endDate || '',
      });
    }
  }, [initialData]);

  const courses = [
    'ms office',
    'Tally accounting',
    'Photoshop',
    'CorelDraw',
    'HTML',
    'c language',
    'C++'
  ];

  const genders = ['Male', 'Female', 'Other'];
  const categories = ['General', 'OBC', 'SC', 'ST', 'Other'];
  const religions = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Other'];
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const educationQualifications = [
    '10th Pass',
    '12th Pass',
    'Graduate',
    'Post Graduate',
    'Diploma',
    'Other'
  ];
  const plans = ['Monthly', 'Quarterly', 'Half Yearly', 'Yearly', 'One Time'];
  const sources = ['Online', 'Referral', 'Walk-in', 'Advertisement', 'Social Media'];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prepare data for submission
    const submissionData = {
      ...formData,
      studentName: formData.name,
    };
    
    onSubmit(submissionData);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-calculate discount and balance
    if (name === 'courseFees' || name === 'discountRate') {
      calculateDiscountAmount();
    }
    if (name === 'totalFees' || name === 'feesReceived') {
      calculateBalance();
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    }
  };

  const calculateDiscountAmount = () => {
    const fees = parseFloat(formData.courseFees) || 0;
    const rate = parseFloat(formData.discountRate) || 0;
    const discount = (fees * rate) / 100;
    const total = fees - discount;
    
    setFormData(prev => ({
      ...prev,
      discountAmount: discount.toFixed(2),
      totalFees: total.toFixed(2),
      balance: (total - (parseFloat(prev.feesReceived) || 0)).toFixed(2)
    }));
  };

  const calculateBalance = () => {
    const total = parseFloat(formData.totalFees) || 0;
    const received = parseFloat(formData.feesReceived) || 0;
    const balance = total - received;
    setFormData(prev => ({
      ...prev,
      balance: balance.toFixed(2)
    }));
  };

  const addInstallment = () => {
    const newInstallment = {
      id: Date.now(),
      amount: '',
      date: '',
      mode: ''
    };
    setFormData(prev => ({
      ...prev,
      installments: [...prev.installments, newInstallment]
    }));
  };


  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  const getModalTitle = () => {
    if (viewMode === 'view') return 'View Student Details';
    if (viewMode === 'admissionForm') return 'Admission Form';
    if (viewMode === 'fees') return 'Admission Fees';
    if (viewMode === 'certificate') return 'Certificate';
    return initialData ? 'Edit Student Admission' : 'Add Student Admission';
  };

  const renderFeesView = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Fee Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Course Fees:</p>
            <p className="text-xl font-bold text-black">₹{formData.courseFees || '0'}</p>
          </div>
          <div>
            <p className="text-gray-600">Discount ({formData.discountRate || '0'}%):</p>
            <p className="text-xl font-bold text-red-600">-₹{formData.discountAmount || '0'}</p>
          </div>
          <div>
            <p className="text-gray-600">Total Fees:</p>
            <p className="text-xl font-bold text-green-600">₹{formData.totalFees || '0'}</p>
          </div>
          <div>
            <p className="text-gray-600">Fees Received:</p>
            <p className="text-xl font-bold text-blue-600">₹{formData.feesReceived || '0'}</p>
          </div>
          <div className="col-span-2">
            <p className="text-gray-600">Balance Amount:</p>
            <p className={`text-2xl font-bold ${parseFloat(formData.balance) > 0 ? 'text-red-600' : 'text-green-600'}`}>
              ₹{formData.balance || '0'}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Installments</h3>
        {formData.installments && formData.installments.length > 0 ? (
          <div className="space-y-3">
            {formData.installments.map((installment, index) => (
              <div key={installment.id} className="bg-white border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">Installment {index + 1}</p>
                    <p className="text-sm text-gray-600">Date: {formatDate(installment.date)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">₹{installment.amount}</p>
                    <p className="text-sm text-gray-600">Mode: {installment.mode}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No installments recorded</p>
        )}
      </div>

      <div className="flex justify-between items-center pt-6">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
        >
          Close
        </button>
        <button
          type="button"
          onClick={() => onPrintAdmissionForm && onPrintAdmissionForm({...formData, studentName: formData.name})}
          className="px-6 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
        >
          Print Fee Receipt
        </button>
      </div>
    </div>
  );

  const renderCertificateView = () => (
    <div className="space-y-6 p-4">
      <div className="border-4 border-blue-500 rounded-xl p-8 bg-gradient-to-b from-blue-50 to-white">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-blue-800 mb-2">XYZ INSTITUTE OF TECHNOLOGY</h2>
          <h3 className="text-2xl font-bold text-red-600 mb-2">CERTIFICATE OF ADMISSION</h3>
          <p className="text-gray-600">This is to certify that</p>
        </div>

        <div className="text-center my-8">
          <div className="text-4xl font-bold text-blue-900 mb-2">{formData.name} {formData.surname}</div>
          <p className="text-lg text-gray-700">son/daughter of</p>
          <div className="text-xl font-semibold text-gray-800 mt-2">{formData.fatherHusbandName}</div>
        </div>

        <div className="text-center my-8">
          <p className="text-lg text-gray-700">has been admitted to our institute for the course</p>
          <div className="text-2xl font-bold text-green-700 my-4">{formData.course}</div>
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <div className="text-right">Roll No:</div>
            <div className="text-left font-bold">{formData.rollNo || 'N/A'}</div>
            <div className="text-right">Session:</div>
            <div className="text-left font-bold">{formData.admissionSession || 'N/A'}</div>
            <div className="text-right">Admission Date:</div>
            <div className="text-left font-bold">{formatDate(formData.admissionDate)}</div>
          </div>
        </div>

        <div className="flex justify-between mt-16 pt-8 border-t-2 border-gray-400">
          <div className="text-center">
            <div className="border-t-2 border-gray-400 w-48 mt-12"></div>
            <p className="mt-2">Principal</p>
            <p className="text-sm text-gray-600">XYZ Institute of Technology</p>
          </div>
          <div className="text-center">
            <div className="border-t-2 border-gray-400 w-48 mt-12"></div>
            <p className="mt-2">Director</p>
            <p className="text-sm text-gray-600">XYZ Institute of Technology</p>
          </div>
        </div>

        <div className="text-center mt-8 text-gray-500 text-sm">
          Official Seal: <span className="font-mono">XYZ-IT-2025-{(formData.rollNo || '').slice(-4)}</span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
        >
          Close
        </button>
        <div className="space-x-3">
          <button
            type="button"
            onClick={() => onPrintCertificate && onPrintCertificate({...formData, studentName: formData.name})}
            className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Print Certificate
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Print Preview
          </button>
        </div>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className={`bg-white rounded-lg shadow-xl max-h-[90vh] overflow-hidden overflow-y-auto p-4 ${viewMode === 'certificate' ? 'w-full max-w-3xl' : 'w-full max-w-4xl'} my-8`}>
        <div className={`${viewMode === 'certificate' ? 'bg-red-500' : 'bg-sky-500'} text-white p-4 rounded-t-lg`}>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">{getModalTitle()}</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>
        </div>
        
        {viewMode === 'fees' ? (
          renderFeesView()
        ) : viewMode === 'certificate' ? (
          renderCertificateView()
        ) : (
          <form onSubmit={handleSubmit} className="p-6">
            {/* View mode: display only */}
            {viewMode === 'view' || viewMode === 'admissionForm' ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-600">Full Name</p>
                    <p className="text-lg font-semibold">{formData.name} {formData.surname}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Roll Number</p>
                    <p className="text-lg font-semibold">{formData.rollNo || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Course</p>
                    <p className="text-lg font-semibold">{formData.course || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Admission Date</p>
                    <p className="text-lg font-semibold">{formatDate(formData.admissionDate)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Mobile</p>
                    <p className="text-lg font-semibold">{formData.mobile || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Email</p>
                    <p className="text-lg font-semibold">{formData.email || 'N/A'}</p>
                  </div>
                </div>

                {viewMode === 'admissionForm' && (
                  <div className="mt-8 pt-6 border-t">
                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                      >
                        Close
                      </button>
                      <button
                        type="button"
                        onClick={() => onPrintAdmissionForm && onPrintAdmissionForm({...formData, studentName: formData.name})}
                        className="px-6 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
                      >
                        Print Admission Form
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Edit/Create mode: editable form */
              <>
                 <div className="space-y-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Personal Information</h3>
            
            <div className="grid grid-cols-2 gap-6">
              {/* Left Column - Profile Photo */}
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <p className="text-gray-600 mb-2">Add a profile photo</p>
                  <p className="text-sm text-gray-500 mb-4">PNG, JPG up to 5MB</p>
                  <input
                    type="file"
                    name="profilePhoto"
                    onChange={handleFileChange}
                    accept=".png,.jpg,.jpeg"
                    className="hidden"
                    id="profilePhoto"
                  />
                  <label htmlFor="profilePhoto" className="cursor-pointer block">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center">
                        {formData.profilePhoto ? (
                          <img 
                            src={URL.createObjectURL(formData.profilePhoto)} 
                            alt="Profile" 
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-400">No Image</span>
                        )}
                      </div>
                      <button
                        type="button"
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                        onClick={() => document.getElementById('profilePhoto').click()}
                      >
                        Upload Image
                      </button>
                    </div>
                  </label>
                  <div className="flex items-center justify-center space-x-4 mt-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={true}
                        readOnly
                        className="rounded"
                      />
                      <span className="text-sm">Use Camera</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="rounded"
                      />
                      <span className="text-sm">Upload Image</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Column - Personal Details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Father / Husband's Name *</label>
                  <input
                    type="text"
                    name="fatherHusbandName"
                    value={formData.fatherHusbandName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Surname *</label>
                  <input
                    type="text"
                    name="surname"
                    value={formData.surname}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Mother's Name *</label>
                  <input
                    type="text"
                    name="mothersName"
                    value={formData.mothersName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">D.O.B. *</label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Aadhar No.</label>
                    <input
                      type="text"
                      name="aadharNo"
                      value={formData.aadharNo}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                      maxLength="12"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Gender *</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                      required
                    >
                      <option value="">Select...</option>
                      {genders.map((gender, index) => (
                        <option key={index} value={gender}>{gender}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                    >
                      <option value="">Select...</option>
                      {categories.map((category, index) => (
                        <option key={index} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Religion</label>
                    <select
                      name="religion"
                      value={formData.religion}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                    >
                      <option value="">Select...</option>
                      {religions.map((religion, index) => (
                        <option key={index} value={religion}>{religion}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact & Education Information */}
          <div className="space-y-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Contact & Education</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Mobile *</label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Education Qualification</label>
                <select
                  name="educationQualification"
                  value={formData.educationQualification}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="">Select...</option>
                  {educationQualifications.map((qual, index) => (
                    <option key={index} value={qual}>{qual}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Blood Group</label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="">Select...</option>
                  {bloodGroups.map((group, index) => (
                    <option key={index} value={group}>{group}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Admission Date *</label>
                <input
                  type="date"
                  name="admissionDate"
                  value={formData.admissionDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Admission Session *</label>
                <input
                  type="text"
                  name="admissionSession"
                  value={formData.admissionSession}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                  placeholder="e.g., 2024-2025"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Address *</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Referral Code</label>
                <input
                  type="text"
                  name="referralCode"
                  value={formData.referralCode}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Total Fee</label>
                <input
                  type="number"
                  name="totalFees"
                  value={formData.totalFees}
                  onChange={handleChange}
                  onBlur={calculateBalance}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Family Information */}
          <div className="space-y-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Family Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Father's Mobile No *</label>
                <input
                  type="tel"
                  name="fathersMobileNo"
                  value={formData.fathersMobileNo}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Father's Occupation</label>
                <input
                  type="text"
                  name="fathersOccupation"
                  value={formData.fathersOccupation}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Mother's Mobile No.</label>
              <input
                type="tel"
                name="mothersMobileNo"
                value={formData.mothersMobileNo}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Account Information */}
          <div className="space-y-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Account Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Login Email *</label>
                <input
                  type="email"
                  name="loginEmail"
                  value={formData.loginEmail}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Login Password *</label>
                <input
                  type="password"
                  name="loginPassword"
                  value={formData.loginPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>
            </div>

            {/* Signature Section */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <p className="text-gray-600 mb-2">Signature</p>
              <p className="text-sm text-gray-500 mb-4">PNG, JPG up to 5MB</p>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="rounded"
                  />
                  <span className="text-sm">Use Camera for signature</span>
                </label>
                <input
                  type="file"
                  name="signature"
                  onChange={handleFileChange}
                  accept=".png,.jpg,.jpeg"
                  className="hidden"
                  id="signature"
                />
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                  onClick={() => document.getElementById('signature').click()}
                >
                  Upload Signature
                </button>
              </div>
            </div>
          </div>

          {/* Course Information */}
          <div className="space-y-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Course Information</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Source</label>
                <select
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="">Select...</option>
                  {sources.map((source, index) => (
                    <option key={index} value={source}>{source}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Select Course</label>
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="">Select...</option>
                  {courses.map((course, index) => (
                    <option key={index} value={course}>{course}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Select Batch</label>
                <select
                  name="batch"
                  value={formData.batch}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="">Select...</option>
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Plan *</label>
              <select
                name="plan"
                value={formData.plan}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              >
                <option value="">Select Plan for student</option>
                {plans.map((plan, index) => (
                  <option key={index} value={plan}>{plan}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Incentive</label>
                <input
                  type="text"
                  name="incentive"
                  value={formData.incentive}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Select Staff Name</label>
                <select
                  name="staffName"
                  value={formData.staffName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="">--No Select Staff--</option>
                  <option value="staff1">Staff 1</option>
                  <option value="staff2">Staff 2</option>
                  <option value="staff3">Staff 3</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Course Fees</label>
                <input
                  type="number"
                  name="courseFees"
                  value={formData.courseFees}
                  onChange={handleChange}
                  onBlur={calculateDiscountAmount}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Discount Rate (%)</label>
                <input
                  type="number"
                  name="discountRate"
                  value={formData.discountRate}
                  onChange={handleChange}
                  onBlur={calculateDiscountAmount}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  max="100"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Discount Amount</label>
                <input
                  type="number"
                  name="discountAmount"
                  value={formData.discountAmount}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Total Fees</label>
                <input
                  type="number"
                  name="totalFees"
                  value={formData.totalFees}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Fees Received</label>
                <input
                  type="number"
                  name="feesReceived"
                  value={formData.feesReceived}
                  onChange={handleChange}
                  onBlur={calculateBalance}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Balance</label>
                <input
                  type="number"
                  name="balance"
                  value={formData.balance}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Remarks</label>
                <select
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="">Select</option>
                  <option value="good">Good</option>
                  <option value="average">Average</option>
                  <option value="excellent">Excellent</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-md font-medium text-gray-700">Installments</h4>
                <button
                  type="button"
                  onClick={addInstallment}
                  className="px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600"
                >
                  Add Installment
                </button>
              </div>
              
              {formData.installments.map((installment, index) => (
                <div key={installment.id} className="grid grid-cols-4 gap-4 p-4 border rounded-md">
                  <input
                    type="number"
                    placeholder="Amount"
                    value={installment.amount}
                    onChange={(e) => {
                      const newInstallments = [...formData.installments];
                      newInstallments[index].amount = e.target.value;
                      setFormData(prev => ({ ...prev, installments: newInstallments }));
                    }}
                    className="px-3 py-2 border rounded-md"
                  />
                  <input
                    type="date"
                    value={installment.date}
                    onChange={(e) => {
                      const newInstallments = [...formData.installments];
                      newInstallments[index].date = e.target.value;
                      setFormData(prev => ({ ...prev, installments: newInstallments }));
                    }}
                    className="px-3 py-2 border rounded-md"
                  />
                  <select
                    value={installment.mode}
                    onChange={(e) => {
                      const newInstallments = [...formData.installments];
                      newInstallments[index].mode = e.target.value;
                      setFormData(prev => ({ ...prev, installments: newInstallments }));
                    }}
                    className="px-3 py-2 border rounded-md"
                  >
                    <option value="">Mode</option>
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="online">Online</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      const newInstallments = formData.installments.filter((_, i) => i !== index);
                      setFormData(prev => ({ ...prev, installments: newInstallments }));
                    }}
                    className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
                
                <div className="flex justify-end space-x-3 mt-8 pt-6 border-t">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600"
                  >
                    {initialData ? 'Update Admission' : 'Create Admission'}
                  </button>
                </div>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default StudentAdmissionModal;