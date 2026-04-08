import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const RoleExamModal = ({ isOpen, onClose, onSave, examData, isEditing, loading }) => {
  const [formData, setFormData] = useState({
    role: '',
    examTitle: '',
    durationHours: 0,
    durationMinutes: 0,
    passingPercentage: '',
    isDraft: false,
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

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && examData && isEditing) {
      console.log("Loading exam data for edit:", examData);
      
      // Extract duration from examDuration string or from hours/minutes
      let hours = 0;
      let minutes = 0;
      
      if (examData.examduration) {
        hours = examData.examduration.hours || 0;
        minutes = examData.examduration.minutes || 0;
      } else if (examData.examDuration) {
        // Handle string format like "2hr 30Min" or "2:30"
        const durationStr = examData.examDuration;
        const hoursMatch = durationStr.match(/(\d+)hr/);
        const minutesMatch = durationStr.match(/(\d+)Min/);
        hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
        minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;
      }
      
      // Handle questions
      let formattedQuestions = [];
      
      if (examData.questions && Array.isArray(examData.questions) && examData.questions.length > 0) {
        formattedQuestions = examData.questions.map((q, idx) => ({
          id: idx + 1,
          text: q.question || q.text || '',
          options: {
            A: q.option_1 || q.options?.A || '',
            B: q.option_2 || q.options?.B || '',
            C: q.option_3 || q.options?.C || '',
            D: q.option_4 || q.options?.D || ''
          },
          correctAnswer: q.answer || q.correctAnswer || 'A'
        }));
      } else {
        formattedQuestions = [{
          id: 1,
          text: '',
          options: { A: '', B: '', C: '', D: '' },
          correctAnswer: 'A'
        }];
      }
      
      setFormData({
        role: examData.role || '',
        examTitle: examData.examtitle || examData.examTitle || '',
        durationHours: hours,
        durationMinutes: minutes,
        passingPercentage: examData.passingPercentage || '',
        isDraft: examData.isDraft || false,
        questions: formattedQuestions
      });
    } else if (isOpen && !isEditing) {
      resetForm();
    }
  }, [examData, isEditing, isOpen]);

  const resetForm = () => {
    setFormData({
      role: '',
      examTitle: '',
      durationHours: 0,
      durationMinutes: 0,
      passingPercentage: '',
      isDraft: false,
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
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // If not draft and editing existing exam, prevent changes
    if (isEditing && !formData.isDraft) {
      toast.warning('Published exams cannot be edited. Please save as draft first.');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleQuestionChange = (index, field, value) => {
    // If not draft and editing existing exam, prevent changes
    if (isEditing && !formData.isDraft) {
      toast.warning('Published exams cannot be edited. Please save as draft first.');
      return;
    }
    
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
    // If not draft and editing existing exam, prevent changes
    if (isEditing && !formData.isDraft) {
      toast.warning('Published exams cannot be edited. Please save as draft first.');
      return;
    }
    
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

  const removeQuestion = (index) => {
    // If not draft and editing existing exam, prevent changes
    if (isEditing && !formData.isDraft) {
      toast.warning('Published exams cannot be edited. Please save as draft first.');
      return;
    }
    
    if (formData.questions.length === 1) {
      toast.warning('At least one question is required');
      return;
    }
    const updatedQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      questions: updatedQuestions.map((q, idx) => ({ ...q, id: idx + 1 }))
    }));
  };

  const validateForm = () => {
    if (!formData.role) {
      toast.error('Please select a role');
      return false;
    }
    if (!formData.examTitle.trim()) {
      toast.error('Please enter exam title');
      return false;
    }
    if (formData.durationHours === 0 && formData.durationMinutes === 0) {
      toast.error('Please set exam duration');
      return false;
    }
    if (!formData.passingPercentage) {
      toast.error('Please enter passing percentage');
      return false;
    }
    
    // Validate questions only if not draft
    if (!formData.isDraft) {
      for (let i = 0; i < formData.questions.length; i++) {
        const q = formData.questions[i];
        if (!q.text.trim()) {
          toast.error(`Question ${i + 1} text is required`);
          return false;
        }
        if (!q.options.A.trim() || !q.options.B.trim() || !q.options.C.trim() || !q.options.D.trim()) {
          toast.error(`All options for Question ${i + 1} are required`);
          return false;
        }
      }
    }
    
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const examToSave = {
      role: formData.role,
      examTitle: formData.examTitle.trim(),
      durationHours: parseInt(formData.durationHours) || 0,
      durationMinutes: parseInt(formData.durationMinutes) || 0,
      passingPercentage: parseInt(formData.passingPercentage),
      questions: formData.questions,
      isDraft: formData.isDraft
    };
    
    onSave(examToSave);
  };

  // Determine if fields should be disabled
  const isDisabled = isEditing && !formData.isDraft;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              {isEditing ? 'Edit Teacher Examination' : 'Add Teacher Examination'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
          </div>
          {isDisabled && (
            <div className="mt-2 text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
              ⚠️ This exam is published. To edit, please save it as a draft first.
            </div>
          )}
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6 mb-8">
              {/* Select Role */}
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Select Role *</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={isDisabled}
                >
                  <option value="">Select Role</option>
                  <option value="Photoshop">Photoshop</option>
                  <option value="Tally accounting">Tally accounting</option>
                  <option value="ms office">ms office</option>
                  <option value="Graphic Design">Graphic Design</option>
                  <option value="Web Development">Web Development</option>
                </select>
              </div>

              {/* Exam Title */}
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Exam Title *</label>
                <input
                  type="text"
                  name="examTitle"
                  value={formData.examTitle}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter exam title"
                  required
                  disabled={isDisabled}
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Duration *</label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm text-gray-600 mb-1">Hours</label>
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <input
                        type="number"
                        name="durationHours"
                        value={formData.durationHours}
                        onChange={handleInputChange}
                        min="0"
                        className="w-full px-4 py-2 focus:outline-none rounded-l-md"
                        disabled={isDisabled}
                      />
                      <span className="px-3 text-gray-500">hr</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm text-gray-600 mb-1">Minutes</label>
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <input
                        type="number"
                        name="durationMinutes"
                        value={formData.durationMinutes}
                        onChange={handleInputChange}
                        min="0"
                        max="59"
                        className="w-full px-4 py-2 focus:outline-none rounded-l-md"
                        disabled={isDisabled}
                      />
                      <span className="px-3 text-gray-500">min</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Passing Percentage */}
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
                    placeholder="Enter passing percentage"
                    required
                    disabled={isDisabled}
                  />
                  <span className="px-3 text-gray-500">%</span>
                </div>
              </div>

              {/* Draft Checkbox */}
              <div>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="isDraft"
                    checked={formData.isDraft}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    disabled={isEditing} 
                  />
                  <span className="text-gray-700 font-medium">Save as Draft</span>
                  <span className="text-sm text-gray-500">(Draft exams won't be visible to teachers)</span>
                </label>
              </div>
            </div>

            {/* Questions Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Questions</h3>
                <button
                  type="button"
                  onClick={addQuestion}
                  disabled={isDisabled}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm font-medium transition-colors disabled:opacity-50"
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
                        disabled={isDisabled}
                        className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
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
                      required={!formData.isDraft}
                      disabled={isDisabled}
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
                          required={!formData.isDraft}
                          disabled={isDisabled}
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
                      required={!formData.isDraft}
                      disabled={isDisabled}
                    >
                      <option value="A">Option A</option>
                      <option value="B">Option B</option>
                      <option value="C">Option C</option>
                      <option value="D">Option D</option>
                    </select>
                  </div>
                </div>
              ))}
              
              {formData.questions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No questions added. Click "Add Question" to create questions.
                </div>
              )}
            </div>

            {/* Submit Buttons */}
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
                disabled={loading || isDisabled}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : (isEditing ? 'Update Exam' : (formData.isDraft ? 'Save Draft' : 'Submit Exam'))}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RoleExamModal;