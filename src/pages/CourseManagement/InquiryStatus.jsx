/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Plus, Edit2, Trash2, Search, Filter, Tag } from "lucide-react";
import { toast } from "react-toastify";
import {
  inquiryStatusList,
  enableDisableInquiryStatus,
  deleteInquiryStatus,
  createInquiryStatus,
  updateInquiryStatus,
} from "../../redux/slices/branch";
import Table from "../../components/Atoms/TableData/TableData";
import AlertModal from "../../components/Modal/AlertModal";
import { formatDateForTable, hasPermission } from "../../utils/globalFunction";

const StatusModal = ({ status, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
  });

  useEffect(() => {
    if (status) {
      setFormData({
        name: status.name || "",
      });
    }
  }, [status]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name) {
      toast.error("Please enter status name");
      return;
    }

    const payload = {
      name: formData.name,
    };

    if (status) {
      payload._id = status._id;
    }

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {status ? "Edit Status" : "Add Status"}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Enter status name"
                  required
                />
              </div>
            </div>

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
                disabled={!formData.name}
              >
                {status ? "Update Status" : "Create Status"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default function InquiryStatusManagement({ roleData, adminId }) {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingStatus, setEditingStatus] = useState(null);
  const [deletingStatus, setDeletingStatus] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
  });

  const statusListData = useSelector(
    (state) => state.branch?.inquiryStatusListData,
  );
  const enableDisableData = useSelector(
    (state) => state.branch?.enableDisableInquiryStatusData,
  );
  const deleteData = useSelector(
    (state) => state.branch?.deleteInquiryStatusData,
  );
  const createData = useSelector(
    (state) => state.branch?.createInquiryStatusData,
  );
  const updateData = useSelector(
    (state) => state.branch?.updateInquiryStatusData,
  );

  useEffect(() => {
    fetchStatuses(filters);
  }, []);

  useEffect(() => {
    if (!showModal) {
      fetchStatuses(filters);
    }
  }, [currentPage, enableDisableData, deleteData, createData, updateData]);

  const fetchStatuses = (filters) => {
    setLoading(true);

    const params = {
      page: currentPage,
      size: itemsPerPage,
      ...(filters.search && { keyWord: filters.search, searchFields: "name" }),
      populate: "adminId:name,role",
    };

    dispatch(inquiryStatusList(params)).then((action) => {
      if (action.error) {
        toast.error(action.payload || "Failed to fetch statuses");
      }
      setLoading(false);
    });
  };

  const handleAddStatusClick = () => {
    setEditingStatus(null);
    setShowModal(true);
  };

  const handleEditStatus = (status) => {
    setEditingStatus(status);
    setShowModal(true);
  };

  const handleDeleteClick = (status) => {
    setDeletingStatus(status);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingStatus) {
      setLoading(true);
      dispatch(deleteInquiryStatus({ _id: deletingStatus._id })).then(
        (action) => {
          if (!action.error) {
            toast.success("Status deleted successfully");
            fetchStatuses(filters);
          } else {
            toast.error(action.payload || "Failed to delete status");
          }
          setLoading(false);
          setShowDeleteModal(false);
          setDeletingStatus(null);
        },
      );
    }
  };

  const handleStatusToggle = (status) => {
    const newStatus = !status.status;
    if (
      window.confirm(
        `Are you sure you want to ${newStatus ? "activate" : "deactivate"} this status?`,
      )
    ) {
      setLoading(true);
      const payload = {
        _id: status._id,
        status: newStatus,
      };
      dispatch(enableDisableInquiryStatus(payload)).then((action) => {
        if (!action.error) {
          toast.success(
            `Status ${newStatus ? "activated" : "deactivated"} successfully`,
          );
          fetchStatuses(filters);
        } else {
          toast.error(action.payload || "Failed to update status");
        }
        setLoading(false);
      });
    }
  };

  const handleSaveStatus = (formData) => {
    setLoading(true);
    if (editingStatus) {
      const payload = {
        ...formData,
        _id: editingStatus._id,
      };
      dispatch(updateInquiryStatus(payload)).then((action) => {
        if (!action.error) {
          toast.success("Status updated successfully");
          setShowModal(false);
          setEditingStatus(null);
          fetchStatuses(filters);
        } else {
          toast.error(action.payload || "Failed to update status");
        }
        setLoading(false);
      });
    } else {
      dispatch(createInquiryStatus(formData)).then((action) => {
        if (!action.error) {
          toast.success("Status created successfully");
          setShowModal(false);
          fetchStatuses(filters);
        } else {
          toast.error(action.payload || "Failed to create status");
        }
        setLoading(false);
      });
    }
  };

  const getStatusColor = (status) => {
    const statusLower = status.name.toLowerCase();

    if (statusLower.includes("active") || statusLower.includes("active"))
      return "bg-green-100 text-green-800 border-green-200";
    if (statusLower.includes("inactive") || statusLower.includes("deative"))
      return "bg-gray-100 text-gray-800 border-gray-200";
    if (statusLower.includes("pending"))
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (statusLower.includes("cancel"))
      return "bg-red-100 text-red-800 border-red-200";
    if (statusLower.includes("convert"))
      return "bg-blue-100 text-blue-800 border-blue-200";
    if (statusLower.includes("follow"))
      return "bg-purple-100 text-purple-800 border-purple-200";
    if (statusLower.includes("enroll"))
      return "bg-indigo-100 text-indigo-800 border-indigo-200";
    if (statusLower.includes("not") || statusLower.includes("interested"))
      return "bg-pink-100 text-pink-800 border-pink-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getStatusText = (status) => {
    return status.status ? "Active" : "Inactive";
  };

  const statuses = statusListData?.data?.data?.list || [];
  const totalStatuses = statusListData?.data?.data?.total || 0;
  const totalPages = Math.ceil(totalStatuses / itemsPerPage);

  const tableHeaders = ["Name", "Branch", "Status", "Created At", "Actions"];

  const tableData = statuses.map((status) => [
    <div className="font-medium text-gray-900 text-lg capitalize">
      {status.name}
    </div>,
    !status?.adminId ? (
      "N/A"
    ) : (
      <div>
        <div className="font-medium text-gray-900 capitalize">
          {status.adminId.name || "Branch"}
        </div>
        <div className="text-sm text-gray-500">
          {status.adminId.role.toLowerCase() === "superadmin"
            ? "Main Branch"
            : "Sub Branch"}
        </div>
      </div>
    ),
    <div className="flex items-center">
      <span
        className={`px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(status)}`}
      >
        {getStatusText(status)}
      </span>
      <div className="ml-3 relative inline-block w-10 align-middle select-none">
        <input
          type="checkbox"
          checked={status.status}
          onChange={() => handleStatusToggle(status)}
          className="sr-only"
          id={`toggle-status-${status._id}`}
          disabled={
            loading ||
            !hasPermission(roleData, adminId, status?.adminId?._id || null)
          }
        />
        <label
          htmlFor={`toggle-status-${status._id}`}
          className={`block overflow-hidden h-6 rounded-full ${status.status ? "bg-green-500" : "bg-gray-300"} ${hasPermission(roleData, adminId, status?.adminId?._id || null) ? "cursor-pointer" : "cursor-not-allowed"}`}
        >
          <span
            className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${status.status ? "translate-x-4" : "translate-x-0"}`}
          />
        </label>
      </div>
    </div>,
    formatDateForTable(status.createdAt),
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleEditStatus(status)}
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition disabled:cursor-not-allowed"
        title="Edit"
        disabled={
          loading ||
          !hasPermission(roleData, adminId, status?.adminId?._id || null)
        }
      >
        <Edit2 className="w-4 h-4" />
      </button>
      {roleData === "superadmin" && (
        <button
          onClick={() => handleDeleteClick(status)}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
          title="Delete"
          disabled={loading}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>,
  ]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleFilter = () => {
    setCurrentPage(1);
    fetchStatuses(filters);
  };

  const resetFilters = () => {
    setFilters({
      search: "",
    });
    setCurrentPage(1);
    fetchStatuses({
      search: "",
    });
  };

  return (
    <>
      <div className="mb-8 flex justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Status Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage inquiry statuses and their configurations
          </p>
        </div>
        <div className="flex justify-end items-center mb-6">
          <button
            onClick={handleAddStatusClick}
            className="px-6 py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-all shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-50"
            disabled={loading}
          >
            <span>Add Source</span>
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
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Title
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              placeholder="Search name..."
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

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
        currentPage={currentPage}
        size={itemsPerPage}
        handlePageChange={setCurrentPage}
        total={totalStatuses}
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

      {showModal && (
        <StatusModal
          status={editingStatus}
          onSave={handleSaveStatus}
          onClose={() => {
            setShowModal(false);
            setEditingStatus(null);
          }}
        />
      )}

      {showDeleteModal && (
        <AlertModal
          isOpen={showDeleteModal}
          onCancel={() => {
            setShowDeleteModal(false);
            setDeletingStatus(null);
          }}
          onConfirm={handleDeleteConfirm}
          title="Delete Status"
          description="Are you sure you want to delete this status? This action cannot be undone."
          cancelLabel="Cancel"
          confirmLabel="Yes, Delete"
          confirmClassNameButton="!bg-red-600 hover:!bg-red-700"
          isVisibleCancelButton={true}
          isVisibleConfirmButton={true}
        />
      )}
    </>
  );
}
