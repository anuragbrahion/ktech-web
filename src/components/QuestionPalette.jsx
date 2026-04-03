import React from 'react';

const QuestionPalette = ({
  totalQuestions,
  currentQuestion,
  answers,
  markedForReview,
  visitedQuestions,
  onQuestionSelect,
  stats
}) => {
  const getQuestionStatus = (index) => {
    if (markedForReview.includes(index)) return 'review';
    if (answers[index] !== null && answers[index] !== undefined) return 'answered';
    if (visitedQuestions.has(index)) return 'visited';
    return 'not-visited';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'answered':
        return 'bg-green-500 text-white hover:bg-green-600';
      case 'review':
        return 'bg-purple-500 text-white hover:bg-purple-600';
      case 'visited':
        return 'bg-orange-200 text-orange-700 hover:bg-orange-300';
      default:
        return 'bg-gray-200 text-gray-600 hover:bg-gray-300';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-20">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Question Palette</h3>
      
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-green-50 p-2 rounded-lg text-center">
          <p className="text-xs text-gray-600">Answered</p>
          <p className="text-xl font-bold text-green-600">{stats.answered}</p>
        </div>
        <div className="bg-purple-50 p-2 rounded-lg text-center">
          <p className="text-xs text-gray-600">Marked</p>
          <p className="text-xl font-bold text-purple-600">{stats.markedCount}</p>
        </div>
        <div className="bg-orange-50 p-2 rounded-lg text-center">
          <p className="text-xs text-gray-600">Visited</p>
          <p className="text-xl font-bold text-orange-600">{stats.total - stats.notVisited}</p>
        </div>
        <div className="bg-gray-50 p-2 rounded-lg text-center">
          <p className="text-xs text-gray-600">Not Visited</p>
          <p className="text-xl font-bold text-gray-600">{stats.notVisited}</p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-4 pb-4 border-b">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-xs">Answered</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-purple-500 rounded"></div>
          <span className="text-xs">Review</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-orange-200 rounded"></div>
          <span className="text-xs">Visited</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
          <span className="text-xs">Not Visited</span>
        </div>
      </div>

      {/* Question Grid */}
      <div className="grid grid-cols-5 gap-2 max-h-96 overflow-y-auto p-1">
        {Array.from({ length: totalQuestions }, (_, i) => {
          const status = getQuestionStatus(i);
          return (
            <button
              key={i}
              onClick={() => onQuestionSelect(i)}
              className={`
                w-10 h-10 rounded-lg font-medium text-sm transition
                ${getStatusColor(status)}
                ${currentQuestion === i ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
              `}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionPalette;