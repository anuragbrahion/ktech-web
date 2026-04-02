import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Table from "../../components/Atoms/TableData/TableData";
import {
  addHallTicketList,
  getAllAdmissionList,
  getALlExamList,
  getHallTicketList,
} from "../../redux/slices/examination";
import { getAllStudFeeName } from "../../redux/slices/course";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "lg", 
  showCloseButton = true,
  closeOnOutsideClick = true,
  footer = null,
}) => {
   useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
       document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

   const handleOutsideClick = (e) => {
    if (closeOnOutsideClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

   const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-7xl",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 transition-opacity"
      onClick={handleOutsideClick}
      style={{ animation: "fadeIn 0.2s ease-in-out" }}
    >
      <div
        className={`bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} transform transition-all`}
        style={{ animation: "slideIn 0.3s ease-out" }}
      >
         <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
              aria-label="Close modal"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          )}
        </div>

         <div className="px-6 py-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          {children}
        </div>

         {footer && (
          <div className="px-6 py-4 border-t bg-gray-50 rounded-b-lg">
            {footer}
          </div>
        )}
      </div>

       <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "info",  
}) => {
  const getTypeStyles = () => {
    switch (type) {
      case "danger":
        return {
          icon: (
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          ),
          confirmBtn: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
        };
      case "warning":
        return {
          icon: (
            <svg
              className="w-6 h-6 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
          confirmBtn: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
        };
      case "success":
        return {
          icon: (
            <svg
              className="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
          confirmBtn: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
        };
      default:
        return {
          icon: (
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
          confirmBtn: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${styles.confirmBtn}`}
          >
            {confirmText}
          </button>
        </div>
      }
    >
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">{styles.icon}</div>
        <p className="text-gray-600">{message}</p>
      </div>
    </Modal>
  );
};

export const FormModal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  children,
  submitText = "Submit",
  cancelText = "Cancel",
  size = "md",
  isLoading = false,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={size}
      footer={
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            type="submit"
            form="modal-form"
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-sky-500 rounded-md hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </div>
            ) : (
              submitText
            )}
          </button>
        </div>
      }
    >
      <form id="modal-form" onSubmit={handleSubmit}>
        {children}
      </form>
    </Modal>
  );
};

export const DrawerModal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  position = "right",  
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-7xl",
  };

  const positionClasses = {
    right: "right-0 translate-x-0",
    left: "left-0 -translate-x-0",
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
        style={{ animation: "fadeIn 0.2s ease-in-out" }}
      />

      <div
        className={`absolute top-0 h-full ${sizeClasses[size]} w-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${positionClasses[position]}`}
        style={{
          animation: `slideIn${position === "right" ? "Right" : "Left"} 0.3s ease-out`,
        }}
      >
        <div className="flex flex-col h-full">
           <div className="flex items-center justify-between px-6 py-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

           <div className="flex-1 px-6 py-4 overflow-y-auto">{children}</div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

const HallTickets = () => {
  const dispatch = useDispatch();

  const hallTicketData = useSelector(
    (state) => state?.examination?.getHallTicketListData,
  );
  const examListData = useSelector(
    (state) => state?.examination?.getALlExamListData.data?.data?.list,
  );
  console.log(examListData)

  const studentListData = useSelector(
    (state) => state?.course?.getAllStudFeeNameData,
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    user_id: "",
    examination_id: "",
    admission_id: "",
  });

  const [filteredAdmissions, setFilteredAdmissions] = useState([]);

  const getData = (page = 1) => {
    dispatch(getHallTicketList({ page, size: itemsPerPage }));
  };

  useEffect(() => {
    getData(currentPage);
    dispatch(
      getALlExamList({
        query: JSON.stringify({ type: "Student" }),
      })
    )
    dispatch(getAllStudFeeName());
  }, [currentPage, dispatch]);

  useEffect(() => {
    if (formData.user_id) {
      dispatch(
        getAllAdmissionList({
          query: JSON.stringify({ user: formData.user_id }),
        })
      ).then((res) => {
        setFilteredAdmissions(res?.payload?.data?.list || []);
      });
    }
  }, [formData.user_id, dispatch]);

const handleAddTicket = () => { 
    if (!formData.user_id) {
    alert("Please select a user");
    return;
  }
  
  if (!formData.admission_id) {
    alert("Please select an admission");
    return;
  }
  
  if (!formData.examination_id) {
    alert("Please select an examination");
    return;
  }
  
   const payload = {
    user_id: formData.user_id,
    examination_id: formData.examination_id,
    admission_id: formData.admission_id
  };
  
  console.log("Dispatching payload:", payload);
  
  dispatch(addHallTicketList(payload)).then((result) => {
    console.log("Dispatch result:", result);
    if (result.payload) {
      setShowAddModal(false);
      setFormData({
        user_id: "",
        examination_id: "",
        admission_id: "",
      });
      getData(currentPage);
    }
  }).catch((error) => {
    console.error("Error adding hall ticket:", error);
    alert("Failed to add hall ticket. Please try again.");
  });
};

  const handleGeneratePDF = (ticket) => {
    console.log("Generate PDF for:", ticket);
  };

  const hallTickets = hallTicketData?.data?.data?.list || [];
  const totalPages = hallTicketData?.data?.data?.page || 1;
  const students = studentListData?.data?.data?.list || [];

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const tableHeaders = [
    "Student Name",
    "Roll No.",
    "Exam Title",
    "Course Name",
    "Batch Time",
    "PDF",
  ];

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Hall Tickets</h1>
          <p className="text-black mt-2">View and manage all hall tickets</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
        >
          + Add Hall Ticket
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">

        <Table
          headers={tableHeaders}
          data={hallTickets}
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
          renderRow={(ticket, index) => (
            <tr key={ticket._id || index} className="hover:bg-gray-50">
              <td className="py-4 px-4">{ticket?.user_id?.name || "N/A"}</td>
              <td className="py-4 px-4">{ticket?.user_id?.email || "N/A"}</td>
              <td className="py-4 px-4">
                {ticket?.examination_id?.examtitle || "N/A"}
              </td>
              <td className="py-4 px-4">
                {ticket?.admission_id?.course?.courseName || "N/A"}
              </td>
              <td className="py-4 px-4">
                {ticket?.admission_id?.batch
                  ? `${ticket.admission_id.batch.startTime} - ${ticket.admission_id.batch.endTime}`
                  : "N/A"}
              </td>
              <td className="py-4 px-4">
                <button
                  onClick={() => handleGeneratePDF(ticket)}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                >
                  PDF
                </button>
              </td>
            </tr>
          )}
        />
      </div>

    <Modal
  isOpen={showAddModal}
  onClose={() => {
    setShowAddModal(false);
    setFormData({
      user_id: "",
      examination_id: "",
      admission_id: "",
    });
  }}
  title="Add Hall Ticket"
>
  <form onSubmit={(e) => {
    e.preventDefault();
    handleAddTicket();
  }}>
    <div className="space-y-4 p-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          User <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.user_id}
          onChange={(e) =>
            setFormData({
              ...formData,
              user_id: e.target.value,
              admission_id: "",  
            })
          }
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
          required
        >
          <option value="">Select...</option>
          {students.map((student) => (
            <option key={student._id} value={student._id}>
              {student.name || student.user?.name || "Unknown"}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Admission <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.admission_id}
          onChange={(e) =>
            setFormData({ ...formData, admission_id: e.target.value })
          }
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
          disabled={!formData.user_id || filteredAdmissions.length === 0}
          required
        >
          <option value="">Select...</option>
          {filteredAdmissions.map((admission) => (
            <option key={admission._id} value={admission._id}>
              {admission.name || "N/A"} ({admission?.course?.courseName})
            </option>
          ))}
        </select>
        {!formData.user_id && (
          <p className="text-sm text-gray-500 mt-1">
            Please select a user first
          </p>
        )}
        {formData.user_id && filteredAdmissions.length === 0 && (
          <p className="text-sm text-yellow-600 mt-1">
            No admissions found for this user
          </p>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Examination <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.examination_id}
          onChange={(e) =>
            setFormData({
              ...formData,
              examination_id: e.target.value,
             })
          }
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
          required
        >
          <option value="">Select...</option>
          {Array.isArray(examListData) && examListData.map((exam) => (
            <option key={exam._id} value={exam._id}>
              {exam.examtitle || "Unknown"}
            </option>
          ))}
        </select>
      </div>
      
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          className="px-6 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 transition-colors"
        >
          Submit
        </button>
      </div>
    </div>
  </form>
</Modal>
    </div>
  );
};

export default HallTickets;
