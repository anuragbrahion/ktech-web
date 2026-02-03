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
import moment from "moment-timezone";

const VisitorsBook = () => {
  const dispatch = useDispatch();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFollowUpModal, setShowFollowUpModal] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
   const [editingVisitor, setEditingVisitor] = useState(null);
  const [deletingVisitor, setDeletingVisitor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [resData, setResData] = useState([]);
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
    fetchVisitors();
  }, [currentPage, createVisitorData, updateVisitorData, deleteVisitorData]);

  const fetchVisitors = () => {
    setLoading(true);
    const params = {
      page: currentPage,
      size: itemsPerPage,

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
      date: formatDateForAPI(visitorData.date),
      followUpDate: visitorData.followUpDate
        ? formatDateForAPI(visitorData.followUpDate)
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

  const resetFilters = () => {
   
  };

  const formatDateForAPI = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const tableData = visitors.map((visitor) => [
    visitor.name || "N/A",
    visitor.phoneNo || "N/A",
    visitor.meetingWith || "N/A",
    moment(visitor.date).format("DD MM YYYY"),
    moment(visitor.followUpDate).format("DD MM YYYY"),
    visitor.purpose || "N/A",
    visitor.totalPerson || 1,
    visitor._id,
  ]);

  const renderRow = (row, index) => {
    const [
      name,
      phoneNo,
      meetingWith,
       followUpDate,
      purpose,
      totalPerson,
      visitorId,
    ] = row;
    const visitor = visitors[index];
    const isFollowUpOverdue =visitor.followUpDate && new Date(moment(visitor.followUpDate).format("DD MM YYYY")) < new Date();

    return (
      <tr
        key={visitorId}
        className={`hover:bg-sky-50 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
      >
        <td className="py-4 px-4 text-black">{name}</td>
        <td className="py-4 px-4 text-black">
          <a href={`tel:${phoneNo}`} className="hover:text-blue-600">
            {phoneNo}
          </a>
        </td>
        <td className="py-4 px-4 text-black">{meetingWith}</td>
         <td className="py-4 px-4 text-black">
          <span
            className={`${isFollowUpOverdue ? "text-red-600" : "text-green-600"} font-medium`}
          >
            {followUpDate}
          </span>
        </td>
        <td className="py-4 px-4 text-black">{purpose}</td>
        <td className="py-4 px-4 text-black text-center">
          {totalPerson}
        </td>
        <td className="py-4 px-4">
          <div className="flex space-x-2">
            <button
              onClick={() => handleEditClick(visitor)}
              className="text-sky-500 hover:text-sky-700 p-1"
              title="Edit"
              disabled={loading}
            >
              ✏️
            </button>
            <button
              onClick={() => handleDeleteClick(visitor)}
              className="text-red-500 hover:text-red-700 p-1"
              title="Delete"
              disabled={loading}
            >
              🗑️
            </button>
          </div>
        </td>
      </tr>
    );
  };

  const tableHeaders = [
    "Visitor Name",
    "Phone No",
    "Meeting With",
     "Follow Up Date",
    "Purpose",
    "Total Persons",
    "Actions",
  ];

  return (
    <div className="">
      <div className="">
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
              className="px-6 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 font-medium flex items-center gap-2 disabled:opacity-50"
              disabled={loading}
            >
              <span className="text-xl">+</span>
              Add Visitor
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="mt-4 flex justify-between items-center">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm("name", e.target.value)}
                  placeholder="Search by name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex gap-2">
                  <button
                    onClick={fetchVisitors}
                    className="px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600"
                    disabled={loading}
                  >
                    Apply Filters
                  </button>
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    disabled={loading}
                  >
                    Clear
                  </button>
                </div>
                <div>
                  <button
                    onClick={() => fetchVisitorFollowUpData()}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    title="View Follow-up"
                    disabled={loading}
                  >
                    View Follow-up
                  </button>
                </div>
              </div>
            </div>
          </div>
          {visitors.length > 0 ? (
            <Table
              headers={tableHeaders}
              data={tableData}
              renderRow={renderRow}
              currentPage={currentPage}
              size={itemsPerPage}
              handlePageChange={setCurrentPage}
              total={totalVisitors}
              totalPages={totalPages}
            />
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {loading ? "Loading visitors..." : "No visitors found"}
              </h3>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600"
                disabled={loading}
              >
                Add First Visitor
              </button>
            </div>
          )}
        </div>
      </div>

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
    </div>
  );
};

export default VisitorsBook;
