/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Table from "../../components/Atoms/TableData/TableData";
import { getMyTasksList } from "../../redux/slices/teacherSlice";
import Loader from "../../components/Loader/Loader";
import { toast } from "react-toastify";
import { formatDateForTable } from "../../utils/globalFunction";

const AllAssignTask = () => {
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [loading, setLoading] = useState(false);

  const getMyTasksListData = useSelector(
    (state) => state.teacher?.getMyTasksListData,
  );

  const tasks = getMyTasksListData?.data?.data?.list || [];
  const totalTasks = getMyTasksListData?.data?.data?.total || 0;
  const totalPages = Math.ceil(totalTasks / itemsPerPage);

  const fetchTasks = async () => {
    try {
      setLoading(true);

      const payload = {
        page: currentPage,
        size: itemsPerPage,
      };

      dispatch(getMyTasksList(payload)).then((action) => {
        if (action.error) {
          toast.error(action.payload || "Failed to fetch tasks");
        }
        setLoading(false);
      });
    } catch (error) {
      console.log("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [currentPage]);

  const tableHeaders = [
    "Staff Name",
    "Title",
    "Description",
    "Assign Date",
    "Status",
  ].filter(Boolean);

  const tableData = tasks.map((task) => [
    <div className="font-medium text-gray-900">{task.assignTo.user.name}</div>,
    <div>{task.title}</div>,
    <div className="relative group max-w-xs cursor-pointer">
      <p className="truncate">{task.description || "No description"}</p>

      {task.description && (
        <div className="absolute left-0 top-full mt-1 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1 z-50 w-64 break-words shadow-lg">
          {task.description}
        </div>
      )}
    </div>,
    <div>{formatDateForTable(task.assignTo.assignDate)}</div>,
    task.assignTo.status,
  ]);

  return (
    <>
      <Loader loading={loading} />
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black">Assign Task List</h1>
          <p className="text-black mt-2">View and manage all assigned tasks</p>
        </div>

        <Table
          headers={tableHeaders}
          data={tableData}
          currentPage={currentPage}
          size={itemsPerPage}
          handlePageChange={setCurrentPage}
          total={totalTasks}
          totalPages={totalPages}
          renderRow={(row, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              {row.map((cell, i) => (
                <td key={i} className="px-4 py-3">
                  {cell}
                </td>
              ))}
            </tr>
          )}
        />
      </div>
    </>
  );
};

export default AllAssignTask;
