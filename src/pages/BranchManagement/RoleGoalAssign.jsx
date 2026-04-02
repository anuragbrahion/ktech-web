/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import AssignModal from "../../components/Atoms/UI/AssignModal";
import Table from "../../components/Atoms/TableData/TableData";
import {
  assignGoalToTeacher,
  assignRoleToTeacher,
  goalsAllDocuments,
  rolesAllDocuments,
  teachersList,
} from "../../redux/slices/employee";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../components/Loader/Loader";

const RoleGoalAssign = ({ adminId }) => {
  const dispatch = useDispatch();

  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignType, setAssignType] = useState("role"); // 'role' or 'goal'
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const teachersListData = useSelector(
    (state) => state.employee?.teachersListData,
  );

  const goalsAllDocumentsData = useSelector(
    (state) => state.employee?.goalsAllDocumentsData,
  );
  const rolesAllDocumentsData = useSelector(
    (state) => state.employee?.rolesAllDocumentsData,
  );

  const teachers = teachersListData?.data?.data?.list || [];
  const totalTeachers = teachersListData?.data?.data?.total || 0;
  const totalPages = Math.ceil(totalTeachers / itemsPerPage);
  const allRoles = rolesAllDocumentsData?.data?.data?.list || [];
  const allGoals = goalsAllDocumentsData?.data?.data?.list || [];

  const fetchTeachers = () => {
    setLoading(true);
    const params = {
      page: currentPage,
      size: itemsPerPage,
    };

    const query = { adminId };

    params.query = JSON.stringify(query);

    dispatch(teachersList(params)).then((action) => {
      if (action.error) {
        toast.error(action.payload || "Failed to fetch teachers");
      }
      setLoading(false);
    });
  };

  const handleAssignRole = (staff) => {
    setSelectedStaff(staff);
    setAssignType("role");
    setShowAssignModal(true);
  };

  const handleAssignGoal = (staff) => {
    setSelectedStaff(staff);
    setAssignType("goal");
    setShowAssignModal(true);
  };

  const handleSaveAssignment = async (type, value) => {
    setLoading(true);
    try {
      const apiToCall =
        type === "role" ? assignRoleToTeacher : assignGoalToTeacher;

      const response = await dispatch(
        apiToCall({
          teacherId: selectedStaff._id,
          [type === "role" ? "roleId" : "goalId"]: value,
        }),
      ).unwrap();

      if (!response.error) {
        toast.success(response.message || "Role or goal assigned successfully");
        setShowAssignModal(false);
        setSelectedStaff(null);
      } else {
        toast.error(response.message || "Failed to assign role or goal");
      }
    } catch (error) {
      console.error("Error saving assignment:", error);
      toast.error("Failed to assign role or goal");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    return status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const tableHeaders = [
    "Staff Name",
    "Phone No.",
    "Department",
    "Designation",
    "Status",
    "Date Of Joining",
    "Actions",
  ];

  const tableData = teachers.map((teacher) => [
    <div className="font-medium text-gray-900">{teacher.name}</div>,
    <div className="text-gray-700">{teacher.phoneNo}</div>,
    <div className="text-gray-700">{teacher.department?.name}</div>,
    <div className="text-gray-700">{teacher.designation?.name}</div>,
    <div className="flex items-center">
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(teacher.status)}`}
      >
        {teacher.status ? "Active" : "Inactive"}
      </span>
    </div>,
    <div className="text-gray-700">{formatDate(teacher.dateOfJoining)}</div>,
    <div className="flex items-center gap-2">
      <div className="flex space-x-2">
        <button
          onClick={() => handleAssignRole(teacher)}
          className="px-3 py-1 bg-sky-500 text-white text-sm rounded-md hover:bg-sky-600"
        >
          Assign Role
        </button>
        <button
          onClick={() => handleAssignGoal(teacher)}
          className="px-3 py-1 bg-yellow-500 text-white text-sm rounded-md hover:bg-yellow-600"
        >
          Assign Goal
        </button>
      </div>
    </div>,
  ]);

  useEffect(() => {
    fetchTeachers();
  }, [currentPage]);

  useEffect(() => {
    dispatch(rolesAllDocuments({ select: "name" }));
    dispatch(goalsAllDocuments({ select: "name" }));
  }, []);

  return (
    <>
      <Loader loading={loading} />
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black">
            Assign Role/Goal to Teacher
          </h1>
          <p className="text-black mt-2">
            Manage role and goal assignments for staff members
          </p>
        </div>

        {!loading && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <Table
              headers={tableHeaders}
              data={tableData}
              currentPage={currentPage}
              size={itemsPerPage}
              handlePageChange={setCurrentPage}
              total={totalTeachers}
              totalPages={totalPages}
              renderRow={(row, index) => (
                <tr
                  key={index}
                  className={`hover:bg-blue-50 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                >
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="py-4 px-4">
                      {cell}
                    </td>
                  ))}
                </tr>
              )}
            />
          </div>
        )}
      </div>

      <AssignModal
        isOpen={showAssignModal}
        onClose={() => {
          setShowAssignModal(false);
          setSelectedStaff(null);
        }}
        staffData={selectedStaff}
        assignType={assignType}
        roles={allRoles}
        goals={allGoals}
        onSave={handleSaveAssignment}
      />
    </>
  );
};

export default RoleGoalAssign;
