import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { axiosPrivate } from '../../../utils/axiosProvider';
import Loader from '../../Loader/Loader';

const GoalExamModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  examData, 
  isEditing, 
  goalsData,
  loading 
}) => {
  const [formData, setFormData] = useState({
    _id: '',
    goalName: '',
    examTitle: '',
    durationHours: 0,
    durationMinutes: 0,
    passingPercentage: '',
    isDraft: false,
    questions: [
      {
        id: 1,
        text: '',
        options: { A: '', B: '', C: '', D: '' },
        correctAnswer: 'A'
      }
    ]
  });
  
  const [fetchLoading, setFetchLoading] = useState(false);
  const [originalData, setOriginalData] = useState(null);

  // Fetch single document when editing
  useEffect(() => {
    const fetchSingleDocument = async () => {
      if (isOpen && isEditing && examData?._id) {
        setFetchLoading(true);
        try {
          const response = await axiosPrivate.get('/examinations/single-document', {
            params: { _id: examData._id }
          });
          
          const result = response?.data;
          if (result && result.data) {
            const fetchedData = result.data;
            setOriginalData(fetchedData);
            
            // Extract duration
            let hours = 0;
            let minutes = 0;
            
            if (fetchedData.examduration) {
              hours = fetchedData.examduration.hours || 0;
              minutes = fetchedData.examduration.minutes || 0;
            }
            
            // Handle questions
            let formattedQuestions = [];
            
            if (fetchedData.questions && Array.isArray(fetchedData.questions) && fetchedData.questions.length > 0) {
              formattedQuestions = fetchedData.questions.map((q, idx) => ({
                id: idx + 1,
                text: q.question || q.text || '',
                options: {
                  A: q.option_1 || q.options?.A || '',
                  B: q.option_2 || q.options?.B || '',
                  C: q.option_3 || q.options?.C || '',
                  D: q.option_4 || q.options?.D || ''
                },
                correctAnswer: q.answer || q.correctAnswer || 'A',
                _id: q._id // Store original question ID for updates
              }));
            }
            
            setFormData({
              _id: fetchedData._id,
              goalName: fetchedData.goal || '',
              examTitle: fetchedData.examtitle || '',
              durationHours: hours,
              durationMinutes: minutes,
              passingPercentage: fetchedData.passingPercentage || '',
              isDraft: fetchedData.isDraft || false,
              questions: formattedQuestions
            });
          }
        } catch (error) {
          console.error("Error fetching exam data:", error);
          toast.error(error.response?.data?.message || "Failed to fetch exam data");
        } finally {
          setFetchLoading(false);
        }
      }
    };
    
    fetchSingleDocument();
  }, [isOpen, isEditing, examData]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && examData && isEditing && !originalData) {
      // Fallback to passed examData if single document fetch fails
      console.log("Loading exam data for edit:", examData);
      
      let hours = 0;
      let minutes = 0;
      
      if (examData.examduration) {
        hours = examData.examduration.hours || 0;
        minutes = examData.examduration.minutes || 0;
      }
      
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
      }
      
      setFormData({
        _id: examData._id || '',
        goalName: examData.goal?._id || examData.goal || '',
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
  }, [examData, isEditing, isOpen, originalData]);

  const resetForm = () => {
    setFormData({
      _id: '',
      goalName: '',
      examTitle: '',
      durationHours: 0,
      durationMinutes: 0,
      passingPercentage: '',
      isDraft: false,
      questions: [
        {
          id: 1,
          text: '',
          options: { A: '', B: '', C: '', D: '' },
          correctAnswer: 'A'
        }
      ]
    });
    setOriginalData(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
          options: { A: '', B: '', C: '', D: '' },
          correctAnswer: 'A'
        }
      ]
    }));
  };

  const removeQuestion = (index) => {
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
    if (!formData.goalName) {
      toast.error('Please select a goal');
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
    if (formData.passingPercentage < 0 || formData.passingPercentage > 100) {
      toast.error('Passing percentage must be between 0 and 100');
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
      _id: formData._id,
      goalName: formData.goalName,
      examTitle: formData.examTitle.trim(),
      durationHours: parseInt(formData.durationHours) || 0,
      durationMinutes: parseInt(formData.durationMinutes) || 0,
      passingPercentage: parseInt(formData.passingPercentage),
      questions: formData.questions.map(q => ({
        text: q.text,
        options: q.options,
        correctAnswer: q.correctAnswer,
        ...(q._id && { _id: q._id }) // Include _id if it exists for updates
      })),
      isDraft: formData.isDraft
    };
    
    onSave(examToSave);
  };

  // Show loading state while fetching data
  if (fetchLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl p-8">
          <Loader loading={true} />
        </div>
      </div>
    );
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              {isEditing ? 'Edit Goal Examination' : 'Add Goal Examination'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
          {formData.isDraft && (
            <div className="mt-2 text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
              ⚠️ This exam is in draft mode. You can edit all fields.
            </div>
          )}
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Select Goal <span className="text-red-500">*</span>
                </label>
                <select
                  name="goalName"
                  value={formData.goalName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                >
                  <option value="">Select Goal</option>
                  {goalsData?.map((goal) => (
                    <option key={goal._id} value={goal._id}>
                      {goal.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Exam Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="examTitle"
                  value={formData.examTitle}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="Enter exam title"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Duration <span className="text-red-500">*</span>
                </label>
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
                      />
                      <span className="px-3 text-gray-500">min</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Passing Percentage <span className="text-red-500">*</span>
                </label>
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
                  />
                  <span className="px-3 text-gray-500">%</span>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="isDraft"
                    checked={formData.isDraft}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
                  />
                  <span className="text-gray-700 font-medium">Save as Draft</span>
                  <span className="text-sm text-gray-500">(Draft exams won't be visible to employees)</span>
                </label>
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
                    <h4 className="font-medium text-gray-700">Question {index + 1}</h4>
                    {formData.questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(index)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">
                      Question Text <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={question.text}
                      onChange={(e) => handleQuestionChange(index, 'text', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                      placeholder="Enter question text"
                      required={!formData.isDraft}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {['A', 'B', 'C', 'D'].map((option) => (
                      <div key={option}>
                        <label className="block text-gray-700 mb-2">
                          Option {option} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={question.options[option]}
                          onChange={(e) => handleQuestionChange(index, `option_${option}`, e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                          placeholder={`Enter option ${option}`}
                          required={!formData.isDraft}
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">
                      Correct Answer <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={question.correctAnswer}
                      onChange={(e) => handleQuestionChange(index, 'answer', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                      required={!formData.isDraft}
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

            <div className="flex justify-end gap-4 sticky bottom-0 bg-white py-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700 font-medium transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 font-medium transition-colors disabled:opacity-50"
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

export default GoalExamModal;