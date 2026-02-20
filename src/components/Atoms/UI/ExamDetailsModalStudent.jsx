import React from 'react';

const ExamDetailsModalStudent = ({ isOpen, onClose, examData }) => {
  // Extract correct nested data from API response
  const exam = examData?.data?.data;
  if (!isOpen || !exam) return null;

  const examiner = exam.userId || {};
  const examInfo = exam.examination || {};
  const questions = examInfo.questions || [];

  // Safe marks calculation (if backend does not send marks)
  const marks = exam.marks || 0;
  const totalMarks = exam.totalMarks || questions.length;
  const percentage = totalMarks ? (marks / totalMarks) * 100 : 0;

  const getPercentageColor = (percentage) => {
    const passing = examInfo.passingPercentage || 0;
    return percentage >= passing
      ? 'text-green-600'
      : 'text-red-600';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white rounded-t-xl">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-1">
                Exam Details
              </h2>
              <p className="opacity-90">
                Detailed view of your examination performance
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white text-xl font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Student + Exam Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Student Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-3">
                Student Information
              </h3>
              <p>
                <strong>Name:</strong> {examiner.name}
              </p>
              <p>
                <strong>Email:</strong> {examiner.email}
              </p>
            </div>

            {/* Exam Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-3">
                Exam Information
              </h3>
              <p>
                <strong>Exam Title:</strong>{' '}
                {examInfo.examtitle}
              </p>
              <p>
                <strong>Passing Percentage:</strong>{' '}
                {examInfo.passingPercentage}%
              </p>
            </div>
          </div>

          {/* Score Summary */}
          <div className="bg-blue-50 p-6 rounded-lg mb-6">
            <h3 className="font-bold text-lg mb-4">
              Score Summary
            </h3>

            <div className="flex items-center justify-center">
              <div className="text-center">
                <div
                  className={`text-4xl font-bold ${getPercentageColor(
                    percentage
                  )}`}
                >
                  {percentage.toFixed(1)}%
                </div>
                <div className="text-gray-600 mt-2">
                  {marks} out of {totalMarks} marks
                </div>
              </div>
            </div>
          </div>

          {/* Questions Section */}
          <div className="space-y-6">
            <h3 className="font-bold text-xl">
              Question Breakdown
            </h3>

            {questions.map((q, index) => (
              <div
                key={q._id}
                className="bg-gray-50 p-4 rounded-lg border"
              >
                <div className="mb-3">
                  <span className="font-bold text-black">
                    Question {index + 1}:
                  </span>
                  <p className="text-black ml-2">
                    {q.question}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div className="bg-white p-2 rounded border">
                    {q.option_1}
                  </div>
                  <div className="bg-white p-2 rounded border">
                    {q.option_2}
                  </div>
                  <div className="bg-white p-2 rounded border">
                    {q.option_3}
                  </div>
                  <div className="bg-white p-2 rounded border">
                    {q.option_4}
                  </div>
                </div>

                <div className="mt-3 bg-green-50 border border-green-300 p-2 rounded">
                  <strong>Correct Answer:</strong>{' '}
                  {q.answer}
                </div>
              </div>
            ))}
          </div>

          {/* Close Button */}
          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamDetailsModalStudent;
