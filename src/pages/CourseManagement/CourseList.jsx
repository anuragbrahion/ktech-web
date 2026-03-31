/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Plus, Edit2, Trash2, Upload, Filter } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import Table from "../../components/Atoms/TableData/TableData";
import AlertModal from "../../components/Modal/AlertModal";
import {
  updateCourses,
  coursesList,
  enableDisableCourses,
  deleteCourses,
  createCourses,
} from "../../redux/slices/course";
import {
  websiteCategoryAllDocuments,
  websiteLanguagesAllDocuments,
} from "../../redux/slices/website";
import { apiUrl } from "../../utils/axiosProvider";
import { formatDateForTable, hasPermission } from "../../utils/globalFunction";
import Loader from "../../components/Loader/Loader";
const CourseModal = ({ course, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    courseName: "",
    description: "",
    template: "",
    actualPrice: "",
    sellingPrice: "",
    duration: "",
    totalLectures: "",
    language: [],
    category: [],
  });

  const [imagePreview, setImagePreview] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const languagesData = useSelector(
    (state) => state.website?.websiteLanguagesAllDocumentsData,
  );
  const categoriesData = useSelector(
    (state) => state.website?.websiteCategoryAllDocumentsData,
  );

  useEffect(() => {
    if (course) {
      setFormData({
        courseName: course.courseName || "",
        description: course.description || "",
        template: course.template || "",
        actualPrice: course.actualPrice || "",
        sellingPrice: course.sellingPrice || "",
        duration: course.duration || "",
        totalLectures: course.totalLectures || "",
        language: course.language || [],
        category: course.category || [],
      });

      if (course.mainImageUrl?.url) {
        setImagePreview(course.mainImageUrl.url);
        setImageUrl(course.mainImageUrl);
      }
    }
  }, [course]);

  useEffect(() => {
    fetchLanguagesAndCategories();
  }, []);

  const fetchLanguagesAndCategories = () => {
    setLoading(true);
    Promise.all([
      dispatch(websiteLanguagesAllDocuments()),
      dispatch(websiteCategoryAllDocuments()),
    ]).then(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    if (languagesData?.data?.data) {
      setLanguages(languagesData.data.data?.list);
    }
  }, [languagesData]);

  useEffect(() => {
    if (categoriesData?.data?.data) {
      setCategories(categoriesData.data.data?.list);
    }
  }, [categoriesData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiSelect = (field, value) => {
    setFormData((prev) => {
      const currentValues = prev[field];
      const isSelected = currentValues.includes(value);

      if (isSelected) {
        return {
          ...prev,
          [field]: currentValues.filter((item) => item !== value),
        };
      } else {
        return {
          ...prev,
          [field]: [...currentValues, value],
        };
      }
    });
  };

  const handleImageUpload = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("files", file);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${apiUrl}/files/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.data) {
        setImageUrl(response.data.data[0]);
        setImagePreview(response.data.data[0].url);
        toast.success("Image uploaded successfully");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      handleImageUpload(file);
    }
  };

  const removeImage = () => {
    setImagePreview("");
    setImageUrl(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.courseName || !formData.description || !imageUrl) {
      toast.error("Please fill all required fields");
      return;
    }

    const payload = {
      courseName: formData.courseName,
      description: formData.description,
      template: formData.template,
      mainImageUrl: imageUrl,
      language: formData.language,
      category: formData.category,
      actualPrice: Number(formData.actualPrice),
      sellingPrice: Number(formData.sellingPrice),
      duration: Number(formData.duration),
      totalLectures: Number(formData.totalLectures),
    };

    if (course) {
      payload._id = course._id;
    }

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl max-h-[90vh] overflow-y-auto w-full">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {course ? "Edit Course" : "Add Course"}
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
                  Course Name *
                </label>
                <input
                  type="text"
                  name="courseName"
                  value={formData.courseName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Enter course name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-h-[120px] resize-none"
                  placeholder="Enter course description"
                  rows="4"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Image *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                  {uploading ? (
                    <div className="py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="text-sm text-gray-600 mt-3">Uploading...</p>
                    </div>
                  ) : imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Course"
                        className="w-48 h-32 mx-auto object-cover rounded-lg border-4 border-white shadow-lg"
                      />
                      <div className="mt-4 flex gap-2 justify-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
                        >
                          Change
                        </label>
                        <button
                          type="button"
                          onClick={removeImage}
                          className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer block"
                      >
                        <div className="space-y-3">
                          <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                          <p className="text-gray-500">
                            Click to upload course image
                          </p>
                          <p className="text-xs text-gray-400">
                            Supported: JPG, PNG, WebP
                          </p>
                        </div>
                      </label>
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Languages
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto p-2 border border-gray-300 rounded-xl">
                    {loading ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mx-auto"></div>
                      </div>
                    ) : (
                      languages.map((lang) => (
                        <label
                          key={lang._id}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={formData.language.includes(lang._id)}
                            onChange={() =>
                              handleMultiSelect("language", lang._id)
                            }
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-gray-700">{lang.name}</span>
                        </label>
                      ))
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categories
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto p-2 border border-gray-300 rounded-xl">
                    {loading ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mx-auto"></div>
                      </div>
                    ) : (
                      categories.map((cat) => (
                        <label
                          key={cat._id}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={formData.category.includes(cat._id)}
                            onChange={() =>
                              handleMultiSelect("category", cat._id)
                            }
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-gray-700">{cat.name}</span>
                        </label>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Actual Price (₹) *
                  </label>
                  <input
                    type="number"
                    name="actualPrice"
                    value={formData.actualPrice}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter actual price"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    name="sellingPrice"
                    value={formData.sellingPrice}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter selling price"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (hours) *
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter course duration"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Lectures *
                  </label>
                  <input
                    type="number"
                    name="totalLectures"
                    value={formData.totalLectures}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter total lectures"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template
                </label>
                <input
                  type="text"
                  name="template"
                  value={formData.template}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Enter template identifier"
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
                disabled={
                  uploading ||
                  loading ||
                  !formData.courseName ||
                  !formData.description ||
                  !imageUrl
                }
              >
                {uploading
                  ? "Uploading..."
                  : course
                    ? "Update Course"
                    : "Create Course"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default function CourseManagement({ roleData, adminId }) {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [deletingCourse, setDeletingCourse] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    search: "",
  });
  const [loading, setLoading] = useState(false);

  const coursesListData = useSelector((state) => state.course?.coursesListData);
  const enableDisableData = useSelector(
    (state) => state.course?.enableDisableCoursesData,
  );
  const deleteData = useSelector((state) => state.course?.deleteCoursesData);
  const createData = useSelector((state) => state.course?.createCoursesData);
  const updateData = useSelector((state) => state.course?.updateCoursesData);

  useEffect(() => {
    fetchCourses(filters);
  }, []);

  useEffect(() => {
    if (!showModal) {
      fetchCourses(filters);
    }
  }, [currentPage, enableDisableData, deleteData, createData, updateData]);

  const fetchCourses = (filters) => {
    setLoading(true);
    const params = {
      page: currentPage,
      size: itemsPerPage,
      ...(filters.search && {
        keyWord: filters.search,
        searchFields: "courseName",
      }),

      populate: "adminId:name,role|category:name|language:name",
    };

    dispatch(coursesList(params)).then((action) => {
      if (action.error) {
        toast.error(action.payload || "Failed to fetch courses");
      }
      setLoading(false);
    });
  };

  const handleAddCourseClick = () => {
    setEditingCourse(null);
    setShowModal(true);
  };

  const handleEditCourse = (course) => {
    setEditingCourse({
      ...course,
      category: course?.category?.map((category) => category._id),
      language: course?.language?.map((language) => language._id),
    });
    setShowModal(true);
  };

  const handleDeleteClick = (course) => {
    setDeletingCourse(course);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingCourse) {
      setLoading(true);
      dispatch(deleteCourses({ _id: deletingCourse._id })).then((action) => {
        if (!action.error) {
          toast.success("Course deleted successfully");
          fetchCourses(filters);
        } else {
          toast.error(action.payload || "Failed to delete course");
        }
        setLoading(false);
        setShowDeleteModal(false);
        setDeletingCourse(null);
      });
    }
  };

  const handleStatusToggle = (course) => {
    const newStatus = !course.status;
    if (
      window.confirm(
        `Are you sure you want to ${newStatus ? "activate" : "deactivate"} this course?`,
      )
    ) {
      setLoading(true);
      const payload = {
        _id: course._id,
        status: newStatus,
      };
      dispatch(enableDisableCourses(payload)).then((action) => {
        if (!action.error) {
          toast.success(
            `Course ${newStatus ? "activated" : "deactivated"} successfully`,
          );
          fetchCourses(filters);
        } else {
          toast.error(action.payload || "Failed to update status");
        }
        setLoading(false);
      });
    }
  };

  const handleSaveCourse = (formData) => {
    setLoading(true);
    if (editingCourse) {
      const payload = {
        ...formData,
        _id: editingCourse._id,
      };
      dispatch(updateCourses(payload)).then((action) => {
        if (!action.error) {
          toast.success("Course updated successfully");
          setShowModal(false);
          setEditingCourse(null);
          fetchCourses(filters);
        } else {
          toast.error(action.payload || "Failed to update course");
        }
        setLoading(false);
      });
    } else {
      dispatch(createCourses(formData)).then((action) => {
        if (!action.error) {
          toast.success("Course created successfully");
          setShowModal(false);
          fetchCourses(filters);
        } else {
          toast.error(action.payload || "Failed to create course");
        }
        setLoading(false);
      });
    }
  };

  const courses = coursesListData?.data?.data?.list || [];
  const totalCourses = coursesListData?.data?.data?.total || 0;
  const totalPages = Math.ceil(totalCourses / itemsPerPage);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleFilter = () => {
    setCurrentPage(1);
    fetchCourses(filters);
  };

  const resetFilters = () => {
    setFilters({
      search: "",
    });
    setCurrentPage(1);
    fetchCourses({
      search: "",
    });
  };

  const tableHeaders = [
    // "Branch",
    "Course",
    "Categories",
    "languages",
    "Status",
    "Created At",
    ...(roleData === "superadmin" ? ["Action"] : []),
  ];

  const tableData = courses.map((course) => [
    // !course?.adminId ? (
    //   <span className="text-gray-400 italic">N/A</span>
    // ) : (
    //   <div className="flex flex-col">
    //     <span className="font-semibold text-gray-800 capitalize">
    //       {course.adminId.name || "Branch"}
    //     </span>
    //     <span
    //       className={`text-xs font-medium mt-1 px-2 py-0.5 rounded-full w-fit ${
    //         course.adminId.role.toLowerCase() === "superadmin"
    //           ? "bg-green-100 text-green-700"
    //           : "bg-yellow-100 text-yellow-700"
    //       }`}
    //     >
    //       {course.adminId.role.toLowerCase() === "superadmin"
    //         ? "Main Branch"
    //         : "Sub Branch"}
    //     </span>
    //   </div>
    // ),

    <div className="flex items-start gap-3">
      <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center overflow-hidden shadow-sm">
        {course.mainImageUrl?.url ? (
          <img
            src={course.mainImageUrl.url}
            alt={course.courseName}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-blue-600 font-bold text-lg">
            {course.courseName?.charAt(0)}
          </span>
        )}
      </div>

      <div className="flex flex-col">
        <span className="font-semibold text-gray-900">{course.courseName}</span>
        <span className="text-sm text-gray-500 line-clamp-2 max-w-xs">
          {course.description}
        </span>
      </div>
    </div>,

    <div className="flex flex-wrap gap-1 max-w-xs">
      {course.category?.length ? (
        course.category.map((catId, index) => (
          <span
            key={index}
            className="px-2 py-1 text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100 rounded-full capitalize"
          >
            {catId.name}
          </span>
        ))
      ) : (
        <span className="text-gray-400 text-xs">No Category</span>
      )}
    </div>,
    <div className="flex flex-wrap gap-1 max-w-xs">
      {course.language?.length ? (
        course.language.map((catId, index) => (
          <span
            key={index}
            className="px-2 py-1 text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100 rounded-full capitalize"
          >
            {catId.name}
          </span>
        ))
      ) : (
        <span className="text-gray-400 text-xs">No Language</span>
      )}
    </div>,

    <div className="flex items-center gap-3">
      <span
        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
          course.status
            ? "bg-green-100 text-green-700"
            : "bg-gray-200 text-gray-600"
        }`}
      >
        {course.status ? "Active" : "Inactive"}
      </span>

      <label
        className={`relative inline-flex items-center ${roleData === "superadmin" ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}
      >
        <input
          type="checkbox"
          checked={course.status}
          onChange={() => handleStatusToggle(course)}
          className="sr-only peer"
          // disabled={
          //   loading ||
          //   !hasPermission(roleData, adminId, course?.adminId?._id || null)
          // }
          disabled={loading || roleData !== "superadmin"}
        />
        <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition-all"></div>
        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-5"></div>
      </label>
    </div>,

    <span className="text-sm text-gray-600">
      {formatDateForTable(course.createdAt)}
    </span>,
    roleData === "superadmin" && (
      <>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEditCourse(course)}
            className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={
              loading ||
              !hasPermission(roleData, adminId, course?.adminId?._id || null)
            }
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteClick(course)}
            className="p-2 rounded-lg text-red-600 hover:bg-red-50 hover:scale-105 transition disabled:opacity-50"
            disabled={loading}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </>
    ),
  ]);

  return (
    <>
      <Loader loading={loading} />

      <div className="mb-8 flex justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Course Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage all courses and their details
          </p>
        </div>
        {roleData === "superadmin" && (
          <div className="flex justify-end items-center mb-6">
            <button
              onClick={handleAddCourseClick}
              className="px-6 py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-all shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-50"
              disabled={loading}
            >
              <span>Add Course</span>
              <Plus className="w-5 h-5" />
            </button>
          </div>
        )}
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
        currentPage={currentPage}
        size={itemsPerPage}
        handlePageChange={setCurrentPage}
        total={totalCourses}
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
        <CourseModal
          course={editingCourse}
          onSave={handleSaveCourse}
          onClose={() => {
            setShowModal(false);
            setEditingCourse(null);
          }}
        />
      )}

      {showDeleteModal && (
        <AlertModal
          isOpen={showDeleteModal}
          onCancel={() => {
            setShowDeleteModal(false);
            setDeletingCourse(null);
          }}
          onConfirm={handleDeleteConfirm}
          title="Delete Course"
          description="Are you sure you want to delete this course? This action cannot be undone."
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
