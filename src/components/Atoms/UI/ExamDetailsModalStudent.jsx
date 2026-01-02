import React from 'react';

const ExamDetailsModalStudent = ({ isOpen, onClose, examData }) => {
  if (!isOpen || !examData) return null;

  // Sample exam questions and answers (based on your data)
  const questions = [
    {
      number: 1,
      question: "MS Word खोलने के लिए Run Dialog Box में क्या लिखना पड़ता है?",
      correctAnswer: "(c) winword",
      studentAnswer: "(c) winword",
      isCorrect: true
    },
    {
      number: 2,
      question: "MS Word है-",
      correctAnswer: "(a) Word एडिटिंग सॉफ्टवेयर",
      studentAnswer: "(a) Word एडिटिंग सॉफ्टवेयर",
      isCorrect: true
    },
    {
      number: 3,
      question: "माइक्रोसॉफ्ट वर्ड में किसी भी Particular Word को खोजने के लिए इस्तेमाल किया जाता है",
      correctAnswer: "(a) Find",
      studentAnswer: "(a) Find",
      isCorrect: true
    },
    {
      number: 4,
      question: "किसी Save File को दूबारा से Save करने के लिए इस्तेमाल किया जाता है?",
      correctAnswer: "(b) Save as",
      studentAnswer: "(b) Save as",
      isCorrect: true
    },
    {
      number: 5,
      question: "किसी भी Text को Bold करने का Shortcut होता है?",
      correctAnswer: "(b) Ctrl + B",
      studentAnswer: "(b) Ctrl + B",
      isCorrect: true
    },
    {
      number: 6,
      question: "Help Option को खोलने के लिए कीबोर्ड में प्रेस किया जाता है",
      correctAnswer: "(d) F1",
      studentAnswer: "(b) F12",
      isCorrect: false
    },
    {
      number: 7,
      question: "Ctrl + Shift + > से होता है",
      correctAnswer: "(a) Increase Font Size",
      studentAnswer: "(a) Increase Font Size",
      isCorrect: true
    },
    {
      number: 8,
      question: "Ctrl + D = ?",
      correctAnswer: "(b) Font Setting",
      studentAnswer: "(a) Bold",
      isCorrect: false
    },
    {
      number: 9,
      question: "Format Painter किस Menu में आता है?",
      correctAnswer: "(a) Home Menu",
      studentAnswer: "(a) Home Menu",
      isCorrect: true
    },
    {
      number: 10,
      question: "Align Text Left का Shortcut Key होता है",
      correctAnswer: "(a) Ctrl + L",
      studentAnswer: "(a) Ctrl + L",
      isCorrect: true
    },
    {
      number: 11,
      question: "पुरे Page को एक बार में Select किया जा सकता है –",
      correctAnswer: "(a) Ctrl + A के जरिये",
      studentAnswer: "(a) Ctrl + A के जरिये",
      isCorrect: true
    },
    {
      number: 12,
      question: "Hyperlink होता है",
      correctAnswer: "(b) Insert Menu में",
      studentAnswer: "(b) Insert Menu में",
      isCorrect: true
    },
    {
      number: 13,
      question: "Equation Mode Enable करने का Shortcut Key बताये:",
      correctAnswer: "(a) Alt + =",
      studentAnswer: "(a) Alt + =",
      isCorrect: true
    },
    {
      number: 14,
      question: "Short Link बनाने के लिए इस्तेमाल किया जाता है-",
      correctAnswer: "(a) Hyperlink",
      studentAnswer: "(a) Hyperlink",
      isCorrect: true
    },
    {
      number: 15,
      question: "Ctrl + X = ?",
      correctAnswer: "(a) Cut",
      studentAnswer: "(a) Cut",
      isCorrect: true
    }
  ];

  const percentage = (examData.marks / examData.totalMarks) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl my-8 max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Exam Details</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
            <p className="text-lg font-semibold text-blue-800 mb-2">check details: {examData.name}</p>
            <p className="text-gray-600">you can view the details here:</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Exam Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="text-gray-600">Name of Examinar:</span>
                  <span className="font-medium text-black">{examData.name}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="text-gray-600">Email of Examinar:</span>
                  <span className="font-medium text-black">{examData.email}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="text-gray-600">Exam-Title of Examinar:</span>
                  <span className="font-medium text-black">{examData.examTitle}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="text-gray-600">Passing Percentage:</span>
                  <span className="font-bold text-blue-600">{examData.passingPercentage}%</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="text-gray-600">Type of Examinar:</span>
                  <span className="font-medium text-black">{examData.type}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="text-gray-600">Final Score:</span>
                  <span className={`font-bold text-lg ${percentage >= examData.passingPercentage ? 'text-green-600' : 'text-red-600'}`}>
                    {examData.marks}/{examData.totalMarks} ({percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
            </div>

            {/* Questions and Answers */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-sky-600 mb-6 pb-2 border-b border-gray-200">Questions & Answers</h3>
              
              <div className="space-y-6">
                {questions.map((q, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="mb-3">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-black">Question {q.number}:</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          q.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {q.isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                      </div>
                      <p className="text-black ml-2">{q.question}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-3 rounded border border-green-200">
                        <div className="font-medium text-green-700 mb-1">Correct Answer:</div>
                        <div className="text-black ml-2">{q.correctAnswer}</div>
                      </div>
                      
                      <div className={`p-3 rounded border ${
                        q.isCorrect ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'
                      }`}>
                        <div className={`font-medium mb-1 ${q.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                          Selected Answer by Student:
                        </div>
                        <div className="text-black ml-2">-{q.studentAnswer}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Summary */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-xl font-bold text-sky-600 mb-4">Performance Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                  <div className="text-3xl font-bold text-sky-600 mb-1">{examData.marks}</div>
                  <div className="text-gray-600">Marks Obtained</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                  <div className="text-3xl font-bold text-sky-600 mb-1">{examData.totalMarks}</div>
                  <div className="text-gray-600">Total Marks</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                  <div className="text-3xl font-bold mb-1" style={{
                    color: percentage >= examData.passingPercentage ? '#059669' : '#dc2626'
                  }}>
                    {percentage.toFixed(1)}%
                  </div>
                  <div className="text-gray-600">Percentage</div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Passing Percentage Required:</span>
                  <span className="font-bold text-blue-600">{examData.passingPercentage}%</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-600">Result:</span>
                  <span className={`font-bold ${examData.result === 'PASS' ? 'text-green-600' : 'text-red-600'}`}>
                    {examData.result}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex-shrink-0">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 font-medium"
            >
              Close Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamDetailsModalStudent;