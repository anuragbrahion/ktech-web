/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Plus, Edit2, Trash2, Eye, Search, Filter } from "lucide-react";
import { toast } from "react-toastify";
import {
  inquirySourceList,
  enableDisableInquirySource,
  deleteInquirySource,
  createInquirySource,
  updateInquirySource,
} from "../../redux/slices/branch";
import Table from "../../components/Atoms/TableData/TableData";
import AlertModal from "../../components/Modal/AlertModal";
import { formatDateForTable, hasPermission } from "../../utils/globalFunction";

const SourceModal = ({ source, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
  });

  useEffect(() => {
    if (source) {
      setFormData({
        name: source.name || "",
      });
    }
  }, [source]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name) {
      toast.error("Please enter source name");
      return;
    }

    const payload = {
      name: formData.name,
    };

    if (source) {
      payload._id = source._id;
    }

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {source ? "Edit Source" : "Add Source"}
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
                  Source Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Enter source name"
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
                {source ? "Update Source" : "Create Source"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default function InquirySourceManagement({ roleData, adminId }) {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingSource, setEditingSource] = useState(null);
  const [deletingSource, setDeletingSource] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    search: "",
  });
  const [loading, setLoading] = useState(false);

  const sourceListData = useSelector(
    (state) => state.branch?.inquirySourceListData,
  );
  const enableDisableData = useSelector(
    (state) => state.branch?.enableDisableInquirySourceData,
  );
  const deleteData = useSelector(
    (state) => state.branch?.deleteInquirySourceData,
  );
  const createData = useSelector(
    (state) => state.branch?.createInquirySourceData,
  );
  const updateData = useSelector(
    (state) => state.branch?.updateInquirySourceData,
  );

  useEffect(() => {
    fetchSources(filters);
  }, []);

  useEffect(() => {
    if (!showModal) {
      fetchSources(filters);
    }
  }, [currentPage, enableDisableData, deleteData, createData, updateData]);

  const fetchSources = (filters) => {
    setLoading(true);
    const params = {
      page: currentPage,
      size: itemsPerPage,
      populate: "adminId:name,role",
      ...(filters.search && { keyWord: filters.search, searchFields: "name" }),
    };

    dispatch(inquirySourceList(params)).then((action) => {
      if (action.error) {
        toast.error(action.payload || "Failed to fetch sources");
      }
      setLoading(false);
    });
  };

  const handleAddSourceClick = () => {
    setEditingSource(null);
    setShowModal(true);
  };

  const handleEditSource = (source) => {
    setEditingSource(source);
    setShowModal(true);
  };

  const handleDeleteClick = (source) => {
    setDeletingSource(source);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingSource) {
      setLoading(true);
      dispatch(deleteInquirySource({ _id: deletingSource._id })).then(
        (action) => {
          if (!action.error) {
            toast.success("Source deleted successfully");
            fetchSources(filters);
          } else {
            toast.error(action.payload || "Failed to delete source");
          }
          setLoading(false);
          setShowDeleteModal(false);
          setDeletingSource(null);
        },
      );
    }
  };

  const handleStatusToggle = (source) => {
    const newStatus = !source.status;
    if (
      window.confirm(
        `Are you sure you want to ${newStatus ? "activate" : "deactivate"} this source?`,
      )
    ) {
      setLoading(true);
      const payload = {
        _id: source._id,
        status: newStatus,
      };
      dispatch(enableDisableInquirySource(payload)).then((action) => {
        if (!action.error) {
          toast.success(
            `Source ${newStatus ? "activated" : "deactivated"} successfully`,
          );
          fetchSources(filters);
        } else {
          toast.error(action.payload || "Failed to update status");
        }
        setLoading(false);
      });
    }
  };

  const handleSaveSource = (formData) => {
    setLoading(true);
    if (editingSource) {
      const payload = {
        ...formData,
        _id: editingSource._id,
      };
      dispatch(updateInquirySource(payload)).then((action) => {
        if (!action.error) {
          toast.success("Source updated successfully");
          setShowModal(false);
          setEditingSource(null);
          fetchSources(filters);
        } else {
          toast.error(action.payload || "Failed to update source");
        }
        setLoading(false);
      });
    } else {
      dispatch(createInquirySource(formData)).then((action) => {
        if (!action.error) {
          toast.success("Source created successfully");
          setShowModal(false);
          fetchSources(filters);
        } else {
          toast.error(action.payload || "Failed to create source");
        }
        setLoading(false);
      });
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleFilter = () => {
    setCurrentPage(1);
    fetchSources(filters);
  };

  const resetFilters = () => {
    setFilters({
      search: "",
    });
    setCurrentPage(1);
    fetchSources({
      search: "",
    });
  };

  const getStatusColor = (status) => {
    return status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const sources = sourceListData?.data?.data?.list || [];
  const totalSources = sourceListData?.data?.data?.total || 0;
  const totalPages = Math.ceil(totalSources / itemsPerPage);

  const tableHeaders = ["Source", "Branch", "Status", "Created At", "Actions"];

  const tableData = sources.map((source) => [
    <div className="font-medium text-gray-900">{source.name}</div>,
    !source?.adminId ? (
      "N/A"
    ) : (
      <div>
        <div className="font-medium text-gray-900 capitalize">
          {source.adminId.name || "Branch"}
        </div>
        <div className="text-sm text-gray-500">
          {source.adminId.role.toLowerCase() === "superadmin"
            ? "Main Branch"
            : "Sub Branch"}
        </div>
      </div>
    ),
    <div className="flex items-center">
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(source.status)}`}
      >
        {source.status ? "Active" : "Inactive"}
      </span>
      <div className="ml-3 relative inline-block w-10 align-middle select-none">
        <input
          type="checkbox"
          checked={source.status}
          onChange={() => handleStatusToggle(source)}
          className="sr-only"
          id={`toggle-source-${source._id}`}
          disabled={
            loading ||
            !hasPermission(roleData, adminId, source?.adminId?._id || null)
          }
        />
        <label
          htmlFor={`toggle-source-${source._id}`}
          className={`block overflow-hidden h-6 rounded-full ${source.status ? "bg-green-500" : "bg-gray-300"} ${hasPermission(roleData, adminId, source?.adminId?._id || null) ? "cursor-pointer" : "cursor-not-allowed"}`}
        >
          <span
            className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${source.status ? "translate-x-4" : "translate-x-0"}`}
          />
        </label>
      </div>
    </div>,
    formatDateForTable(source.createdAt),
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleEditSource(source)}
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition disabled:cursor-not-allowed"
        title="Edit"
        disabled={
          loading ||
          !hasPermission(roleData, adminId, source?.adminId?._id || null)
        }
      >
        <Edit2 className="w-4 h-4" />
      </button>
      {roleData === "superadmin" && (
        <button
          onClick={() => handleDeleteClick(source)}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
          title="Delete"
          disabled={loading}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>,
  ]);

  return (
    <>
      <div className="mb-8 flex justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Inquiry Sources
          </h1>
          <p className="text-gray-600 mt-2">
            Manage all inquiry sources
          </p>
        </div>
        <div className="flex justify-end items-center mb-6">
          <button
            onClick={handleAddSourceClick}
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
        total={totalSources}
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
        <SourceModal
          source={editingSource}
          onSave={handleSaveSource}
          onClose={() => {
            setShowModal(false);
            setEditingSource(null);
          }}
        />
      )}

      {showDeleteModal && (
        <AlertModal
          isOpen={showDeleteModal}
          onCancel={() => {
            setShowDeleteModal(false);
            setDeletingSource(null);
          }}
          onConfirm={handleDeleteConfirm}
          title="Delete Source"
          description="Are you sure you want to delete this inquiry source? This action cannot be undone."
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
