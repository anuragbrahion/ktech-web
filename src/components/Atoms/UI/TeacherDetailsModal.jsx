// components/TeacherDetailsModal/TeacherDetailsModal.jsx
import React, { useState } from 'react';

const TeacherDetailsModal = ({ isOpen, onClose, teacherData, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: teacherData?.name || '',
    email: teacherData?.email || '',
    phoneNo: teacherData?.phoneNo || '',
    walletAmount: teacherData?.walletAmount || '0',
    address: teacherData?.address || '',
    salary: teacherData?.salary || '',
    role: teacherData?.role || '',
    password: teacherData?.password || '',
    dob: teacherData?.dob || '',
    doj: teacherData?.doj || ''
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen || !teacherData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl">
        <div className="bg-gray-200 text-black p-4 rounded-t-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Update User - {teacherData.name}</h2>
            <button
              onClick={onClose}
              className="text-black hover:text-gray-500"
            >
              ✕
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-black mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                required
              />
            </div>

            <div>
              <label className="block text-black mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                required
              />
            </div>

            <div>
              <label className="block text-black mb-2">Phone No.</label>
              <input
                type="tel"
                name="phoneNo"
                value={formData.phoneNo}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                required
              />
            </div>

            <div>
              <label className="block text-black mb-2">Wallet Amount</label>
              <input
                type="number"
                name="walletAmount"
                value={formData.walletAmount}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
              />
            </div>

            <div>
              <label className="block text-black mb-2">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
              />
            </div>

            <div>
              <label className="block text-black mb-2">Salary</label>
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
              />
            </div>

            <div>
              <label className="block text-black mb-2">Role</label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                required
              />
            </div>

            <div>
              <label className="block text-black mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                  placeholder="Leave blank to keep current"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-black mb-2">D.O.B.</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
              />
            </div>

            <div>
              <label className="block text-black mb-2">D.O.J.</label>
              <input
                type="date"
                name="doj"
                value={formData.doj}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-black rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600"
            >
              Update User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherDetailsModal;