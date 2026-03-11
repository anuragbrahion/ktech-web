/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  websiteLanguagesList,
  deleteWebsiteLanguages,
  enableDisableWebsiteLanguages,
  createWebsiteLanguages,
  updateWebsiteLanguages,
} from "../../../redux/slices/website";
import { toast } from "react-toastify";
import { Edit2, Trash2 } from "lucide-react";
import Loader from "../../../components/Loader/Loader";
import { formatDateForTable } from "../../../utils/globalFunction";
import Table from "../../../components/Atoms/TableData/TableData";

export default function LanguageManagement({ roleData }) {
  const dispatch = useDispatch();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [editingLanguage, setEditingLanguage] = useState(null);
  const [newLanguage, setNewLanguage] = useState({
    name: "",
    status: true,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const websiteLanguagesListData = useSelector(
    (state) => state.website?.websiteLanguagesListData,
  );
  const deleteWebsiteLanguagesData = useSelector(
    (state) => state.website?.deleteWebsiteLanguagesData,
  );
  const enableDisableWebsiteLanguagesData = useSelector(
    (state) => state.website?.enableDisableWebsiteLanguagesData,
  );
  const createWebsiteLanguagesData = useSelector(
    (state) => state.website?.createWebsiteLanguagesData,
  );
  const updateWebsiteLanguagesData = useSelector(
    (state) => state.website?.updateWebsiteLanguagesData,
  );
  const isLoading = useSelector((state) => state.website?.loading);
  const loading =
    createWebsiteLanguagesData?.loading || updateWebsiteLanguagesData?.loading;
  const languages = websiteLanguagesListData?.data?.data?.list || [];
  const totalCount = websiteLanguagesListData?.data?.data?.total || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const tableHeaders = ["Language", "Branch", "Status", "Action"];

  useEffect(() => {
    fetchLanguages();
  }, [currentPage]);

  const fetchLanguages = () => {
    dispatch(
      websiteLanguagesList({
        page: currentPage,
        size: itemsPerPage,
        select: "name status adminId updatedAt",
        populate: "adminId:name,role",
      }),
    );
  };

  const handleAddLanguageClick = () => {
    setEditingLanguage(null);
    setNewLanguage({
      name: "",
      status: "active",
    });
    setShowAddPopup(true);
  };

  const handleEditLanguage = (language) => {
    setEditingLanguage(language);
    setNewLanguage({
      name: language.name,
      status: language.status,
    });
    setShowAddPopup(true);
  };

  const handleClosePopup = () => {
    if (loading) return;
    setShowAddPopup(false);
    setEditingLanguage(null);
    setNewLanguage({
      name: "",
      status: "active",
    });
  };

  const handleInputChange = (field, value) => {
    setNewLanguage((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddLanguage = () => {
    if (!newLanguage.name.trim()) {
      toast.error("Please enter a language name");
      return;
    }

    if (editingLanguage) {
      const payload = {
        _id: editingLanguage._id,
        name: newLanguage.name.trim(),
      };
      dispatch(updateWebsiteLanguages(payload)).then((action) => {
        if (!action.error) {
          fetchLanguages();
          handleClosePopup();
        }
      });
    } else {
      const payload = {
        name: newLanguage.name.trim(),
      };
      dispatch(createWebsiteLanguages(payload)).then((action) => {
        if (!action.error) {
          fetchLanguages();
          handleClosePopup();
        }
      });
    }
  };

  const handleStatusToggle = (language) => {
    const newStatus = language.status ? false : true;
    const payload = {
      _id: language._id,
      status: newStatus,
    };

    dispatch(enableDisableWebsiteLanguages(payload)).then((action) => {
      if (!action.error) {
        fetchLanguages();
      }
    });
  };

  const handleDeleteClick = (language) => {
    setDeleteTarget(language);
    setShowDeletePopup(true);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    dispatch(deleteWebsiteLanguages({ _id: deleteTarget._id })).then(
      (action) => {
        if (!action.error) {
          fetchLanguages();
        }
        setShowDeletePopup(false);
        setDeleteTarget(null);
      },
    );
  };

  const cancelDelete = () => {
    setShowDeletePopup(false);
    setDeleteTarget(null);
  };

  const renderToggleSwitch = (language) => {
    const isActive = language.status == true;
    return (
      <div className="flex items-center space-x-6">
        <button
          onClick={() => handleEditLanguage(language)}
          className="text-gray-600 hover:text-gray-900 transition-colors"
          title="Edit"
        >
          <Edit2 size={22} />
        </button>

        <button
          onClick={() => handleStatusToggle(language)}
          disabled={enableDisableWebsiteLanguagesData?.loading}
          title="Active/Inactive"
        >
          <div
            className={`w-12 h-6 flex items-center rounded-full p-1 ${isActive ? "bg-green-500" : "bg-gray-300"}`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full ${isActive ? "translate-x-6" : ""}`}
            />
          </div>
        </button>

        {roleData === "superadmin" && (
          <button
            onClick={() => handleDeleteClick(language)}
            disabled={deleteWebsiteLanguagesData?.loading}
            className="text-red-600 hover:text-red-800"
            title="Delete"
          >
            <Trash2 size={22} />
          </button>
        )}
      </div>
    );
  };

  const tableData = useMemo(
    () =>
      languages.map((language) => [
        <div className="flex items-center">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold mr-3 capitalize">
            {language.name?.charAt(0) || "?"}
          </div>
          <div>
            <div className="font-medium text-gray-900">
              {language.name || "Unnamed Language"}
            </div>
            <div className="text-sm text-gray-500">
              Last Updated: {formatDateForTable(language.updatedAt)}
            </div>
          </div>
        </div>,
        !language?.adminId ? (
          "N/A"
        ) : (
          <div>
            <div className="font-medium text-gray-900">
              {language.adminId.name || "Branch"}
            </div>
            <div className="text-sm text-gray-500">
              {language.adminId.role.toLowerCase() === "superadmin"
                ? "Main Branch"
                : "Branch"}
            </div>
          </div>
        ),
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${language.status ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
        >
          {language.status ? "Active" : "Inactive"}
        </span>,

        renderToggleSwitch(language),
      ]),
    [languages],
  );

  return (
    <>
      <Loader loading={isLoading} />
      <div className="mb-8 flex justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Language Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage application languages and their status
          </p>
        </div>
        <div className="flex justify-end items-center mb-6">
          <button
            onClick={handleAddLanguageClick}
            className="px-6 py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <span>Add Language</span>
            <span className="text-xl font-bold">+</span>
          </button>
        </div>
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

      {showAddPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full transform transition-all">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingLanguage ? "Edit Language" : "Add Language"}
                </h2>
                <button
                  onClick={handleClosePopup}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                  disabled={loading}
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language Name
                  </label>
                  <input
                    type="text"
                    value={newLanguage.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter language name (e.g., Bhojpuri)"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={handleClosePopup}
                  disabled={loading}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddLanguage}
                  disabled={loading || !newLanguage.name.trim()}
                  className="flex-1 px-6 py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                      {editingLanguage ? "Updating..." : "Creating..."}
                    </span>
                  ) : editingLanguage ? (
                    "Update Language"
                  ) : (
                    "Create Language"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showDeletePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900">
              Delete Language
            </h2>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{deleteTarget?.name}</span>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={cancelDelete}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteWebsiteLanguagesData?.loading}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all"
              >
                {deleteWebsiteLanguagesData?.loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
