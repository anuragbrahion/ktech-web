import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { courseBatchesAllDocuments, coursePlansAllDocuments, getAllStudFeeName, reAdmission } from '../../redux/slices/course';
 import { coursesAllDocuments } from '../../redux/slices/course';
 import { teachersAllDocuments } from '../../redux/slices/employee';

const ReAdmission = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    userId: '',
    batch: '',
    course: '',
    plan: '',
    discountRate: 'Percent',
    discountAmount: 0,
    remarks: '',
    examType: 'Online',
    admissionDate: '',
    incentive: 0,
    teacherid: '',
    installments: [
      {
        name: 'First Installment',
        amount: '',
        date: '',
        paymentStatus: 'Pending',
        receiptNumber: null,
        paymentmode: null,
        transctionId: null
      }
    ]
  });

  const [calculationFields, setCalculationFields] = useState({
    courseFees: '',
    feesReceived: '',
    totalFees: '',
    balance: ''
  });

  const studentsData = useSelector((state) => state?.hallticket?.getAllStudFeeName?.data?.data?.list || []);
  const coursesData = useSelector((state) => state?.course?.coursesAllDocumentsData?.data?.data?.list || []);
  const batchesData = useSelector((state) => state?.batch?.courseBatchesAllDocumentsData?.data?.data?.list || []);
  const plansData = useSelector((state) => state?.plan?.coursePlansAllDocumentsData?.data?.data?.list || []);
  const teachersData = useSelector((state) => state?.employee?.teachersAllDocumentsData?.data?.data?.list || []);
  const reAdmissionData = useSelector((state) => state?.course?.reAdmissionData);

  useEffect(() => {
    loadMasterData();
  }, []);

  useEffect(() => {
    if (reAdmissionData?.success) {
      alert('Re-Admission submitted successfully!');
      resetForm();
    }
  }, [reAdmissionData]);

  const loadMasterData = () => {
    dispatch(getAllStudFeeName());
    dispatch(coursesAllDocuments());
    dispatch(courseBatchesAllDocuments());
    dispatch(coursePlansAllDocuments());
    dispatch(teachersAllDocuments());
  };

  const resetForm = () => {
    setFormData({
      userId: '',
      batch: '',
      course: '',
      plan: '',
      discountRate: 'Percent',
      discountAmount: 0,
      remarks: '',
      examType: 'Online',
      admissionDate: '',
      incentive: 0,
      teacherid: '',
      installments: [
        {
          name: 'First Installment',
          amount: '',
          date: '',
          paymentStatus: 'Pending',
          receiptNumber: null,
          paymentmode: null,
          transctionId: null
        }
      ]
    });
    setCalculationFields({
      courseFees: '',
      feesReceived: '',
      totalFees: '',
      balance: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'incentive' || name === 'discountAmount' ? parseFloat(value) || 0 : value
    }));
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

  const handleInstallmentChange = (index, field, value) => {
    const updatedInstallments = [...formData.installments];
    updatedInstallments[index] = {
      ...updatedInstallments[index],
      [field]: field === 'amount' ? parseFloat(value) || 0 : value
    };
    setFormData(prev => ({
      ...prev,
      installments: updatedInstallments
    }));
  };

  const addInstallment = () => {
    const newInstallment = {
      name: `Installment ${formData.installments.length + 1}`,
      amount: '',
      date: '',
      paymentStatus: 'Pending',
      receiptNumber: null,
      paymentmode: null,
      transctionId: null
    };
    setFormData(prev => ({
      ...prev,
      installments: [...prev.installments, newInstallment]
    }));
  };

  const removeInstallment = (index) => {
    if (formData.installments.length > 1) {
      const updatedInstallments = formData.installments.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        installments: updatedInstallments
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
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
      installments: formData.installments.map(inst => ({
        name: inst.name,
        amount: parseFloat(inst.amount) || 0,
        date: inst.date,
        paymentStatus: inst.paymentStatus,
        receiptNumber: inst.receiptNumber || null,
        paymentmode: inst.paymentmode || null,
        transctionId: inst.transctionId || null
      }))
    };

    dispatch(reAdmission(payload));
  };

  const calculateTotalInstallments = () => {
    return formData.installments.reduce((total, inst) => {
      return total + (parseFloat(inst.amount) || 0);
    }, 0);
  };

  const examTypes = ['Online', 'Offline', 'Mixed'];
  const paymentStatuses = ['Pending', 'Paid', 'Partial', 'Overdue'];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Re-Admission</h1>
        <p className="text-black mt-2">Process student re-admission with fee details</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block text-black mb-2">Student *</label>
              <select
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                required
              >
                <option value="">Select Student</option>
                {studentsData.map((student) => (
                  <option key={student._id} value={student._id}>
                    {student.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-black mb-2">Exam Type *</label>
              <select
                name="examType"
                value={formData.examType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                required
              >
                {examTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-black mb-2">Batch *</label>
              <select
                name="batch"
                value={formData.batch}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                required
              >
                <option value="">Select Batch</option>
                {batchesData.map((batch) => (
                  <option key={batch._id} value={batch._id}>{batch.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-black mb-2">Course *</label>
              <select
                name="course"
                value={formData.course}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                required
              >
                <option value="">Select Course</option>
                {coursesData.map((course) => (
                  <option key={course._id} value={course._id}>{course.courseName}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-black mb-2">Plan *</label>
              <select
                name="plan"
                value={formData.plan}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                required
              >
                <option value="">Select Plan</option>
                {plansData.map((plan) => (
                  <option key={plan._id} value={plan._id}>{plan.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-black mb-2">Select Staff</label>
              <select
                name="teacherid"
                value={formData.teacherid}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
              >
                <option value="">Select Staff</option>
                {teachersData.map((teacher) => (
                  <option key={teacher._id} value={teacher._id}>{teacher.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-black mb-2">Incentive</label>
              <input
                type="number"
                name="incentive"
                value={formData.incentive}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                placeholder="0"
                min="0"
              />
            </div>

            <div>
              <label className="block text-black mb-2">Admission Date *</label>
              <input
                type="date"
                name="admissionDate"
                value={formData.admissionDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                required
              />
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-sky-700 mb-4">Course Fees</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-black mb-2">Course Fees</label>
                <input
                  type="number"
                  name="courseFees"
                  value={calculationFields.courseFees}
                  onChange={handleCalculationChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                  placeholder="0.00"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-black mb-2">Discount Type</label>
                <select
                  name="discountRate"
                  value={formData.discountRate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                >
                  <option value="Percent">Percent</option>
                  <option value="Fixed">Fixed</option>
                </select>
              </div>

              <div>
                <label className="block text-black mb-2">Discount {formData.discountRate === 'Percent' ? '(%)' : 'Amount'}</label>
                <input
                  type="number"
                  name="discountAmount"
                  value={formData.discountAmount}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                  placeholder="0"
                  min="0"
                  max={formData.discountRate === 'Percent' ? 100 : undefined}
                />
              </div>

              <div>
                <label className="block text-black mb-2">Total Fees</label>
                <input
                  type="text"
                  value={calculationFields.totalFees}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-black"
                />
              </div>

              <div>
                <label className="block text-black mb-2">Fees Received</label>
                <input
                  type="number"
                  name="feesReceived"
                  value={calculationFields.feesReceived}
                  onChange={handleCalculationChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                  placeholder="0.00"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-black mb-2">Balance</label>
                <input
                  type="text"
                  value={calculationFields.balance}
                  readOnly
                  className={`w-full px-3 py-2 border rounded-md bg-gray-50 text-black font-bold ${
                    parseFloat(calculationFields.balance) > 0 ? 'text-red-600' : 'text-green-600'
                  }`}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-black mb-2">Remarks</label>
                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                  rows="3"
                  placeholder="Additional notes or remarks"
                />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-sky-700">Installments</h3>
              <button
                type="button"
                onClick={addInstallment}
                className="px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 text-sm"
              >
                + Add Installment
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-sky-100">
                  <tr>
                    <th className="py-3 px-4 text-left text-black font-semibold">Name</th>
                    <th className="py-3 px-4 text-left text-black font-semibold">Amount</th>
                    <th className="py-3 px-4 text-left text-black font-semibold">Date</th>
                    <th className="py-3 px-4 text-left text-black font-semibold">Payment Status</th>
                    <th className="py-3 px-4 text-left text-black font-semibold">Payment Mode</th>
                    <th className="py-3 px-4 text-left text-black font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {formData.installments.map((installment, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={installment.name}
                          onChange={(e) => handleInstallmentChange(index, 'name', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-sky-500 text-black text-sm"
                          placeholder="Installment name"
                          required
                        />
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          value={installment.amount}
                          onChange={(e) => handleInstallmentChange(index, 'amount', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-sky-500 text-black text-sm"
                          placeholder="0.00"
                          required
                          min="0"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="date"
                          value={installment.date}
                          onChange={(e) => handleInstallmentChange(index, 'date', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-sky-500 text-black text-sm"
                          required
                        />
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={installment.paymentStatus}
                          onChange={(e) => handleInstallmentChange(index, 'paymentStatus', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-sky-500 text-black text-sm"
                        >
                          {paymentStatuses.map((status) => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={installment.paymentmode || ''}
                          onChange={(e) => handleInstallmentChange(index, 'paymentmode', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-sky-500 text-black text-sm"
                        >
                          <option value="">Select Mode</option>
                          <option value="Cash">Cash</option>
                          <option value="Card">Card</option>
                          <option value="Online">Online</option>
                          <option value="Cheque">Cheque</option>
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => removeInstallment(index)}
                          disabled={formData.installments.length <= 1}
                          className={`text-red-500 hover:text-red-700 text-sm ${
                            formData.installments.length <= 1 ? 'opacity-50 cursor-not-allowed' : ''
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
            
            <div className="mt-4 p-3 bg-gray-50 rounded flex justify-between items-center">
              <p className="text-sm text-black">
                <span className="font-medium">Total Installments Amount:</span> ₹{calculateTotalInstallments().toFixed(2)}
              </p>
              <p className="text-sm text-black">
                <span className="font-medium">Total Fees:</span> ₹{calculationFields.totalFees || '0.00'}
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-2 border border-gray-300 text-black rounded-md hover:bg-gray-50"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={reAdmissionData?.loading}
              className="px-6 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {reAdmissionData?.loading ? 'Processing...' : 'Submit Re-Admission'}
            </button>
          </div>
        </form>
      </div> 
    </div>
  );
};

export default ReAdmission;