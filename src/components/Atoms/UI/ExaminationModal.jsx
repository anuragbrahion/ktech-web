// components/ExaminationModal/ExaminationModal.jsx
import React, { useState } from 'react';

const ExaminationModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    batch: initialData?.batch || '',
    course: initialData?.course || '',
    examTitle: initialData?.examTitle || '',
    date: initialData?.date || '',
    durationHours: initialData?.durationHours || '0',
    durationMinutes: initialData?.durationMinutes || '0',
    passingPercentage: initialData?.passingPercentage || '',
    questions: initialData?.questions || [
      { 
        question: '', 
        optionA: '', 
        optionB: '', 
        optionC: '', 
        optionD: '', 
        answer: '' 
      }
    ]
  });

  const batches = [
    '07:00 - 08:00',
    '08:00 - 09:00', 
    '09:00 - 10:00',
    '10:00 - 11:00',
    '11:00 - 12:00',
    '12:00 - 13:00',
    '13:00 - 14:00',
    '14:00 - 15:00',
    '15:00 - 16:00',
    '16:00 - 17:00',
    '17:00 - 18:00',
    '18:00 - 19:00'
  ];

  const courses = [
    'ms office',
    'Tally accounting',
    'Photoshop',
    'CorelDraw',
    'HTML',
    'c language',
    'C++'
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

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[index][field] = value;
    setFormData(prev => ({
      ...prev,
      questions: newQuestions
    }));
  };

  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        { question: '', optionA: '', optionB: '', optionC: '', optionD: '', answer: '' }
      ]
    }));
  };

  const removeQuestion = (index) => {
    if (formData.questions.length > 1) {
      const newQuestions = [...formData.questions];
      newQuestions.splice(index, 1);
      setFormData(prev => ({
        ...prev,
        questions: newQuestions
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl">
        <div className="bg-sky-500 text-white p-4 rounded-t-lg">
          <h2 className="text-xl font-semibold">
            {initialData ? 'Edit Examination' : 'Add/Edit Examination'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-black mb-2">Batch</label>
              <select
                name="batch"
                value={formData.batch}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                required
              >
                <option value="">Select Batch</option>
                {batches.map((batch, index) => (
                  <option key={index} value={batch}>{batch}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-black mb-2">Course</label>
              <select
                name="course"
                value={formData.course}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                required
              >
                <option value="">Select Course</option>
                {courses.map((course, index) => (
                  <option key={index} value={course}>{course}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-black mb-2">Exam Title</label>
              <input
                type="text"
                name="examTitle"
                value={formData.examTitle}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                required
              />
            </div>

            <div>
              <label className="block text-black mb-2">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                required
              />
            </div>

            <div>
              <label className="block text-black mb-2">Duration</label>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <input
                    type="number"
                    name="durationHours"
                    value={formData.durationHours}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                    placeholder="Hours"
                    min="0"
                    max="24"
                  />
                  <p className="text-xs text-gray-500 mt-1">Duration Hours</p>
                </div>
                <div className="flex-1">
                  <input
                    type="number"
                    name="durationMinutes"
                    value={formData.durationMinutes}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                    placeholder="Minutes"
                    min="0"
                    max="59"
                  />
                  <p className="text-xs text-gray-500 mt-1">Duration Minutes</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-black mb-2">Passing Percentage</label>
              <div className="relative">
                <input
                  type="number"
                  name="passingPercentage"
                  value={formData.passingPercentage}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                  placeholder="e.g., 70"
                  min="0"
                  max="100"
                  required
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  %
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-sky-700 mb-4">Questions</h3>
            {formData.questions.map((q, index) => (
              <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-md font-medium text-black">Question {index + 1}</h4>
                  {formData.questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove Question
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-black mb-2">Question</label>
                    <input
                      type="text"
                      value={q.question}
                      onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                      placeholder={`Enter question ${index + 1}`}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-black mb-2">Option A</label>
                      <input
                        type="text"
                        value={q.optionA}
                        onChange={(e) => handleQuestionChange(index, 'optionA', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-black mb-2">Option B</label>
                      <input
                        type="text"
                        value={q.optionB}
                        onChange={(e) => handleQuestionChange(index, 'optionB', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-black mb-2">Option C</label>
                      <input
                        type="text"
                        value={q.optionC}
                        onChange={(e) => handleQuestionChange(index, 'optionC', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-black mb-2">Option D</label>
                      <input
                        type="text"
                        value={q.optionD}
                        onChange={(e) => handleQuestionChange(index, 'optionD', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-black mb-2">Correct Answer</label>
                    <select
                      value={q.answer}
                      onChange={(e) => handleQuestionChange(index, 'answer', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                      required
                    >
                      <option value="">Select correct option</option>
                      <option value="A">Option A</option>
                      <option value="B">Option B</option>
                      <option value="C">Option C</option>
                      <option value="D">Option D</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addQuestion}
              className="w-full py-3 border-2 border-dashed border-sky-300 text-sky-500 hover:bg-sky-50 rounded-lg"
            >
              + Add your question
            </button>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t">
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
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExaminationModal;