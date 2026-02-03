/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Plus,
  Edit2,
  Trash2,
  Eye, 
  Search,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  courseBatchesList,
  enableDisableCourseBatches,
  deleteCourseBatches,
  createCourseBatches,
  updateCourseBatches,
  coursesAllDocuments,
} from "../../redux/slices/course";
import Table from "../../components/Atoms/TableData/TableData";
import AlertModal from "../../components/Modal/AlertModal";

const BatchModal = ({ batch, onSave, onClose, mode = "add" }) => {
  const [formData, setFormData] = useState({
    startTime: "",
    endTime: "",
    totalSeat: "",
    courses: [],
  });

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [courseSearch, setCourseSearch] = useState("");

  const dispatch = useDispatch();
  const coursesData = useSelector(
    (state) => state.course?.coursesAllDocumentsData,
  );

  useEffect(() => {
    if (batch) {
       setFormData({
        startTime: batch.startTime || "",
        endTime: batch.endTime || "",
        totalSeat: batch.totalSeat || "",
        courses: batch.courses.map((course) => course._id) || [],
      });
    } else {
      setFormData({
        startTime: "",
        endTime: "",
        totalSeat: "",
        courses: [],
      });
    }
  }, [batch]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = () => {
    setLoading(true);
    dispatch(coursesAllDocuments()).then(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    if (coursesData?.data?.data) {
      setCourses(coursesData.data.data?.list || []);
    }
  }, [coursesData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTimeChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const convertTo24Hour = (time12h) => {
    if (!time12h) return "";

    const [time, period] = time12h.split(" ");
    if (!period) return time;

    let [hours, minutes] = time.split(":").map(Number);

    if (period === "PM" && hours < 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  };

  const convertTo12Hour = (time24) => {
    if (!time24) return "";

    const [hours, minutes] = time24.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;

    return `${displayHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  const handleMultiSelect = (value) => {
    setFormData((prev) => {
      const currentValues = prev.courses;
      const isSelected = currentValues.includes(value);

      if (isSelected) {
        return {
          ...prev,
          courses: currentValues.filter((item) => item !== value),
        };
      } else {
        return {
          ...prev,
          courses: [...currentValues, value],
        };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.startTime ||
      !formData.endTime ||
      !formData.totalSeat ||
      formData.courses.length === 0
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    const payload = {
      startTime: convertTo24Hour(formData.startTime),
      endTime: convertTo24Hour(formData.endTime),
      totalSeat: Number(formData.totalSeat),
      courses: formData.courses,
    };

    if (batch && batch._id) {
      payload._id = batch._id;
    }

    onSave(payload);
  };

  const filteredCourses = courses.filter((course) =>
    course.courseName?.toLowerCase().includes(courseSearch.toLowerCase()),
  );

  const timeSlots = [
    "12:00 AM",
    "01:00 AM",
    "02:00 AM",
    "03:00 AM",
    "04:00 AM",
    "05:00 AM",
    "06:00 AM",
    "07:00 AM",
    "08:00 AM",
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM",
    "07:00 PM",
    "08:00 PM",
    "09:00 PM",
    "10:00 PM",
    "11:00 PM",
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === "view"
                ? "Batch Details"
                : batch
                  ? "Edit Batch"
                  : "Add Batch"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {mode === "view" ? "Time Schedule" : "Start Time & End Time"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time *
                    </label>
                    {mode === "view" ? (
                      <div className="px-4 py-3 border border-gray-300 rounded-xl bg-gray-50">
                        {convertTo12Hour(formData.startTime)}
                      </div>
                    ) : (
                      <select
                        value={formData.startTime}
                        onChange={(e) =>
                          handleTimeChange(
                            "startTime",
                            convertTo24Hour(e.target.value),
                          )
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        required
                      >
                        <option value="">Select Start Time</option>
                        {timeSlots.map((time, index) => (
                          <option key={index} value={convertTo24Hour(time)}>
                            {time}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time *
                    </label>
                    {mode === "view" ? (
                      <div className="px-4 py-3 border border-gray-300 rounded-xl bg-gray-50">
                        {convertTo12Hour(formData.endTime)}
                      </div>
                    ) : (
                      <select
                        value={formData.endTime}
                        onChange={(e) =>
                          handleTimeChange(
                            "endTime",
                            convertTo24Hour(e.target.value),
                          )
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        required
                      >
                        <option value="">Select End Time</option>
                        {timeSlots.map((time, index) => (
                          <option key={index} value={convertTo24Hour(time)}>
                            {time}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {mode === "view" ? "Seat Information" : "Total Seats"}
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Seats *
                  </label>
                  {mode === "view" ? (
                    <div className="px-4 py-3 border border-gray-300 rounded-xl bg-gray-50">
                      {formData.totalSeat}
                    </div>
                  ) : (
                    <input
                      type="number"
                      name="totalSeat"
                      value={formData.totalSeat}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Enter total seats"
                      required
                      min="1"
                    />
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {mode === "view" ? "Included Courses" : "Courses"}
                </h3>
                {mode === "view" ? (
                  <div className="space-y-2">
                    {loading ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mx-auto"></div>
                      </div>
                    ) : (
                      <div className="border border-gray-300 rounded-xl p-2 bg-gray-50">
                        {formData.courses?.length > 0 && (
                          <div className="">
                            <p className="text-sm text-gray-600 mb-2">
                              Selected courses:
                            </p>
                            <div className="space-y-1 max-h-40 overflow-y-auto">
                              {formData.courses.map((courseId, index) => {
                                return (
                                  <div
                                    key={courseId || index}
                                    className="text-sm text-gray-700 bg-white p-2 rounded border capitalize"
                                  >
                                    {courseId?.courseName}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="mb-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          value={courseSearch}
                          onChange={(e) => setCourseSearch(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="Search courses..."
                        />
                      </div>
                    </div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Courses for this batch *
                    </label>
                    <div className="space-y-2 max-h-60 overflow-y-auto p-2 border border-gray-300 rounded-xl">
                      {loading ? (
                        <div className="text-center py-4">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mx-auto"></div>
                        </div>
                      ) : filteredCourses.length === 0 ? (
                        <div className="text-center py-4 text-gray-500">
                          {courseSearch
                            ? "No courses found"
                            : "No courses available"}
                        </div>
                      ) : (
                        filteredCourses.map((course) => (
                          <label
                            key={course._id}
                            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                          >
                            <input
                              type="checkbox"
                              checked={formData.courses.includes(course._id)}
                              onChange={() => handleMultiSelect(course._id)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-gray-700">
                              {course.courseName}
                            </span>
                          </label>
                        ))
                      )}
                    </div>
                    {formData.courses.length > 0 && (
                      <div className="mt-2 text-sm text-gray-500">
                        Selected: {formData.courses.length} course(s)
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {mode !== "view" && (
              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={
                    loading ||
                    !formData.startTime ||
                    !formData.endTime ||
                    !formData.totalSeat ||
                    formData.courses.length === 0
                  }
                >
                  {batch ? "Update Batch" : "Create Batch"}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default function CourseBatchesManagement() {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [modalMode, setModalMode] = useState("add");
  const [deletingBatch, setDeletingBatch] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    search: ""
  });
  const [loading, setLoading] = useState(false);

  const batchesListData = useSelector(
    (state) => state.course?.courseBatchesListData,
  );
  const enableDisableData = useSelector(
    (state) => state.course?.enableDisableCourseBatchesData,
  );
  const deleteData = useSelector(
    (state) => state.course?.deleteCourseBatchesData,
  );
  const createData = useSelector(
    (state) => state.course?.createCourseBatchesData,
  );
  const updateData = useSelector(
    (state) => state.course?.updateCourseBatchesData,
  ); 
  useEffect(() => {
    fetchBatches();
  }, []);

  useEffect(() => {
    if (!showModal) {
      fetchBatches();
    }
  }, [currentPage, enableDisableData, deleteData, createData, updateData]);

  const fetchBatches = () => {
    setLoading(true);

    const params = {
      page: currentPage,
      size: itemsPerPage,
      ...(filters.search && { keyWord: filters.search }),
      populate: "courses",
    };

    dispatch(courseBatchesList(params)).then((action) => {
      if (action.meta.requestStatus === "rejected") {
        toast.error(action.payload || "Failed to fetch batches");
      }
      setLoading(false);
    });
  };

  const handleAddBatchClick = () => {
    setSelectedBatch(null);
    setModalMode("add");
    setShowModal(true);
  };

  const handleViewBatch = (batch) => {
    setSelectedBatch({
      ...batch,
      _id: batch._id,
      startTime: batch.startTime,
      endTime: batch.endTime,
      totalSeat: batch.totalSeat,
      courses: batch.courses || [],
    });
    setModalMode("view");
    setShowModal(true);
  };

  const handleEditBatch = (batch) => {
    setSelectedBatch({
      ...batch,
      _id: batch._id,
      startTime: batch.startTime,
      endTime: batch.endTime,
      totalSeat: batch.totalSeat,
      courses: batch.courses || [],
    });
    setModalMode("edit");
    setShowModal(true);
  };

  const handleDeleteClick = (batch) => {
    setDeletingBatch(batch);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingBatch) {
      setLoading(true);
      dispatch(deleteCourseBatches({ _id: deletingBatch._id })).then(
        (action) => {
          if (!action.error) {
            toast.success("Batch deleted successfully");
            fetchBatches();
          } else {
            toast.error(action.payload || "Failed to delete batch");
          }
          setLoading(false);
          setShowDeleteModal(false);
          setDeletingBatch(null);
        },
      );
    }
  };

  const handleStatusToggle = (batch) => {
    const newStatus = !batch.status;
    if (
      window.confirm(
        `Are you sure you want to ${newStatus ? "activate" : "deactivate"} this batch?`,
      )
    ) {
      setLoading(true);
      const payload = {
        _id: batch._id,
        status: newStatus,
      };
      dispatch(enableDisableCourseBatches(payload)).then((action) => {
        if (!action.error) {
          toast.success(
            `Batch ${newStatus ? "activated" : "deactivated"} successfully`,
          );
          fetchBatches();
        } else {
          toast.error(action.payload || "Failed to update status");
        }
        setLoading(false);
      });
    }
  };

  const handleSaveBatch = (formData) => {
    setLoading(true);
    const actionToDispatch =
      modalMode === "edit" && selectedBatch?._id
        ? updateCourseBatches({ ...formData, _id: selectedBatch._id })
        : createCourseBatches(formData);

    dispatch(actionToDispatch).then((action) => {
      if (action.meta.requestStatus === "fulfilled") {
        toast.success(
          modalMode === "edit"
            ? "Batch updated successfully"
            : "Batch created successfully",
        );

        setShowModal(false);
        setSelectedBatch(null);
        fetchBatches();
      } else {
        toast.error(
          action.payload || action.error?.message || "Something went wrong",
        );
      }

      setLoading(false);
    });
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleFilter = () => {
    setCurrentPage(1);
    fetchBatches();
  };

  const resetFilters = () => {
    setFilters({
      search: "",
    });
    setCurrentPage(1);
    fetchBatches();
  };

  const formatTimeForDisplay = (time24) => {
    if (!time24) return "";

    const [hours, minutes] = time24.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;

    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  const getStatusColor = (status) => {
    return status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };
 
  const getAvailableSeats = (batch) => {
    return batch.totalSeat || 0;
  };

  const batches = batchesListData?.data?.data?.list || [];
  const totalBatches = batchesListData?.data?.data?.total || 0;
  const totalPages = Math.ceil(totalBatches / itemsPerPage);
  const tableHeaders = [
    "Start Time",
    "End Time",
    "Total Seats",
    "Available Seats",
    "Courses",
    "Status",
    "Created At",
    "Actions",
  ];

  const tableData = batches.map((batch) => [
    <div className="flex items-center">
      <span className="text-gray-900">
        {formatTimeForDisplay(batch.startTime)}
      </span>
    </div>,
    <div className="flex items-center">
      <span className="text-gray-900">
        {formatTimeForDisplay(batch.endTime)}
      </span>
    </div>,
    <div className="flex items-center">
      <span className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-800 rounded-full text-lg">
        {batch.totalSeat}
      </span>
    </div>,
    <div className="flex items-center">
      <span
        className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-lg ${
          getAvailableSeats(batch) > 0
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {getAvailableSeats(batch)}
      </span>
    </div>,
    <div className="max-w-xs text-gray-700 capitalize">
      {batch.courses?.length > 0 ? (
        <>
          {batch.courses[0]?.courseName}
          {batch.courses.length > 1 && ` +${batch.courses.length - 1}`}
        </>
      ) : (
        "—"
      )}
    </div>,
    <div className="flex items-center">
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(batch.status)}`}
      >
        {batch.status ? "Active" : "Inactive"}
      </span>
      <div className="ml-3 relative inline-block w-10 align-middle select-none">
        <input
          type="checkbox"
          checked={batch.status}
          onChange={() => handleStatusToggle(batch)}
          className="sr-only"
          id={`toggle-batch-${batch._id}`}
          disabled={loading}
        />
        <label
          htmlFor={`toggle-batch-${batch._id}`}
          className={`block overflow-hidden h-6 rounded-full cursor-pointer ${batch.status ? "bg-green-500" : "bg-gray-300"}`}
        >
          <span
            className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${batch.status ? "translate-x-4" : "translate-x-0"}`}
          />
        </label>
      </div>
    </div>,
    <div className="flex items-center">
      {new Date(batch.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })}
    </div>,
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleViewBatch(batch)}
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
        title="View Details"
        disabled={loading}
      >
        <Eye className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleEditBatch(batch)}
        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
        title="Edit"
        disabled={loading}
      >
        <Edit2 className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleDeleteClick(batch)}
        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
        title="Delete"
        disabled={loading}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>,
  ]);

  return (
    <div className="">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Course Batches</h1>
        <p className="text-gray-600 mt-2">
          Manage all course batches and schedules
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Filter Batches
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Search batches..."
              disabled={loading}
            />
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleFilter}
              className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 w-24"
              disabled={loading}
            >
              {loading ? "Loading..." : "Filter"}
            </button>
            <button
              onClick={resetFilters}
              className="px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50"
              disabled={loading}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end items-center mb-6">
        <button
          onClick={handleAddBatchClick}
          className="px-6 py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-all shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-50"
          disabled={loading}
        >
          <span>Add Batch</span>
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {loading && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading batches...</span>
          </div>
        </div>
      )}

      {!loading && (
        <Table
          headers={tableHeaders}
          data={tableData}
          currentPage={currentPage}
          size={itemsPerPage}
          handlePageChange={setCurrentPage}
          total={totalBatches}
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
      )}

      {showModal && (
        <BatchModal
          batch={selectedBatch}
          onSave={handleSaveBatch}
          onClose={() => {
            setShowModal(false);
            setSelectedBatch(null);
          }}
          mode={modalMode}
        />
      )}

      {showDeleteModal && (
        <AlertModal
          isOpen={showDeleteModal}
          onCancel={() => {
            setShowDeleteModal(false);
            setDeletingBatch(null);
          }}
          onConfirm={handleDeleteConfirm}
          title="Delete Batch"
          description="Are you sure you want to delete this batch? This action cannot be undone."
          cancelLabel="Cancel"
          confirmLabel="Yes, Delete"
          confirmClassNameButton="!bg-red-600 hover:!bg-red-700"
          isVisibleCancelButton={true}
          isVisibleConfirmButton={true}
        />
      )}
    </div>
  );
}
