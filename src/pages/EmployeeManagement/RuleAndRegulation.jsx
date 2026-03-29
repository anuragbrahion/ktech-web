/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Plus, Edit2, Trash2, DollarSign } from "lucide-react";
import { toast } from "react-toastify";
import {
  rulesList,
  enableDisableRules,
  deleteRules,
  createRules,
  updateRules,
} from "../../redux/slices/employee";
import AlertModal from "../../components/Modal/AlertModal";
import Table from "../../components/Atoms/TableData/TableData";
import Loader from "../../components/Loader/Loader";
import { formatDateForTable, hasPermission } from "../../utils/globalFunction";

const RuleModal = ({ designation, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    rule: "",
    role: "",
  });

  useEffect(() => {
    if (designation) {
      setFormData({
        rule: designation.rule || "",
        role: designation.role || "",
      });
    }
  }, [designation]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.rule || !formData.role) {
      toast.error("Please fill all required fields");
      return;
    }

    const payload = {
      rule: formData.rule,
      role: formData.role,
    };

    if (designation) {
      payload._id = designation._id;
    }

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {designation
                ? "Edit Rule And Regulation"
                : "Add Rule And Regulation"}
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
                  Rule *
                </label>
                <textarea
                  name="rule"
                  value={formData.rule}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                  placeholder="Enter rule"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type *
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Student">Student</option>
                  <option value="Teacher">Teacher</option>
                </select>
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
                disabled={!formData.rule || !formData.role}
              >
                {designation ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default function RuleAndRegulation({ roleData, adminId }) {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingDesignation, setEditingDesignation] = useState(null);
  const [deletingDesignation, setDeletingDesignation] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);

  const rulesListData = useSelector((state) => state.employee?.rulesListData);
  const enableDisableData = useSelector(
    (state) => state.employee?.enableDisableRulesData,
  );
  const deleteData = useSelector((state) => state.employee?.deleteRulesData);
  const createData = useSelector((state) => state.employee?.createRulesData);
  const updateData = useSelector((state) => state.employee?.updateRulesData);

  useEffect(() => {
    fetchRulesAndRegulations();
  }, []);

  useEffect(() => {
    if (!showModal) {
      fetchRulesAndRegulations();
    }
  }, [currentPage, enableDisableData, deleteData, createData, updateData]);

  const fetchRulesAndRegulations = () => {
    setLoading(true);
    const params = {
      page: currentPage,
      size: itemsPerPage,
    };

    dispatch(rulesList(params)).then((action) => {
      if (action.error) {
        toast.error(action.payload || "Failed to fetch rules");
      }
      setLoading(false);
    });
  };

  const handleAddDesignationClick = () => {
    setEditingDesignation(null);
    setShowModal(true);
  };

  const handleEditDesignation = (designation) => {
    setEditingDesignation(designation);
    setShowModal(true);
  };

  const handleDeleteClick = (designation) => {
    setDeletingDesignation(designation);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingDesignation) {
      setLoading(true);
      dispatch(deleteRules({ _id: deletingDesignation._id })).then((action) => {
        if (!action.error) {
          toast.success("Rule deleted successfully");
          fetchRulesAndRegulations();
        } else {
          toast.error(action.payload || "Failed to delete rule");
        }
        setLoading(false);
        setShowDeleteModal(false);
        setDeletingDesignation(null);
      });
    }
  };

  const handleStatusToggle = (designation) => {
    const newStatus = !designation.status;
    if (
      window.confirm(
        `Are you sure you want to ${newStatus ? "activate" : "deactivate"} this rule?`,
      )
    ) {
      setLoading(true);
      const payload = {
        _id: designation._id,
        status: newStatus,
      };
      dispatch(enableDisableRules(payload)).then((action) => {
        if (!action.error) {
          toast.success(
            `Rule ${newStatus ? "activated" : "deactivated"} successfully`,
          );
          fetchRulesAndRegulations();
        } else {
          toast.error(action.payload || "Failed to update status");
        }
        setLoading(false);
      });
    }
  };

  const handleSaveDesignation = (formData) => {
    setLoading(true);
    if (editingDesignation) {
      const payload = {
        ...formData,
        _id: editingDesignation._id,
      };
      dispatch(updateRules(payload)).then((action) => {
        if (!action.error) {
          toast.success("Rule updated successfully");
          setShowModal(false);
          setEditingDesignation(null);
          fetchRulesAndRegulations();
        } else {
          toast.error(action.payload || "Failed to update rule");
        }
        setLoading(false);
      });
    } else {
      dispatch(createRules(formData)).then((action) => {
        if (!action.error) {
          toast.success("Rule created successfully");
          setShowModal(false);
          fetchRulesAndRegulations();
        } else {
          toast.error(action.payload || "Failed to create rule");
        }
        setLoading(false);
      });
    }
  };

  const getStatusColor = (status) => {
    return status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const designations = rulesListData?.data?.data?.list || [];
  const totalDesignations = rulesListData?.data?.data?.total || 0;
  const totalPages = Math.ceil(totalDesignations / itemsPerPage);

  const tableHeaders = ["Rule", "Type", "Status", "Created At", "Actions"];

  const tableData = designations.map((designation) => [
    <div className="font-medium text-gray-900 capitalize">
      {designation.rule}
    </div>,

    <div className="font-bold text-green-600">{designation.role}</div>,
    <div className="flex items-center">
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(designation.status)}`}
      >
        {designation.status ? "Active" : "Inactive"}
      </span>
      <div className="ml-3 relative inline-block w-10 align-middle select-none">
        <input
          type="checkbox"
          checked={designation.status}
          onChange={() => handleStatusToggle(designation)}
          className="sr-only"
          id={`toggle-designation-${designation._id}`}
          disabled={
            loading ||
            !hasPermission(roleData, adminId, designation?.adminId?._id || null)
          }
        />
        <label
          htmlFor={`toggle-designation-${designation._id}`}
          className={`block overflow-hidden h-6 rounded-full ${!hasPermission(roleData, adminId, designation?.adminId?._id || null) ? "cursor-not-allowed" : "cursor-pointer"} ${designation.status ? "bg-green-500" : "bg-gray-300"}`}
        >
          <span
            className={`block h-6 w-6 rounded-full bg-white transform transition-transform ${designation.status ? "translate-x-4" : "translate-x-0"}`}
          />
        </label>
      </div>
    </div>,
    formatDateForTable(designation.createdAt),
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleEditDesignation(designation)}
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition disabled:cursor-not-allowed"
        title="Edit"
        disabled={
          loading ||
          !hasPermission(roleData, adminId, designation?.adminId?._id || null)
        }
      >
        <Edit2 className="w-4 h-4" />
      </button>
      {roleData === "superadmin" && (
        <button
          onClick={() => handleDeleteClick(designation)}
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
      <Loader loading={loading} />

      <div className="mb-8 flex justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Rule And Regulation
          </h1>
          <p className="text-gray-600 mt-2">
            Manage rules and regulations for employees
          </p>
        </div>

        <div className="flex justify-end items-center mb-6">
          <button
            onClick={handleAddDesignationClick}
            className="px-6 py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-all shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-50"
            disabled={loading}
          >
            <span>Add Rule</span>
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <Table
        headers={tableHeaders}
        data={tableData}
        currentPage={currentPage}
        size={itemsPerPage}
        handlePageChange={setCurrentPage}
        total={totalDesignations}
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
        <RuleModal
          designation={editingDesignation}
          onSave={handleSaveDesignation}
          onClose={() => {
            setShowModal(false);
            setEditingDesignation(null);
          }}
        />
      )}

      {showDeleteModal && (
        <AlertModal
          isOpen={showDeleteModal}
          onCancel={() => {
            setShowDeleteModal(false);
            setDeletingDesignation(null);
          }}
          onConfirm={handleDeleteConfirm}
          title="Delete Rule"
          description="Are you sure you want to delete this rule? This action cannot be undone."
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
