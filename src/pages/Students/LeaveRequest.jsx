/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { leaveTypesAllDocuments } from "../../redux/slices/employee";
import LoadingSpinner from "../../components/Loader/Loader";
import { toast } from "react-toastify";
import {
  applyLeaveRequest,
  getLeavesList,
} from "../../redux/slices/teacherSlice";
import { formatDateForTable } from "../../utils/globalFunction";
import Table from "../../components/Atoms/TableData/TableData";
import { Plus } from "lucide-react";
import DefaultPreviewModal from "../../components/Modal/DefaultModal";
import Dropdown from "../../components/DropDown";
import FormField from "../../components/Atoms/FormField/FormField";

const LeaveRequest = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [applyLeaveData, setApplyLeaveData] = useState({
    isOpen: false,
    data: {},
  });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const getLeavesListData = useSelector(
    (state) => state.teacher?.getLeavesListData,
  );
  const leavesList = getLeavesListData?.data?.data?.list || [];
  const totalCount = getLeavesListData?.data?.data?.total || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const {
    leaveTypesAllDocumentsData: {
      data: { data: { list: leaveTypes = [] } = {} } = {},
    } = {},
  } = useSelector((state) => state.employee);

  const fetchAllLeaveTypes = () => {
    dispatch(leaveTypesAllDocuments({ select: "name" }));
  };

  const tableHeaders = [
    "Name",
    "Apply Date",
    "Leave Type",
    "Leave From",
    "Leave To",
    "Status",
  ];

  const fetchLeaves = () => {
    setLoading(true);
    const params = {
      page: currentPage,
      size: itemsPerPage,
    };

    dispatch(getLeavesList(params)).then((action) => {
      if (action.error) {
        toast.error(action.payload || "Failed to fetch courses");
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchLeaves();
  }, [currentPage, itemsPerPage, isRefresh]);

  useEffect(() => {
    fetchAllLeaveTypes();
  }, []);

  const tableData = useMemo(() => {
    return leavesList.map((item) => [
      item.name.name,
      item.leaveType.name,
      formatDateForTable(item.applyDate),
      formatDateForTable(item.startDate, "MMM DD YYYY"),
      formatDateForTable(item.endDate, "MMM DD YYYY"),
      item.leaveStatus,
    ]);
  }, [leavesList]);

  const handleApplyLeaveModal = (type = "open") => {
    setApplyLeaveData({ isOpen: type === "open", data: {} });
    setErrors({});
  };

  const validateApplyLeave = (data) => {
    const newErrors = {};

    if (!data?.leaveType?.value) {
      newErrors.leaveType = "Leave type is required";
    }

    if (!data?.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!data?.endDate) {
      newErrors.endDate = "End date is required";
    }

    if (data?.startDate && data?.endDate) {
      if (new Date(data.endDate) < new Date(data.startDate)) {
        newErrors.endDate = "End date cannot be before start date";
      }
    }

    if (!data?.reason || !data.reason.trim()) {
      newErrors.reason = "Reason is required";
    }

    return newErrors;
  };

  const handleSubmitApplyLeave = async (e) => {
    e.preventDefault();
    const formData = applyLeaveData.data;

    const validationErrors = validateApplyLeave(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({}); // clear errors

    try {
      setActionLoading(true);
      // Example payload
      const payload = {
        leaveType: formData.leaveType.value,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason.trim(),
        applyDate: new Date().toISOString(),
      };

      const response = await dispatch(applyLeaveRequest(payload)).unwrap();

      if (!response.error) {
        toast.success(response.message || "Leave applied successfully");
        handleApplyLeaveModal("close");
        setIsRefresh(!isRefresh);
      } else {
        toast.error(response.message || "Failed to apply leave");
      }
    } catch (error) {
      console.error("Apply leave error:", error);
      toast.error("Failed to apply leave");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <>
      <LoadingSpinner loading={loading} />
      <div className="flex justify-between items-center">
        <div className="">
          <h1 className="text-3xl font-bold text-gray-900">My Leaves</h1>
          <p className="text-gray-600 mt-2">Manage all leave requests</p>
        </div>
        <button
          onClick={() => handleApplyLeaveModal("open")}
          className="px-6 py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-all shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-50"
          disabled={loading}
        >
          <span>Apply Leave</span>
          <Plus className="w-5 h-5" />
        </button>
      </div>
      <div className="py-6">
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
      </div>

      <DefaultPreviewModal
        isOpen={applyLeaveData.isOpen}
        closeModal={() => handleApplyLeaveModal("close")}
        heading="Apply Leave"
        handleSubmit={handleSubmitApplyLeave}
        isLoading={actionLoading}
      >
        <div className="space-y-6">
          {/* Leave Type */}
          <Dropdown
            label="Leave Type"
            options={(leaveTypes ?? []).map((type) => ({
              label: type.name,
              value: type._id,
            }))}
            value={applyLeaveData.data?.leaveType || ""}
            onChange={(value) =>
              setApplyLeaveData((prev) => ({
                ...prev,
                data: { ...prev.data, leaveType: value },
              }))
            }
            placeholder="Select Leave Type"
            name="leaveType"
            id="leaveType"
            error={errors.leaveType || ""}
            showIcon
            required
            disabled={actionLoading}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Start Date"
              type="date"
              name="startDate"
              required
              value={applyLeaveData.data?.startDate || ""}
              min={new Date().toISOString().split("T")[0]}
              max={applyLeaveData.data?.endDate || ""}
              error={errors.startDate}
              onChange={(e) => {
                const start = e.target.value;

                setApplyLeaveData((prev) => ({
                  ...prev,
                  data: {
                    ...prev.data,
                    startDate: start,
                    endDate:
                      prev.data?.endDate && prev.data.endDate < start
                        ? ""
                        : prev.data?.endDate,
                  },
                }));
              }}
              disabled={actionLoading}
            />

            <FormField
              label="End Date"
              type="date"
              name="endDate"
              required
              value={applyLeaveData.data?.endDate || ""}
              min={applyLeaveData.data?.startDate || ""}
              disabled={!applyLeaveData.data?.startDate || actionLoading}
              error={errors.endDate}
              onChange={(e) =>
                setApplyLeaveData((prev) => ({
                  ...prev,
                  data: { ...prev.data, endDate: e.target.value },
                }))
              }
            />
          </div>
          <FormField
            label="Reason"
            type="textarea"
            name="reason"
            required
            rows={4}
            value={applyLeaveData.data?.reason || ""}
            error={errors.reason}
            placeholder="Enter leave reason..."
            onChange={(e) =>
              setApplyLeaveData((prev) => ({
                ...prev,
                data: { ...prev.data, reason: e.target.value },
              }))
            }
            disabled={actionLoading}
          />
        </div>
      </DefaultPreviewModal>
    </>
  );
};

export default LeaveRequest;
