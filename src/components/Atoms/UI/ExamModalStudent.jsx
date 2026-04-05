import React, { useState, useEffect } from 'react';

const ExamModalStudent = ({ 
  isOpen, 
  onClose, 
  onSave, 
  examData, 
  isEditing, 
  coursesData, 
  batchesData,
  loading 
}) => {
  const [formData, setFormData] = useState({
    batchId: '',
    batch: '',
    courseId: '',
    course: '',
    examTitle: '',
    date: '',
    durationHours: 0,
    durationMinutes: 0,
    passingPercentage: '',
    questions: []
  });

  useEffect(() => {
    if (examData && isEditing && examData._id) {
      const exam = examData;
      
      const hours = exam.examduration?.hours || 0;
      const minutes = exam.examduration?.minutes || 0;
      
      const formattedQuestions = (exam.questions || []).map((q, idx) => ({
        id: idx + 1,
        text: q.question || '',
        options: {
          A: q.option_1 || '',
          B: q.option_2 || '',
          C: q.option_3 || '',
          D: q.option_4 || ''
        },
        correctAnswer: q.answer || 'A'
      }));

      if (formattedQuestions.length === 0) {
        formattedQuestions.push({
          id: 1,
          text: '',
          options: { A: '', B: '', C: '', D: '' },
          correctAnswer: 'A'
        });
      }

      setFormData({
        batchId: exam.batch?._id || exam.batchId || '',
        batch: exam.batch || '',
        courseId: exam.course?._id || exam.courseId || '',
        course: exam.course || '',
        examTitle: exam.examtitle || '',
        date: exam.date || '',
        durationHours: hours,
        durationMinutes: minutes,
        passingPercentage: exam.passingPercentage || '',
        questions: formattedQuestions
      });
    } else if (!isEditing) {
      setFormData({
        batchId: '',
        batch: '',
        courseId: '',
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
            options: { A: '', B: '', C: '', D: '' },
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

  const handleSelectChange = (name, value, selectedItem) => {
    if (name === 'courseId') {
      setFormData(prev => ({
        ...prev,
        courseId: value,
        course: selectedItem
      }));
    } else if (name === 'batchId') {
      setFormData(prev => ({
        ...prev,
        batchId: value,
        batch: selectedItem
      }));
    }
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
          options: { A: '', B: '', C: '', D: '' },
          correctAnswer: 'A'
        }
      ]
    }));
  };

  const removeQuestion = (index) => {
    if (formData.questions.length === 1) return;
    const updatedQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      questions: updatedQuestions.map((q, idx) => ({ ...q, id: idx + 1 }))
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const examToSave = {
      examTitle: formData.examTitle,
      durationHours: parseInt(formData.durationHours) || 0,
      durationMinutes: parseInt(formData.durationMinutes) || 0,
      passingPercentage: parseInt(formData.passingPercentage),
      questions: formData.questions,
      courseId: formData.courseId,
      batchId: formData.batchId,
      course: formData.course,
      batch: formData.batch,
      date: formData.date
    };
    
    onSave(examToSave);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              {isEditing ? 'Edit Examination' : 'Add New Examination'}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Course *</label>
              <select
                value={formData.courseId}
                onChange={(e) => {
                  const selected = coursesData.find(c => c._id === e.target.value);
                  handleSelectChange('courseId', e.target.value, selected);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Course</option>
                {coursesData?.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.courseName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">Batch *</label>
              <select
                value={formData.batchId}
                onChange={(e) => {
                  const selected = batchesData?.find(b => b._id === e.target.value);
                  handleSelectChange('batchId', e.target.value, selected);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={!formData.courseId}
              >
                <option value="">Select Batch</option>
                {batchesData?.map((batch) => (
                  <option key={batch._id} value={batch._id}>
                    {batch.startTime} - {batch.endTime}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2 font-medium">Exam Title *</label>
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

            <div>
              <label className="block text-gray-700 mb-2 font-medium">Duration *</label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <input
                      type="number"
                      name="durationHours"
                      value={formData.durationHours}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-2 focus:outline-none rounded-l-md"
                      placeholder="Hours"
                    />
                    <span className="px-3 text-gray-500">hr</span>
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
                      className="w-full px-4 py-2 focus:outline-none rounded-l-md"
                      placeholder="Minutes"
                    />
                    <span className="px-3 text-gray-500">min</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">Passing Percentage *</label>
              <div className="flex items-center border border-gray-300 rounded-md">
                <input
                  type="number"
                  name="passingPercentage"
                  value={formData.passingPercentage}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  className="w-full px-4 py-2 focus:outline-none rounded-l-md"
                  required
                />
                <span className="px-3 text-gray-500">%</span>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Questions</h3>
              <button
                type="button"
                onClick={addQuestion}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm font-medium transition-colors"
              >
                + Add Question
              </button>
            </div>

            {formData.questions.map((question, index) => (
              <div key={question.id} className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold text-gray-700">Question {index + 1}</h4>
                  {formData.questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Question Text *</label>
                  <input
                    type="text"
                    value={question.text}
                    onChange={(e) => handleQuestionChange(index, 'text', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    placeholder="Enter question text"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {['A', 'B', 'C', 'D'].map((option) => (
                    <div key={option}>
                      <label className="block text-gray-700 mb-2">Option {option} *</label>
                      <input
                        type="text"
                        value={question.options[option]}
                        onChange={(e) => handleQuestionChange(index, `option_${option}`, e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        placeholder={`Enter option ${option}`}
                        required
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Correct Answer *</label>
                  <select
                    value={question.correctAnswer}
                    onChange={(e) => handleQuestionChange(index, 'answer', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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

          <div className="flex justify-end gap-4 sticky bottom-0 bg-white py-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : (isEditing ? 'Update Exam' : 'Submit Exam')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExamModalStudent;