/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  courseBatchesAllDocuments,
  coursePlansAllDocuments,
  getAllStudFeeName,
  reAdmission,
} from "../../redux/slices/course";
import { coursesAllDocuments } from "../../redux/slices/course";
import { teachersAllDocuments } from "../../redux/slices/employee";
import { useMemo } from "react";

const ReAdmission = ({ adminId }) => {
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    userId: "",
    batch: "",
    course: "",
    plan: "",
    discountRate: "Percent",
    discountAmount: 0,
    remarks: "",
    examType: "Online",
    admissionDate: new Date().toISOString().split("T")[0],
    incentive: 0,
    teacherid: "",
    installments: [
      {
        name: "First Installment",
        amount: "",
        date: "",
        paymentStatus: "Pending",
        receiptNumber: null,
        paymentmode: null,
        transctionId: null,
      },
    ],
  });

  const [calculationFields, setCalculationFields] = useState({
    courseFees: "",
    feesReceived: "",
    totalFees: "",
    balance: "",
  });

  const studentsData = useSelector(
    (state) => state?.course?.getAllStudFeeNameData?.data?.data?.list || [],
  );
  const coursesData = useSelector(
    (state) => state?.course?.coursesAllDocumentsData?.data?.data?.list || [],
  );
  const batchesData = useSelector(
    (state) =>
      state?.course?.courseBatchesAllDocumentsData?.data?.data?.list || [],
  );
  const plansData = useSelector(
    (state) =>
      state?.course?.coursePlansAllDocumentsData?.data?.data?.list || [],
  );
  const teachersData = useSelector(
    (state) =>
      state?.employee?.teachersAllDocumentsData?.data?.data?.list || [],
  );
  const reAdmissionData = useSelector(
    (state) => state?.course?.reAdmissionData,
  );

  const loadingStates = {
    students: useSelector(
      (state) => state?.course?.getAllStudFeeNameData?.loading,
    ),
    courses: useSelector(
      (state) => state?.course?.coursesAllDocumentsData?.loading,
    ),
    batches: useSelector(
      (state) => state?.course?.courseBatchesAllDocumentsData?.loading,
    ),
    plans: useSelector(
      (state) => state?.course?.coursePlansAllDocumentsData?.loading,
    ),
    teachers: useSelector(
      (state) => state?.employee?.teachersAllDocumentsData?.loading,
    ),
  };

  useEffect(() => {
    loadMasterData();
  }, []);

  useEffect(() => {
    if (reAdmissionData?.success) {
      setSuccessMessage("Re-Admission submitted successfully!");
      setTimeout(() => {
        resetForm();
        setSuccessMessage("");
      }, 2000);
    }
    if (reAdmissionData?.error) {
      setSubmitError(reAdmissionData.error);
      setTimeout(() => setSubmitError(""), 5000);
    }
  }, [reAdmissionData]);

  const loadMasterData = () => {
    if (adminId) {
      dispatch(getAllStudFeeName({ query: JSON.stringify({ adminId }) }));
      dispatch(
        courseBatchesAllDocuments({ query: JSON.stringify({ adminId }) }),
      );
      dispatch(coursePlansAllDocuments({ query: JSON.stringify({ adminId }) }));
      dispatch(teachersAllDocuments({ query: JSON.stringify({ adminId }) }));
    }
    dispatch(coursesAllDocuments());
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.userId) newErrors.userId = "Student selection is required";
    if (!formData.batch) newErrors.batch = "Batch selection is required";
    if (!formData.course) newErrors.course = "Course selection is required";
    if (!formData.plan) newErrors.plan = "Plan selection is required";
    if (!formData.admissionDate)
      newErrors.admissionDate = "Admission date is required";
    if (!formData.examType) newErrors.examType = "Exam type is required";

    // Validate course fees
    if (
      !calculationFields.courseFees ||
      parseFloat(calculationFields.courseFees) <= 0
    ) {
      newErrors.courseFees = "Valid course fees is required";
    }

    // Validate installments
    if (formData.installments.length === 0) {
      newErrors.installments = "At least one installment is required";
    } else {
      formData.installments.forEach((inst, index) => {
        if (!inst.name)
          newErrors[`installment_${index}_name`] = "Installment name required";
        if (!inst.amount || parseFloat(inst.amount) <= 0) {
          newErrors[`installment_${index}_amount`] = "Valid amount required";
        }
        if (!inst.date)
          newErrors[`installment_${index}_date`] = "Date required";
      });
    }

    // Check if total installments match total fees
    const totalInstallments = calculateTotalInstallments();
    const totalFees = parseFloat(calculationFields.totalFees) || 0;
    if (Math.abs(totalInstallments - totalFees) > 0.01) {
      newErrors.installmentSum = `Total installments (₹${totalInstallments.toFixed(2)}) should equal total fees (₹${totalFees.toFixed(2)})`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  const resetForm = () => {
    setFormData({
      userId: "",
      batch: "",
      course: "",
      plan: "",
      discountRate: "Percent",
      discountAmount: 0,
      remarks: "",
      examType: "Online",
      admissionDate: new Date().toISOString().split("T")[0],
      incentive: 0,
      teacherid: "",
      installments: [
        {
          name: "First Installment",
          amount: "",
          date: "",
          paymentStatus: "Pending",
          receiptNumber: null,
          paymentmode: null,
          transctionId: null,
        },
      ],
    });
    setCalculationFields({
      courseFees: "",
      feesReceived: "",
      totalFees: "",
      balance: "",
    });
    setErrors({});
    setTouched({});
    setSubmitError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "incentive" || name === "discountAmount"
          ? parseFloat(value) || 0
          : value,
    }));

    if (name === "plan") {
      if (value) {
        const plan = plansData.find((plan) => plan._id === value);
        if (plan) {
          handleCalculationChange({
            target: { name: "courseFees", value: plan.amount },
          });
        } else {
          handleCalculationChange({ target: { name: "courseFees", value: 0 } });
        }
      } else {
        handleCalculationChange({ target: { name: "courseFees", value: 0 } });
      }
    }
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleCalculationChange = (e) => {
    const { name, value } = e.target;
    setCalculationFields((prev) => {
      const updated = { ...prev, [name]: value };

      if (
        name === "courseFees" ||
        name === "discountAmount" ||
        name === "feesReceived"
      ) {
        const fees = parseFloat(updated.courseFees) || 0;
        const discountAmount = parseFloat(formData.discountAmount) || 0;
        const discountValue =
          formData.discountRate === "Percent"
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
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleInstallmentChange = (index, field, value) => {
    const updatedInstallments = [...formData.installments];
    updatedInstallments[index] = {
      ...updatedInstallments[index],
      [field]: field === "amount" ? parseFloat(value) || 0 : value,
    };
    setFormData((prev) => ({
      ...prev,
      installments: updatedInstallments,
    }));
    // Clear specific installment errors
    const errorKey = `installment_${index}_${field}`;
    if (errors[errorKey]) {
      setErrors({ ...errors, [errorKey]: "" });
    }
    if (errors.installmentSum) {
      setErrors({ ...errors, installmentSum: "" });
    }
  };

  const addInstallment = () => {
    const newInstallment = {
      name: `Installment ${formData.installments.length + 1}`,
      amount: "",
      date: "",
      paymentStatus: "Pending",
      receiptNumber: null,
      paymentmode: null,
      transctionId: null,
    };
    setFormData((prev) => ({
      ...prev,
      installments: [...prev.installments, newInstallment],
    }));
  };

  const removeInstallment = (index) => {
    if (formData.installments.length > 1) {
      const updatedInstallments = formData.installments.filter(
        (_, i) => i !== index,
      );
      setFormData((prev) => ({
        ...prev,
        installments: updatedInstallments,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!validateForm()) {
      // Scroll to first error
      const firstError = Object.keys(errors)[0];
      const errorElement = document.getElementById(firstError);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    const payload = {
      userId: formData.userId,
      batch: formData.batch,
      course: formData.course,
      plan: formData.plan,
      discountRate: formData.discountRate,
      discountAmount: parseFloat(formData.discountAmount) || 0,
      remarks: formData.remarks,
      examType: formData.examType,
      admissionDate: formData.admissionDate,
      incentive: parseFloat(formData.incentive) || 0,
      teacherid: formData.teacherid,
      installments: formData.installments.map((inst) => ({
        name: inst.name,
        amount: parseFloat(inst.amount) || 0,
        date: inst.date,
        paymentStatus: inst.paymentStatus,
        receiptNumber: inst.receiptNumber || null,
        paymentmode: inst.paymentmode || null,
        transctionId: inst.transctionId || null,
      })),
    };

    dispatch(reAdmission(payload));
  };

  const calculateTotalInstallments = () => {
    return formData.installments.reduce((total, inst) => {
      return total + (parseFloat(inst.amount) || 0);
    }, 0);
  };

  const examTypes = ["Online", "Offline", "Mixed"];
  const paymentStatuses = ["Pending", "Paid", "Partial", "Overdue"];
  const paymentModes = ["Cash", "Card", "Online", "Cheque", "Bank Transfer"];

  // Check if any master data is loading
  const isLoading = Object.values(loadingStates).some((loading) => loading);

  const applicableCourses = useMemo(() => {
    if (
      formData.batch &&
      Array.isArray(batchesData) &&
      batchesData.length > 0
    ) {
      const batch = batchesData.find((b) => b._id === formData.batch);

      return coursesData.filter((c) => batch.courses.includes(c._id));
    } else {
      return [];
    }
  }, [formData.batch]);

  const applicablePlans = useMemo(() => {
    if (formData.course && Array.isArray(plansData) && plansData.length > 0) {
      return plansData.filter((c) => c.course.includes(formData.course));
    } else {
      return [];
    }
  }, [formData.course]);

  return (
    <div className="">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Re-Admission</h1>
          <p className="text-gray-600 mt-2">
            Process student re-admission with fee details
          </p>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center justify-between">
            <span>{successMessage}</span>
            <button
              onClick={() => setSuccessMessage("")}
              className="text-green-700 hover:text-green-900"
            >
              ×
            </button>
          </div>
        )}

        {submitError && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center justify-between">
            <span>{submitError}</span>
            <button
              onClick={() => setSubmitError("")}
              className="text-red-700 hover:text-red-900"
            >
              ×
            </button>
          </div>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="mb-6 p-4 bg-blue-100 text-blue-700 rounded-lg">
            Loading master data...
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-6">
          <form onSubmit={handleSubmit}>
            {/* Basic Information Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Student *
                  </label>
                  <select
                    id="userId"
                    name="userId"
                    value={formData.userId}
                    onChange={handleChange}
                    onBlur={() => handleBlur("userId")}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900 ${
                      errors.userId && touched.userId
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    required
                  >
                    <option value="">Select Student</option>
                    {studentsData.map((student) => (
                      <option key={student._id} value={student._id}>
                        {student.name}{" "}
                        {student.email ? `(${student.email})` : ""}
                      </option>
                    ))}
                  </select>
                  {errors.userId && touched.userId && (
                    <p className="mt-1 text-sm text-red-600">{errors.userId}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Exam Type *
                  </label>
                  <select
                    name="examType"
                    value={formData.examType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900"
                    required
                  >
                    {examTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Batch *
                  </label>
                  <select
                    name="batch"
                    value={formData.batch}
                    onChange={handleChange}
                    onBlur={() => handleBlur("batch")}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900 ${
                      errors.batch && touched.batch
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    required
                  >
                    <option value="">Select Batch</option>
                    {batchesData.map((batch) => (
                      <option key={batch._id} value={batch._id}>
                        {batch.name ||
                          `${batch.startTime ?? "0"} - ${batch.endTime ?? "0"}`}
                      </option>
                    ))}
                  </select>
                  {errors.batch && touched.batch && (
                    <p className="mt-1 text-sm text-red-600">{errors.batch}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Course *
                  </label>
                  <select
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    onBlur={() => handleBlur("course")}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900 ${
                      errors.course && touched.course
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    disabled={!formData.batch}
                    required
                  >
                    <option value="">Select Course</option>
                    {applicableCourses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.courseName}
                      </option>
                    ))}
                  </select>
                  {errors.course && touched.course && (
                    <p className="mt-1 text-sm text-red-600">{errors.course}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Plan *
                  </label>
                  <select
                    name="plan"
                    value={formData.plan}
                    onChange={handleChange}
                    onBlur={() => handleBlur("plan")}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900 ${
                      errors.plan && touched.plan
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    disabled={!formData.course}
                    required
                  >
                    <option value="">Select Plan</option>
                    {applicablePlans.map((plan) => (
                      <option key={plan._id} value={plan._id}>
                        {plan.name}
                      </option>
                    ))}
                  </select>
                  {errors.plan && touched.plan && (
                    <p className="mt-1 text-sm text-red-600">{errors.plan}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Select Staff
                  </label>
                  <select
                    name="teacherid"
                    value={formData.teacherid}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900"
                  >
                    <option value="">Select Staff</option>
                    {teachersData.map((teacher) => (
                      <option key={teacher._id} value={teacher._id}>
                        {teacher.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Incentive
                  </label>
                  <input
                    type="number"
                    name="incentive"
                    value={formData.incentive}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900"
                    placeholder="0"
                    min="0"
                    step="100"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Admission Date *
                  </label>
                  <input
                    type="date"
                    name="admissionDate"
                    value={formData.admissionDate}
                    onChange={handleChange}
                    onBlur={() => handleBlur("admissionDate")}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900 ${
                      errors.admissionDate && touched.admissionDate
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    required
                  />
                  {errors.admissionDate && touched.admissionDate && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.admissionDate}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Fee Details Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">
                Fee Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Course Fees *
                  </label>
                  <input
                    type="number"
                    name="courseFees"
                    value={calculationFields.courseFees}
                    onChange={handleCalculationChange}
                    onBlur={() => handleBlur("courseFees")}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900 ${
                      errors.courseFees && touched.courseFees
                        ? "border-red-500"
                        : "border-gray-300"
                    } disabled:cursor-not-allowed`}
                    placeholder="0.00"
                    min="0"
                    step="100"
                    required
                    disabled
                  />
                  {errors.courseFees && touched.courseFees && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.courseFees}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Discount Type
                  </label>
                  <select
                    name="discountRate"
                    value={formData.discountRate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900"
                  >
                    <option value="Percent">Percent (%)</option>
                    <option value="Fixed">Fixed Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Discount{" "}
                    {formData.discountRate === "Percent" ? "(%)" : "Amount (₹)"}
                  </label>
                  <input
                    type="number"
                    name="discountAmount"
                    value={formData.discountAmount}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900"
                    placeholder="0"
                    min="0"
                    max={formData.discountRate === "Percent" ? 100 : undefined}
                    step={formData.discountRate === "Percent" ? 1 : 100}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Total Fees
                  </label>
                  <input
                    type="text"
                    value={calculationFields.totalFees}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Fees Received
                  </label>
                  <input
                    type="number"
                    name="feesReceived"
                    value={calculationFields.feesReceived}
                    onChange={handleCalculationChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900"
                    placeholder="0.00"
                    min="0"
                    step="100"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Balance
                  </label>
                  <input
                    type="text"
                    value={calculationFields.balance}
                    readOnly
                    className={`w-full px-3 py-2 border rounded-md bg-gray-50 font-semibold ${
                      parseFloat(calculationFields.balance) > 0
                        ? "text-orange-600"
                        : parseFloat(calculationFields.balance) < 0
                          ? "text-red-600"
                          : "text-gray-900"
                    }`}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-2 font-medium">
                    Remarks
                  </label>
                  <textarea
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900"
                    rows="3"
                    placeholder="Additional notes or remarks"
                  />
                </div>
              </div>
            </div>

            {/* Installments Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Installments
                </h2>
                <button
                  type="button"
                  onClick={addInstallment}
                  className="px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 transition-colors text-sm font-medium"
                >
                  + Add Installment
                </button>
              </div>

              {errors.installmentSum && (
                <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-md">
                  {errors.installmentSum}
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-4 text-left text-gray-700 font-semibold text-sm">
                        Name *
                      </th>
                      <th className="py-3 px-4 text-left text-gray-700 font-semibold text-sm">
                        Amount *
                      </th>
                      <th className="py-3 px-4 text-left text-gray-700 font-semibold text-sm">
                        Date *
                      </th>
                      <th className="py-3 px-4 text-left text-gray-700 font-semibold text-sm">
                        Payment Status
                      </th>
                      <th className="py-3 px-4 text-left text-gray-700 font-semibold text-sm">
                        Payment Mode
                      </th>
                      <th className="py-3 px-4 text-left text-gray-700 font-semibold text-sm">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {formData.installments.map((installment, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <input
                            type="text"
                            value={installment.name}
                            onChange={(e) =>
                              handleInstallmentChange(
                                index,
                                "name",
                                e.target.value,
                              )
                            }
                            onBlur={() =>
                              handleBlur(`installment_${index}_name`)
                            }
                            className={`w-full px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-sky-500 text-gray-900 text-sm ${
                              errors[`installment_${index}_name`] &&
                              touched[`installment_${index}_name`]
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                            placeholder="Installment name"
                            required
                          />
                          {errors[`installment_${index}_name`] &&
                            touched[`installment_${index}_name`] && (
                              <p className="mt-1 text-xs text-red-600">
                                {errors[`installment_${index}_name`]}
                              </p>
                            )}
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            value={installment.amount}
                            onChange={(e) =>
                              handleInstallmentChange(
                                index,
                                "amount",
                                e.target.value,
                              )
                            }
                            onBlur={() =>
                              handleBlur(`installment_${index}_amount`)
                            }
                            className={`w-full px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-sky-500 text-gray-900 text-sm ${
                              errors[`installment_${index}_amount`] &&
                              touched[`installment_${index}_amount`]
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                            placeholder="0.00"
                            required
                            min="0"
                            step="100"
                          />
                          {errors[`installment_${index}_amount`] &&
                            touched[`installment_${index}_amount`] && (
                              <p className="mt-1 text-xs text-red-600">
                                {errors[`installment_${index}_amount`]}
                              </p>
                            )}
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="date"
                            value={installment.date}
                            onChange={(e) =>
                              handleInstallmentChange(
                                index,
                                "date",
                                e.target.value,
                              )
                            }
                            onBlur={() =>
                              handleBlur(`installment_${index}_date`)
                            }
                            className={`w-full px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-sky-500 text-gray-900 text-sm ${
                              errors[`installment_${index}_date`] &&
                              touched[`installment_${index}_date`]
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                            required
                          />
                          {errors[`installment_${index}_date`] &&
                            touched[`installment_${index}_date`] && (
                              <p className="mt-1 text-xs text-red-600">
                                {errors[`installment_${index}_date`]}
                              </p>
                            )}
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={installment.paymentStatus}
                            onChange={(e) =>
                              handleInstallmentChange(
                                index,
                                "paymentStatus",
                                e.target.value,
                              )
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-sky-500 text-gray-900 text-sm"
                          >
                            {paymentStatuses.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={installment.paymentmode || ""}
                            onChange={(e) =>
                              handleInstallmentChange(
                                index,
                                "paymentmode",
                                e.target.value,
                              )
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-sky-500 text-gray-900 text-sm"
                          >
                            <option value="">Select Mode</option>
                            {paymentModes.map((mode) => (
                              <option key={mode} value={mode}>
                                {mode}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => removeInstallment(index)}
                            disabled={formData.installments.length <= 1}
                            className={`text-red-500 hover:text-red-700 text-sm font-medium ${
                              formData.installments.length <= 1
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                <p className="text-gray-700">
                  <span className="font-semibold">
                    Total Installments Amount:
                  </span>{" "}
                  <span className="text-lg font-bold text-sky-600">
                    ₹{calculateTotalInstallments().toFixed(2)}
                  </span>
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Total Fees:</span>{" "}
                  <span className="text-lg font-bold text-green-600">
                    ₹{calculationFields.totalFees || "0.00"}
                  </span>
                </p>
                {Math.abs(
                  calculateTotalInstallments() -
                    (parseFloat(calculationFields.totalFees) || 0),
                ) > 0.01 && (
                  <p className="text-sm text-orange-600">⚠️ Amount mismatch</p>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={reAdmissionData?.loading || isLoading}
                className="px-6 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
              >
                {reAdmissionData?.loading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Submit Re-Admission"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReAdmission;
