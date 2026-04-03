import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ExamResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { results, examTitle } = location.state || {};

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Results Found</h2>
          <button
            onClick={() => navigate('/student/my-exams')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to My Exams
          </button>
        </div>
      </div>
    );
  }

  const isPassed = results.percentage >= results.passingPercentage;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className={`px-8 py-6 ${isPassed ? 'bg-gradient-to-r from-green-600 to-emerald-600' : 'bg-gradient-to-r from-red-600 to-pink-600'}`}>
            <h1 className="text-3xl font-bold text-white">Exam Results</h1>
            <p className="text-white/90 mt-2">{examTitle || 'Exam'}</p>
          </div>

          {/* Score Overview */}
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="inline-block p-4 rounded-full bg-gray-50 mb-4">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold ${
                  isPassed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  {results.percentage}%
                </div>
              </div>
              <h2 className={`text-2xl font-bold ${isPassed ? 'text-green-600' : 'text-red-600'}`}>
                {isPassed ? 'Congratulations! You Passed' : 'Better Luck Next Time'}
              </h2>
            </div>

            {/* Score Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Total Questions</p>
                <p className="text-2xl font-bold text-blue-600">{results.totalQuestions}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Correct Answers</p>
                <p className="text-2xl font-bold text-green-600">{results.correctAnswers}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Total Marks</p>
                <p className="text-2xl font-bold text-purple-600">{results.obtainedMarks}/{results.totalMarks}</p>
              </div>
            </div>

            {/* Detailed Stats */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Detailed Analysis</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Passing Percentage</span>
                  <span className="font-semibold">{results.passingPercentage}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Your Percentage</span>
                  <span className={`font-semibold ${isPassed ? 'text-green-600' : 'text-red-600'}`}>
                    {results.percentage}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Questions</span>
                  <span className="font-semibold">{results.totalQuestions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Attempted</span>
                  <span className="font-semibold">{results.attempted}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Unattempted</span>
                  <span className="font-semibold">{results.unattempted}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => navigate('/student/my-exams')}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Back to My Exams
              </button>
              <button
                onClick={() => window.print()}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold"
              >
                Print Results
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamResults;