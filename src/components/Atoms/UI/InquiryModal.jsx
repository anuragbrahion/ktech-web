import React, { useState } from 'react';

const InquiryModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phoneNo: initialData?.phoneNo || '',
    enquiryFor: initialData?.enquiryFor || '',
    followUpDate: initialData?.followUpDate || '',
    source: initialData?.source || '',
    status: initialData?.status || '',
    remark: initialData?.remark || ''
  });

  const enquiryOptions = [
    'Admission',
    'Course Information',
    'Fees Structure',
    'Schedule',
    'Faculty',
    'Placement',
    'Other'
  ];

  const sourceOptions = [
    'Website',
    'Walk-in',
    'Referral',
    'Social Media',
    'Phone Call',
    'Email',
    'Advertisement',
    'Other'
  ];

  const statusOptions = [
    'New',
    'Contacted',
    'Follow Up',
    'Interested',
    'Not Interested',
    'Admitted',
    'Cancelled'
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="bg-sky-500 text-white p-4 rounded-t-lg">
          <h2 className="text-xl font-semibold">
            {initialData ? 'Edit Inquiry' : 'Add your inquiry'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-black mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                placeholder="Enter name"
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
                placeholder="Enter email"
              />
            </div>

            <div>
              <label className="block text-black mb-2">Phone No</label>
              <input
                type="tel"
                name="phoneNo"
                value={formData.phoneNo}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                placeholder="Enter phone number"
                required
              />
            </div>

            <div>
              <label className="block text-black mb-2">Enquiry For</label>
              <select
                name="enquiryFor"
                value={formData.enquiryFor}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                required
              >
                <option value="">Select...</option>
                {enquiryOptions.map((option, index) => (
                  <option key={index} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-black mb-2">Follow Up Date</label>
              <input
                type="date"
                name="followUpDate"
                value={formData.followUpDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
              />
            </div>

            <div>
              <label className="block text-black mb-2">Source</label>
              <select
                name="source"
                value={formData.source}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
              >
                <option value="">Select...</option>
                {sourceOptions.map((source, index) => (
                  <option key={index} value={source}>{source}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-black mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
              >
                <option value="">Select...</option>
                {statusOptions.map((status, index) => (
                  <option key={index} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-black mb-2">Remark</label>
            <textarea
              name="remark"
              value={formData.remark}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
              rows="3"
              placeholder="Enter any additional remarks"
            />
          </div>
          
          <div className="flex justify-end space-x-3">
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
              {initialData ? 'Update Inquiry' : 'Create Inquiry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InquiryModal;