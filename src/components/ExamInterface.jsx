import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { studentExamsListDetails } from '../redux/slices/studentSlice';
import Loader from './Loader/Loader';

const ExamInterface = ({ examId, initialExamData, onBack }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [loading, setLoading] = useState(!initialExamData);
  const [submitting, setSubmitting] = useState(false);
  const [examData, setExamData] = useState(initialExamData || null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState([]);
  const [visitedQuestions, setVisitedQuestions] = useState(new Set([0]));
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [violations, setViolations] = useState(0);
  const [showViolationModal, setShowViolationModal] = useState(false);
  const [violationMessage, setViolationMessage] = useState('');
  
  const MAX_VIOLATIONS = 3;
  const visibilityRef = useRef(true);
  const tabSwitchCount = useRef(0); 

  useEffect(() => {
    const fetchExamDetails = async () => {
      if (!initialExamData) {
        setLoading(true);
        try {
          const response = await dispatch(studentExamsListDetails({ examId }));
          const data = response.payload;
          
          if (data?.success) {
            setExamData(data.data);
            const formattedQuestions = (data.data.questions || []).map(q => ({
              questionText: q.question,
              options: [q.option_1, q.option_2, q.option_3, q.option_4].filter(Boolean)
            }));
            setQuestions(formattedQuestions);
            
            const initialAnswers = {};
            formattedQuestions.forEach((_, index) => {
              initialAnswers[index] = null;
            });
            setAnswers(initialAnswers);
            
            const duration = data.data.examduration;
            const totalSeconds = (duration.hours || 0) * 3600 + (duration.minutes || 0) * 60;
            setTimeRemaining(totalSeconds);
            
            const attempts = parseInt(sessionStorage.getItem(`exam_${examId}_attempts`) || "0");
            sessionStorage.setItem(`exam_${examId}_attempts`, (attempts + 1).toString());
          } else {
            toast.error("Failed to load exam details");
            onBack();
          }
        } catch (error) {
          toast.error("Error loading exam");
          onBack();
        } finally {
          setLoading(false);
        }
      } else {
        const formattedQuestions = (initialExamData.questions || []).map(q => ({
          questionText: q.question,
          options: [q.option_1, q.option_2, q.option_3, q.option_4].filter(Boolean)
        }));
        setQuestions(formattedQuestions);
        
        const initialAnswers = {};
        formattedQuestions.forEach((_, index) => {
          initialAnswers[index] = null;
        });
        setAnswers(initialAnswers);
        
        const duration = initialExamData.examduration;
        const totalSeconds = (duration.hours || 0) * 3600 + (duration.minutes || 0) * 60;
        setTimeRemaining(totalSeconds);
        setLoading(false);
      }
    };

    fetchExamDetails();
  }, [examId, initialExamData, onBack, dispatch]);

  useEffect(() => {
    if (!examData || submitting) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        visibilityRef.current = false;
        const newViolationCount = tabSwitchCount.current + 1;
        tabSwitchCount.current = newViolationCount;
        setViolations(newViolationCount);
        setViolationMessage(`Tab switching detected! Violation ${newViolationCount}/${MAX_VIOLATIONS}`);
        setShowViolationModal(true);
        toast.warning(`Warning: Tab switching detected! (${newViolationCount}/${MAX_VIOLATIONS})`);
        
        if (newViolationCount >= MAX_VIOLATIONS) {
          toast.error('Maximum violations reached. Submitting exam...');
          handleSubmitExam(true, 'max_violations');
        }
      } else {
        visibilityRef.current = true;
      }
    };

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
      const newViolationCount = tabSwitchCount.current + 1;
      tabSwitchCount.current = newViolationCount;
      sessionStorage.setItem(`exam_${examId}_violations`, newViolationCount.toString());
      
      if (newViolationCount >= MAX_VIOLATIONS) {
        navigator.sendBeacon('/api/student/submit-exam', JSON.stringify({
          examId: examId,
          studentanswer: Object.values(answers).filter(a => a !== null),
          type: "Role",
          autoSubmit: true,
          reason: 'max_violations'
        }));
      }
      return '';
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
      const newViolationCount = tabSwitchCount.current + 1;
      tabSwitchCount.current = newViolationCount;
      setViolations(newViolationCount);
      setViolationMessage(`Right click detected! Violation ${newViolationCount}/${MAX_VIOLATIONS}`);
      setShowViolationModal(true);
      toast.warning(`Warning: Right click is disabled! (${newViolationCount}/${MAX_VIOLATIONS})`);
      
      if (newViolationCount >= MAX_VIOLATIONS) {
        toast.error('Maximum violations reached. Submitting exam...');
        handleSubmitExam(true, 'max_violations');
      }
    };

    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (['c', 'v', 'x', 'a'].includes(e.key)) {
          e.preventDefault();
          const newViolationCount = tabSwitchCount.current + 1;
          tabSwitchCount.current = newViolationCount;
          setViolations(newViolationCount);
          setViolationMessage(`Copy/Paste detected! Violation ${newViolationCount}/${MAX_VIOLATIONS}`);
          setShowViolationModal(true);
          toast.warning(`Warning: Copy/Paste is disabled! (${newViolationCount}/${MAX_VIOLATIONS})`);
          
          if (newViolationCount >= MAX_VIOLATIONS) {
            toast.error('Maximum violations reached. Submitting exam...');
            handleSubmitExam(true, 'max_violations');
          }
        }
      }
      
      if (e.key === 'F5' || (e.ctrlKey && e.key === 'r') || (e.ctrlKey && e.shiftKey && e.key === 'r')) {
        e.preventDefault();
        toast.warning('Page refresh is disabled during exam');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.userSelect = 'none';

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.userSelect = '';
    };
  }, [examData, submitting, answers]);

  useEffect(() => {
    if (!timeRemaining || timeRemaining <= 0 || submitting) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam(true, 'timeout');
          return 0;
        }
        if (prev === 300) {
          setShowWarningModal(true);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, submitting]);

  const handleAnswerSelect = (answer) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: answer
    }));
    markQuestionVisited(currentQuestion);
  };

  const markQuestionVisited = (questionIndex) => {
    setVisitedQuestions(prev => new Set([...prev, questionIndex]));
  };

  const toggleMarkForReview = () => {
    setMarkedForReview(prev => 
      prev.includes(currentQuestion)
        ? prev.filter(q => q !== currentQuestion)
        : [...prev, currentQuestion]
    );
    markQuestionVisited(currentQuestion);
  };

  const goToQuestion = (index) => {
    setCurrentQuestion(index);
    markQuestionVisited(index);
  };

  const goToNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      markQuestionVisited(currentQuestion + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      markQuestionVisited(currentQuestion - 1);
    }
  };

  const handleSubmitExam = async (isAutoSubmit = false, reason = '') => {
    setSubmitting(true);
    
    try {
      const formattedAnswers = Object.values(answers).filter(answer => answer !== null);
      const payload = {
        examId: examId,
        studentanswer: formattedAnswers,
        type: "Role",
        violations: tabSwitchCount.current
      };

      if (isAutoSubmit) {
        payload.autoSubmit = true;
        payload.reason = reason;
      }

      const response = await fetch('/api/student/submit-exam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        sessionStorage.removeItem(`exam_${examId}_started`);
        sessionStorage.removeItem(`exam_${examId}_violations`);
        
        const message = isAutoSubmit 
          ? reason === 'max_violations' 
            ? 'Maximum violations reached. Exam submitted!'
            : 'Time up! Exam submitted successfully!'
          : 'Exam submitted successfully!';
        
        toast.success(message);
        navigate('/exam-results', { 
          state: { 
            examId,
            results: data.data,
            examTitle: examData?.examtitle
          } 
        });
      } else {
        toast.error(data.message || 'Failed to submit exam');
        setSubmitting(false);
        setShowSubmitModal(false);
      }
    } catch (error) {
      toast.error('Failed to submit exam');
      setSubmitting(false);
      setShowSubmitModal(false);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds) return '00:00:00';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (!timeRemaining) return 'text-gray-600';
    if (timeRemaining < 300) return 'text-red-600';
    if (timeRemaining < 600) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getQuestionStatus = (index) => {
    if (markedForReview.includes(index)) return 'review';
    if (answers[index] !== null) return 'answered';
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

  const calculateStats = () => {
    const total = questions.length;
    const answered = Object.values(answers).filter(a => a !== null).length;
    const notVisited = total - visitedQuestions.size;
    const markedCount = markedForReview.length;
    return { total, answered, notVisited, markedCount };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader loading={true} />
      </div>
    );
  }

  const stats = calculateStats();
  const currentQ = questions[currentQuestion];
  const violationsLeft = MAX_VIOLATIONS - violations;

  return (
    <div className="min-h-screen bg-gray-50">
      {showViolationModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setShowViolationModal(false)}></div>
            <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Violation Detected!</h3>
                <p className="text-sm text-gray-500 mb-2">{violationMessage}</p>
                <p className="text-sm font-semibold text-red-600 mb-4">
                  Warnings remaining: {violationsLeft}
                </p>
                <button
                  onClick={() => setShowViolationModal(false)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Continue Exam
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showWarningModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setShowWarningModal(false)}></div>
            <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                  <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">5 Minutes Remaining!</h3>
                <p className="text-sm text-gray-500 mb-4">
                  You have only 5 minutes left. Please finish your exam soon.
                </p>
                <button
                  onClick={() => setShowWarningModal(false)}
                  className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
                >
                  Continue Exam
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSubmitModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setShowSubmitModal(false)}></div>
            <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Submit Exam</h3>
              <p className="text-gray-600 mb-4">
                You have answered {stats.answered} out of {stats.total} questions.
                {stats.total - stats.answered > 0 && (
                  <span className="text-red-500 block mt-1">
                    {stats.total - stats.answered} question(s) are still unanswered.
                  </span>
                )}
              </p>
              <p className="text-gray-600 mb-6">Are you sure you want to submit?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleSubmitExam(false)}
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Yes, Submit'}
                </button>
                <button
                  onClick={() => setShowSubmitModal(false)}
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
                title="Back to Exams"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div>
                <h2 className="text-xl font-bold text-gray-800">{examData?.examtitle}</h2>
                <p className="text-sm text-gray-600">{examData?.course?.courseName}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-sm text-gray-600">Violations</p>
                <p className={`font-bold ${violationsLeft <= 1 ? 'text-red-600' : 'text-orange-600'}`}>
                  {violations}/{MAX_VIOLATIONS}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Progress</p>
                <p className="font-semibold">{stats.answered}/{stats.total}</p>
              </div>
              <div className={`flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg ${getTimerColor()}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-mono font-bold text-lg">
                  {formatTime(timeRemaining)}
                </span>
              </div>
              <button
                onClick={() => setShowSubmitModal(true)}
                disabled={submitting}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50"
              >
                Submit Exam
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                <button
                  onClick={toggleMarkForReview}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                    markedForReview.includes(currentQuestion)
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <svg className="w-5 h-5" fill={markedForReview.includes(currentQuestion) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  {markedForReview.includes(currentQuestion) ? 'Marked for Review' : 'Mark for Review'}
                </button>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-800 mb-6">{currentQ?.questionText}</h3>
                <div className="space-y-3">
                  {currentQ?.options?.map((option, index) => (
                    <label
                      key={index}
                      className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition ${
                        answers[currentQuestion] === option
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="question"
                        value={option}
                        checked={answers[currentQuestion] === option}
                        onChange={() => handleAnswerSelect(option)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t">
                <button
                  onClick={goToPreviousQuestion}
                  disabled={currentQuestion === 0}
                  className="flex items-center gap-2 px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>
                
                {currentQuestion < questions.length - 1 ? (
                  <button
                    onClick={goToNextQuestion}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Next
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ) : (
                  <button
                    onClick={() => setShowSubmitModal(true)}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    Review & Submit
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="w-80">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-20">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Question Palette</h3>
              
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

              <div className="grid grid-cols-5 gap-2 max-h-96 overflow-y-auto p-1">
                {questions.map((_, index) => {
                  const status = getQuestionStatus(index);
                  return (
                    <button
                      key={index}
                      onClick={() => goToQuestion(index)}
                      className={`
                        w-10 h-10 rounded-lg font-medium text-sm transition
                        ${getStatusColor(status)}
                        ${currentQuestion === index ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
                      `}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamInterface;