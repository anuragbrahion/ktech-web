// components/UserModal/UserModal.jsx
import React, { useState } from 'react';

const UserModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    address: initialData?.address || '',
    password: initialData?.password || '',
    designation: initialData?.designation || '',
    department: initialData?.department || '',
    dob: initialData?.dob || '',
    doj: initialData?.doj || '',
    profileImage: initialData?.profileImage || null
  });

  const [showPassword, setShowPassword] = useState(false);
  const designations = [
    'Computer Teacher',
    'Under Training',
    'Computer Faculty',
    'Lab in charge & Computer teacher',
    'Quality Maintenance & Lab In Charge',
    'Branch in Charge & Marketing Person',
    'Junior Manager',
    'Assistant Manager',
    'Senior Manager & Branch Manager',
    'Managing Director',
    'Franchise Partner & Share Holder',
    'CEO'
  ];

  const departments = [
    'Teachers Team',
    'Deviopers Team',
    'Reception Team',
    'Backoffice Team',
    'Sales Team'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          profileImage: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl my-8">
        <div className="bg-sky-500 text-white p-4 rounded-t-lg">
          <h2 className="text-xl font-semibold">
            {initialData ? 'Update User' : 'Add User'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                required
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
                  required={!initialData}
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
              <label className="block text-black mb-2">Designation</label>
              <select
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                required
              >
                <option value="">Select Designation</option>
                {designations.map((des, index) => (
                  <option key={index} value={des}>{des}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-black mb-2">Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                required
              >
                <option value="">Select Department</option>
                {departments.map((dept, index) => (
                  <option key={index} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-black mb-2">D.O.B.</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                required
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
                required
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-black mb-2">Profile Image</label>
            <div className="flex items-center space-x-4">
              <label className="px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 cursor-pointer">
                Choose File
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <span className="text-gray-500">No file chosen</span>
            </div>
            {formData.profileImage && (
              <div className="mt-4">
                <img
                  src={formData.profileImage}
                  alt="Profile Preview"
                  className="w-32 h-32 rounded-full object-cover border-4 border-sky-100"
                />
              </div>
            )}
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
              {initialData ? 'Update User' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;