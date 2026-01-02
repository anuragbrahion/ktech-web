import React, { useState, useEffect } from 'react';

const ExamModalStudent = ({ isOpen, onClose, onSave, examData, isEditing }) => {
  const [formData, setFormData] = useState({
    batch: '',
    course: '',
    examTitle: '',
    date: '',
    durationHours: 0,
    durationMinutes: 0,
    passingPercentage: '',
    questions: [
      {
        id: 1,
        text: '',
        options: {
          A: '',
          B: '',
          C: '',
          D: ''
        },
        correctAnswer: 'A'
      }
    ]
  });

  useEffect(() => {
    if (examData && isEditing) {
      setFormData({
        batch: examData.batch || '',
        course: examData.course || '',
        examTitle: examData.examTitle || '',
        date: examData.examTime?.split(',')[0] || '',
        durationHours: parseInt(examData.examDuration?.split('hr')[0]) || 0,
        durationMinutes: parseInt(examData.examDuration?.split('Min')[0]?.split(':')[1]) || 0,
        passingPercentage: examData.passingPercentage || '',
        questions: examData.questions || [
          {
            id: 1,
            text: '',
            options: {
              A: '',
              B: '',
              C: '',
              D: ''
            },
            correctAnswer: 'A'
          }
        ]
      });
    } else {
      // Reset form for new exam
      setFormData({
        batch: '',
        course: '',
        examTitle: '',
        date: '',
        durationHours: 0,
        durationMinutes: 0,
        passingPercentage: '',
        questions: [
          {
            id: 1,
            text: '',
            options: {
              A: '',
              B: '',
              C: '',
              D: ''
            },
            correctAnswer: 'A'
          }
        ]
      });
    }
  }, [examData, isEditing]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...formData.questions];
    
    if (field.startsWith('option_')) {
      const optionKey = field.split('_')[1];
      updatedQuestions[index] = {
        ...updatedQuestions[index],
        options: {
          ...updatedQuestions[index].options,
          [optionKey]: value
        }
      };
    } else if (field === 'text') {
      updatedQuestions[index] = {
        ...updatedQuestions[index],
        text: value
      };
    } else if (field === 'answer') {
      updatedQuestions[index] = {
        ...updatedQuestions[index],
        correctAnswer: value
      };
    }
    
    setFormData(prev => ({
      ...prev,
      questions: updatedQuestions
    }));
  };

  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          id: prev.questions.length + 1,
          text: '',
          options: {
            A: '',
            B: '',
            C: '',
            D: ''
          },
          correctAnswer: 'A'
        }
      ]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Format the exam data
    const examDuration = `${formData.durationHours} hr : ${formData.durationMinutes} Min`;
    const examTime = `${formData.date}, --:-- --`;
    
    const examToSave = {
      ...formData,
      examDuration,
      examTime,
      passingPercentage: parseInt(formData.passingPercentage)
    };
    
    onSave(examToSave);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {isEditing ? 'Edit Examination' : 'Add Examination'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Batch */}
              <div>
                <label className="block text-gray-700 mb-2">Batch</label>
                <select
                  name="batch"
                  value={formData.batch}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Batch</option>
                  <option value="ms office">ms office</option>
                  <option value="batch 2">Batch 2</option>
                  <option value="batch 3">Batch 3</option>
                </select>
              </div>

              {/* Course */}
              <div>
                <label className="block text-gray-700 mb-2">Course</label>
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Course</option>
                  <option value="MS Office Basics">MS Office Basics</option>
                  <option value="Advanced Excel">Advanced Excel</option>
                  <option value="PowerPoint Mastery">PowerPoint Mastery</option>
                </select>
              </div>

              {/* Exam Title */}
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-2">Exam Title</label>
                <input
                  type="text"
                  name="examTitle"
                  value={formData.examTitle}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter exam title"
                  required
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-gray-700 mb-2">Duration</label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <input
                        type="number"
                        name="durationHours"
                        value={formData.durationHours}
                        onChange={handleInputChange}
                        min="0"
                        className="w-full px-4 py-2 focus:outline-none"
                      />
                      <span className="px-3 text-gray-500">Hours</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <input
                        type="number"
                        name="durationMinutes"
                        value={formData.durationMinutes}
                        onChange={handleInputChange}
                        min="0"
                        max="59"
                        className="w-full px-4 py-2 focus:outline-none"
                      />
                      <span className="px-3 text-gray-500">Minutes</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Passing Percentage */}
              <div>
                <label className="block text-gray-700 mb-2">Passing Percentage</label>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <input
                    type="number"
                    name="passingPercentage"
                    value={formData.passingPercentage}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    className="w-full px-4 py-2 focus:outline-none"
                    required
                  />
                  <span className="px-3 text-gray-500">%</span>
                </div>
              </div>
            </div>

            {/* Questions Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Questions</h3>
                <button
                  type="button"
                  onClick={addQuestion}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm font-medium"
                >
                  + Add Question
                </button>
              </div>

              {formData.questions.map((question, index) => (
                <div key={question.id} className="mb-6 p-4 border border-gray-200 rounded-lg">
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Question {index + 1}</label>
                    <input
                      type="text"
                      value={question.text}
                      onChange={(e) => handleQuestionChange(index, 'text', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter question text"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {['A', 'B', 'C', 'D'].map((option) => (
                      <div key={option}>
                        <label className="block text-gray-700 mb-2">Option {option}</label>
                        <input
                          type="text"
                          value={question.options[option]}
                          onChange={(e) => handleQuestionChange(index, `option_${option}`, e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={`Enter option ${option}`}
                          required
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Correct Answer</label>
                    <select
                      value={question.correctAnswer}
                      onChange={(e) => handleQuestionChange(index, 'answer', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="A">Option A</option>
                      <option value="B">Option B</option>
                      <option value="C">Option C</option>
                      <option value="D">Option D</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
              >
                {isEditing ? 'Update Exam' : 'Submit Exam'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ExamModalStudent;