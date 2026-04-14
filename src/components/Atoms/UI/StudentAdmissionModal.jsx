import React, { useState, useEffect, useMemo } from 'react';

const StudentAdmissionModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  viewMode = null,
  onPrintAdmissionForm,
  onPrintCertificate,
  coursesData = [],
  batchesData = [],
  plansData = [],
  teachersData = [],
  loading = false
}) => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    fatherHusbandName: '',
    mothersName: '',
    dob: '',
    aadharNo: '',
    gender: '',
    category: '',
    religion: '',
    mobile: '',
    email: '',
    educationQualification: '',
    bloodGroup: '',
    admissionDate: '',
    admissionSession: '',
    address: '',
    referralCode: '',
    fathersMobileNo: '',
    fathersOccupation: '',
    mothersMobileNo: '',
    loginEmail: '',
    loginPassword: '',
    source: '',
    batch: '',
    course: '',
    plan: '',
    incentive: '',
    staffName: '',
    courseFees: '',
    discountRate: '',
    discountAmount: '',
    totalFees: '',
    feesReceived: '',
    balance: '',
    remarks: '',
    installments: [],
    type: 'New-Admission',
    rollNo: '',
    courseDuration: 1,
    addressProof: 'Electricity Bill',
    examType: 'Online'
  });

  const [calculationFields, setCalculationFields] = useState({
    courseFees: '',
    feesReceived: '',
    totalFees: '',
    balance: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || initialData.studentName || '',
        surname: initialData.surname || '',
        fatherHusbandName: initialData.fatherName || initialData.fatherHusbandName || '',
        mothersName: initialData.motherName || initialData.mothersName || '',
        dob: initialData.dateOfBirth || initialData.dob || '',
        aadharNo: initialData.aadharNo || '',
        gender: initialData.gender || '',
        category: initialData.category || '',
        religion: initialData.religion || '',
        mobile: initialData.phoneNo || initialData.mobile || '',
        email: initialData.email || '',
        educationQualification: initialData.qualification || initialData.educationQualification || '',
        bloodGroup: initialData.bloodGroup || '',
        admissionDate: initialData.admissionDate || '',
        admissionSession: initialData.admissionSession || '',
        address: initialData.address || '',
        referralCode: initialData.referredBy || initialData.referralCode || '',
        fathersMobileNo: initialData.fatherPhoneNo || initialData.fathersMobileNo || '',
        fathersOccupation: initialData.fatherOccupation || initialData.fathersOccupation || '',
        mothersMobileNo: initialData.motherPhoneNo || initialData.mothersMobileNo || '',
        loginEmail: initialData.loginEmail || '',
        loginPassword: initialData.loginPassword || '',
        source: initialData.admissionSource || initialData.source || '',
        batch: initialData.batch || '',
        course: initialData.course || '',
        plan: initialData.plan || '',
        incentive: initialData.incentive || '',
        staffName: initialData.teacherid || initialData.staffName || '',
        courseFees: initialData.courseFees || '',
        discountRate: initialData.discountRate === 'Percent' ? 'Percent' : initialData.discountRate || '',
        discountAmount: initialData.discountAmount || '',
        totalFees: initialData.totalFees || '',
        feesReceived: initialData.feesReceived || '',
        balance: initialData.balance || '',
        remarks: initialData.remarks || '',
        installments: initialData.installments?.map((inst, idx) => ({
          id: idx + 1,
          name: inst.name || `Installment ${idx + 1}`,
          amount: inst.amount || '',
          date: inst.date || '',
          mode: inst.paymentmode || inst.mode || '',
          paymentStatus: inst.paymentStatus || 'Pending'
        })) || [],
        type: initialData.type || 'New-Admission',
        rollNo: initialData.rollNo || '',
        courseDuration: initialData.courseDuration || 1,
        addressProof: initialData.addressProof || 'Electricity Bill',
        examType: initialData.examType || 'Online'
      });

      setCalculationFields({
        courseFees: initialData.courseFees || '',
        feesReceived: initialData.feesReceived || '',
        totalFees: initialData.totalFees || '',
        balance: initialData.balance || '',
      });
    }
  }, [initialData]);

  const genders = ['Male', 'Female', 'Other'];
  const categories = ['General', 'OBC', 'SC', 'ST', 'Other'];
  const religions = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Other'];
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const educationQualifications = ['10th Pass', '12th Pass', 'Graduate', 'Post Graduate', 'Diploma', 'Other'];
  const sources = ['Online', 'Referral', 'Walk-in', 'Advertisement', 'Social Media'];

  // Filter courses based on selected batch
  const applicableCourses = useMemo(() => {
    if (formData.batch && Array.isArray(batchesData) && batchesData.length > 0) {
      const batch = batchesData.find((b) => b._id === formData.batch);
      if (batch && batch.courses && Array.isArray(batch.courses)) {
        return coursesData.filter((c) => batch.courses.includes(c._id));
      }
    }
    return [];
  }, [formData.batch, batchesData, coursesData]);

  // Filter plans based on selected course
  const applicablePlans = useMemo(() => {
    if (formData.course && Array.isArray(plansData) && plansData.length > 0) {
      return plansData.filter((plan) => plan.course?.includes(formData.course));
    }
    return [];
  }, [formData.course, plansData]);

  // Auto-fill plan details when plan is selected
  useEffect(() => {
    if (formData.plan && applicablePlans.length > 0) {
      const selectedPlan = applicablePlans.find(plan => plan._id === formData.plan);
      if (selectedPlan && selectedPlan.amount) {
        handleCalculationChange({
          target: { name: 'courseFees', value: selectedPlan.amount }
        });
      }
    }
  }, [formData.plan, applicablePlans]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Reset dependent fields when batch or course changes
    if (name === 'batch') {
      setFormData(prev => ({ ...prev, batch: value, course: '', plan: '' }));
      setCalculationFields(prev => ({ ...prev, courseFees: '', totalFees: '', balance: '' }));
    } else if (name === 'course') {
      setFormData(prev => ({ ...prev, course: value, plan: '' }));
      setCalculationFields(prev => ({ ...prev, courseFees: '', totalFees: '', balance: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCalculationChange = (e) => {
    const { name, value } = e.target;
    setCalculationFields(prev => {
      const updated = { ...prev, [name]: value };

      if (name === 'courseFees' || name === 'discountAmount' || name === 'feesReceived') {
        const fees = parseFloat(updated.courseFees) || 0;
        const discountAmount = parseFloat(formData.discountAmount) || 0;
        const discountValue = formData.discountRate === 'Percent' 
          ? (fees * discountAmount) / 100 
          : discountAmount;

        const totalFees = fees - discountValue;
        const feesReceived = parseFloat(updated.feesReceived) || 0;
        const balance = totalFees - feesReceived;

        updated.totalFees = totalFees.toFixed(2);
        updated.balance = balance.toFixed(2);
      }

      return updated;
    });
  };

  const addInstallment = () => {
    const newInstallment = {
      id: Date.now(),
      name: `Installment ${formData.installments.length + 1}`,
      amount: '',
      date: '',
      mode: '',
      paymentStatus: 'Pending'
    };
    setFormData(prev => ({ ...prev, installments: [...prev.installments, newInstallment] }));
  };

  const updateInstallment = (index, field, value) => {
    const updated = [...formData.installments];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, installments: updated }));
  };

  const removeInstallment = (index) => {
    const updated = formData.installments.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, installments: updated }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  const getModalTitle = () => {
    if (viewMode === 'view') return 'View Student Details';
    if (viewMode === 'admissionForm') return 'Admission Form';
    if (viewMode === 'fees') return 'Admission Fees';
    if (viewMode === 'certificate') return 'Certificate';
    return initialData ? 'Edit Student Admission' : 'Add Student Admission';
  };

  const renderFeesView = () => (
    <div className="space-y-6 p-2">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Fee Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div><p className="text-gray-600">Course Fees:</p><p className="text-xl font-bold text-black">₹{calculationFields.courseFees || formData.courseFees || '0'}</p></div>
          <div><p className="text-gray-600">Discount ({formData.discountRate}):</p><p className="text-xl font-bold text-red-600">-₹{formData.discountAmount || '0'}</p></div>
          <div><p className="text-gray-600">Total Fees:</p><p className="text-xl font-bold text-green-600">₹{calculationFields.totalFees || formData.totalFees || '0'}</p></div>
          <div><p className="text-gray-600">Fees Received:</p><p className="text-xl font-bold text-blue-600">₹{calculationFields.feesReceived || formData.feesReceived || '0'}</p></div>
          <div className="col-span-2"><p className="text-gray-600">Balance:</p><p className={`text-2xl font-bold ${parseFloat(calculationFields.balance || formData.balance || 0) > 0 ? 'text-red-600' : 'text-green-600'}`}>₹{calculationFields.balance || formData.balance || '0'}</p></div>
        </div>
      </div>
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Installments</h3>
        {formData.installments?.length > 0 ? (
          <div className="space-y-3">
            {formData.installments.map((inst, idx) => (
              <div key={idx} className="bg-white border rounded-lg p-4">
                <div className="flex justify-between">
                  <div><p className="font-semibold">{inst.name}</p><p className="text-sm text-gray-600">Date: {formatDate(inst.date)}</p></div>
                  <div className="text-right"><p className="text-lg font-bold text-green-600">₹{inst.amount}</p><p className="text-sm text-gray-600">Mode: {inst.mode}</p></div>
                </div>
              </div>
            ))}
          </div>
        ) : <p className="text-gray-500 text-center py-4">No installments recorded</p>}
      </div>
      <div className="flex justify-between pt-6">
        <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">Close</button>
        <button type="button" onClick={() => onPrintAdmissionForm(formData)} className="px-6 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600">Print Fee Receipt</button>
      </div>
    </div>
  );

  const renderCertificateView = () => (
    <div className="space-y-6 p-4">
      <div className="border-4 border-sky-500 rounded-xl p-8 bg-gradient-to-b from-sky-50 to-white">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-sky-800 mb-2">XYZ INSTITUTE OF TECHNOLOGY</h2>
          <h3 className="text-2xl font-bold text-red-600 mb-2">CERTIFICATE OF ADMISSION</h3>
        </div>
        <div className="text-center my-8">
          <div className="text-4xl font-bold text-sky-900 mb-2">{formData.name} {formData.surname}</div>
          <p className="text-lg text-gray-700">son/daughter of {formData.fatherHusbandName}</p>
          <p className="text-lg text-gray-700 mt-4">has been admitted for the course</p>
          <div className="text-2xl font-bold text-green-700 my-4">{formData.course}</div>
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mt-4">
            <div className="text-right">Roll No:</div><div className="text-left font-bold">{formData.rollNo || 'N/A'}</div>
            <div className="text-right">Session:</div><div className="text-left font-bold">{formData.admissionSession || 'N/A'}</div>
            <div className="text-right">Admission Date:</div><div className="text-left font-bold">{formatDate(formData.admissionDate)}</div>
          </div>
        </div>
        <div className="flex justify-between mt-16 pt-8 border-t-2 border-gray-400">
          <div className="text-center"><div className="border-t-2 border-gray-400 w-48 mt-12"></div><p className="mt-2">Principal</p></div>
          <div className="text-center"><div className="border-t-2 border-gray-400 w-48 mt-12"></div><p className="mt-2">Director</p></div>
        </div>
      </div>
      <div className="flex justify-between">
        <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">Close</button>
        <div className="space-x-3">
          <button type="button" onClick={() => onPrintCertificate(formData)} className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">Print Certificate</button>
        </div>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className={`bg-white rounded-lg shadow-xl max-h-[90vh] overflow-hidden overflow-y-auto ${viewMode === 'certificate' ? 'w-full max-w-3xl' : 'w-full max-w-4xl'} my-8`}>
        <div className="bg-sky-500 text-white p-4 rounded-t-lg sticky top-0">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">{getModalTitle()}</h2>
            <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl">×</button>
          </div>
        </div>

        {viewMode === 'fees' ? renderFeesView() : viewMode === 'certificate' ? renderCertificateView() : (
          <form onSubmit={handleSubmit} className="p-6">
            {viewMode === 'view' || viewMode === 'admissionForm' ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div><p className="text-gray-600">Full Name</p><p className="text-lg font-semibold">{formData.name} {formData.surname}</p></div>
                  <div><p className="text-gray-600">Roll Number</p><p className="text-lg font-semibold">{formData.rollNo || 'N/A'}</p></div>
                  <div><p className="text-gray-600">Course</p><p className="text-lg font-semibold">{formData.course || 'N/A'}</p></div>
                  <div><p className="text-gray-600">Admission Date</p><p className="text-lg font-semibold">{formatDate(formData.admissionDate)}</p></div>
                  <div><p className="text-gray-600">Mobile</p><p className="text-lg font-semibold">{formData.mobile || 'N/A'}</p></div>
                  <div><p className="text-gray-600">Email</p><p className="text-lg font-semibold">{formData.email || 'N/A'}</p></div>
                </div>
                {viewMode === 'admissionForm' && (
                  <div className="mt-8 pt-6 border-t flex justify-between">
                    <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">Close</button>
                    <button type="button" onClick={() => onPrintAdmissionForm(formData)} className="px-6 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600">Print Admission Form</button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="space-y-6 mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 mb-2">Name *</label>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" required />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Surname *</label>
                      <input type="text" name="surname" value={formData.surname} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" required />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Father/Husband Name *</label>
                      <input type="text" name="fatherHusbandName" value={formData.fatherHusbandName} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" required />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Mother's Name *</label>
                      <input type="text" name="mothersName" value={formData.mothersName} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" required />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">D.O.B. *</label>
                      <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" required />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Aadhar No.</label>
                      <input type="text" name="aadharNo" value={formData.aadharNo} onChange={handleChange} maxLength="12" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Gender *</label>
                      <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" required>
                        <option value="">Select...</option>
                        {genders.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Category</label>
                      <select name="category" value={formData.category} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500">
                        <option value="">Select...</option>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Religion</label>
                      <select name="religion" value={formData.religion} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500">
                        <option value="">Select...</option>
                        {religions.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Contact & Education</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2">Mobile *</label>
                      <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" required />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Email</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Education Qualification</label>
                      <select name="educationQualification" value={formData.educationQualification} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500">
                        <option value="">Select...</option>
                        {educationQualifications.map(e => <option key={e} value={e}>{e}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Blood Group</label>
                      <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500">
                        <option value="">Select...</option>
                        {bloodGroups.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Admission Date *</label>
                      <input type="date" name="admissionDate" value={formData.admissionDate} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" required />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Admission Session *</label>
                      <input type="text" name="admissionSession" value={formData.admissionSession} onChange={handleChange} placeholder="e.g., 2026" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" required />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-gray-700 mb-2">Address *</label>
                      <textarea name="address" value={formData.address} onChange={handleChange} rows="3" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" required></textarea>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Family Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2">Father's Mobile No *</label>
                      <input type="tel" name="fathersMobileNo" value={formData.fathersMobileNo} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" required />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Father's Occupation</label>
                      <input type="text" name="fathersOccupation" value={formData.fathersOccupation} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Mother's Mobile No.</label>
                      <input type="tel" name="mothersMobileNo" value={formData.mothersMobileNo} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" />
                    </div>
                  </div>
                </div>

                <div className="space-y-6 mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Account Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2">Login Email *</label>
                      <input type="email" name="loginEmail" value={formData.loginEmail} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" required />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Login Password *</label>
                      <input type="password" name="loginPassword" value={formData.loginPassword} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" required />
                    </div>
                  </div>
                </div>

                <div className="space-y-6 mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Course Information</h3>
                  
                  {/* Batch Selection - First */}
                  <div>
                    <label className="block text-gray-700 mb-2">Batch *</label>
                    <select name="batch" value={formData.batch} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" required>
                      <option value="">Select Batch</option>
                      {batchesData.map(b => <option key={b._id} value={b._id}>{b.name || `${b.startTime}-${b.endTime}`}</option>)}
                    </select>
                  </div>

                  {/* Course Selection - Depends on Batch */}
                  <div>
                    <label className="block text-gray-700 mb-2">Course *</label>
                    <select name="course" value={formData.course} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" disabled={!formData.batch} required>
                      <option value="">{formData.batch ? "Select Course" : "Select Batch First"}</option>
                      {applicableCourses.map(c => <option key={c._id} value={c._id}>{c.courseName}</option>)}
                    </select>
                  </div>

                  {/* Plan Selection - Depends on Course */}
                  <div>
                    <label className="block text-gray-700 mb-2">Plan *</label>
                    <select name="plan" value={formData.plan} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" disabled={!formData.course} required>
                      <option value="">{formData.course ? "Select Plan" : "Select Course First"}</option>
                      {applicablePlans.map(p => <option key={p._id} value={p._id}>{p.name} - ₹{p.amount}</option>)}
                    </select>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2">Source</label>
                      <select name="source" value={formData.source} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500">
                        <option value="">Select...</option>
                        {sources.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Course Duration (years)</label>
                      <input type="number" name="courseDuration" value={formData.courseDuration} onChange={handleChange} min="1" className="w-full px-3 py-2 border rounded-md" />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Incentive</label>
                      <input type="number" name="incentive" value={formData.incentive} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Staff Name</label>
                    <select name="staffName" value={formData.staffName} onChange={handleChange} className="w-full px-3 py-2 border rounded-md">
                      <option value="">Select Staff</option>
                      {teachersData.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                    </select>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2">Course Fees</label>
                      <input type="number" name="courseFees" value={calculationFields.courseFees} onChange={handleCalculationChange} className="w-full px-3 py-2 border rounded-md bg-gray-50" readOnly />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Discount Rate</label>
                      <select name="discountRate" value={formData.discountRate} onChange={handleChange} className="w-full px-3 py-2 border rounded-md">
                        <option value="">Select</option>
                        <option value="Percent">Percent</option>
                        <option value="Fixed">Fixed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Discount Amount</label>
                      <input type="number" name="discountAmount" value={formData.discountAmount} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Fees Received</label>
                      <input type="number" name="feesReceived" value={calculationFields.feesReceived} onChange={handleCalculationChange} className="w-full px-3 py-2 border rounded-md" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2">Total Fees</label>
                      <input type="text" value={calculationFields.totalFees} readOnly className="w-full px-3 py-2 border rounded-md bg-gray-50 font-semibold" />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Balance</label>
                      <input type="text" value={calculationFields.balance} readOnly className={`w-full px-3 py-2 border rounded-md bg-gray-50 font-semibold ${parseFloat(calculationFields.balance) > 0 ? 'text-red-600' : 'text-green-600'}`} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2">Remarks</label>
                      <select name="remarks" value={formData.remarks} onChange={handleChange} className="w-full px-3 py-2 border rounded-md">
                        <option value="">Select</option>
                        <option value="Referred by existing student">Referred by existing student</option>
                        <option value="Walk-in">Walk-in</option>
                        <option value="Online">Online</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Referral Code</label>
                      <input type="text" name="referralCode" value={formData.referralCode} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-md font-medium text-gray-700">Installments</h4>
                      <button type="button" onClick={addInstallment} className="px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600">Add Installment</button>
                    </div>
                    {formData.installments.map((inst, idx) => (
                      <div key={inst.id} className="grid grid-cols-5 gap-4 p-4 border rounded-md">
                        <input type="text" placeholder="Name" value={inst.name} onChange={(e) => updateInstallment(idx, 'name', e.target.value)} className="px-3 py-2 border rounded-md" />
                        <input type="number" placeholder="Amount" value={inst.amount} onChange={(e) => updateInstallment(idx, 'amount', e.target.value)} className="px-3 py-2 border rounded-md" />
                        <input type="date" value={inst.date} onChange={(e) => updateInstallment(idx, 'date', e.target.value)} className="px-3 py-2 border rounded-md" />
                        <select value={inst.mode} onChange={(e) => updateInstallment(idx, 'mode', e.target.value)} className="px-3 py-2 border rounded-md">
                          <option value="">Mode</option>
                          <option value="Cash">Cash</option>
                          <option value="Card">Card</option>
                          <option value="Online">Online</option>
                        </select>
                        <button type="button" onClick={() => removeInstallment(idx)} className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">Remove</button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-8 pt-6 border-t">
                  <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">Cancel</button>
                  <button type="submit" disabled={loading} className="px-6 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 disabled:bg-gray-400 disabled:cursor-not-allowed">
                    {loading ? 'Processing...' : (initialData ? 'Update Admission' : 'Create Admission')}
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


// import React, { useState, useEffect } from 'react';

// const StudentAdmissionModal = ({
//   isOpen,
//   onClose,
//   onSubmit,
//   initialData = null,
//   viewMode = null,
//   onPrintAdmissionForm,
//   onPrintCertificate,
//   coursesData = [],
//   batchesData = [],
//   plansData = [],
//   teachersData = [],
//   loading = false
// }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     surname: '',
//     fatherHusbandName: '',
//     mothersName: '',
//     dob: '',
//     aadharNo: '',
//     gender: '',
//     category: '',
//     religion: '',
//     mobile: '',
//     email: '',
//     educationQualification: '',
//     bloodGroup: '',
//     admissionDate: '',
//     admissionSession: '',
//     address: '',
//     referralCode: '',
//     fathersMobileNo: '',
//     fathersOccupation: '',
//     mothersMobileNo: '',
//     loginEmail: '',
//     loginPassword: '',
//     source: '',
//     batch: '',
//     course: '',
//     plan: '',
//     incentive: '',
//     staffName: '',
//     courseFees: '',
//     discountRate: '',
//     discountAmount: '',
//     totalFees: '',
//     feesReceived: '',
//     balance: '',
//     remarks: '',
//     installments: [],
//     type: 'New-Admission',
//     rollNo: '',
//     courseDuration: 1,
//     addressProof: 'Electricity Bill',
//     examType: 'Online'
//   });

//   useEffect(() => {
//     if (initialData) {
//       setFormData({
//         name: initialData.name || initialData.studentName || '',
//         surname: initialData.surname || '',
//         fatherHusbandName: initialData.fatherName || initialData.fatherHusbandName || '',
//         mothersName: initialData.motherName || initialData.mothersName || '',
//         dob: initialData.dateOfBirth || initialData.dob || '',
//         aadharNo: initialData.aadharNo || '',
//         gender: initialData.gender || '',
//         category: initialData.category || '',
//         religion: initialData.religion || '',
//         mobile: initialData.phoneNo || initialData.mobile || '',
//         email: initialData.email || '',
//         educationQualification: initialData.qualification || initialData.educationQualification || '',
//         bloodGroup: initialData.bloodGroup || '',
//         admissionDate: initialData.admissionDate || '',
//         admissionSession: initialData.admissionSession || '',
//         address: initialData.address || '',
//         referralCode: initialData.referredBy || initialData.referralCode || '',
//         fathersMobileNo: initialData.fatherPhoneNo || initialData.fathersMobileNo || '',
//         fathersOccupation: initialData.fatherOccupation || initialData.fathersOccupation || '',
//         mothersMobileNo: initialData.motherPhoneNo || initialData.mothersMobileNo || '',
//         loginEmail: initialData.loginEmail || '',
//         loginPassword: initialData.loginPassword || '',
//         source: initialData.admissionSource || initialData.source || '',
//         batch: initialData.batch || '',
//         course: initialData.course || '',
//         plan: initialData.plan || '',
//         incentive: initialData.incentive || '',
//         staffName: initialData.teacherid || initialData.staffName || '',
//         courseFees: initialData.courseFees || '',
//         discountRate: initialData.discountRate === 'Percent' ? 'Percent' : initialData.discountRate || '',
//         discountAmount: initialData.discountAmount || '',
//         totalFees: initialData.totalFees || '',
//         feesReceived: initialData.feesReceived || '',
//         balance: initialData.balance || '',
//         remarks: initialData.remarks || '',
//         installments: initialData.installments?.map((inst, idx) => ({
//           id: idx + 1,
//           name: inst.name || `Installment ${idx + 1}`,
//           amount: inst.amount || '',
//           date: inst.date || '',
//           mode: inst.paymentmode || inst.mode || '',
//           paymentStatus: inst.paymentStatus || 'Pending'
//         })) || [],
//         type: initialData.type || 'New-Admission',
//         rollNo: initialData.rollNo || '',
//         courseDuration: initialData.courseDuration || 1,
//         addressProof: initialData.addressProof || 'Electricity Bill',
//         examType: initialData.examType || 'Online'
//       });
//     }
//   }, [initialData]);

//   const genders = ['Male', 'Female', 'Other'];
//   const categories = ['General', 'OBC', 'SC', 'ST', 'Other'];
//   const religions = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Other'];
//   const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
//   const educationQualifications = ['10th Pass', '12th Pass', 'Graduate', 'Post Graduate', 'Diploma', 'Other'];
//   const sources = ['Online', 'Referral', 'Walk-in', 'Advertisement', 'Social Media'];

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit(formData);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const addInstallment = () => {
//     const newInstallment = {
//       id: Date.now(),
//       name: `Installment ${formData.installments.length + 1}`,
//       amount: '',
//       date: '',
//       mode: '',
//       paymentStatus: 'Pending'
//     };
//     setFormData(prev => ({ ...prev, installments: [...prev.installments, newInstallment] }));
//   };

//   const updateInstallment = (index, field, value) => {
//     const updated = [...formData.installments];
//     updated[index][field] = value;
//     setFormData(prev => ({ ...prev, installments: updated }));
//   };

//   const removeInstallment = (index) => {
//     const updated = formData.installments.filter((_, i) => i !== index);
//     setFormData(prev => ({ ...prev, installments: updated }));
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleDateString('en-GB');
//   };

//   const getModalTitle = () => {
//     if (viewMode === 'view') return 'View Student Details';
//     if (viewMode === 'admissionForm') return 'Admission Form';
//     if (viewMode === 'fees') return 'Admission Fees';
//     if (viewMode === 'certificate') return 'Certificate';
//     return initialData ? 'Edit Student Admission' : 'Add Student Admission';
//   };

//   const renderFeesView = () => (
//     <div className="space-y-6 p-2">
//       <div className="bg-gray-50 p-4 rounded-lg">
//         <h3 className="text-lg font-semibold text-gray-800 mb-4">Fee Summary</h3>
//         <div className="grid grid-cols-2 gap-4">
//           <div><p className="text-gray-600">Course Fees:</p><p className="text-xl font-bold text-black">₹{formData.courseFees || '0'}</p></div>
//           <div><p className="text-gray-600">Discount ({formData.discountRate}):</p><p className="text-xl font-bold text-red-600">-₹{formData.discountAmount || '0'}</p></div>
//           <div><p className="text-gray-600">Total Fees:</p><p className="text-xl font-bold text-green-600">₹{formData.totalFees || '0'}</p></div>
//           <div><p className="text-gray-600">Fees Received:</p><p className="text-xl font-bold text-blue-600">₹{formData.feesReceived || '0'}</p></div>
//           <div className="col-span-2"><p className="text-gray-600">Balance:</p><p className={`text-2xl font-bold ${parseFloat(formData.balance) > 0 ? 'text-red-600' : 'text-green-600'}`}>₹{formData.balance || '0'}</p></div>
//         </div>
//       </div>
//       <div className="border-t pt-6">
//         <h3 className="text-lg font-semibold text-gray-800 mb-4">Installments</h3>
//         {formData.installments?.length > 0 ? (
//           <div className="space-y-3">
//             {formData.installments.map((inst, idx) => (
//               <div key={inst.id} className="bg-white border rounded-lg p-4">
//                 <div className="flex justify-between">
//                   <div><p className="font-semibold">{inst.name}</p><p className="text-sm text-gray-600">Date: {formatDate(inst.date)}</p></div>
//                   <div className="text-right"><p className="text-lg font-bold text-green-600">₹{inst.amount}</p><p className="text-sm text-gray-600">Mode: {inst.mode}</p></div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : <p className="text-gray-500 text-center py-4">No installments recorded</p>}
//       </div>
//       <div className="flex justify-between pt-6">
//         <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">Close</button>
//         <button type="button" onClick={() => onPrintAdmissionForm(formData)} className="px-6 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600">Print Fee Receipt</button>
//       </div>
//     </div>
//   );

//   const renderCertificateView = () => (
//     <div className="space-y-6 p-4">
//       <div className="border-4 border-sky-500 rounded-xl p-8 bg-gradient-to-b from-sky-50 to-white">
//         <div className="text-center mb-8">
//           <h2 className="text-3xl font-bold text-sky-800 mb-2">XYZ INSTITUTE OF TECHNOLOGY</h2>
//           <h3 className="text-2xl font-bold text-red-600 mb-2">CERTIFICATE OF ADMISSION</h3>
//         </div>
//         <div className="text-center my-8">
//           <div className="text-4xl font-bold text-sky-900 mb-2">{formData.name} {formData.surname}</div>
//           <p className="text-lg text-gray-700">son/daughter of {formData.fatherHusbandName}</p>
//           <p className="text-lg text-gray-700 mt-4">has been admitted for the course</p>
//           <div className="text-2xl font-bold text-green-700 my-4">{formData.course}</div>
//           <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mt-4">
//             <div className="text-right">Roll No:</div><div className="text-left font-bold">{formData.rollNo || 'N/A'}</div>
//             <div className="text-right">Session:</div><div className="text-left font-bold">{formData.admissionSession || 'N/A'}</div>
//             <div className="text-right">Admission Date:</div><div className="text-left font-bold">{formatDate(formData.admissionDate)}</div>
//           </div>
//         </div>
//         <div className="flex justify-between mt-16 pt-8 border-t-2 border-gray-400">
//           <div className="text-center"><div className="border-t-2 border-gray-400 w-48 mt-12"></div><p className="mt-2">Principal</p></div>
//           <div className="text-center"><div className="border-t-2 border-gray-400 w-48 mt-12"></div><p className="mt-2">Director</p></div>
//         </div>
//       </div>
//       <div className="flex justify-between">
//         <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">Close</button>
//         <div className="space-x-3">
//           <button type="button" onClick={() => onPrintCertificate(formData)} className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">Print Certificate</button>
//         </div>
//       </div>
//     </div>
//   );

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
//       <div className={`bg-white rounded-lg shadow-xl max-h-[90vh] overflow-hidden overflow-y-auto ${viewMode === 'certificate' ? 'w-full max-w-3xl' : 'w-full max-w-4xl'} my-8`}>
//         <div className="bg-sky-500 text-white p-4 rounded-t-lg sticky top-0">
//           <div className="flex justify-between items-center">
//             <h2 className="text-xl font-semibold">{getModalTitle()}</h2>
//             <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl">×</button>
//           </div>
//         </div>

//         {viewMode === 'fees' ? renderFeesView() : viewMode === 'certificate' ? renderCertificateView() : (
//           <form onSubmit={handleSubmit} className="p-6">
//             {viewMode === 'view' || viewMode === 'admissionForm' ? (
//               <div className="space-y-6">
//                 <div className="grid grid-cols-2 gap-6">
//                   <div><p className="text-gray-600">Full Name</p><p className="text-lg font-semibold">{formData.name} {formData.surname}</p></div>
//                   <div><p className="text-gray-600">Roll Number</p><p className="text-lg font-semibold">{formData.rollNo || 'N/A'}</p></div>
//                   <div><p className="text-gray-600">Course</p><p className="text-lg font-semibold">{formData.course || 'N/A'}</p></div>
//                   <div><p className="text-gray-600">Admission Date</p><p className="text-lg font-semibold">{formatDate(formData.admissionDate)}</p></div>
//                   <div><p className="text-gray-600">Mobile</p><p className="text-lg font-semibold">{formData.mobile || 'N/A'}</p></div>
//                   <div><p className="text-gray-600">Email</p><p className="text-lg font-semibold">{formData.email || 'N/A'}</p></div>
//                 </div>
//                 {viewMode === 'admissionForm' && (
//                   <div className="mt-8 pt-6 border-t flex justify-between">
//                     <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">Close</button>
//                     <button type="button" onClick={() => onPrintAdmissionForm(formData)} className="px-6 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600">Print Admission Form</button>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <>
//                 <div className="space-y-6 mb-8">
//                   <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Personal Information</h3>
//                   <div className="grid grid-cols-2 gap-6">
//                     <div>
//                       <label className="block text-gray-700 mb-2">Name *</label>
//                       <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" required />
//                     </div>
//                     <div>
//                       <label className="block text-gray-700 mb-2">Surname *</label>
//                       <input type="text" name="surname" value={formData.surname} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" required />
//                     </div>
//                     <div>
//                       <label className="block text-gray-700 mb-2">Father/Husband Name *</label>
//                       <input type="text" name="fatherHusbandName" value={formData.fatherHusbandName} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" required />
//                     </div>
//                     <div>
//                       <label className="block text-gray-700 mb-2">Mother's Name *</label>
//                       <input type="text" name="mothersName" value={formData.mothersName} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" required />
//                     </div>
//                     <div>
//                       <label className="block text-gray-700 mb-2">D.O.B. *</label>
//                       <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" required />
//                     </div>
//                     <div>
//                       <label className="block text-gray-700 mb-2">Aadhar No.</label>
//                       <input type="text" name="aadharNo" value={formData.aadharNo} onChange={handleChange} maxLength="12" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" />
//                     </div>
//                     <div>
//                       <label className="block text-gray-700 mb-2">Gender *</label>
//                       <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" required>
//                         <option value="">Select...</option>
//                         {genders.map(g => <option key={g} value={g}>{g}</option>)}
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block text-gray-700 mb-2">Category</label>
//                       <select name="category" value={formData.category} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500">
//                         <option value="">Select...</option>
//                         {categories.map(c => <option key={c} value={c}>{c}</option>)}
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block text-gray-700 mb-2">Religion</label>
//                       <select name="religion" value={formData.religion} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500">
//                         <option value="">Select...</option>
//                         {religions.map(r => <option key={r} value={r}>{r}</option>)}
//                       </select>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="space-y-6 mb-8">
//                   <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Contact & Education</h3>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-gray-700 mb-2">Mobile *</label>
//                       <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" required />
//                     </div>
//                     <div>
//                       <label className="block text-gray-700 mb-2">Email</label>
//                       <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" />
//                     </div>
//                     <div>
//                       <label className="block text-gray-700 mb-2">Education Qualification</label>
//                       <select name="educationQualification" value={formData.educationQualification} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500">
//                         <option value="">Select...</option>
//                         {educationQualifications.map(e => <option key={e} value={e}>{e}</option>)}
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block text-gray-700 mb-2">Blood Group</label>
//                       <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500">
//                         <option value="">Select...</option>
//                         {bloodGroups.map(b => <option key={b} value={b}>{b}</option>)}
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block text-gray-700 mb-2">Admission Date *</label>
//                       <input type="date" name="admissionDate" value={formData.admissionDate} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" required />
//                     </div>
//                     <div>
//                       <label className="block text-gray-700 mb-2">Admission Session *</label>
//                       <input type="text" name="admissionSession" value={formData.admissionSession} onChange={handleChange} placeholder="e.g., 2026" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" required />
//                     </div>
//                     <div className="col-span-2">
//                       <label className="block text-gray-700 mb-2">Address *</label>
//                       <textarea name="address" value={formData.address} onChange={handleChange} rows="3" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" required></textarea>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="space-y-6 mb-8">
//                   <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Family Information</h3>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-gray-700 mb-2">Father's Mobile No *</label>
//                       <input type="tel" name="fathersMobileNo" value={formData.fathersMobileNo} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" required />
//                     </div>
//                     <div>
//                       <label className="block text-gray-700 mb-2">Father's Occupation</label>
//                       <input type="text" name="fathersOccupation" value={formData.fathersOccupation} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" />
//                     </div>
//                     <div>
//                       <label className="block text-gray-700 mb-2">Mother's Mobile No.</label>
//                       <input type="tel" name="mothersMobileNo" value={formData.mothersMobileNo} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" />
//                     </div>
//                   </div>
//                 </div>

//                 <div className="space-y-6 mb-8">
//                   <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Account Information</h3>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-gray-700 mb-2">Login Email *</label>
//                       <input type="email" name="loginEmail" value={formData.loginEmail} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" required />
//                     </div>
//                     <div>
//                       <label className="block text-gray-700 mb-2">Login Password *</label>
//                       <input type="password" name="loginPassword" value={formData.loginPassword} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" required />
//                     </div>
//                   </div>
//                 </div>

//                 <div className="space-y-6 mb-8">
//                   <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Course Information</h3>
//                   <div className="grid grid-cols-3 gap-4">
//                     <div>
//                       <label className="block text-gray-700 mb-2">Source</label>
//                       <select name="source" value={formData.source} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500">
//                         <option value="">Select...</option>
//                         {sources.map(s => <option key={s} value={s}>{s}</option>)}
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block text-gray-700 mb-2">Course *</label>
//                       <select name="course" value={formData.course} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" required>
//                         <option value="">Select...</option>
//                         {coursesData.map(c => <option key={c._id} value={c._id}>{c.courseName}</option>)}
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block text-gray-700 mb-2">Batch *</label>
//                       <select name="batch" value={formData.batch} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" required>
//                         <option value="">Select...</option>
//                         {batchesData.map(b => <option key={b._id} value={b._id}>{b.startTime}-{b.endTime}</option>)}
//                       </select>
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-gray-700 mb-2">Plan *</label>
//                     <select name="plan" value={formData.plan} onChange={handleChange} className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" required>
//                       <option value="">Select Plan</option>
//                       {plansData.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
//                     </select>
//                   </div>

//                   <div className="grid grid-cols-3 gap-4">
//                     <div>
//                       <label className="block text-gray-700 mb-2">Course Duration (years)</label>
//                       <input type="number" name="courseDuration" value={formData.courseDuration} onChange={handleChange} min="1" className="w-full px-3 py-2 border rounded-md" />
//                     </div>
//                     <div>
//                       <label className="block text-gray-700 mb-2">Incentive</label>
//                       <input type="number" name="incentive" value={formData.incentive} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" />
//                     </div>
//                     <div>
//                       <label className="block text-gray-700 mb-2">Staff Name</label>
//                       <select name="staffName" value={formData.staffName} onChange={handleChange} className="w-full px-3 py-2 border rounded-md">
//                         <option value="">Select Staff</option>
//                         {teachersData.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
//                       </select>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-4 gap-4">
//                     <div>
//                       <label className="block text-gray-700 mb-2">Course Fees</label>
//                       <input type="number" name="courseFees" value={formData.courseFees} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" />
//                     </div>
//                     <div>
//                       <label className="block text-gray-700 mb-2">Discount Rate</label>
//                       <select name="discountRate" value={formData.discountRate} onChange={handleChange} className="w-full px-3 py-2 border rounded-md">
//                         <option value="">Select</option>
//                         <option value="Percent">Percent</option>
//                         <option value="Fixed">Fixed</option>
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block text-gray-700 mb-2">Discount Amount</label>
//                       <input type="number" name="discountAmount" value={formData.discountAmount} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" />
//                     </div>
//                     <div>
//                       <label className="block text-gray-700 mb-2">Fees Received</label>
//                       <input type="number" name="feesReceived" value={formData.feesReceived} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" />
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-gray-700 mb-2">Remarks</label>
//                       <select name="remarks" value={formData.remarks} onChange={handleChange} className="w-full px-3 py-2 border rounded-md">
//                         <option value="">Select</option>
//                         <option value="Referred by existing student">Referred by existing student</option>
//                         <option value="Walk-in">Walk-in</option>
//                         <option value="Online">Online</option>
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block text-gray-700 mb-2">Referral Code</label>
//                       <input type="text" name="referralCode" value={formData.referralCode} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" />
//                     </div>
//                   </div>

//                   <div className="space-y-4">
//                     <div className="flex justify-between items-center">
//                       <h4 className="text-md font-medium text-gray-700">Installments</h4>
//                       <button type="button" onClick={addInstallment} className="px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600">Add Installment</button>
//                     </div>
//                     {formData.installments.map((inst, idx) => (
//                       <div key={inst.id} className="grid grid-cols-5 gap-4 p-4 border rounded-md">
//                         <input type="text" placeholder="Name" value={inst.name} onChange={(e) => updateInstallment(idx, 'name', e.target.value)} className="px-3 py-2 border rounded-md" />
//                         <input type="number" placeholder="Amount" value={inst.amount} onChange={(e) => updateInstallment(idx, 'amount', e.target.value)} className="px-3 py-2 border rounded-md" />
//                         <input type="date" value={inst.date} onChange={(e) => updateInstallment(idx, 'date', e.target.value)} className="px-3 py-2 border rounded-md" />
//                         <select value={inst.mode} onChange={(e) => updateInstallment(idx, 'mode', e.target.value)} className="px-3 py-2 border rounded-md">
//                           <option value="">Mode</option>
//                           <option value="Cash">Cash</option>
//                           <option value="Card">Card</option>
//                           <option value="Online">Online</option>
//                         </select>
//                         <button type="button" onClick={() => removeInstallment(idx)} className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">Remove</button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="flex justify-end space-x-3 mt-8 pt-6 border-t">
//                   <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">Cancel</button>
//                   <button type="submit" disabled={loading} className="px-6 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 disabled:bg-gray-400 disabled:cursor-not-allowed">
//                     {loading ? 'Processing...' : (initialData ? 'Update Admission' : 'Create Admission')}
//                   </button>
//                 </div>
//               </>
//             )}
//           </form>
//         )}
//       </div>
//     </div>
//   );
// };

// export default StudentAdmissionModal;