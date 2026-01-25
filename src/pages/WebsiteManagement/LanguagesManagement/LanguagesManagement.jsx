import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  websiteLanguagesList,
  deleteWebsiteLanguages,
  enableDisableWebsiteLanguages,
  createWebsiteLanguages,
  updateWebsiteLanguages,
} from "../../../redux/slices/website";
import { toast } from "react-toastify";
import { Trash2 } from "lucide-react";
import Loader from "../../../components/Loader/Loader";

export default function LanguageManagement() {
  const dispatch = useDispatch();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    status: "",
  });

  const [showAddPopup, setShowAddPopup] = useState(false);
  const [editingLanguage, setEditingLanguage] = useState(null);
  const [newLanguage, setNewLanguage] = useState({
    name: "",
    status: true,
  });

  // Redux selectors
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

  const isLoading = websiteLanguagesListData?.loading;
  const loading =
    createWebsiteLanguagesData?.loading || updateWebsiteLanguagesData?.loading;

  const languages = websiteLanguagesListData?.data?.data?.list || [];
  const totalEntries =
    websiteLanguagesListData?.data?.data?.total || languages.length;
  useEffect(() => {
    fetchLanguages();
  }, []);

  const fetchLanguages = () => {
    const params = {};
    if (filters.status) params.status = filters.status;
    if (filters.category) params.category = filters.category;
    dispatch(websiteLanguagesList({ params, page: 1, size: 10 }));
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleFilter = () => {
    fetchLanguages();
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
    if (loading) return; // ✅ prevent closing during API call
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

  const getFormattedDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderToggleSwitch = (language) => {
    const isActive = language.status == true;
    return (
      <div className="flex items-center space-x-6">
        <button
          onClick={() => handleEditLanguage(language)}
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          ✏️
        </button>

        <button
          onClick={() => handleStatusToggle(language)}
          disabled={enableDisableWebsiteLanguagesData?.loading}
        >
          <div
            className={`w-12 h-6 flex items-center rounded-full p-1 ${isActive ? "bg-green-500" : "bg-gray-300"}`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full ${isActive ? "translate-x-6" : ""}`}
            />
          </div>
        </button>

        <button
          onClick={() => handleDeleteClick(language)}
          disabled={deleteWebsiteLanguagesData?.loading}
          className="text-red-600 hover:text-red-800"
        >
          <Trash2 size={22} />
        </button>
      </div>
    );
  };

  return (
       <div className="">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Language Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage application languages and their status
            </p>
          </div>

          <div className="bg-white rounded shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Category Name
                </label>
                <select
                  value={filters.category}
                  onChange={(e) =>
                    handleFilterChange("category", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
                >
                  <option value="">No Selected</option>
                  <option value="primary">Primary Languages</option>
                  <option value="secondary">Secondary Languages</option>
                  <option value="regional">Regional Languages</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
                >
                  <option value="">No Selected</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleFilter}
                  disabled={isLoading}
                  className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Filtering..." : "Filter"}
                </button>
              </div>
            </div>
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

          <div className="bg-white rounded shadow-lg overflow-hidden border border-gray-200">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
               <Loader />
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                        <th className="px-6 py-4 text-left font-semibold">
                          Language
                        </th>
                        <th className="px-6 py-4 text-left font-semibold">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left font-semibold">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {languages.length > 0 ? (
                        languages.map((language, index) => (
                          <tr
                            key={language.id || index}
                            className={`border-b border-gray-100 hover:bg-gray-50 
                              transition-colors ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                          >
                            <td className="px-6 py-4 capitalize">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold mr-3">
                                  {language.name?.charAt(0) || "?"}
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {language.name || "Unnamed Language"}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    Added:{" "}
                                    {getFormattedDate(
                                      language.createdAt || language.created_at,
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${language.status ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                              >
                                {language.status ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {renderToggleSwitch(language)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="3"
                            className="px-6 py-12 text-center text-gray-500"
                          >
                            No languages found. Add your first language!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {totalEntries > 10 && (
                  <div className="flex justify-end items-center px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex gap-2">
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-all">
                        Previous
                      </button>
                      <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all">
                        1
                      </button>
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-all">
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

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
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
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
                  {deleteWebsiteLanguagesData?.loading
                    ? "Deleting..."
                    : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div> 
  );
}
