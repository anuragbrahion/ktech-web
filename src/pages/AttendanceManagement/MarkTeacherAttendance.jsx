import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Table from "../../components/Atoms/TableData/TableData";
import TeacherDetailsModal from "../../components/Atoms/UI/TeacherDetailsModal";
import AttendanceCalendarModal from "../../components/Atoms/UI/AttendanceCalendarModal";
import {
  teacherAttendanceView,
  teacherMarkAttendance,
  attendanceList
} from "../../redux/slices/examination";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/Loader/Loader";
import { usersList } from '../../redux/slices/employee';


const MarkTeacherAttendance = () => {
  const dispatch = useDispatch();
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [itemsPerPage] = useState(10);

  const attendanceViewData = useSelector(
    (state) => state?.examination?.teacherAttendanceViewData
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  const fetchTeachersList = useCallback(async () => {
    setLoading(true);
        const payload = {
          page: currentPage,
          size: itemsPerPage,
          query: JSON.stringify({ role: "Teacher" }),
          ...(debouncedSearchTerm && { keyWord: debouncedSearchTerm })
        };
        try {
          const result = await dispatch(usersList(payload)).unwrap();
          if (result && result.data) {
            setTeachers(result.data.list || []);
            setTotalCount(result.data.total || 0);
            setTotalPages(Math.ceil((result.data.total || 0) / itemsPerPage) || 1);
          }
        } catch (error) {
          console.error('Error fetching students:', error);
          toast.error(error?.message || 'Failed to fetch students list');
        } finally {
          setLoading(false);
        }
  }, [currentPage, itemsPerPage, debouncedSearchTerm, dispatch]);

  useEffect(() => {
    fetchTeachersList();
  }, [fetchTeachersList]);

  const handleViewDetails = (teacher) => {
    setSelectedTeacher(teacher);
    setShowDetailsModal(true);
  };

  const handleAttendanceCalendar = (teacher) => {
    setSelectedTeacher(teacher);
    setShowCalendarModal(true);
  };

  const handleMarkAttendance = async (teacherId, status, date) => {
    try {
      const result = await dispatch(teacherMarkAttendance({
        teacherId,
        status,
        date
      })).unwrap();
      if (result) {
        toast.success("Attendance marked successfully");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error marking attendance:", error);
      toast.error(error?.response?.data?.message || "Failed to mark attendance");
      return false;
    }
  };

  const handleViewAttendance = async (teacherId, startDate, endDate) => {
    try {
      const result = await dispatch(teacherAttendanceView({
        startDate,
        endDate,
        teacherId
      })).unwrap();
      return result?.data || [];
    } catch (error) {
      console.error("Error fetching attendance:", error);
      toast.error("Failed to fetch attendance records");
      return [];
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setCurrentPage(1);
  };

  const tableHeaders = [
    "Teacher Name",
    "Email",
    "Phone",
    "Status",
    "Actions",
    "Attendance"
  ];

  return (
    <div className="p-2">
      <LoadingSpinner loading={loading} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mark Teacher Attendance</h1>
        <p className="text-gray-600 mt-2">Manage teacher attendance and details</p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          {/* <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Teacher
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, or phone..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div> */}
          <div className="text-sm text-gray-500">
            Total Teachers: {totalCount}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {teachers.length === 0 && !loading ? (
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 mx-auto text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <p className="text-gray-500 text-lg">No teachers found</p>
            <p className="text-gray-400 text-sm mt-1">
              {searchTerm ? "Try a different search term" : "No teachers available"}
            </p>
          </div>
        ) : (
          <Table
            headers={tableHeaders}
            data={teachers}
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={setCurrentPage}
            renderRow={(teacher, index) => (
              <tr
                key={teacher._id || teacher.id || index}
                className={`hover:bg-blue-50 transition-colors duration-150 ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                <td className="py-4 px-4">
                  <div>
                    <p className="font-medium text-gray-900">
                      {teacher.user?.name || teacher.name || "N/A"}
                    </p>
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-600">
                  {teacher.user?.email || teacher.email || "N/A"}
                </td>
                <td className="py-4 px-4 text-gray-600">
                  {teacher.user?.phoneNo || teacher.phoneNo || "N/A"}
                </td>
                <td className="py-4 px-4">
  <span
    className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
      teacher.status === true
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-700"
    }`}
  >
    {teacher.status ? "Active" : "Inactive"}
  </span>
</td>
                <td className="py-4 px-4">
                  <button
                    onClick={() => handleViewDetails(teacher)}
                    className="text-blue-500 hover:text-blue-700 transition-colors"
                    title="View Details"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </td>
                <td className="py-4 px-4">
                  <button
                    onClick={() => handleAttendanceCalendar(teacher)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 text-sm font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Calendar
                  </button>
                </td>
              </tr>
            )}
          />
        )}
      </div>

      <TeacherDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedTeacher(null);
        }}
        teacherData={selectedTeacher}
      />

      <AttendanceCalendarModal
        isOpen={showCalendarModal}
        onClose={() => {
          setShowCalendarModal(false);
          setSelectedTeacher(null);
        }}
        teacherData={selectedTeacher}
        onMarkAttendance={handleMarkAttendance}
        onViewAttendance={handleViewAttendance}
        attendanceData={attendanceViewData}
        type="teacher"
      />
    </div>
  );
};

export default MarkTeacherAttendance;