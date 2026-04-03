import React from 'react';

const QuestionNavigation = ({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onAnswerSelect,
  onMarkForReview,
  isMarkedForReview,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious
}) => {
  if (!question) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Question Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          Question {questionNumber} of {totalQuestions}
        </span>
        <button
          onClick={onMarkForReview}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
            isMarkedForReview
              ? 'bg-purple-100 text-purple-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <svg className="w-5 h-5" fill={isMarkedForReview ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          {isMarkedForReview ? 'Marked for Review' : 'Mark for Review'}
        </button>
      </div>

      {/* Question Text */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">{question.questionText}</h3>
        
        {/* Question Image if any */}
        {question.imageUrl && (
          <div className="mb-4">
            <img src={question.imageUrl} alt="Question" className="max-w-full rounded-lg" />
          </div>
        )}

        {/* Options */}
        <div className="space-y-3">
          {question.options?.map((option, index) => (
            <label
              key={index}
              className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition ${
                selectedAnswer === option
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name="question"
                value={option}
                checked={selectedAnswer === option}
                onChange={() => onAnswerSelect(option)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-3 text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t">
        <button
          onClick={onPrevious}
          disabled={!hasPrevious}
          className="flex items-center gap-2 px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>
        
        {hasNext ? (
          <button
            onClick={onNext}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Next
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ) : (
          <button
            onClick={() => {}}
            className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Review & Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default QuestionNavigation;