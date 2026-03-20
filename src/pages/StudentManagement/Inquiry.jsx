/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Plus, Calendar, Eye, X, Filter, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import Table from "../../components/Atoms/TableData/TableData";
import {
  createInquires,
  deleteInquires,
  inquiriesList,
  moveToAdmission,
  followUpInquires,
  inquiresSingleDocument,
} from "../../redux/slices/inquires";
import InquiryModal from "../../components/Atoms/UI/InquiryModal";
import TodaysFollowUpsPopup from "../../components/Atoms/UI/TodaysFollowUpsPopup";
import AlertModal from "../../components/Modal/AlertModal";
import { formatDateForTable } from "../../utils/globalFunction";

const ViewInquiryModal = ({ inquiry, onClose }) => {
  if (!inquiry) return null;

  const Row = ({ label, value }) => (
    <div className="flex justify-between py-2">
      <span className="text-gray-600 font-medium">{label}</span>
      <span className="text-gray-900">{value || "N/A"}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">Inquiry Details</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-2">
          <Row label="Name" value={inquiry.name} />
          <Row label="Email" value={inquiry.email} />
          <Row label="Phone No" value={inquiry.phoneNo} />
          <Row label="Course" value={inquiry.course?.courseName} />
          <Row label="Source" value={inquiry.source?.name} />
          <Row label="Status" value={inquiry.status?.name} />
          <Row
            label="Follow Up Date"
            value={
              inquiry.followUpDate
                ? new Date(inquiry.followUpDate).toLocaleDateString()
                : "N/A"
            }
          />
          <Row label="Remarks" value={inquiry.remarks} />
          <Row
            label="Created At"
            value={
              inquiry.createdAt
                ? new Date(inquiry.createdAt).toLocaleString()
                : "N/A"
            }
          />
        </div>
      </div>
    </div>
  );
};

export default function InquiryManagement({ adminId }) {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFollowUpPopup, setShowFollowUpPopup] = useState(false);
  const [deletingInquiry, setDeletingInquiry] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    search: "",
  });
  const [loading, setLoading] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewInquiry, setViewInquiry] = useState(null);

  const inquiriesListData = useSelector(
    (state) => state.inquires?.inquiresListData,
  );
  const createData = useSelector((state) => state.inquires?.createInquiresData);
  const deleteData = useSelector((state) => state.inquires?.deleteInquiresData);
  const coursesData = useSelector(
    (state) => state.course?.coursesAllDocumentsData,
  );
  const sourcesData = useSelector(
    (state) => state.banch?.inquirySourceAllDocumentsData,
  );
  const statusesData = useSelector(
    (state) => state.banch?.inquiryStatusAllDocumentsData,
  );
  const followUpInquiresData = useSelector(
    (state) => state.inquires?.followUpInquiresData,
  );

  const inquiries = inquiriesListData?.data?.data?.list || [];
  const totalInquiries = inquiriesListData?.data?.data?.total || 0;
  const followUpInquiresList = followUpInquiresData?.data?.data || [];
  const sources = sourcesData?.data?.data || [];
  const statuses = statusesData?.data?.data || [];
  const courses = coursesData?.data?.data?.list || [];
  const totalPages = Math.ceil(totalInquiries / itemsPerPage);

  useEffect(() => {
    fetchInquiries(filters);
    fetchTodayFollowUps();
  }, []);

  useEffect(() => {
    if (!showModal && !showDeleteModal) {
      fetchInquiries(filters);
    }
  }, [currentPage, createData, deleteData]);

  const fetchTodayFollowUps = () => {
    dispatch(followUpInquires());
  };

  const fetchInquiries = (filters) => {
    setLoading(true);
    const params = {
      page: currentPage,
      size: itemsPerPage,
      query: JSON.stringify({ adminId }),
      populate: "course:courseName|source:name|status:name",
      ...(filters.search && { keyWord: filters.search, searchFields: "name" }),
    };

    dispatch(inquiriesList(params)).then((action) => {
      if (action.error) {
        toast.error(action.payload || "Failed to fetch inquiries");
      }
      setLoading(false);
    });
  };

  const handleViewInquiry = (inquiry) => {
    setLoading(true);
    dispatch(inquiresSingleDocument({ _id: inquiry._id })).then((action) => {
      if (action?.payload?.data) {
        setViewInquiry(action.payload?.data);
        console.log("object", action.payload?.data, showViewModal);
        setShowViewModal(true);
      } else {
        toast.error(action.payload || "Failed to fetch inquiry details");
      }
      setLoading(false);
    });
  };

  const handleAddInquiryClick = () => {
    setShowModal(true);
  };

  const handleDeleteClick = (inquiry) => {
    setDeletingInquiry(inquiry);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingInquiry) {
      setLoading(true);
      dispatch(deleteInquires({ _id: deletingInquiry._id })).then((action) => {
        if (!action.error) {
          toast.success("Inquiry deleted successfully");
          fetchInquiries(filters);
        } else {
          toast.error(action.payload || "Failed to delete inquiry");
        }
        setLoading(false);
        setShowDeleteModal(false);
        setDeletingInquiry(null);
      });
    }
  };

  const handleSaveInquiry = (formData) => {
    setLoading(true);
    dispatch(createInquires(formData)).then((action) => {
      if (!action.error) {
        toast.success("Inquiry created successfully");
        setShowModal(false);
        fetchInquiries(filters);
      } else {
        toast.error(action.payload || "Failed to create inquiry");
      }
      setLoading(false);
    });
  };

  const handleMoveToAdmission = (inquiry) => {
    setLoading(true);
    const payload = {
      _id: inquiry._id,
      isAdmissionDone: true,
    };

    dispatch(moveToAdmission(payload)).then((action) => {
      if (!action.error) {
        toast.success("Inquiry moved to admission successfully");
        fetchInquiries(filters);
      } else {
        toast.error(action.payload || "Failed to move to admission");
      }
      setLoading(false);
    });
  };

  const getCourseName = (course) => {
    if (!course) return "N/A";
    if (typeof course === "object")
      return course.courseName || "Unknown Course";
    const courseObj = courses.find((c) => c._id === course);
    return courseObj ? courseObj.courseName : "Unknown Course";
  };

  const getSourceName = (source) => {
    if (!source) return "N/A";
    if (typeof source === "object") return source.name || "Unknown Source";
    const sourceObj = sources.find((s) => s._id === source);
    return sourceObj ? sourceObj.name : "Unknown Source";
  };

  const getStatusName = (status) => {
    if (!status) return "N/A";
    if (typeof status === "object") return status.name || "Unknown Status";
    const statusObj = statuses.find((s) => s._id === status);
    return statusObj ? statusObj.name : "Unknown Status";
  };

  const getStatusColor = (status) => {
    const statusName = getStatusName(status);
    switch (statusName) {
      case "New":
        return "bg-yellow-100 text-yellow-800";
      case "Contacted":
        return "bg-blue-100 text-blue-800";
      case "Interested":
        return "bg-green-100 text-green-800";
      case "Not Interested":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const tableHeaders = [
    "Name",
    "Phone No",
    "Follow Up Date",
    "Course",
    "Source",
    "Status",
    "Actions",
  ];

  const tableData = inquiries.map((inquiry) => [
    inquiry.name || "N/A",
    inquiry.phoneNo || "N/A",
    inquiry.followUpDate ? formatDateForTable(inquiry.followUpDate) : "N/A",
    inquiry?.course?.courseName || "N/A",
    inquiry?.source?.name || "N/A",
    inquiry?.status?.name || "N/A",
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleViewInquiry(inquiry)}
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition disabled:cursor-not-allowed"
        title="Edit"
      >
        <Eye className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleDeleteClick(inquiry)}
        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
        title="Delete"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>,
  ]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleFilter = () => {
    setCurrentPage(1);
    fetchInquiries(filters);
  };

  const resetFilters = () => {
    setFilters({
      search: "",
    });
    setCurrentPage(1);
    fetchInquiries({
      search: "",
    });
  };

  return (
    <>
      <div className="mb-8 flex justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Inquiry Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage customer inquiries and follow-ups
          </p>
        </div>
        <div className="flex justify-end items-center gap-2">
          <button
            onClick={() => setShowFollowUpPopup(true)}
            className="px-6 py-3 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Show Today's Follow-ups
          </button>
          <button
            onClick={handleAddInquiryClick}
            className="px-6 py-3 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition-all shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-50"
            disabled={loading}
          >
            <span>Add Inquiry</span>
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Filter className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            placeholder="Search name..."
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex justify-end gap-2">
            <button
              onClick={handleFilter}
              disabled={loading}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "..." : "Apply"}
            </button>
            <button
              onClick={resetFilters}
              disabled={loading}
              className="px-4 py-2 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100 transition"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <Table
        headers={tableHeaders}
        data={tableData}
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
        currentPage={currentPage}
        size={itemsPerPage}
        handlePageChange={setCurrentPage}
        total={totalInquiries}
        totalPages={totalPages}
      />

      <TodaysFollowUpsPopup
        isOpen={showFollowUpPopup}
        onClose={() => setShowFollowUpPopup(false)}
        followUps={followUpInquiresList}
        onMoveToAdmission={handleMoveToAdmission}
        getCourseName={getCourseName}
        getSourceName={getSourceName}
        getStatusName={getStatusName}
        getStatusColor={getStatusColor}
        loading={loading}
      />

      {showModal && (
        <InquiryModal
          onSave={handleSaveInquiry}
          onClose={() => setShowModal(false)}
        />
      )}

      {showDeleteModal && (
        <AlertModal
          isOpen={showDeleteModal}
          onCancel={() => {
            setShowDeleteModal(false);
            setDeletingInquiry(null);
          }}
          onConfirm={handleDeleteConfirm}
          title="Delete Inquiry"
          description="Are you sure you want to delete this inquiry? This action cannot be undone."
          cancelLabel="Cancel"
          confirmLabel="Yes, Delete"
          confirmClassNameButton="!bg-red-600 hover:!bg-red-700"
          isVisibleCancelButton={true}
          isVisibleConfirmButton={true}
        />
      )}
      {showViewModal && (
        <ViewInquiryModal
          inquiry={viewInquiry}
          onClose={() => {
            setShowViewModal(false);
            setViewInquiry(null);
          }}
        />
      )}
    </>
  );
}
