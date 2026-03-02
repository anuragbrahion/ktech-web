/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getMyTasksList,
  updateTaskStatus,
} from "../../redux/slices/teacherSlice";
import { toast } from "react-toastify";
import { formatDateForTable } from "../../utils/globalFunction";
import LoadingSpinner from "../../components/Loader/Loader";
import Table from "../../components/Atoms/TableData/TableData";
import { Edit2 } from "lucide-react";
import DefaultPreviewModal from "../../components/Modal/DefaultModal";
import Dropdown from "../../components/DropDown";
const statusOptions = [
  { label: "Pending", value: "Pending" },
  { label: "In Progress", value: "In-Progress" },
  { label: "Completed", value: "Completed" },
];

const MyTasks = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [updateModalData, setUpdateModalData] = useState({
    isOpen: false,
    data: {},
  });
  const [actionLoading, setActionLoading] = useState(false);
  const getMyTasksListData = useSelector(
    (state) => state.teacher?.getMyTasksListData,
  );
  const tasksList = getMyTasksListData?.data?.data?.list || [];
  const totalCount = getMyTasksListData?.data?.data?.total || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const tableHeaders = [
    "Title",
    "Description",
    "Assign Date",
    "Status",
    "Action",
  ];

  const fetchTasks = () => {
    setLoading(true);
    const params = {
      page: currentPage,
      size: itemsPerPage,
    };

    dispatch(getMyTasksList(params)).then((action) => {
      if (action.error) {
        toast.error(action.payload || "Failed to fetch tasks list");
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchTasks();
  }, [currentPage, itemsPerPage]);

  const tableData = useMemo(() => {
    return tasksList.map((item) => [
      item.title,
      item.description,
      formatDateForTable(item.assignTo[0].assignDate),
      item.assignTo[0].status,
      <div className="flex items-center gap-2">
        <button
          onClick={() =>
            handleUpdateModal("open", {
              _id: item._id,
              status: statusOptions.find(
                (status) => status.value === item.assignTo[0].status,
              ),
            })
          }
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
          title="Edit"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      </div>,
    ]);
  }, [tasksList]);

  const handleUpdateModal = (type = "open", data = {}) => {
    setUpdateModalData({ isOpen: type === "open", data: data });
  };

  const handleSubmitUpdateModal = async (e) => {
    e.preventDefault();
    const formData = updateModalData.data;

    try {
      setActionLoading(true);
      const payload = {
        _id: formData._id,
        status: formData.status.value || formData.status,
      };

      const response = await dispatch(updateTaskStatus(payload)).unwrap();

      if (!response.error) {
        toast.success(response.message || "Task updated successfully");
        handleUpdateModal("close");
        fetchTasks();
      } else {
        toast.error(response.message || "Failed to update task");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to update task");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <>
      <LoadingSpinner loading={loading} />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
        <p className="text-gray-600 mt-2">Manage your all tasks</p>
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
        isOpen={updateModalData.isOpen}
        closeModal={() => handleUpdateModal("close")}
        heading="Update Task"
        handleSubmit={handleSubmitUpdateModal}
        isLoading={actionLoading}
      >
        <div className="space-y-6">
          {/* Leave Type */}
          <Dropdown
            label="Task Status"
            options={statusOptions}
            value={updateModalData.data?.status || ""}
            onChange={(value) =>
              setUpdateModalData((prev) => ({
                ...prev,
                data: { ...prev.data, status: value },
              }))
            }
            placeholder="Select task status"
            name="status"
            id="status"
            showIcon
            required
            disabled={actionLoading}
          />
        </div>
      </DefaultPreviewModal>
    </>
  );
};

export default MyTasks;
