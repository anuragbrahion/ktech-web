/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAssignedRoleList,
  requestApprovalForRole,
} from "../../redux/slices/teacherSlice";
import { toast } from "react-toastify";
import { formatDateForTable, getDaysLeft } from "../../utils/globalFunction";
import LoadingSpinner from "../../components/Loader/Loader";
import Table from "../../components/Atoms/TableData/TableData";
import { Edit2 } from "lucide-react";
import DefaultPreviewModal from "../../components/Modal/DefaultModal";

const RoleAssign = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [instructionsModalData, setInstructionsModalData] = useState({
    isOpen: false,
    data: null,
    accepted: false,
    error: null,
  });

  const getAssignedRoleListData = useSelector(
    (state) => state.teacher?.getAssignedRoleListData,
  );
  const assignedRoleList = getAssignedRoleListData?.data?.data?.list || [];
  const totalCount = getAssignedRoleListData?.data?.data?.total || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const tableHeaders = [
    "Role",
    "Course",
    "Assign Date",
    "Total Days",
    "Days Left",
    "Instant Apply",
    "Action",
  ];

  const fetchAssignedRoles = () => {
    setLoading(true);
    const params = {
      page: currentPage,
      size: itemsPerPage,
    };

    dispatch(getAssignedRoleList(params)).then((action) => {
      if (action.error) {
        toast.error(action.payload || "Failed to fetch assigned role");
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchAssignedRoles();
  }, [currentPage, itemsPerPage]);

  const tableData = useMemo(() => {
    return assignedRoleList.map((item) => [
      item.name,
      item.courseName,
      formatDateForTable(item.assignDate),
      `${item.days} Days`,
      `${getDaysLeft(item.assignDate, item.days)} Days`,
      !item.status || item.status === "Rejected" ? (
        <span
          className="hover:text-blue-600 hover:underline cursor-pointer"
          onClick={() => handleInstantApply(item._id)}
        >
          Apply
        </span>
      ) : (
        "N/A"
      ),
      <div className="flex items-center gap-2">
        <button
          className={`
    p-2.5 rounded-xl transition-all duration-200
    ${
      item.status === "Approved" && getDaysLeft(item.assignDate, item.days) >= 0
        ? "bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-sm hover:shadow-md"
        : "bg-gray-100 text-gray-400 cursor-not-allowed"
    }
  `}
          title={
            item.status !== "Approved"
              ? "Not approved yet"
              : getDaysLeft(item.assignDate, item.days) < 0
                ? "Edit time expired"
                : "Edit"
          }
          disabled={
            item.status !== "Approved" ||
            getDaysLeft(item.assignDate, item.days) < 0
          }
          onClick={() =>
            item.status !== "Approved" ||
            getDaysLeft(item.assignDate, item.days) < 0
              ? null
              : handleInstructionsModal("open", item)
          }
        >
          Start Exam
        </button>
      </div>,
    ]);
  }, [assignedRoleList]);

  const handleInstantApply = async (_id) => {
    try {
      setLoading(true);

      const response = await dispatch(requestApprovalForRole({ _id })).unwrap();

      if (!response.error) {
        toast.success(response.message || "Request sent successfully");
        fetchAssignedRoles();
      } else {
        toast.error(response.message || "Failed to send request");
      }
    } catch (error) {
      console.error("Error: ", error);
      toast.error("Failed to send request");
    } finally {
      setLoading(false);
    }
  };

  const handleInstructionsModal = (type, data) => {
    setInstructionsModalData({
      isOpen: type === "open",
      data: data || null,
      accepted: false,
      error: null,
    });
  };

  const handleSubmitInstructions = async () => {
    try {
      if (!instructionsModalData.accepted) {
        setInstructionsModalData((prev) => ({
          ...prev,
          error: "Please accept the terms and conditions",
        }));
        return;
      }
    } catch (error) {
      console.error("Error in submitting instructions:", error);
      toast.error("Failed to submit instructions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LoadingSpinner loading={loading} />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Assigned Role</h1>
        <p className="text-gray-600 mt-2">Manage your all assigned role</p>
      </div>

      <Table
        headers={tableHeaders}
        data={tableData}
        currentPage={currentPage}
        size={itemsPerPage}
        handlePageChange={setCurrentPage}
        total={totalCount}
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
      <DefaultPreviewModal
        isOpen={instructionsModalData.isOpen}
        closeModal={() => handleInstructionsModal("close", null)}
        heading="Exam Instructions"
        submitButtonLabel="Start Exam"
        handleSubmit={handleSubmitInstructions}
      >
        <>
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">
              Important Guidelines:
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>Read each question carefully before answering</li>
              <li>
                You can navigate between questions using the question palette
              </li>
              <li>
                The exam will be automatically submitted when the timer reaches
                zero
              </li>
              <li>Do not refresh the page during the exam</li>
              <li>Do not switch tabs or windows</li>
              <li>Maximum 3 violations allowed</li>
              <li>Your answers are saved as you progress</li>
              <li>Once submitted, you cannot retake the exam</li>
            </ul>
          </div>
          <div className="border-t pt-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="acceptInstructions"
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                checked={instructionsModalData.accepted}
                onChange={(e) => {
                  setInstructionsModalData((prev) => ({
                    ...prev,
                    accepted: e.target.checked,
                  }));
                }}
              />
              <span className="text-gray-700">
                I have read and understood all the instructions
              </span>
            </label>
            {instructionsModalData.error && (
              <p className="text-red-500 mt-2">{instructionsModalData.error}</p>
            )}
          </div>
        </>
      </DefaultPreviewModal>
    </>
  );
};

export default RoleAssign;
