import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Table from '../../components/Atoms/TableData/TableData';
import RoleExamModal from '../../components/Atoms/UI/RoleExamModal';
import Loader from '../../components/Loader/Loader';
import { createRoleExam, getRoleExamsList, updateRoleExam } from '../../redux/slices/examSlice';

const RoleExamination = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Redux selectors
  const getRoleExamsListData = useSelector(
    (state) => state.exam?.getRoleExamsListData
  );
   // Extract data from API response
  const examsList = getRoleExamsListData?.data?.list || 
                    getRoleExamsListData?.data || 
                    [];
  const totalCount = getRoleExamsListData?.data?.total || 
                     getRoleExamsListData?.total || 
                     0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // Fetch exams on page change
  const fetchRoleExams = async () => {
    setLoading(true);
    try {
      const query = {
        type: "Role"
      };
      
      const params = {
        page: currentPage,
        size: itemsPerPage,
        query: JSON.stringify(query)
      };
      
      await dispatch(getRoleExamsList(params)).unwrap();
    } catch (error) {
      toast.error(error.message || "Failed to fetch role examinations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoleExams();
  }, [currentPage]);

  const handleAddExam = () => {
    setSelectedExam(null);
    setIsEditing(false);
    setShowModal(true);
  };

  const handleEditExam = (exam) => {
    setSelectedExam(exam);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSaveExam = async (examData) => {
    try {
      if (isEditing && selectedExam) {
        // Update existing exam
        const updatePayload = {
          _id: selectedExam._id,
          examtitle: examData.examTitle,
          examduration: {
            hours: examData.durationHours,
            minutes: examData.durationMinutes
          },
          passingPercentage: examData.passingPercentage,
          questions: examData.questions.map(q => ({
            question: q.text,
            option_1: q.options.A,
            option_2: q.options.B,
            option_3: q.options.C,
            option_4: q.options.D,
            answer: q.correctAnswer
          })),
          role: examData.roleId || examData.role,
          isDraft: examData.isDraft,
          type: "Role"
        };
        
        await dispatch(updateRoleExam(updatePayload)).unwrap();
        toast.success("Exam updated successfully!");
      } else {
        // Create new exam
        const createPayload = {
          examtitle: examData.examTitle,
          examduration: {
            hours: examData.durationHours,
            minutes: examData.durationMinutes
          },
          passingPercentage: examData.passingPercentage,
          questions: examData.questions.map(q => ({
            question: q.text,
            option_1: q.options.A,
            option_2: q.options.B,
            option_3: q.options.C,
            option_4: q.options.D,
            answer: q.correctAnswer
          })),
          role: examData.roleId || examData.role,
          isDraft: examData.isDraft,
          type: "Role"
        };
        
        await dispatch(createRoleExam(createPayload)).unwrap();
        toast.success("Exam created successfully!");
      }
      
      setShowModal(false);
      setSelectedExam(null);
      fetchRoleExams(); // Refresh the list
    } catch (error) {
      toast.error(error.message || "Failed to save exam");
    }
  };

  const tableHeaders = [
    'Exam Title', 
    'Exam Duration', 
    'Passing Percentage', 
    'Status',
    'Actions'
  ];

  const formatDuration = (examduration) => {
    if (!examduration) return 'N/A';
    const hours = examduration.hours || 0;
    const minutes = examduration.minutes || 0;
    return `${hours} hr : ${minutes} Min`;
  };

  return (
    <>
      <Loader loading={loading} />
      
      <div className="">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Role Examination Lists</h1>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="mb-6 flex justify-end items-center">
            <button
              onClick={handleAddExam}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium flex items-center gap-2"
            >
              <span>+</span> Add Role Examination
            </button>
          </div>

          <div className="overflow-x-auto">
            <Table
              headers={tableHeaders}
              data={examsList}
              renderRow={(exam, index) => (
                <tr 
                  key={exam._id || exam.id} 
                  className={`hover:bg-blue-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                >
                  <td className="py-4 px-4 text-gray-800 font-medium">
                    {exam.examtitle}
                  </td>
                  <td className="py-4 px-4 text-gray-700">
                    {formatDuration(exam.examduration)}
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-bold text-gray-800">
                      {exam.passingPercentage}%
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      exam.isDraft 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {exam.isDraft ? 'Draft' : 'Published'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleEditExam(exam)}
                      className="px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 text-sm font-medium"
                    >
                      View / Edit
                    </button>
                  </td>
                </tr>
              )}
            />
          </div>

          {examsList.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No role examinations found</h3>
              <p className="text-gray-500">
                No role examinations available. Click 'Add Role Examination' to create one.
              </p>
            </div>
          )}

          {examsList.length > 0 && (
            <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 ${
                  currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700'
                }`}
              >
                Previous
              </button>
              
              <div className="flex items-center space-x-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 flex items-center justify-center rounded-md ${
                        currentPage === pageNum
                          ? 'bg-blue-500 text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 ${
                  currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700'
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>

        <RoleExamModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedExam(null);
          }}
          onSave={handleSaveExam}
          examData={selectedExam}
          isEditing={isEditing}
          loading={loading}
        />
      </div>
    </>
  );
};

export default RoleExamination;