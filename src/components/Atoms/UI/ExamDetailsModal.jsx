// components/ExamDetailsModal/ExamDetailsModal.jsx
import React from 'react';

const ExamDetailsModal = ({ isOpen, onClose, examData }) => {
  if (!isOpen || !examData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="bg-sky-500 text-white p-4 rounded-t-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Exam Details</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200"
            >
              ✕
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-sky-700 mb-4">Staff Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Staff Name</label>
                  <p className="text-black font-medium">{examData.staffName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Staff Email</label>
                  <p className="text-black">{examData.staffEmail}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-sky-700 mb-4">Exam Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Exam Title</label>
                  <p className="text-black font-medium">{examData.examTitle}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Type</label>
                    <p className="text-black">{examData.type}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Marks</label>
                    <p className="text-black font-bold">{examData.marks}/100</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className={`p-4 rounded-lg ${
              examData.result === 'PASS' 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-semibold">Result: {examData.result}</h4>
                  <p className="text-gray-600 mt-1">
                    Passing Marks: 70/100 | Obtained: {examData.marks}/100
                  </p>
                </div>
                <div className={`px-4 py-2 rounded-full text-sm font-bold ${
                  examData.result === 'PASS' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {examData.result === 'PASS' ? '✓ PASSED' : '✗ FAILED'}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-sky-700 mb-4">Question Analysis</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-black">Total Questions</span>
                <span className="font-bold">20</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-black">Attempted</span>
                <span className="font-bold">15</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-black">Correct Answers</span>
                <span className="font-bold text-green-600">{Math.floor(examData.marks / 5)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-black">Wrong Answers</span>
                <span className="font-bold text-red-600">{15 - Math.floor(examData.marks / 5)}</span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-sky-700 mb-4">Time Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-3 rounded">
                <label className="block text-sm font-medium text-gray-500">Date</label>
                <p className="text-black">08/11/2025</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <label className="block text-sm font-medium text-gray-500">Start Time</label>
                <p className="text-black">10:30 AM</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <label className="block text-sm font-medium text-gray-500">End Time</label>
                <p className="text-black">11:30 AM</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <label className="block text-sm font-medium text-gray-500">Duration</label>
                <p className="text-black">60 minutes</p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t">
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamDetailsModal;