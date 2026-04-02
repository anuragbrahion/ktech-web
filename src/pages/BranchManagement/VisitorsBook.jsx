/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Table from "../../components/Atoms/TableData/TableData";
import AddVisitorModal from "../../components/Atoms/UI/AddVisitorModal";
import EditVisitorModal from "../../components/Atoms/UI/EditVisitorModal";
import AlertModal from "../../components/Modal/AlertModal";
import {
  visitorsList,
  createVisitor,
  updateVisitor,
  deleteVisitor,
  followUpVisitor,
} from "../../redux/slices/inquires";
import FollowUpModal from "../../components/Atoms/UI/FollowUpModal";
import { Edit2, Filter, Plus, Trash2 } from "lucide-react";
import { formatDateForTable } from "../../utils/globalFunction";

const VisitorsBook = ({ adminId }) => {
  const dispatch = useDispatch();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFollowUpModal, setShowFollowUpModal] = useState(true);
  const [editingVisitor, setEditingVisitor] = useState(null);
  const [deletingVisitor, setDeletingVisitor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [resData, setResData] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
  });
  const visitorsListData = useSelector(
    (state) => state.inquires?.visitorsListData,
  );
  const createVisitorData = useSelector(
    (state) => state.inquires?.createVisitorData,
  );
  const updateVisitorData = useSelector(
    (state) => state.inquires?.updateVisitorData,
  );
  const deleteVisitorData = useSelector(
    (state) => state.inquires?.deleteVisitorData,
  );
  const visitors = visitorsListData?.data?.data?.list || [];
  const totalVisitors = visitorsListData?.data?.data?.total || 0;
  const totalPages = Math.ceil(totalVisitors / itemsPerPage);

  useEffect(() => {
    fetchVisitors(filters);
  }, [currentPage, createVisitorData, updateVisitorData, deleteVisitorData]);

  const fetchVisitors = (filters) => {
    setLoading(true);
    const params = {
      page: currentPage,
      size: itemsPerPage,
      ...(filters.search && { keyWord: filters.search, searchFields: "name" }),
      query: JSON.stringify({ adminId }),
    };

    dispatch(visitorsList(params)).then((action) => {
      if (action.error) {
        toast.error(action.payload || "Failed to fetch visitors");
      }
      setLoading(false);
    });
  };

  const handleAddVisitor = (visitorData) => {
    setLoading(true);
    dispatch(createVisitor(visitorData)).then((action) => {
      if (!action.error) {
        toast.success("Visitor added successfully");
        setShowAddModal(false);
      } else {
        toast.error(action.payload || "Failed to add visitor");
      }
      setLoading(false);
    });
  };

  const handleEditVisitor = (visitorData) => {
    if (!editingVisitor) return;

    setLoading(true);
    const payload = {
      _id: editingVisitor._id,
      ...visitorData,
      date: visitorData.date ? new Date(visitorData.date) : undefined,
      followUpDate: visitorData.followUpDate
        ? new Date(visitorData.followUpDate)
        : undefined,
    };

    dispatch(updateVisitor(payload)).then((action) => {
      if (!action.error) {
        toast.success("Visitor updated successfully");
        setShowEditModal(false);
        setEditingVisitor(null);
      } else {
        toast.error(action.payload || "Failed to update visitor");
      }
      setLoading(false);
    });
  };

  const handleDeleteClick = (visitor) => {
    setDeletingVisitor(visitor);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (!deletingVisitor) return;

    setLoading(true);
    dispatch(deleteVisitor({ _id: deletingVisitor._id })).then((action) => {
      if (!action.error) {
        toast.success("Visitor deleted successfully");
      } else {
        toast.error(action.payload || "Failed to delete visitor");
      }
      setLoading(false);
      setShowDeleteModal(false);
      setDeletingVisitor(null);
    });
  };

  const handleEditClick = (visitor) => {
    setEditingVisitor(visitor);
    setShowEditModal(true);
  };
  const fetchVisitorFollowUpData = (visitorId) => {
    setLoading(true);
    dispatch(followUpVisitor({ _id: visitorId })).then((action) => {
      if (action) {
        setResData(action?.payload?.data);
        setShowFollowUpModal(true);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchVisitorFollowUpData();
  }, []);

  const tableHeaders = [
    "Visitor Name",
    "Phone No",
    "Meeting With",
    "Date",
    "Follow Up Date",
    "Purpose",
    "Total Persons",
    "Timing",
    "Actions",
  ];

  const tableData = visitors.map((visitor) => [
    visitor.name || "N/A",
    visitor.phoneNo || "N/A",
    visitor.meetingWith || "N/A",
    formatDateForTable(visitor.date),
    formatDateForTable(visitor.followUpDate),
    visitor.purpose || "N/A",
    visitor.totalPerson || 1,
    `${visitor.inTime} - ${visitor.outTime}`,
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleEditClick(visitor)}
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition disabled:cursor-not-allowed"
        title="Edit"
      >
        <Edit2 className="w-4 h-4" />
      </button>
      <button
        onClick={() => handleDeleteClick(visitor)}
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
    fetchVisitors(filters);
  };

  const resetFilters = () => {
    setFilters({
      search: "",
    });
    setCurrentPage(1);
    fetchVisitors({
      search: "",
    });
  };

  return (
    <>
      <div className="mb-8">
        <div className="flex justify-between items-start md:items-center mb-4 flex-col md:flex-row gap-4">
          <div>
            <h1 className="text-3xl font-bold text-black">
              Visitor's Book List
            </h1>
            <p className="text-black mt-2">
              Manage and track all visitor records
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-all shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-50"
            disabled={loading}
          >
            <span>Add Visitor</span>
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
        total={totalVisitors}
        totalPages={totalPages}
      />

      <AddVisitorModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddVisitor}
        loading={loading}
      />

      {showEditModal && editingVisitor && (
        <EditVisitorModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingVisitor(null);
          }}
          onSubmit={handleEditVisitor}
          visitor={editingVisitor}
          loading={loading}
        />
      )}

      {showFollowUpModal && (
        <FollowUpModal
          isOpen={showFollowUpModal}
          onClose={() => {
            setShowFollowUpModal(false);
          }}
          visitor={resData}
          loading={loading}
        />
      )}

      <AlertModal
        isOpen={showDeleteModal}
        onCancel={() => {
          setShowDeleteModal(false);
          setDeletingVisitor(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Visitor"
        description="Are you sure you want to delete this visitor record? This action cannot be undone."
        cancelLabel="Cancel"
        confirmLabel="Yes, Delete"
        confirmClassNameButton="!bg-red-600 hover:!bg-red-700"
        isVisibleCancelButton={true}
        isVisibleConfirmButton={true}
      />
    </>
  );
};

export default VisitorsBook;
