import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { axiosPrivate } from "../utils/axiosProvider";
import Loader from "./Loader/Loader";

const GoalExamPage = () => {
  const { goalId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const goalData = location.state || {};

  // State management
  const [loading, setLoading] = useState(true);
  const [examData, setExamData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [violationCount, setViolationCount] = useState(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState({});
  const [examStarted, setExamStarted] = useState(false);
  const [devToolsOpen, setDevToolsOpen] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  // Refs
  const timerRef = useRef(null);
  const devToolsCheckRef = useRef(null);

  // Fetch exam questions
  useEffect(() => {
    const fetchGoalExam = async () => {
      setLoading(true);
      try {
        const response = await axiosPrivate.get(`/examinations/goal/${goalId}`);
        const result = response?.data;

        if (result && result.data) {
          setExamData(result.data);

          const totalSeconds =
            (result.data.examduration?.hours || 0) * 3600 +
            (result.data.examduration?.minutes || 0) * 60;

          setTimeLeft(totalSeconds);

          // Load saved answers from session storage
          const savedAnswers = sessionStorage.getItem(`goal_exam_${goalId}_answers`);
          if (savedAnswers) {
            setAnswers(JSON.parse(savedAnswers));
          }

          const savedFlagged = sessionStorage.getItem(`goal_exam_${goalId}_flagged`);
          if (savedFlagged) {
            setFlaggedQuestions(JSON.parse(savedFlagged));
          }
        } else {
          toast.error("Failed to load exam data");
          navigate("/teacher/assigned-goal");
        }
      } catch (error) {
        console.error("Error fetching exam:", error);
        toast.error(error.response?.data?.message || "Failed to load exam data");
        navigate("/teacher/assigned-goal");
      } finally {
        setLoading(false);
      }
    };

    if (goalId) {
      fetchGoalExam();
    }
  }, [goalId, navigate]);

  // Check for developer tools
  useEffect(() => {
    const checkDevTools = () => {
      const threshold = 160;
      const widthDiff = window.outerWidth - window.innerWidth > threshold;
      const heightDiff = window.outerHeight - window.innerHeight > threshold;
      
      if (widthDiff || heightDiff) {
        if (!devToolsOpen && examStarted && !isSubmitting) {
          setDevToolsOpen(true);
          setViolationCount((prev) => {
            const newCount = prev + 1;
            if (newCount >= 3) {
              toast.error("Developer tools detected! Exam will be auto-submitted.");
              handleAutoSubmit();
            } else {
              toast.warning(`Developer tools detected! ${3 - newCount} violation(s) remaining.`);
            }
            return newCount;
          });
        }
      } else {
        setDevToolsOpen(false);
      }
    };

    if (examStarted) {
      devToolsCheckRef.current = setInterval(checkDevTools, 1000);
    }

    return () => {
      if (devToolsCheckRef.current) {
        clearInterval(devToolsCheckRef.current);
      }
    };
  }, [examStarted, devToolsOpen, isSubmitting]);

  // Timer logic
  useEffect(() => {
    if (timeLeft > 0 && !isSubmitting && examStarted) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timeLeft, isSubmitting, examStarted]);

  // Save answers to session storage
  useEffect(() => {
    if (goalId && Object.keys(answers).length > 0 && examStarted) {
      sessionStorage.setItem(`goal_exam_${goalId}_answers`, JSON.stringify(answers));
    }
  }, [answers, goalId, examStarted]);

  // Save flagged questions to session storage
  useEffect(() => {
    if (goalId && Object.keys(flaggedQuestions).length > 0 && examStarted) {
      sessionStorage.setItem(`goal_exam_${goalId}_flagged`, JSON.stringify(flaggedQuestions));
    }
  }, [flaggedQuestions, goalId, examStarted]);

  // Security measures
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullScreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      
      if (!isCurrentlyFullScreen && examStarted && !isSubmitting) {
        setViolationCount((prev) => {
          const newCount = prev + 1;
          if (newCount >= 3) {
            toast.error("Exited fullscreen mode! Exam will be auto-submitted.");
            handleAutoSubmit();
          } else {
            toast.warning(`Fullscreen mode exited! ${3 - newCount} violation(s) remaining.`);
            requestFullscreen();
          }
          return newCount;
        });
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && examStarted && !isSubmitting) {
        setViolationCount((prev) => {
          const newCount = prev + 1;
          if (newCount >= 3) {
            toast.error("Tab switch detected! Exam will be auto-submitted.");
            handleAutoSubmit();
          } else {
            toast.warning(`Tab switch detected! ${3 - newCount} violation(s) remaining.`);
          }
          return newCount;
        });
      }
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
      toast.warning("Right-click is disabled during the exam");
      return false;
    };

    const handleKeyDown = (e) => {
      if (
        (e.ctrlKey && (e.key === "c" || e.key === "v" || e.key === "x")) ||
        (e.metaKey && (e.key === "c" || e.key === "v" || e.key === "x"))
      ) {
        e.preventDefault();
        toast.warning("Copy-paste is disabled during the exam");
        return false;
      }

      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && e.key === "I") ||
        (e.ctrlKey && e.shiftKey && e.key === "J") ||
        (e.ctrlKey && e.key === "U") ||
        (e.ctrlKey && e.shiftKey && e.key === "C")
      ) {
        e.preventDefault();
        toast.warning("Developer tools are disabled during the exam");
        return false;
      }
    };

    if (examStarted && !isSubmitting) {
      document.addEventListener("fullscreenchange", handleFullscreenChange);
      document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.addEventListener("mozfullscreenchange", handleFullscreenChange);
      document.addEventListener("MSFullscreenChange", handleFullscreenChange);
      document.addEventListener("visibilitychange", handleVisibilityChange);
      document.addEventListener("contextmenu", handleContextMenu);
      document.addEventListener("keydown", handleKeyDown);
      
      hideSidebarAndHeader();
    }

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      
      restoreSidebarAndHeader();
      exitFullscreen();
    };
  }, [examStarted, isSubmitting]);

  const hideSidebarAndHeader = () => {
    const sidebar = document.querySelector('.sidebar, [class*="sidebar"], nav:first-child');
    if (sidebar) sidebar.style.display = 'none';
    
    const header = document.querySelector('header, .navbar, [class*="header"]');
    if (header) header.style.display = 'none';
    
    document.body.style.paddingTop = '0';
    document.body.style.marginTop = '0';
  };

  const restoreSidebarAndHeader = () => {
    const sidebar = document.querySelector('.sidebar, [class*="sidebar"], nav:first-child');
    if (sidebar) sidebar.style.display = '';
    
    const header = document.querySelector('header, .navbar, [class*="header"]');
    if (header) header.style.display = '';
    
    document.body.style.paddingTop = '';
    document.body.style.marginTop = '';
  };

  const requestFullscreen = async () => {
    try {
      const elem = document.documentElement;
      if (elem.requestFullscreen) await elem.requestFullscreen();
      else if (elem.webkitRequestFullscreen) await elem.webkitRequestFullscreen();
      else if (elem.msRequestFullscreen) await elem.msRequestFullscreen();
    } catch (error) {
      console.error("Fullscreen request failed:", error);
    }
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
  };

  const startExam = async () => {
    await requestFullscreen();
    setShowInstructions(false);
    setExamStarted(true);
  };

  const handleAutoSubmit = async () => {
    if (isSubmitting) return;
    toast.warning("Time's up! Submitting your exam...");
    await handleSubmitExam();
  };

  const handleAnswerSelect = (questionIndex, selectedOption) => {
    if (!examStarted) return;
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: selectedOption,
    }));
  };

  const handleNavigateToQuestion = (index) => {
    if (!examStarted) return;
    setCurrentQuestionIndex(index);
  };

  const handleFlagQuestion = (index) => {
    if (!examStarted) return;
    setFlaggedQuestions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleSubmitExam = async () => {
    if (isSubmitting || !examStarted) return;

    const totalQuestions = examData.questions.length;
    const answeredQuestions = Object.keys(answers).length;

    if (answeredQuestions < totalQuestions) {
      const confirmSubmit = window.confirm(
        `You have answered ${answeredQuestions} out of ${totalQuestions} questions. Do you still want to submit?`
      );
      if (!confirmSubmit) return;
    }

    setIsSubmitting(true);

    try {
      if (timerRef.current) clearInterval(timerRef.current);

      // Prepare student answers array with blanks for unanswered questions
      const studentAnswers = [];
      for (let i = 0; i < totalQuestions; i++) {
        studentAnswers.push(answers[i] || "");
      }

      // Prepare submission payload
      const submissionPayload = {
        examId: examData._id,
        studentanswer: studentAnswers,
        goalId: goalId,
        type: "Goal"
      };

      const response = await axiosPrivate.post("/examinations/submit", submissionPayload);
      
      if (response?.data) {
        toast.success(response.data.message || "Exam submitted successfully!");
        
        sessionStorage.removeItem(`goal_exam_${goalId}_answers`);
        sessionStorage.removeItem(`goal_exam_${goalId}_flagged`);
        
        exitFullscreen();
        
        navigate("/teacher/assigned-goal", {
          state: { message: "Exam submitted successfully!" }
        });
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to submit exam");
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return <Loader loading={true} />;
  }

  if (!examData || !examData.questions || examData.questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">No Questions Found</h2>
          <button
            onClick={() => navigate("/teacher/assigned-goal")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Assigned Goals
          </button>
        </div>
      </div>
    );
  }

  // Show instructions modal
  if (showInstructions) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 p-8">
          <div className="text-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-6 -mt-12 -mx-8 mb-6">
              <h1 className="text-2xl font-bold">{examData.examtitle}</h1>
              <p className="text-blue-100 mt-2">Exam Instructions</p>
            </div>
          </div>
          
          <div className="space-y-4 mb-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Goal</p>
                <p className="text-lg font-bold text-blue-600">{goalData.goalName || 'N/A'}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Designation</p>
                <p className="text-lg font-bold text-green-600">{goalData.designationName || 'N/A'}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Total Questions</p>
                <p className="text-2xl font-bold text-purple-600">{examData.questions.length}</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Duration</p>
                <p className="text-2xl font-bold text-orange-600">
                  {examData.examduration?.hours || 0}h {examData.examduration?.minutes || 0}m
                </p>
              </div>
              <div className="bg-indigo-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Passing %</p>
                <p className="text-2xl font-bold text-indigo-600">{examData.passingPercentage}%</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Max Attempts</p>
                <p className="text-2xl font-bold text-red-600">3</p>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-800 mb-3">Important Guidelines:</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>The exam will be in fullscreen mode</li>
                <li>Leaving fullscreen or switching tabs will be counted as a violation</li>
                <li>Maximum 3 violations allowed - exam will auto-submit on 3rd violation</li>
                <li>Developer tools are strictly prohibited</li>
                <li>Copy-paste and right-click are disabled</li>
                <li>Read each question carefully before answering</li>
                <li>You can navigate between questions using the question palette</li>
                <li>The exam will be automatically submitted when the timer reaches zero</li>
                <li>Do not refresh the page during the exam</li>
                <li>Your answers are saved automatically</li>
                <li>Once submitted, you cannot retake the exam</li>
              </ul>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={startExam}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition shadow-lg"
            >
              Start Exam Now
            </button>
            <button
              onClick={() => navigate("/teacher/assigned-goal")}
              className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = examData.questions[currentQuestionIndex];
  const totalQuestions = examData.questions.length;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-gray-50" style={{ margin: 0, padding: 0 }}>
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-lg z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <div>
              <h1 className="text-lg font-bold text-gray-900">{examData.examtitle}</h1>
              <p className="text-sm text-gray-500">
                {answeredCount} of {totalQuestions} answered
              </p>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-mono font-bold ${timeLeft < 300 ? "text-red-600 animate-pulse" : "text-blue-600"}`}>
                {formatTime(timeLeft)}
              </div>
              <p className="text-xs text-gray-500">Time Remaining</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Question Panel */}
            <div className="flex-1">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6 pb-4 border-b">
                  <div className="text-sm text-gray-500">
                    Question {currentQuestionIndex + 1} of {totalQuestions}
                  </div>
                  <button
                    onClick={() => handleFlagQuestion(currentQuestionIndex)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                      flaggedQuestions[currentQuestionIndex]
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {flaggedQuestions[currentQuestionIndex] ? "★ Flagged" : "☆ Flag"}
                  </button>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {currentQuestion.question}
                  </h3>

                  <div className="space-y-3">
                    {[
                      currentQuestion.option_1,
                      currentQuestion.option_2,
                      currentQuestion.option_3,
                      currentQuestion.option_4,
                    ].map((option, optIndex) => (
                      <label
                        key={optIndex}
                        className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                          answers[currentQuestionIndex] === option
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question_${currentQuestionIndex}`}
                          value={option}
                          checked={answers[currentQuestionIndex] === option}
                          onChange={() => handleAnswerSelect(currentQuestionIndex, option)}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-3 text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t">
                  <button
                    onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                    disabled={currentQuestionIndex === 0}
                    className={`px-6 py-2 rounded-lg font-medium transition ${
                      currentQuestionIndex === 0
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Previous
                  </button>
                  {currentQuestionIndex === totalQuestions - 1 ? (
                    <button
                      onClick={() => setShowSubmitModal(true)}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
                    >
                      Submit Exam
                    </button>
                  ) : (
                    <button
                      onClick={() => setCurrentQuestionIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Question Palette */}
            <div className="lg:w-80">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                <h3 className="font-semibold text-gray-900 mb-4">Question Palette</h3>
                <div className="grid grid-cols-5 gap-2 mb-4">
                  {examData.questions.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleNavigateToQuestion(idx)}
                      className={`
                        w-10 h-10 rounded-lg font-semibold text-sm transition
                        ${currentQuestionIndex === idx ? "ring-2 ring-blue-500 ring-offset-2" : ""}
                        ${
                          answers[idx]
                            ? "bg-green-500 text-white hover:bg-green-600"
                            : flaggedQuestions[idx]
                            ? "bg-yellow-500 text-white hover:bg-yellow-600"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }
                      `}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="text-gray-600">Answered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span className="text-gray-600">Flagged</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                    <span className="text-gray-600">Not Answered</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowSubmitModal(true)}
                  className="w-full mt-6 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
                >
                  Submit Exam
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setShowSubmitModal(false)}></div>
            <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                  <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Submit Exam?</h3>
                <p className="text-sm text-gray-500 mb-4">
                  You have answered {answeredCount} out of {totalQuestions} questions. Once submitted, you cannot change your answers.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowSubmitModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitExam}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                  >
                    {isSubmitting ? "Submitting..." : "Confirm Submit"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalExamPage;