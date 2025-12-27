// pages/ReAdmission.jsx
import React, { useState } from 'react';

const ReAdmission = () => {
  const [formData, setFormData] = useState({
    student: '',
    examType: '',
    batch: '',
    course: '',
    plan: '',
    courseDuration: '',
    incentive: '',
    staffName: '',
    courseFees: '',
    discountRate: '',
    discountAmount: '0',
    totalFees: '',
    feesReceived: '0',
    balance: '',
    remarks: '',
    admissionDate: '',
    installments: [
      { name: '', amount: '', date: '', paymentStatus: 'Pending' }
    ]
  });

  const students = ['Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Sneha Singh', 'Rajesh Gupta'];
  const examTypes = ['Regular', 'Supplementary', 'Retest', 'Improvement'];
  const batches = ['Morning 8-10', 'Morning 10-12', 'Afternoon 2-4', 'Evening 4-6', 'Evening 6-8'];
  const courses = ['Computer Science', 'Commerce', 'Arts', 'Science', 'Medical'];
  const plans = ['Regular', 'Crash Course', 'Weekend Batch', 'Online', 'Correspondence'];
  const staffNames = ['Mr. Sharma', 'Ms. Patel', 'Dr. Kumar', 'Prof. Singh', 'Mrs. Gupta'];
  
  const paymentStatuses = ['Pending', 'Paid', 'Partial', 'Overdue'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      
      if (name === 'courseFees' || name === 'discountRate') {
        const fees = parseFloat(updated.courseFees) || 0;
        const discountRate = parseFloat(updated.discountRate) || 0;
        const discountAmount = (fees * discountRate) / 100;
        const totalFees = fees - discountAmount;
        const feesReceived = parseFloat(updated.feesReceived) || 0;
        const balance = totalFees - feesReceived;
        
        updated.discountAmount = discountAmount.toFixed(2);
        updated.totalFees = totalFees.toFixed(2);
        updated.balance = balance.toFixed(2);
      }
      
      if (name === 'feesReceived') {
        const feesReceived = parseFloat(value) || 0;
        const totalFees = parseFloat(updated.totalFees) || 0;
        updated.balance = (totalFees - feesReceived).toFixed(2);
      }
      
      return updated;
    });
  };

  const handleInstallmentChange = (index, field, value) => {
    const newInstallments = [...formData.installments];
    newInstallments[index][field] = value;
    setFormData(prev => ({
      ...prev,
      installments: newInstallments
    }));
  };

  const addInstallment = () => {
    setFormData(prev => ({
      ...prev,
      installments: [
        ...prev.installments,
        { name: '', amount: '', date: '', paymentStatus: 'Pending' }
      ]
    }));
  };

  const removeInstallment = (index) => {
    if (formData.installments.length > 1) {
      const newInstallments = [...formData.installments];
      newInstallments.splice(index, 1);
      setFormData(prev => ({
        ...prev,
        installments: newInstallments
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Re-Admission form submitted successfully!');
  };

  const calculateTotalInstallments = () => {
    return formData.installments.reduce((total, inst) => {
      return total + (parseFloat(inst.amount) || 0);
    }, 0);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-sky-600">Re-Admission</h1>
          <p className="text-black mt-2">Process student re-admission with fee details</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div>
                <label className="block text-black mb-2">Student</label>
                <select
                  name="student"
                  value={formData.student}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                  required
                >
                  <option value="">Select...</option>
                  {students.map((student, index) => (
                    <option key={index} value={student}>{student}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-black mb-2">Exam Type</label>
                <select
                  name="examType"
                  value={formData.examType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                  required
                >
                  <option value="">Select...</option>
                  {examTypes.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-black mb-2">Batch</label>
                <select
                  name="batch"
                  value={formData.batch}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                  required
                >
                  <option value="">Select Batch</option>
                  {batches.map((batch, index) => (
                    <option key={index} value={batch}>{batch}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-black mb-2">Course</label>
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                  required
                >
                  <option value="">Select Course</option>
                  {courses.map((course, index) => (
                    <option key={index} value={course}>{course}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-black mb-2">Plan</label>
                <select
                  name="plan"
                  value={formData.plan}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                  required
                >
                  <option value="">Select Plan for student</option>
                  {plans.map((plan, index) => (
                    <option key={index} value={plan}>{plan}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-black mb-2">Course Duration</label>
                <input
                  type="text"
                  name="courseDuration"
                  value={formData.courseDuration}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                  placeholder="e.g., 6 Months"
                />
              </div>

              <div>
                <label className="block text-black mb-2">Incentive</label>
                <input
                  type="text"
                  name="incentive"
                  value={formData.incentive}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                  placeholder="Incentive amount or percentage"
                />
              </div>

              <div>
                <label className="block text-black mb-2">Select Staff Name</label>
                <select
                  name="staffName"
                  value={formData.staffName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                  required
                >
                  <option value="">Select Staff</option>
                  {staffNames.map((staff, index) => (
                    <option key={index} value={staff}>{staff}</option>
                  ))}
                </select>
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
                    value={formData.courseFees}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-black mb-2">Discount Rate (%)</label>
                  <input
                    type="number"
                    name="discountRate"
                    value={formData.discountRate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                    placeholder="0"
                    min="0"
                    max="100"
                  />
                </div>

                <div>
                  <label className="block text-black mb-2">Discount Amount</label>
                  <input
                    type="text"
                    name="discountAmount"
                    value={formData.discountAmount}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-black"
                  />
                </div>

                <div>
                  <label className="block text-black mb-2">Total Fees</label>
                  <input
                    type="text"
                    name="totalFees"
                    value={formData.totalFees}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-black"
                  />
                </div>

                <div>
                  <label className="block text-black mb-2">Fees Received</label>
                  <input
                    type="number"
                    name="feesReceived"
                    value={formData.feesReceived}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-black mb-2">Balance</label>
                  <input
                    type="text"
                    name="balance"
                    value={formData.balance}
                    readOnly
                    className={`w-full px-3 py-2 border rounded-md bg-gray-50 text-black font-bold ${
                      parseFloat(formData.balance) > 0 ? 'border-red-300' : 'border-green-300'
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
                      <th className="py-3 px-4 text-left text-black font-semibold">Remove</th>
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
                          />
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            value={installment.amount}
                            onChange={(e) => handleInstallmentChange(index, 'amount', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-sky-500 text-black text-sm"
                            placeholder="0.00"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="date"
                            value={installment.date}
                            onChange={(e) => handleInstallmentChange(index, 'date', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-sky-500 text-black text-sm"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={installment.paymentStatus}
                            onChange={(e) => handleInstallmentChange(index, 'paymentStatus', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-sky-500 text-black text-sm"
                          >
                            {paymentStatuses.map((status, idx) => (
                              <option key={idx} value={status}>{status}</option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => removeInstallment(index)}
                            disabled={formData.installments.length <= 1}
                            className={`text-red-500 hover:text-red-700 ${
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
              
              <div className="mt-4 p-3 bg-gray-50 rounded">
                <p className="text-sm text-black">
                  <span className="font-medium">Total Installments Amount:</span> ₹{calculateTotalInstallments().toFixed(2)}
                </p>
              </div>
            </div>

            <div className="mb-8 pt-6 border-t">
              <div className="max-w-xs">
                <label className="block text-black mb-2">Admission Date</label>
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

            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    student: '',
                    examType: '',
                    batch: '',
                    course: '',
                    plan: '',
                    courseDuration: '',
                    incentive: '',
                    staffName: '',
                    courseFees: '',
                    discountRate: '',
                    discountAmount: '0',
                    totalFees: '',
                    feesReceived: '0',
                    balance: '',
                    remarks: '',
                    admissionDate: '',
                    installments: [{ name: '', amount: '', date: '', paymentStatus: 'Pending' }]
                  });
                }}
                className="px-6 py-2 border border-gray-300 text-black rounded-md hover:bg-gray-50"
              >
                Reset
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600"
              >
                Submit Re-Admission
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-sky-50 p-6 rounded-lg shadow border border-sky-100">
            <h3 className="text-lg font-semibold text-sky-700">Total Fees</h3>
            <p className="text-3xl font-bold text-black mt-2">
              ₹{formData.totalFees || '0.00'}
            </p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg shadow border border-green-100">
            <h3 className="text-lg font-semibold text-green-700">Fees Received</h3>
            <p className="text-3xl font-bold text-black mt-2">
              ₹{formData.feesReceived || '0.00'}
            </p>
          </div>
          <div className={`p-6 rounded-lg shadow border ${
            parseFloat(formData.balance) > 0 
              ? 'bg-red-50 border-red-100' 
              : 'bg-gray-50 border-gray-100'
          }`}>
            <h3 className={`text-lg font-semibold ${
              parseFloat(formData.balance) > 0 ? 'text-red-700' : 'text-gray-700'
            }`}>
              Balance
            </h3>
            <p className="text-3xl font-bold text-black mt-2">
              ₹{formData.balance || '0.00'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReAdmission;